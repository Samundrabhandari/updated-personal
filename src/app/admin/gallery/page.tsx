'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import UploadWidget from '@/components/UploadWidget';
import Image from 'next/image';

type GalleryItem = {
    id: string;
    type: 'IMAGE' | 'VIDEO';
    title: string;
    tags?: string;
    url: string;
    publicId: string;
    isPublic: boolean;
    orderIndex: number;
};

export default function AdminGallery() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch('/api/gallery?includePrivate=true');
            const data = await res.json();
            setItems(data);
        } catch (error) {
            console.error('Failed to fetch items', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadSuccess = async (resultInfo: any) => {
        try {
            // Cloudinary returns resource_type as 'image' or 'video'
            const type = resultInfo.resource_type === 'video' ? 'VIDEO' : 'IMAGE';

            const newItem = {
                type,
                title: resultInfo.original_filename || 'New Upload',
                url: resultInfo.secure_url,
                publicId: resultInfo.public_id,
                isPublic: true,
                orderIndex: 0,
            };

            await fetch('/api/gallery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });

            fetchItems();
        } catch (error) {
            console.error('Failed to save gallery item', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            await fetch(`/api/gallery/${id}`, {
                method: 'DELETE',
            });
            fetchItems();
        } catch (error) {
            console.error('Failed to delete item', error);
        }
    };

    const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
        try {
            await fetch(`/api/gallery/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPublic: !currentStatus }),
            });
            fetchItems();
        } catch (error) {
            console.error('Failed to update item visibility', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Gallery Admin
                    </h1>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>

                <div className="flex gap-4 mb-8">
                    <UploadWidget onUploadSuccess={handleUploadSuccess} type="IMAGE" />
                    <UploadWidget onUploadSuccess={handleUploadSuccess} type="VIDEO" />
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                                <div className="relative aspect-square bg-gray-100">
                                    {item.type === 'IMAGE' ? (
                                        <Image
                                            src={item.url}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <video
                                            src={item.url}
                                            className="w-full h-full object-cover"
                                            controls
                                        />
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.isPublic ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {item.isPublic ? 'Public' : 'Private'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 space-y-4">
                                    <h3 className="font-medium text-gray-900 truncate" title={item.title}>
                                        {item.title}
                                    </h3>

                                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                        <button
                                            onClick={() => handleToggleVisibility(item.id, item.isPublic)}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                        >
                                            {item.isPublic ? 'Hide' : 'Show'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {items.length === 0 && (
                            <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
                                No gallery items found. Upload an image or video to get started.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
