'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Your Doodle Rooms</h1>
            
            <section className="mb-8">
                {rooms.length === 0 ? (
                    <div className="text-center p-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">No rooms created yet. Create your first room to get started!</p>
                    </div>
                ) : (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {rooms.map((room) => (
                            <div key={room.id} className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-semibold text-gray-800">{room.slug}</h3>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        #{room.id}
                                    </span>
                                </div>
                                <div className="mt-4 text-sm text-gray-600">
                                    <p>Created: {formatDate(room.createdAt)}</p>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">
                                        Join Session
                                    </button>
                                    <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
                                        Share
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <div className="flex gap-4">
                <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
                    Join Room
                </button>
                <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium">
                    Create Room
                </button>
            </div>
        </div>
    );
}