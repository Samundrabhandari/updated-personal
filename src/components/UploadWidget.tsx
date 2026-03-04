'use client';

import { CldUploadWidget } from 'next-cloudinary';

interface UploadWidgetProps {
    onUploadSuccess: (result: any) => void;
    type: 'IMAGE' | 'VIDEO';
}

export default function UploadWidget({ onUploadSuccess, type }: UploadWidgetProps) {
    if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
        return (
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium shadow-sm opacity-50 cursor-not-allowed">
                Configuration Missing
            </button>
        );
    }

    return (
        <CldUploadWidget
            signatureEndpoint="/api/upload"
            onSuccess={(result) => {
                onUploadSuccess(result.info);
            }}
            options={{
                resourceType: type === 'VIDEO' ? 'video' : 'image',
                clientAllowedFormats: type === 'IMAGE' ? ['png', 'jpeg', 'jpg', 'webp'] : ['mp4', 'mov', 'avi'],
                maxFiles: 1,
            }}
        >
            {({ open }) => {
                return (
                    <button
                        onClick={() => open()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
                    >
                        Upload {type === 'IMAGE' ? 'Image' : 'Video'}
                    </button>
                );
            }}
        </CldUploadWidget>
    );
}
