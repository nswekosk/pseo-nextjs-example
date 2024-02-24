import buildOpenGraph from "@/utils/buildOpenGraph";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const title = "Sample Next.js pSEO Movies Site";
const description = "This is a sample Next.js pSEO Movies Site";
const url = process.env.VERCEL_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(process.env.VERCEL_URL || "http://localhost:3000"),
  ...buildOpenGraph(title, description, url),
};

const navItems = [
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Actors",
    href: "/actors",
  },
  {
    label: "Directors",
    href: "/directors",
  },
  {
    label: "Genres",
    href: "/genres",
  },
  {
    label: "Movies",
    href: "/movies",
  },
  {
    label: "Theaters",
    href: "/theaters",
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-slate-800">
          <nav className="flex items-center justify-between max-w-screen-xl mx-auto h-16 px-3">
            <a href="/" className="font-bold text-lg text-white">
              Next.js pSEO Starter
            </a>
            <ul className="flex items-center gap-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="px-4 py-2 text-white hover:underline"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <div className="min-h-screen px-3 max-w-screen-xl mx-auto pt-8 pb-20">
          {children}
        </div>

        <footer className="bg-slate-800 text-white h-20 flex items-center justify-center">
          &copy; Your Company, {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
