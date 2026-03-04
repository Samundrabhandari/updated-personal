import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { title, tags, isPublic, orderIndex } = body;

        const item = await prisma.galleryItem.update({
            where: { id: params.id },
            data: {
                ...(title !== undefined && { title }),
                ...(tags !== undefined && { tags }),
                ...(isPublic !== undefined && { isPublic }),
                ...(orderIndex !== undefined && { orderIndex }),
            },
        });

        return NextResponse.json(item);
    } catch (error) {
        console.error('Error updating gallery item:', error);
        return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const item = await prisma.galleryItem.findUnique({
            where: { id: params.id },
        });

        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        // Delete from Cloudinary
        if (item.type === 'IMAGE') {
            await cloudinary.uploader.destroy(item.publicId);
        } else if (item.type === 'VIDEO') {
            await cloudinary.uploader.destroy(item.publicId, { resource_type: 'video' });
        }

        // Delete from DB
        await prisma.galleryItem.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting gallery item:', error);
        return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
    }
}
