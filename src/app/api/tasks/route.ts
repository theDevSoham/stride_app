/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ------------------- Validation Schemas -------------------
const TaskCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().optional(), // ISO string
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  tags: z.array(z.string()).optional(),
});

const TaskUpdateSchema = TaskCreateSchema.partial();

// ------------------- CRUD APIs -------------------
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { dueDate: "asc" },
  });

  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = TaskCreateSchema.parse(body);

    const created = await prisma.task.create({
      data: {
        title: parsed.title,
        description: parsed.description,
        dueDate: parsed.dueDate ? new Date(parsed.dueDate) : undefined,
        priority: parsed.priority ?? "MEDIUM",
        tags: parsed.tags ?? [],
        user: { connect: { id: userId } },
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id)
      return NextResponse.json(
        { error: "Task id is required" },
        { status: 400 }
      );

    const parsed = TaskUpdateSchema.parse(updates);

    const updated = await prisma.task.updateMany({
      where: { id, userId },
      data: {
        ...parsed,
        dueDate: parsed.dueDate ? new Date(parsed.dueDate) : undefined,
      },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "Task not found or not yours" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Task updated successfully" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id)
      return NextResponse.json(
        { error: "Task id is required" },
        { status: 400 }
      );

    const deleted = await prisma.task.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Task not found or not yours" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ------------------- Summarize Endpoint -------------------
export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, description } = body;

    if (!title && !description) {
      return NextResponse.json(
        { error: "Title or description is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a helpful assistant. Summarize the following task in 2-3 concise sentences:\n\nTitle: ${title}\nDescription: ${
      description ?? ""
    }`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return NextResponse.json({ summary });
  } catch (err: any) {
    console.error("Summarize error:", err);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
