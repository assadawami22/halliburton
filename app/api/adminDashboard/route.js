import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req) {
    try {
      // Fetch all posts from all users
      const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' }, 
      });
  
      return new Response(JSON.stringify(posts), { status: 200 });
    } catch (error) {
      console.error('Error fetching posts:', error);
      return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
  }
  