"use client";
import { useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#services", label: "Services" },
  { href: "#projects", label: "Projects" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-neutral-200">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#home" className="font-semibold tracking-tight">MSR.</a>
        <ul className="hidden lg:flex gap-7 text-xs tracking-widest">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:underline underline-offset-4">{l.label}</a>
            </li>
          ))}
        </ul>
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="lg:hidden flex flex-col gap-1.5 p-2"
        >
          <span className="w-6 h-px bg-black" />
          <span className="w-6 h-px bg-black" />
          <span className="w-6 h-px bg-black" />
        </button>
      </nav>
      {open && (
        <ul className="lg:hidden border-t border-neutral-200 bg-white px-6 py-4 flex flex-col gap-4 text-xs tracking-widest">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="uppercase">{l.label}</a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
