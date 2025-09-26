/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(protected)/dashboard/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useUser, SignedIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Edit, Plus } from "lucide-react";

type Task = {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

function formatDate(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString();
}

function emptyTask(): Partial<Task> {
  return {
    title: "",
    description: "",
    dueDate: undefined,
    priority: "MEDIUM",
    status: "PENDING",
    tags: [],
  };
}

export default function DashboardPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch tasks for the authenticated user
  async function loadTasks() {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) return;
    loadTasks();
  }, [isLoaded, isSignedIn]);

  // client-side filtered tasks
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => {
      return (
        t.title.toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q) ||
        (t.tags || []).some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [tasks, search]);

  // Create or update
  async function saveTask(payload: Partial<Task> & { id?: string }) {
    setSaving(true);
    try {
      if (payload.id) {
        // update
        const res = await fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update task");
        // reload or optimistic update
        await loadTasks();
      } else {
        // create
        const body = { ...payload };
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          console.error("create error", err);
          throw new Error("Failed to create task");
        }
        await loadTasks();
      }
      setOpenDialog(false);
      setEditingTask(null);
    } catch (err) {
      console.error(err);
      // optionally show toast
    } finally {
      setSaving(false);
    }
  }

  // Delete
  async function deleteTask(id: string) {
    if (!confirm("Delete this task?")) return;
    try {
      const res = await fetch(`/api/tasks?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      await loadTasks();
    } catch (err) {
      console.error(err);
    }
  }

  // open create dialog
  function openCreate() {
    setEditingTask(emptyTask());
    setOpenDialog(true);
  }

  // open edit dialog
  function openEdit(task: Task) {
    setEditingTask(task);
    setOpenDialog(true);
  }

  return (
    <SignedIn>
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold">
                Hi {user?.firstName}, Your Tasks are listed here
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage and track your tasks
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Input
                placeholder="Search tasks by title, description or tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-80"
              />
              <Button onClick={openCreate} className="ml-2" variant="default">
                <Plus className="mr-2 h-4 w-4" /> New
              </Button>
            </div>
          </div>

          <Card className="overflow-x-auto">
            <CardHeader>
              <CardTitle className="sr-only">Tasks table</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Desktop table */}
              <div className="hidden md:block">
                <table className="w-full table-auto">
                  <thead className="text-sm text-muted-foreground">
                    <tr>
                      <th className="text-left px-4 py-3">Title</th>
                      <th className="text-left px-4 py-3">Priority</th>
                      <th className="text-left px-4 py-3">Status</th>
                      <th className="text-left px-4 py-3">Due</th>
                      <th className="text-left px-4 py-3">Tags</th>
                      <th className="text-right px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center">
                          No tasks found
                        </td>
                      </tr>
                    ) : (
                      filtered.map((t) => (
                        <tr key={t.id} className="border-t">
                          <td className="px-4 py-3">
                            <div className="font-medium">{t.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {t.description ?? ""}
                            </div>
                          </td>
                          <td className="px-4 py-3">{t.priority}</td>
                          <td className="px-4 py-3">{t.status}</td>
                          <td className="px-4 py-3">{formatDate(t.dueDate)}</td>
                          <td className="px-4 py-3">
                            {t.tags?.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-block mr-2 px-2 py-1 text-xs rounded bg-muted-foreground/10"
                              >
                                #{tag}
                              </span>
                            ))}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                onClick={() => openEdit(t)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => deleteTask(t.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile list */}
              <div className="md:hidden divide-y">
                {loading ? (
                  <div className="p-6 text-center">Loading...</div>
                ) : filtered.length === 0 ? (
                  <div className="p-6 text-center">No tasks found</div>
                ) : (
                  filtered.map((t) => (
                    <div key={t.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">{t.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {t.description ?? ""}
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            {t.priority} • {t.status} • {formatDate(t.dueDate)}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEdit(t)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteTask(t.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dialog for create / edit */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            {/* hidden trigger — we open programmatically */}
            <span />
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingTask?.id ? "Edit Task" : "Create Task"}
              </DialogTitle>
              <DialogDescription>Add details for your task.</DialogDescription>
            </DialogHeader>

            <TaskForm
              initial={editingTask ?? emptyTask()}
              onCancel={() => {
                setOpenDialog(false);
                setEditingTask(null);
              }}
              onSave={async (data) => {
                await saveTask(data);
              }}
              saving={saving}
            />
          </DialogContent>
        </Dialog>
      </div>
    </SignedIn>
  );
}

/* -------- TaskForm component (internal) -------- */

function TaskForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: Partial<Task>;
  onSave: (data: Partial<Task> & { id?: string }) => Promise<void>;
  onCancel: () => void;
  saving?: boolean;
}) {
  const [title, setTitle] = useState(initial.title ?? "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [dueDate, setDueDate] = useState<string | undefined>(
    initial.dueDate ?? undefined
  );
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">(
    initial.priority ?? "MEDIUM"
  );
  const [status, setStatus] = useState<"PENDING" | "IN_PROGRESS" | "COMPLETED">(
    initial.status ?? "PENDING"
  );
  const [tagsText, setTagsText] = useState((initial.tags || []).join(", "));

  useEffect(() => {
    // when initial changes (editing different item), sync form
    setTitle(initial.title ?? "");
    setDescription(initial.description ?? "");
    setDueDate(initial.dueDate ?? undefined);
    setPriority((initial.priority as any) ?? "MEDIUM");
    setStatus((initial.status as any) ?? "PENDING");
    setTagsText((initial.tags || []).join(", "));
  }, [initial]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const tags = tagsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Partial<Task> & { id?: string } = {
      id: (initial as any).id,
      title,
      description,
      dueDate: dueDate || undefined,
      priority,
      status,
      tags,
    };
    await onSave(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-md p-2 border bg-transparent"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Due</label>
          <Input
            type="datetime-local"
            value={dueDate ?? ""}
            onChange={(e) => setDueDate(e.target.value || undefined)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="w-full rounded-md p-2 border bg-transparent"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full rounded-md p-2 border bg-transparent"
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Tags (comma separated)
        </label>
        <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
