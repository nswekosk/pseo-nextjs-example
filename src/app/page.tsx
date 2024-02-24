import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Home page",
};

export default function Home() {
  return (
    <main>
      <h1 className="mb-4">Next.js pSEO Movies Starter Site</h1>
      <p>
        This site is not complete, but has well-structured placeholders you can
        use to experiment!
      </p>
    </main>
  );
}
