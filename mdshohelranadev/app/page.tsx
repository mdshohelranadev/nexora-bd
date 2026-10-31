import Navbar from "@/components/Navbar";
import Portfolio from "@/components/Portfolio";
import { getProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getProjects();
  return (
    <>
      <Navbar />
      <Portfolio projects={projects} />
    </>
  );
}
