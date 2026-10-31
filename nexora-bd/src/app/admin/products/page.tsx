'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/utils/slug';
import { uploadAsset } from '@/lib/upload';
import { useUIStore } from '@/store/uiStore';
import { Button, Input, Modal, Textarea, Badge } from '@/components/ui';
import { Skeleton } from '@/components/ui/Loading';
import { formatBDT } from '@/utils/format';

interface ProductRow {
  id: string; slug: string; name: string; brand: string; category: string; subcategory: string;
  price: number; original_price: number; rating: number; review_count: number;
  short_description: string; description: string; specifications: Record<string, string>;
  images: string[]; variants: { colors?: string[]; sizes?: string[] } | null;
  stock: number; badges: string[]; is_active: boolean; sort_order: number;
}
interface CategoryOpt { slug: string; name: string }

const blank = {
  name: '', slug: '', brand: '', category: '', subcategory: '', price: '0', originalPrice: '0',
  stock: '0', shortDescription: '', description: '', specs: '', images: '', colors: '', sizes: '',
  badges: '', isActive: true, sortOrder: '0',
};
type Form = typeof blank;

const toLines = (rec: Record<string, string> | undefined) =>
  Object.entries(rec ?? {}).map(([k, v]) => `${k}: ${v}`).join('\n');
const fromLines = (text: string) =>
  Object.fromEntries(text.split('\n').map((l) => l.split(':')).filter((p) => p.length >= 2 && p[0].trim()).map(([k, ...rest]) => [k.trim(), rest.join(':').trim()]));
const csv = (text: string) => text.split(',').map((t) => t.trim()).filter(Boolean);

