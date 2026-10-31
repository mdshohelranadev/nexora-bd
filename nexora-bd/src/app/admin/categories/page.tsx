'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/utils/slug';
import { useUIStore } from '@/store/uiStore';
import { Button, Input, Modal, Textarea } from '@/components/ui';
import { Skeleton } from '@/components/ui/Loading';

interface CategoryRow { slug: string; name: string; description: string; subcategories: string[]; sort_order: number }

const csv = (text: string) => text.split(',').map((t) => t.trim()).filter(Boolean);

export default function AdminCategoriesPage() {
  const pushToast = useUIStore((s) => s.pushToast);
  const [rows, setRows] = useState<CategoryRow[] | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [subs, setSubs] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [nameError, setNameError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('categories').select('*').order('sort_order').order('name');
    if (error) pushToast(`Could not load categories: ${error.message}`, 'danger');
    setRows((data ?? []) as CategoryRow[]);
  }, [pushToast]);

  useEffect(() => { void load(); }, [load]);

  const openNew = () => {
    setEditing(null); setName(''); setSlug(''); setDescription(''); setSubs(''); setSortOrder(String((rows?.length ?? 0) + 1)); setNameError(''); setOpen(true);
  };
  const openEdit = (r: CategoryRow) => {
    setEditing(r); setName(r.name); setSlug(r.slug); setDescription(r.description); setSubs(r.subcategories.join(', ')); setSortOrder(String(r.sort_order)); setNameError(''); setOpen(true);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (!name.trim()) { setNameError('Category name is required.'); return; }
    setSaving(true);
    const finalSlug = editing ? editing.slug : (slug.trim() || slugify(name));
    const { error } = await supabase.from('categories').upsert({
      slug: finalSlug,
      name: name.trim(),
      description: description.trim(),
      subcategories: csv(subs),
      sort_order: Math.floor(Number(sortOrder)) || 0,
    });
    setSaving(false);
    if (error) { pushToast(error.message.includes('duplicate') ? 'Slug already exists.' : error.message, 'danger'); return; }
    pushToast(editing ? 'Category updated' : 'Category created');
    setOpen(false);
    void load();
  };

  const remove = async (r: CategoryRow) => {
    if (!supabase || !window.confirm(`Delete category "${r.name}"?`)) return;
    const { error } = await supabase.from('categories').delete().eq('slug', r.slug);
    if (error) pushToast('Cannot delete: products still use this category. Move or delete those products first.', 'danger');
    else { pushToast('Category deleted'); void load(); }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">Categories</h2>
          <p className="text-sm text-muted">Shown in the menu, footer and home page. Create as many as you need.</p>
        </div>
        <Button onClick={openNew}>Add category</Button>
      </div>

      {rows === null ? (
        <div className="grid gap-3 sm:grid-cols-2" aria-busy="true">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      ) : rows.length === 0 ? (
        <p className="rounded-xl bg-surface p-6 text-sm text-muted shadow-card">No categories yet.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => (
            <li key={r.slug} className="flex flex-col gap-2 rounded-xl bg-surface p-4 shadow-card">
              <p className="font-semibold">{r.name} <span className="text-xs font-normal text-muted">/{r.slug}</span></p>
              <p className="text-sm text-muted">{r.description}</p>
              {r.subcategories.length > 0 && <p className="text-xs text-muted">{r.subcategories.join(' · ')}</p>}
              <div className="mt-auto flex gap-4 pt-2">
                <button onClick={() => openEdit(r)} className="text-xs font-semibold text-primary hover:underline">Edit</button>
                <button onClick={() => remove(r)} className="text-xs font-semibold text-danger hover:underline">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit category' : 'Add category'}>
        <form onSubmit={save} noValidate className="flex flex-col gap-4">
          <Input label="Category name" value={name} error={nameError} onChange={(e) => setName(e.target.value)} />
          {!editing && <Input label="URL slug (auto if empty)" value={slug} onChange={(e) => setSlug(e.target.value)} hint="Lowercase, hyphens only" />}
          <Textarea label="Description" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input label="Subcategories" value={subs} onChange={(e) => setSubs(e.target.value)} hint="Comma separated" />
          <Input label="Sort order" type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Save changes' : 'Create category'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
