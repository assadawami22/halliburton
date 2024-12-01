import React from 'react'

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
//Get by ID ------------------------------------------------------#######################

export async function GET(request,  context ) {
    const { id } = context.params; 


  console.log("the params is: ",context.params);
    try {
      const post = await prisma.post.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: true, 
        },
      });
  
      if (!post) {
        return new Response(JSON.stringify({ message: 'Post not found' }), { status: 404 });
      }
  
      return new Response(JSON.stringify(post), { status: 200 });
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      return new Response(JSON.stringify({ message: 'Could not fetch post' }), { status: 500 });
    }
  }
  

//Update ### ------------------------------------------------------#######################

  export async function PUT(request, context) {
    const { id } = context.params; 
    const { Thumbnail, Heading, Content, Attachments, restrected } = await request.json();
  
    try {
      const updatedPost = await prisma.post.update({
        where: { id: parseInt(id) },
        data: {
          Thumbnail,
          Heading,
          Content,
          Attachments,
          restrected,
        },
      });
  
      return new Response(JSON.stringify(updatedPost), { status: 200 });
    } catch (error) {
      console.error('Error updating post:', error);
      return new Response(JSON.stringify({ message: 'Could not update post' }), { status: 500 });
    }
  }
  

//Delete ### ------------------------------------------------------#######################

  export async function DELETE(request,  context) {
    const { id } = context.params;
  
    try {
      const deletedPost = await prisma.post.delete({
        where: { id: parseInt(id) },
      });
  
      return new Response(JSON.stringify(deletedPost), { status: 200 });
    } catch (error) {
      console.error('Error deleting post:', error);
      return new Response(JSON.stringify({ message: 'Could not delete post' }), { status: 500 });
    }
  }
  