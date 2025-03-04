'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, Paintbrush } from 'lucide-react';
import Link from 'next/link';

export default function JoinRoom() {
    const router = useRouter();
    const [roomId, setRoomId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await axios.post(`http://localhost:3001/room/${roomId}/join`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            router.push(`/canvas/${roomId}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to join room');
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
                    <h1 className="text-2xl font-bold text-emerald-400 mb-6">Join a Room</h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="roomId" className="block text-sm font-medium text-gray-300 mb-2">
                                Room ID
                            </label>
                            <input
                                id="roomId"
                                type="text"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter room ID"
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
                            {isLoading ? 'Joining...' : 'Join Room'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}