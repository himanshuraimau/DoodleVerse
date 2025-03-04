'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Paintbrush } from 'lucide-react';

interface Room {
    id: number;
    slug: string;
    createdAt: string;
    adminId: string;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export default function Page() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get('http://localhost:3001/room/user/rooms', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setRooms(response.data.rooms);
            } catch (err) {
                setError('Failed to fetch rooms');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const signOut = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    if (isLoading) return <div className="flex justify-center items-center min-h-screen"><span className="text-white">Loading...</span></div>;
    if (error) return <div className="flex justify-center items-center min-h-screen"><span className="text-red-500">Error: {error}</span></div>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white py-12 px-6">
            <div className="container mx-auto max-w-3xl">
                <header className="mb-8 flex items-center justify-between">
                    <Link href="/" className="flex items-center text-2xl font-bold">
                        <Paintbrush className="mr-2 h-6 w-6 text-emerald-400" />
                        DoodleVerse
                    </Link>
                    <nav>
                        <button onClick={signOut} className="text-gray-300 hover:text-emerald-400 transition-colors">
                            Sign Out
                        </button>
                    </nav>
                </header>

                <h1 className="text-3xl font-bold mb-6 text-emerald-400">Your Doodle Rooms</h1>

                <section className="mb-8">
                    {rooms.length === 0 ? (
                        <div className="text-center p-8 bg-black/50 backdrop-blur-sm rounded-xl border border-gray-800">
                            <p className="text-gray-300">No rooms created yet. Create your first room to get started!</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                            {rooms.map((room) => (
                                <div key={room.id} className="group p-6 bg-black/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-emerald-500/30 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">{room.slug}</h3>
                                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm">
                                            #{room.id}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-400 mb-4">
                                        Created: {formatDate(room.createdAt)}
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/canvas/${room.id}`} className="px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-400 transition-colors text-sm">
                                            Join Session
                                        </Link>

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <div className="flex gap-4">
                    <Link href="/dashboard/joinRoom" className="px-6 py-3 bg-black text-emerald-400 rounded-full hover:bg-gray-900 transition-colors font-medium border border-emerald-500/50">
                        Join Room
                    </Link>
                    <Link href="/dashboard/createRoom" className="px-6 py-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-400 transition-colors font-medium">
                        Create Room
                    </Link>
                </div>
            </div>
        </div>
    );
}