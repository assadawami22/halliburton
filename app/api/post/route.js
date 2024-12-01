import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req) {
  try {


    let postData;
    try {
      postData = await req.json();
      console.log('Body:', postData);
    } catch (error) {
      console.error('Error parsing body:', error);
      return new Response(JSON.stringify({ message: 'Invalid request body' }), { status: 400 });
    }

    const cookies = req.headers.get('cookie') || '';
    const token = cookies
      .split('; ')
      .find((cookie) => cookie.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    if (!userId) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const newPost = await prisma.post.create({
      data: {
        ...postData,
        userID: userId, 
      },
    });

    return new Response(JSON.stringify(newPost), { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    const cookies = req.headers.get('cookie') || '';
    const token = cookies
      .split('; ')
      .find((cookie) => cookie.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { userId, role } = decoded;

    if (!userId) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    let posts;

    if (role === 'Admin') {
      posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } else {
      posts = await prisma.post.findMany({
        where: { userID: userId },
        orderBy: { createdAt: 'desc' },
      });
    }

    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}