'use server';

import { User, Users } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

const delay: (ms: number)=>Promise<void> = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const checkEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  if ( !checkEmailFormat(email)) {
    return NextResponse.json(
      { error: 'Invalid email format' },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters long' },
      { status: 400 }
    );
  }

  let USERS: Users;
  try {
    USERS = (process.env.USERS as string).trim().split(/[\n\r]{1,}/g).map((user) => {
      const [id, email, password, token] = user.trim().split('|');
      return {
        id: Number(id.trim()),
        email: email.trim(),
        password: password.trim(),
        token: token.trim(),
      };
    });
  } catch (error) {
    console.error('Failed to load user database:', error);
    return NextResponse.json(
      { error: 'Failed to load user database.' },
      { status: 500 }
    );
  }

  const user = USERS.find((user: User) => user.email === email && user.password === password);
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  }
  
  // Simulate a delay to mimic real-world slow authentication
  await delay(2000);
  
  // Return the user token on success
  return NextResponse.json(
    { id: user.id, token: user.token },
    { status: 200 }
  );
}