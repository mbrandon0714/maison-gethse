import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Garden — A Living Archive | Maison Gethse",
  description:
    "A sanctuary where seeds are planted. Share what you carry — your season, your lesson, your story. Not a comment section. A curated archive of becoming.",
  openGraph: {
    title: "The Garden | Maison Gethse",
    description: "A living archive of stories from people walking through their own seasons.",
    type: "website",
  },
};

export default function GardenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
