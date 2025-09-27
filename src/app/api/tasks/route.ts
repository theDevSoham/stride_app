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

// ------------------- Validation Schema for Summarize -------------------
const TaskSummarizeSchema = z.object({
  id: z.string().min(1, "Task id is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  force: z.boolean().optional().default(false),
});

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
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // ✅ Validate request body strictly
    const { id, title, description, force } = TaskSummarizeSchema.parse(body);

    // ✅ Fetch existing summary
    const task = await prisma.task.findFirst({
      where: { id, userId },
      select: { summary: true },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found or not yours" },
        { status: 404 }
      );
    }

    // ✅ If summary already exists and force is false → return it
    if (task.summary && !force) {
      return NextResponse.json({ summary: task.summary });
    }

    // ✅ Generate new summary
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are a helpful assistant. Summarize the following task in 2-3 concise sentences:\n\nTitle: ${title}\nDescription: ${
      description ?? ""
    }`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();

    if (!summary) {
      return NextResponse.json(
        { error: "Failed to generate summary" },
        { status: 500 }
      );
    }

    // ✅ Update DB with new summary
    await prisma.task.update({
      where: { id },
      data: { summary },
    });

    return NextResponse.json({ summary });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    console.error("Summarize error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
