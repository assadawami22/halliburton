import { PrismaClient } from '@prisma/client';
import { PDFDocument, rgb } from 'pdf-lib';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { postIds } = await req.json(); 
    
    // Fetch posts based on post IDs, or fetch all posts if no IDs are passed
    const posts = postIds && postIds.length > 0 
      ? await prisma.post.findMany({
          where: { id: { in: postIds } },
        })
      : await prisma.post.findMany();
    
    if (posts.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No posts found to export' }),
        { status: 404 }
      );
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add the first page to the PDF document
    let page = pdfDoc.addPage([600, 800]); // Page size: 600x800 units (portrait)
    const { height } = page.getSize();

    // Embed the Helvetica font (use built-in font method)
    // const font = await pdfDoc.embedFont(PDFDocument.Font.Helvetica);

    let yPosition = height - 50; // Start position for the first post

    // Loop through posts and add them to the PDF
    for (const post of posts) {
      const { Heading, Content } = post;

      // Write the heading (larger font)
      page.drawText(Heading, {
        x: 50,
        y: yPosition,
        size: 18,
        // font,
        color: rgb(0, 0, 0),
      });
      yPosition -= 30; // Space between heading and content

      // Write the content (smaller font)
      page.drawText(Content, {
        x: 50,
        y: yPosition,
        size: 12,
        // font,
        color: rgb(0, 0, 0),
        maxWidth: 500,
      });
      yPosition -= 100; // Space between posts

      // If the page runs out of space, add a new page
      if (yPosition < 50) {
        page = pdfDoc.addPage([600, 800]); // Create a new page
        yPosition = page.getHeight() - 50; // Reset y-position for the new page
      }
    }

    // Serialize the document to bytes (a PDF file)
    const pdfBytes = await pdfDoc.save();

    // Save to a temporary file or send directly as response (here we send it directly)
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="posts.pdf"',
      },
    });
  } catch (error) {
    console.error('Error exporting posts to PDF:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to export posts to PDF' }),
      { status: 500 }
    );
  }
}

