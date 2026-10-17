// app/(dashboard)/suppliers/page.tsx

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Factory,
  Plus,
  Download,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  Wallet,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { SupplierFormDialog } from '@/components/suppliers/supplier-form-dialog';
import { MakePaymentDialog } from '@/components/suppliers/make-payment-dialog';
import { useSupplierStore } from '@/lib/store/supplier-store';
import { formatCurrency } from '@/lib/format';
import { downloadCSV } from '@/lib/export';
import { cn } from '@/lib/utils';
import type { Supplier } from '@/lib/types';

export default function SuppliersPage() {
  const { suppliers, remove } = useSupplierStore();

  const [query, setQuery] = useState('');
  const [dueFilter, setDueFilter] = useState<string>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [deleting, setDeleting] = useState<Supplier | null>(null);
  const [payTarget, setPayTarget] = useState<Supplier | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return suppliers.filter((s) => {
      if (dueFilter === 'due' && s.due <= 0) return false;
      if (dueFilter === 'clear' && s.due > 0) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        (s.contactPerson ?? '').toLowerCase().includes(q) ||
        (s.email ?? '').toLowerCase().includes(q)
      );
    });
  }, [suppliers, query, dueFilter]);

  const stats = useMemo(() => {
    const totalDue = suppliers.reduce((s, x) => s + x.due, 0);
    const withDue = suppliers.filter((x) => x.due > 0).length;
    const totalPaid = suppliers.reduce((s, x) => s + x.paid, 0);
    return { totalDue, withDue, totalPaid };
  }, [suppliers]);

  const handleExport = () => {
    downloadCSV(
      filtered.map((s) => ({
        name: s.name,
        contactPerson: s.contactPerson ?? '',
        phone: s.phone,
        email: s.email ?? '',
        address: s.address ?? '',
        due: s.due,
        paid: s.paid,
        totalPurchase: s.totalPurchase,
      })),
      `suppliers-${new Date().toISOString().slice(0, 10)}.csv`
    );
    toast.success('CSV downloaded');
  };

  return (
    <div>
      <PageHeader
        title="Suppliers"
        description={`${suppliers.length} suppliers · ${stats.withDue} with due · ${formatCurrency(stats.totalDue)} payable`}
        actions={
          <>
            <Button variant="outline" className="h-9" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              className="h-9"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              Total Suppliers
            </div>
            <div className="text-lg font-bold mt-1 tabular-nums">
              {suppliers.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              With Outstanding Due
            </div>
            <div className="text-lg font-bold mt-1 tabular-nums text-amber-600 dark:text-amber-400">
              {stats.withDue}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              Total Payable
            </div>
            <div className="text-lg font-bold mt-1 tabular-nums text-red-600 dark:text-red-400">
              {formatCurrency(stats.totalDue)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Input
          placeholder="Search name, contact, phone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-9 max-w-sm"
        />
        <Select value={dueFilter} onValueChange={setDueFilter}>
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Suppliers</SelectItem>
            <SelectItem value="due">With Due</SelectItem>
            <SelectItem value="clear">No Due</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <EmptyState
              icon={Factory}
              title="No suppliers found"
              description="Try different filters or add a new supplier."
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="text-left font-semibold px-4 py-2.5">Supplier</th>
                  <th className="text-left font-semibold px-4 py-2.5 hidden md:table-cell">
                    Phone
                  </th>
                  <th className="text-right font-semibold px-4 py-2.5 hidden lg:table-cell">
                    Total Purchase
                  </th>
                  <th className="text-right font-semibold px-4 py-2.5 hidden lg:table-cell">
                    Paid
                  </th>
                  <th className="text-right font-semibold px-4 py-2.5">Due</th>
                  <th className="text-right font-semibold px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    className={cn(
                      'border-t border-border hover:bg-muted/30 transition',
                      s.due > 0 && 'bg-red-500/[0.03]'
                    )}
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/suppliers/${s.id}`}
                        className="flex items-center gap-3 min-w-0 group"
                      >
                        <div className="h-9 w-9 shrink-0 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">
                          {s.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {s.name}
                          </div>
                          {s.contactPerson && (
                            <div className="text-xs text-muted-foreground truncate">
                              {s.contactPerson}
                            </div>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                      {s.phone}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums hidden lg:table-cell">
                      {formatCurrency(s.totalPurchase)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums hidden lg:table-cell text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(s.paid)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {s.due > 0 ? (
                        <span className="font-semibold text-red-600 dark:text-red-400">
                          {formatCurrency(s.due)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/suppliers/${s.id}`}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditing(s);
                              setFormOpen(true);
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {s.due > 0 && (
                            <DropdownMenuItem onClick={() => setPayTarget(s)}>
                              <Wallet className="mr-2 h-4 w-4" />
                              Make payment
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                            onClick={() => setDeleting(s)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <SupplierFormDialog
        open={formOpen}
        onOpenChange={(v) => {
          setFormOpen(v);
          if (!v) setEditing(null);
        }}
        supplier={editing}
      />

      <MakePaymentDialog
        open={!!payTarget}
        onOpenChange={(v) => !v && setPayTarget(null)}
        supplierId={payTarget?.id ?? null}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Delete supplier?"
        description={`"${deleting?.name}" will be removed. This cannot be undone.`}
        onConfirm={() => {
          if (deleting) {
            remove(deleting.id);
            toast.success('Supplier deleted');
            setDeleting(null);
          }
        }}
      />
    </div>
  );
}