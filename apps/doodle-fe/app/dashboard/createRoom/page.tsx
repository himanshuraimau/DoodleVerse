'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, Paintbrush } from 'lucide-react';
import Link from 'next/link';

export default function CreateRoom() {
    const router = useRouter();
    const [roomName, setRoomName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [roomId, setRoomId] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setRoomId(null);

        try {
            const response = await axios.post('http://localhost:3001/room', 
                { slug: roomName.trim() },  // Changed from name to slug
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setRoomId(response.data.room.id);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create room');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12 px-6">
            <div className="max-w-md mx-auto">
                <Link href="/dashboard" className="inline-flex items-center text-gray-300 hover:text-emerald-400 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <div className="bg-black/50 backdrop-blur-sm rounded-xl shadow-md p-8 border border-gray-800">
                    <h1 className="text-2xl font-bold text-emerald-400 mb-6">Create New Room</h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="roomName" className="block text-sm font-medium text-gray-300 mb-2">
                                Room Name
                            </label>
                            <input
                                id="roomName"
                                type="text"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter room name"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full px-6 py-3 bg-emerald-500 text-white rounded-full font-medium hover:bg-emerald-400 transition-colors
                                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Creating...' : 'Create Room'}
                        </button>
                    </form>
                    {roomId && (
                        <div className="mt-6">
                            <Link href={`/canvas/${roomId}`} className="w-full px-6 py-3 bg-emerald-500 text-white rounded-full font-medium hover:bg-emerald-400 transition-colors block text-center">
                                Join Room
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}