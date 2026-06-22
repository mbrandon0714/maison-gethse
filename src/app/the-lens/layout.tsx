import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Lens — Visual Archive | Maison Gethse",
  description:
    "Documented, not displayed. A visual archive of chapters and the stories between them. Photography as memory — grounded, intentional, honest.",
  openGraph: {
    title: "The Lens | Maison Gethse",
    description: "A visual archive of chapters. Photography as memory — grounded, intentional, honest.",
    type: "website",
  },
};

export default function LensLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
