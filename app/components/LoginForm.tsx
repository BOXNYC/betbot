'use client';

import { useCallback, useState } from "react";

export default function LoginForm({onChange}: {onChange: (token: string) => void}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password.');
            return;
        }
    
        setIsLoading(true);
        setError('');
    
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
        
            if (!res.ok) {
                setError('Failed to login.');
                return;
            }
        
            const data = await res.json();
            const token = `${data.id}|${data.token}`;
            localStorage.setItem('token', token);
            setIsLoggedIn(true);
            onChange(token);
        } catch (err) {
            setError('Error: Invalid email or password');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [email, password, onChange]);

    return (
        <div className="max-w-md mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4 text-[#40cf8f]">Login</h2>
            {isLoggedIn ? (
                <p className="text-green-500">Login successful! Welcome back.</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="sm:flex sm:flex-row mb-8">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="john@doe.com"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sm:rounded-r-none sm:border-r-0 shadow-sm focus:outline-none focus:ring-[#40cf8f] focus:border-[#40cf8f] sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="password"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sm:rounded-l-none shadow-sm focus:outline-none focus:ring-[#40cf8f] focus:border-[#40cf8f] sm:text-sm"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 px-4 bg-[#40cf8f] text-white font-semibold rounded-md shadow-sm hover:bg-[#36b67a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40cf8f] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    {error && <p className="text-red-500 mt-8">{error}</p>}
                </form>
            )}
        </div>
    );
}