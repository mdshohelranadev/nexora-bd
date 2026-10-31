import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Md Shohel Rana — Full Stack Web Developer",
  description: "Portfolio of Md Shohel Rana, Full Stack Web Developer from Dhaka, Bangladesh.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