export default function AdminProductsPage() {
  const pushToast = useUIStore((s) => s.pushToast);
  const [rows, setRows] = useState<ProductRow[] | null>(null);
  const [cats, setCats] = useState<CategoryOpt[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(blank);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});

  const load = useCallback(async () => {
    if (!supabase) return;
    const [p, c] = await Promise.all([
      supabase.from('products').select('*').order('sort_order').order('name'),
      supabase.from('categories').select('slug, name').order('sort_order'),
    ]);
    if (p.error) pushToast(`Could not load products: ${p.error.message}`, 'danger');
    setRows((p.data ?? []) as ProductRow[]);
    setCats((c.data ?? []) as CategoryOpt[]);
  }, [pushToast]);

  useEffect(() => { void load(); }, [load]);

  const openNew = () => { setEditId(null); setForm({ ...blank, category: cats[0]?.slug ?? '' }); setErrors({}); setOpen(true); };
  const openEdit = (r: ProductRow) => {
    setEditId(r.id);
    setForm({
      name: r.name, slug: r.slug, brand: r.brand, category: r.category, subcategory: r.subcategory,
      price: String(r.price), originalPrice: String(r.original_price), stock: String(r.stock),
      shortDescription: r.short_description, description: r.description, specs: toLines(r.specifications),
      images: (r.images ?? []).join('\n'), colors: (r.variants?.colors ?? []).join(', '), sizes: (r.variants?.sizes ?? []).join(', '),
      badges: (r.badges ?? []).join(', '), isActive: r.is_active, sortOrder: String(r.sort_order),
    });
    setErrors({});
    setOpen(true);
  };

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const addImage = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadAsset('products', file);
      set('images', [form.images, url].filter(Boolean).join('\n'));
      pushToast('Image uploaded');
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Upload failed', 'danger');
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Product name is required.';
    if (!form.category) e.category = 'Choose a category.';
    if (!(Number(form.price) >= 0)) e.price = 'Enter a valid price.';
    if (Number(form.originalPrice) < Number(form.price)) e.originalPrice = 'Original price should be above the sale price.';
    if (!(Number(form.stock) >= 0)) e.stock = 'Enter a valid stock number.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase || !validate()) return;
    setSaving(true);
    const slug = (form.slug.trim() || slugify(form.name));
    const variants = { colors: csv(form.colors), sizes: csv(form.sizes) };
    const row = {
      id: editId ?? `p-${Date.now().toString(36)}`,
      slug,
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      subcategory: form.subcategory.trim(),
      price: Number(form.price),
      original_price: Number(form.originalPrice) || Number(form.price),
      stock: Math.floor(Number(form.stock)),
      short_description: form.shortDescription.trim(),
      description: form.description.trim(),
      specifications: fromLines(form.specs),
      images: csv(form.images.replace(/\n/g, ',')),
      variants: variants.colors.length || variants.sizes.length ? variants : null,
      badges: csv(form.badges),
      is_active: form.isActive,
      sort_order: Math.floor(Number(form.sortOrder)) || 0,
    };
    const { error } = await supabase.from('products').upsert(row);
    setSaving(false);
    if (error) {
      pushToast(error.message.includes('duplicate') ? 'Slug already used. Change the slug.' : error.message, 'danger');
      return;
    }
    pushToast(editId ? 'Product updated' : 'Product added');
    setOpen(false);
    void load();
  };

  const remove = async (r: ProductRow) => {
    if (!supabase || !window.confirm(`Delete "${r.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('products').delete().eq('id', r.id);
    if (error) pushToast(error.message, 'danger');
    else { pushToast('Product deleted'); void load(); }
  };

  const toggleActive = async (r: ProductRow) => {
    if (!supabase) return;
    const { error } = await supabase.from('products').update({ is_active: !r.is_active }).eq('id', r.id);
    if (error) pushToast(error.message, 'danger');
    else void load();
  };

  const field = (name: keyof Form, label: string, props: Record<string, unknown> = {}) => (
    <Input label={label} error={errors[name]} value={form[name] as string} onChange={(e) => set(name, e.target.value as never)} {...props} />
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">Products</h2>
          <p className="text-sm text-muted">{rows ? `${rows.length} products` : ' '}</p>
        </div>
        <Button onClick={openNew} disabled={cats.length === 0} title={cats.length === 0 ? 'Create a category first' : undefined}>Add product</Button>
      </div>

      {rows === null ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
          {[0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : rows.length === 0 ? (
        <p className="rounded-xl bg-surface p-6 text-sm text-muted shadow-card">No products yet. Click Add product.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence initial={false}>
            {rows.map((r) => (
              <motion.li key={r.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-3 rounded-xl bg-surface p-3 shadow-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {r.images?.[0] ? <img src={r.images[0]} alt="" className="h-20 w-20 shrink-0 rounded-md object-cover" /> : <div className="h-20 w-20 shrink-0 rounded-md bg-canvas" />}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="truncate font-semibold">{r.name}</p>
                  <p className="text-xs text-muted">{r.category} · stock {r.stock}</p>
                  <p className="text-sm font-bold">{formatBDT(r.price)}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-2">
                    <Badge variant={r.is_active ? 'success' : 'default'}>{r.is_active ? 'Live' : 'Hidden'}</Badge>
                    <button onClick={() => openEdit(r)} className="text-xs font-semibold text-primary hover:underline">Edit</button>
                    <button onClick={() => toggleActive(r)} className="text-xs font-semibold text-muted hover:underline">{r.is_active ? 'Hide' : 'Show'}</button>
                    <button onClick={() => remove(r)} className="text-xs font-semibold text-danger hover:underline">Delete</button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Edit product' : 'Add product'}>
        <form onSubmit={save} noValidate className="grid gap-4 sm:grid-cols-2">
          {field('name', 'Product name')}
          {field('slug', 'URL slug (auto if empty)', { hint: 'Lowercase, hyphens only' })}
          {field('brand', 'Brand')}
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Category
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className="h-12 rounded-md border border-line bg-white px-3 text-base font-normal">
              {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
            {errors.category && <span className="text-xs font-normal text-danger">{errors.category}</span>}
          </label>
          {field('subcategory', 'Subcategory')}
          {field('stock', 'Stock', { type: 'number', min: 0 })}
          {field('price', 'Sale price (৳)', { type: 'number', min: 0 })}
          {field('originalPrice', 'Original price (৳)', { type: 'number', min: 0 })}
          {field('sortOrder', 'Sort order', { type: 'number' })}
          {field('badges', 'Badges', { hint: 'Comma separated: Best Seller, New, Top Rated' })}
          {field('colors', 'Colours', { hint: 'Comma separated' })}
          {field('sizes', 'Sizes', { hint: 'Comma separated, optional' })}
          <div className="sm:col-span-2">{field('shortDescription', 'Short description')}</div>
          <div className="sm:col-span-2"><Textarea label="Full description" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
          <div className="sm:col-span-2"><Textarea label="Specifications" hint="One per line, e.g. Battery: 5000mAh" rows={4} value={form.specs} onChange={(e) => set('specs', e.target.value)} /></div>
          <div className="sm:col-span-2 flex flex-col gap-2">
            <Textarea label="Image URLs" hint="One per line. The first image is the main one." rows={3} value={form.images} onChange={(e) => set('images', e.target.value)} />
            <label className="inline-flex min-h-[44px] w-fit cursor-pointer items-center rounded-md border border-primary px-4 text-sm font-semibold text-primary hover:bg-primary-50">
              {uploading ? 'Uploading...' : 'Upload image'}
              <input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void addImage(f); }} />
            </label>
          </div>
          <label className="flex items-center gap-3 text-sm font-semibold sm:col-span-2">
            <input type="checkbox" className="h-5 w-5 accent-primary" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} />
            Visible on the store
          </label>
          <div className="flex justify-end gap-3 sm:col-span-2">
            <Button variant="ghost" onClick={() => setOpen(false)} type="button">Cancel</Button>
            <Button type="submit" loading={saving}>{editId ? 'Save changes' : 'Add product'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
