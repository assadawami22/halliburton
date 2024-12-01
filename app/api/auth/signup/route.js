import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return new Response(
        JSON.stringify({ message: "Invalid request payload" }),
        { status: 400 }
      );
    }

    const { username, password, role, confirm } = body;

    if (!username || !password || !role) {
      return new Response(
        JSON.stringify({ message: "Username, password, and role are required" }),
        { status: 400 }
      );
    }

    if (role === "Admin") {
      const existingAdmin = await prisma.user.findFirst({
        where: { role: "Admin" },
      });

      if (existingAdmin && !confirm) {
        return new Response(
          JSON.stringify({
            message: "Another admin already exists. Do you want to replace the existing admin?",
          }),
          { status: 409 }
        );
      }

      if (existingAdmin && confirm) {
        await prisma.user.delete({
          where: { id: existingAdmin.id },
        });
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "Username already exists" }),
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });

    return new Response(
      JSON.stringify({
        message: "User created successfully",
        user: { id: newUser.id, username: newUser.username, role: newUser.role },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);

    return new Response(
      JSON.stringify({
        message: "Server error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
