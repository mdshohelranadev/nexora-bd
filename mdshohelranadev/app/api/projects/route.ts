import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getProjects, saveProjects, Project } from "@/lib/projects";

const deny = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });

function clean(b: any) {
  return {
    title: String(b.title ?? "").slice(0, 120),
    description: String(b.description ?? "").slice(0, 400),
    tags: String(b.tags ?? "").slice(0, 200),
    status: b.status === "live" ? "live" : "construction",
    url: b.url ? String(b.url).slice(0, 300) : undefined,
  } as Omit<Project, "id">;
}

export async function GET() {
  return NextResponse.json(await getProjects());
}

export async function POST(req: Request) {
  if (!isAuthed()) return deny();
  const item: Project = { ...clean(await req.json()), id: Date.now().toString() };
  await saveProjects([...(await getProjects()), item]);
  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req: Request) {
  if (!isAuthed()) return deny();
  const body = await req.json();
  const list = await getProjects();
  await saveProjects(list.map((p) => (p.id === body.id ? { ...p, ...clean(body) } : p)));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!isAuthed()) return deny();
  const id = new URL(req.url).searchParams.get("id");
  await saveProjects((await getProjects()).filter((p) => p.id !== id));
  return NextResponse.json({ ok: true });
}
