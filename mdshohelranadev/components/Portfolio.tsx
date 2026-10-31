"use client";
import { useEffect, useRef, useState, FormEvent, ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { profile, roles, stats, skillTabs, services, roadmap, experience } from "@/lib/content";
import type { Project } from "@/lib/projects";

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="py-24 px-6 md:px-12 border-t border-neutral-200 scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-xs tracking-widest uppercase text-neutral-500">{title}</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mt-2 mb-12">{title}</h2>
        </Reveal>
        {children}
      </div>
    </section>
  );
}

function Typewriter() {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = roles[i % roles.length];
    let speed = del ? 40 : 90;
    if (!del && text === word) speed = 1500;
    const t = setTimeout(() => {
      if (!del && text === word) return setDel(true);
      if (del && text === "") {
        setDel(false);
        return setI((n) => n + 1);
      }
      setText(del ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [text, del, i]);
  return (
    <span>
      {text}
      <span className="inline-block w-[2px] h-[1em] bg-black align-middle ml-1 animate-pulse" />
    </span>
  );
}

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const step = Math.max(1, Math.ceil(to / 60));
    const id = setInterval(() => {
      v += step;
      if (v >= to) {
        v = to;
        clearInterval(id);
      }
      setN(v);
    }, 25);
    return () => clearInterval(id);
  }, [inView, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

export default function Portfolio({ projects }: { projects: Project[] }) {
  const [tab, setTab] = useState(0);
  const [filter, setFilter] = useState<"all" | "live" | "construction">("all");
  const [showTop, setShowTop] = useState(false);
  const [status, setStatus] = useState<"" | "sending" | "sent" | "error">("");

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shown = projects.filter((p) => filter === "all" || p.status === filter);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    const fd = new FormData(form);
    fd.append("access_key", profile.web3formsKey);
    fd.append("subject", "New message from portfolio");
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
      const data = await res.json();
      setStatus(data.success ? "sent" : "error");
      if (data.success) form.reset();
    } catch {
      setStatus("error");
    }
  }

  const inputCls = "w-full border border-neutral-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black";

  return (
    <main>
      {/* HERO */}
      <section id="home" className="min-h-screen flex items-center px-6 md:px-12 pt-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center w-full">
          <Reveal>
            <p className="text-sm tracking-widest uppercase text-neutral-500 mb-4">Hello, I am</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
              {profile.name}
            </h1>
            <p className="text-xl md:text-2xl mt-4 h-8 text-neutral-700">
              <Typewriter />
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <a href="#projects" className="bg-black text-white rounded-full px-7 py-3 text-sm hover:opacity-80 transition">
                View Projects
              </a>
              <a href="#contact" className="border border-black rounded-full px-7 py-3 text-sm hover:bg-black hover:text-white transition">
                Contact Me
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.2} className="flex justify-center">
            <img
              src={profile.photo}
              alt={profile.name}
              className="w-64 h-64 md:w-96 md:h-96 object-cover rounded-3xl grayscale"
            />
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-6 md:px-12 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.1}>
              <div className="text-4xl md:text-5xl font-semibold">
                <Counter to={s.to} suffix={s.suffix} />
              </div>
              <p className="text-sm text-neutral-500 mt-2">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <Section id="about" title="About Me">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <Reveal>
            <img src={profile.photo} alt={profile.name} className="w-full max-w-sm rounded-3xl grayscale object-cover" />
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg text-neutral-700 leading-relaxed">{profile.bio}</p>
            <div className="grid grid-cols-2 gap-4 mt-10 text-sm">
              {[
                ["Name", profile.name],
                ["Location", profile.location],
                ["Email", profile.email],
                ["Phone", profile.phone],
                ["Role", profile.title],
                ["Handle", profile.handle],
              ].map(([k, v]) => (
                <div key={k} className="border border-neutral-200 rounded-xl p-4">
                  <p className="text-neutral-500 text-xs uppercase tracking-wider">{k}</p>
                  <p className="mt-1 break-all">{v}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* SKILLS */}
      <Section id="skills" title="Skills">
        <Reveal>
          <div className="flex flex-wrap gap-2 mb-10">
            {skillTabs.map((t, idx) => (
              <button
                key={t.name}
                onClick={() => setTab(idx)}
                className={`rounded-full px-5 py-2 text-sm border transition ${
                  tab === idx ? "bg-black text-white border-black" : "border-neutral-300 hover:border-black"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
          <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {skillTabs[tab].items.map((item) => (
              <div key={item} className="border border-neutral-200 rounded-xl p-5 font-medium">
                {item}
              </div>
            ))}
          </motion.div>
        </Reveal>
      </Section>

      {/* SERVICES */}
      <Section id="services" title="Services">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, idx) => (
            <Reveal key={s.title} delay={(idx % 3) * 0.1}>
              <div className="border border-neutral-200 rounded-2xl p-8 h-full hover:shadow-lg transition">
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="text-neutral-600 mt-3">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* PROJECTS */}
      <Section id="projects" title="Projects">
        <Reveal>
          <div className="flex flex-wrap gap-2 mb-10">
            {(["all", "live", "construction"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-5 py-2 text-sm border transition capitalize ${
                  filter === f ? "bg-black text-white border-black" : "border-neutral-300 hover:border-black"
                }`}
              >
                {f === "construction" ? "Under Construction" : f}
              </button>
            ))}
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((p, idx) => (
            <Reveal key={p.id} delay={(idx % 3) * 0.1}>
              <div className="border border-neutral-200 rounded-2xl p-6 h-full flex flex-col hover:shadow-lg transition">
                <p className={`text-xs uppercase tracking-wider ${p.status === "live" ? "font-semibold" : "text-neutral-500"}`}>
                  {p.status === "live" ? "● Live" : "Under construction"}
                </p>
                <h3 className="text-xl font-semibold mt-4">{p.title}</h3>
                <p className="text-neutral-600 mt-2 flex-1">{p.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {p.tags.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                    <span key={t} className="text-xs border border-neutral-300 rounded-full px-3 py-1">{t}</span>
                  ))}
                </div>
                {p.status === "live" && p.url && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-6 text-sm underline underline-offset-4">
                    View live →
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ROADMAP */}
      <Section id="roadmap" title="Roadmap">
        <div className="relative border-l border-neutral-300 ml-3 md:ml-6 space-y-10">
          {roadmap.map((r, idx) => (
            <Reveal key={r.title} delay={idx * 0.05}>
              <div className="relative pl-8">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-black" />
                <p className="text-xs uppercase tracking-widest text-neutral-500">Step {idx + 1}</p>
                <h3 className="text-xl font-semibold">{r.title}</h3>
                <p className="text-neutral-600 mt-1">{r.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* EXPERIENCE */}
      <Section id="experience" title="Experience">
        <div className="relative border-l border-neutral-300 ml-3 md:ml-6 space-y-10">
          {experience.map((e, idx) => (
            <Reveal key={e.role + idx} delay={idx * 0.1}>
              <div className="relative pl-8">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-black bg-white" />
                <p className="text-xs uppercase tracking-widest text-neutral-500">{e.period}</p>
                <h3 className="text-xl font-semibold mt-1">{e.role}</h3>
                <p className="text-neutral-700">{e.company}</p>
                <p className="text-neutral-600 mt-1">{e.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact" title="Contact">
        <div className="grid md:grid-cols-2 gap-12">
          <Reveal>
            <p className="text-neutral-700 mb-8">Have a project in mind? Send me a message or chat on WhatsApp.</p>
            <a
              href={`https://wa.me/${profile.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-black text-white rounded-full px-7 py-3 text-sm hover:opacity-80 transition"
            >
              Chat on WhatsApp
            </a>
            <div className="mt-10 space-y-2 text-sm">
              <p>{profile.email}</p>
              <p>{profile.phone}</p>
              <p>{profile.location}</p>
            </div>
            <div className="flex gap-6 mt-8 text-sm underline underline-offset-4">
              <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href={profile.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <form onSubmit={onSubmit} className="space-y-4">
              <input name="name" required placeholder="Your name" className={inputCls} />
              <input name="email" type="email" required placeholder="Your email" className={inputCls} />
              <textarea name="message" required rows={5} placeholder="Your message" className={inputCls} />
              <button
                type="submit"
                disabled={status === "sending"}
                className="bg-black text-white rounded-full px-7 py-3 text-sm hover:opacity-80 transition disabled:opacity-50"
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>
              {status === "sent" && <p className="text-sm">Thanks! Your message was sent.</p>}
              {status === "error" && <p className="text-sm">Something went wrong. Please try again.</p>}
            </form>
          </Reveal>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 py-10 px-6 text-center text-sm text-neutral-500">
        <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        <p className="mt-1">{profile.location}</p>
      </footer>

      {/* BACK TO TOP */}
      <button
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center transition ${
          showTop ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        ↑
      </button>
    </main>
  );
}
