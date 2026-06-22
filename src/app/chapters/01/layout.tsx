import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chapter 01 — Before We Knew | Maison Gethse",
  description:
    "We once dreamed without limits. Before life opened our eyes to the weight of reality, there was innocence. Chapter 01 honors the space between who we were and who we are becoming.",
  openGraph: {
    title: "Chapter 01 — Before We Knew | Maison Gethse",
    description: "We once dreamed without limits. This chapter honors the space between who we were and who we are becoming.",
    type: "website",
  },
};

export default function Chapter01Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
