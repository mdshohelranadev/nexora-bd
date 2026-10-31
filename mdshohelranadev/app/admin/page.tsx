"use client";
import { useEffect, useState, FormEvent } from "react";
import type { Project } from "@/lib/projects";

const emptyForm = { title: "", description: "", tags: "", status: "construction", url: "" };

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<any>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);

  async function loadProjects() {
    const res = await fetch("/api/projects");
    setProjects(await res.json());
  }

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((d) => {
        setAuthed(d.ok);
        if (d.ok) loadProjects();
      });
  }, []);

  async function login(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      setLoginError("");
      setPassword("");
      loadProjects();
    } else {
      setLoginError("Wrong password");
    }
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthed(false);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/projects", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editId ? { ...form, id: editId } : form),
    });
    if (!res.ok) {
      alert("Save failed. On Vercel, file saving is not allowed. See README.");
      return;
    }
    setForm(emptyForm);
    setEditId(null);
    loadProjects();
  }

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
    if (!res.ok) alert("Delete failed. See README.");
    loadProjects();
  }

  function startEdit(p: Project) {
    setEditId(p.id);
    setForm({ ...p, url: p.url ?? "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const input = "w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black";

  if (authed === null) return <p className="p-10">Loading...</p>;

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <form onSubmit={login} className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-semibold">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className={input}
          />
          {loginError && <p className="text-sm">{loginError}</p>}
          <button className="w-full bg-black text-white rounded-full py-3 text-sm">Login</button>
        </form>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-semibold">Manage Projects</h1>
        <div className="flex gap-3 text-sm">
          <a href="/" className="underline">View site</a>
          <button onClick={logout} className="border border-black rounded-full px-4 py-1">Logout</button>
        </div>
      </div>

      <form onSubmit={save} className="border border-neutral-200 rounded-2xl p-6 space-y-4 mb-12">
        <h2 className="font-semibold">{editId ? "Edit project" : "Add new project"}</h2>
        <input className={input} placeholder="Title" required value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className={input} placeholder="Description" rows={3} value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className={input} placeholder="Tags (comma separated)" value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        <select className={input} value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="construction">Under Construction</option>
          <option value="live">Live</option>
        </select>
        <input className={input} placeholder="Live URL (optional)" value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })} />
        <div className="flex gap-3">
          <button className="bg-black text-white rounded-full px-6 py-2 text-sm">
            {editId ? "Update" : "Create"}
          </button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setForm(emptyForm); }}
              className="border border-black rounded-full px-6 py-2 text-sm">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p.id} className="border border-neutral-200 rounded-xl p-4 flex justify-between gap-4 items-center">
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-xs text-neutral-500 uppercase tracking-wider">{p.status}</p>
            </div>
            <div className="flex gap-2 text-sm">
              <button onClick={() => startEdit(p)} className="border border-black rounded-full px-4 py-1">Edit</button>
              <button onClick={() => remove(p.id)} className="border border-neutral-400 text-neutral-600 rounded-full px-4 py-1">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
