"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Paintbrush, LogIn, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface AuthFormProps {
    mode: 'signin' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const endpoint = mode === 'signin' ? 'http://localhost:3001/auth/signin' : 'http://localhost:3001/auth/signup';

        console.log(`${mode}:`, formData);

        try {
            const res = await axios({
                method: 'POST',
                url: endpoint,
                headers: { 'Content-Type': 'application/json' },
                data: formData
            });

            if (res.status === 200) {
                if (mode === 'signin') {
                    const { token } = res.data;
                    localStorage.setItem('token', token);
                    router.push('/dashboard');
                } else {
                    router.push('/signin');
                }
            } else {
                console.error(`${mode} failed`);
            }
        } catch (error) {
            console.error(`${mode} error:`, error);
        }
    };

    const title = mode === 'signin' ? 'Sign In' : 'Sign Up';
    const Icon = mode === 'signin' ? LogIn : UserPlus;
    const submitButtonText = mode === 'signin' ? 'Sign In' : 'Create Account';
    const altText = mode === 'signin' ? "Don't have an account?" : 'Already have an account?';
    const altLink = mode === 'signin' ? '/signup' : '/signin';
    const nameField = mode === 'signup' ? (
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
            </label>
            <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-white placeholder-gray-400"
                placeholder="Enter your full name"
                required={mode === 'signup'}
            />
        </div>
    ) : null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
            {/* Navigation */}
            <nav className="container mx-auto px-6 py-4">
                <Link href="/" className="flex items-center space-x-2 w-fit">
                    <Paintbrush className="h-8 w-8 text-emerald-400" />
                    <span className="text-2xl font-bold text-white">DoodleVerse</span>
                </Link>
            </nav>

            {/* Auth Form */}
            <div className="flex-1 flex items-center justify-center px-6">
                <div className="w-full max-w-md">
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl">
                        <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                            <Icon className="mr-2 h-7 w-7 text-emerald-400" />
                            {title}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {nameField}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-white placeholder-gray-400"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-white placeholder-gray-400"
                                    placeholder="Choose a password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-400 transition-colors font-medium"
                            >
                                {submitButtonText}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-gray-400">
                            {altText}{' '}
                            <Link href={altLink} className="text-emerald-400 hover:text-emerald-300">
                                {mode === 'signin' ? 'Sign up' : 'Sign in'}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}