'use client';

import { useRef, type ChangeEvent } from 'react';
import { Button, Input } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import type { HeroSlide } from '@/store/settingsStore';

interface HeroSlideEditorProps {
  slides: HeroSlide[];
  onChange: (slides: HeroSlide[]) => void;
  onMessage?: (msg: string) => void;
}

export function HeroSlideEditor({ slides, onChange, onMessage }: HeroSlideEditorProps) {
  const uploadingRef = useRef<{ [id: string]: boolean }>({});

  const addSlide = () => {
    onChange([
      ...slides,
      {
        id: typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `slide-${Date.now()}`,
        imageUrl: '',
        link: '',
        alt: '',
        enabled: true,
      },
    ]);
  };

  const updateSlide = (id: string, patch: Partial<HeroSlide>) => {
    onChange(slides.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const removeSlide = (id: string) => {
    if (confirm('Remove this slide?')) {
      onChange(slides.filter((s) => s.id !== id));
    }
  };

  const move = (id: string, dir: -1 | 1) => {
    const idx = slides.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const target = idx + dir;
    if (target < 0 || target >= slides.length) return;
    const next = [...slides];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  const uploadImage = async (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !supabase) return;

    uploadingRef.current[id] = true;
    onMessage?.('Uploading image...');

    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `hero/hero-${Date.now()}-${id.slice(0, 6)}.${ext}`;

    const { error } = await supabase.storage
      .from('assets')
      .upload(path, file, { cacheControl: '3600', upsert: true });

    uploadingRef.current[id] = false;

    if (error) {
      onMessage?.(`Upload failed: ${error.message}`);
      return;
    }

    const { data } = supabase.storage.from('assets').getPublicUrl(path);
    updateSlide(id, { imageUrl: data.publicUrl });
    onMessage?.('Image uploaded. Press Save to publish.');
  };

  return (
    <div className="flex flex-col gap-4">
      {slides.length === 0 && (
        <p className="rounded-lg border border-dashed border-line bg-canvas/40 p-4 text-sm text-muted">
          No slides yet. Click <strong>+ Add slide</strong> to create one. Add image, product link, and it will auto-slide on the home page.
        </p>
      )}

      {slides.map((slide, i) => (
        <div key={slide.id} className="rounded-lg border border-line bg-surface p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold">Slide {i + 1}</p>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs font-medium">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-primary"
                  checked={slide.enabled}
                  onChange={(e) => updateSlide(slide.id, { enabled: e.target.checked })}
                />
                Enabled
              </label>
              <Button variant="outline" size="sm" disabled={i === 0} onClick={() => move(slide.id, -1)}>↑</Button>
              <Button variant="outline" size="sm" disabled={i === slides.length - 1} onClick={() => move(slide.id, 1)}>↓</Button>
              <Button variant="danger" size="sm" onClick={() => removeSlide(slide.id)}>Remove</Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-muted">Image</label>
              <div className="flex flex-wrap items-center gap-3">
                {slide.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={slide.imageUrl} alt="Slide preview" className="h-20 w-36 rounded-md border border-line object-cover" />
                ) : (
                  <span className="text-sm text-muted">No image yet</span>
                )}
                <label className="inline-flex min-h-[44px] cursor-pointer items-center rounded-md border border-primary px-4 text-sm font-semibold text-primary hover:bg-primary-50">
                  {uploadingRef.current[slide.id] ? 'Uploading...' : 'Upload image'}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    disabled={Boolean(uploadingRef.current[slide.id])}
                    onChange={(e) => uploadImage(slide.id, e)}
                  />
                </label>
                {slide.imageUrl && (
                  <Button variant="ghost" size="sm" onClick={() => updateSlide(slide.id, { imageUrl: '' })}>
                    Remove image
                  </Button>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Link (product slug or full URL)"
                value={slide.link}
                onChange={(e) => updateSlide(slide.id, { link: e.target.value })}
                hint="Example: /product/iphone-15 or /category/fashion or https://..."
                placeholder="/product/product-slug"
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Alt text (for accessibility)"
                value={slide.alt}
                onChange={(e) => updateSlide(slide.id, { alt: e.target.value })}
                placeholder="Short description"
              />
            </div>
          </div>
        </div>
      ))}

      <div>
        <Button type="button" variant="outline" size="sm" onClick={addSlide}>+ Add slide</Button>
      </div>
    </div>
  );
}