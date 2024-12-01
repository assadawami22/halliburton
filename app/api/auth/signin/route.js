import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req) {
  const { username, password } = await req.json();
  
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role }, 
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    //  cookie with the JWT token
    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60 * 24, // 1 day
      path: '/', 
    });

    const res = new Response(
      JSON.stringify({ message: 'Login successful', role: user.role }), 
      { status: 200 }
    );
    res.headers.set('Set-Cookie', cookie); 
    return res;
    
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
