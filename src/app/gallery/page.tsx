'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type GalleryItem = {
    id: string;
    type: 'IMAGE' | 'VIDEO';
    title: string;
    url: string;
};

export default function PublicGallery() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch('/api/gallery');
                const data = await res.json();
                setItems(data);
            } catch (error) {
                console.error('Failed to fetch items', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchItems();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                <header className="flex justify-between items-center py-6 border-b border-gray-800">
                    <Link href="/" className="text-3xl font-extrabold tracking-tighter hover:text-gray-300 transition-colors">
                        My Gallery
                    </Link>
                    <Link href="/admin/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        Admin
                    </Link>
                </header>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center text-gray-500 py-32 space-y-4">
                        <p className="text-xl">Nothing to see here yet.</p>
                        <p className="text-sm">Check back later for new photos and videos.</p>
                    </div>
                ) : (
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl border border-gray-800 bg-gray-900"
                                onClick={() => setSelectedItem(item)}
                            >
                                {item.type === 'IMAGE' ? (
                                    <Image
                                        src={item.url}
                                        alt={item.title}
                                        width={800}
                                        height={800}
                                        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="relative w-full">
                                        <video
                                            src={item.url}
                                            className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                            muted
                                            loop
                                            playsInline
                                            onMouseEnter={(e) => e.currentTarget.play()}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.pause();
                                                e.currentTarget.currentTime = 0;
                                            }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="bg-black/50 p-3 rounded-full backdrop-blur-sm">
                                                <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <h3 className="text-lg font-medium text-white truncate drop-shadow-md">
                                        {item.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedItem && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-12 backdrop-blur-md"
                    onClick={() => setSelectedItem(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/70 hover:text-white z-50 p-2"
                        onClick={() => setSelectedItem(null)}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div
                        className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center justify-center bg-black rounded-lg overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {selectedItem.type === 'IMAGE' ? (
                            <img
                                src={selectedItem.url}
                                alt={selectedItem.title}
                                className="max-w-full max-h-[80vh] object-contain"
                            />
                        ) : (
                            <video
                                src={selectedItem.url}
                                className="max-w-full max-h-[80vh] object-contain"
                                controls
                                autoPlay
                            />
                        )}
                        <div className="p-4 bg-gray-900 w-full border-t border-gray-800">
                            <h2 className="text-xl text-white font-medium">{selectedItem.title}</h2>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
