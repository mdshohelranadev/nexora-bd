import { promises as fs } from "fs";
import path from "path";

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string; // comma separated
  status: "live" | "construction";
  url?: string;
};

const FILE = path.join(process.cwd(), "data", "projects.json");

export async function getProjects(): Promise<Project[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return [];
  }
}

export async function saveProjects(list: Project[]) {
  await fs.writeFile(FILE, JSON.stringify(list, null, 2));
}
