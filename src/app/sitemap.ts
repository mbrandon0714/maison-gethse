import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://maison-gethse.marknitor.workers.dev";
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/home`, priority: 0.9 },
    { url: `${base}/chapters/01`, priority: 0.9 },
    { url: `${base}/the-garden`, priority: 0.7 },
    { url: `${base}/the-lens`, priority: 0.7 },
  ];
}
