/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const TaskCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().optional(), // ISO string
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  tags: z.array(z.string()).optional(),
  userId: z.string(), // required for linking to a user
});

const TaskUpdateSchema = TaskCreateSchema.partial();

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  const where = userId ? { userId } : {};
  const tasks = await prisma.task.findMany({
    where,
    orderBy: { dueDate: "asc" },
  });

  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
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
        user: { connect: { id: parsed.userId } },
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
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Task id is required" },
        { status: 400 }
      );
    }

    const parsed = TaskUpdateSchema.parse(updates);

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...parsed,
        dueDate: parsed.dueDate ? new Date(parsed.dueDate) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Task id is required" },
        { status: 400 }
      );
    }

    await prisma.task.delete({ where: { id } });

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
