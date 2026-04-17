import type { Metadata, Viewport } from "next";
import siteMetadata from "@/data/site-metadata.json";
import {
  toNextMetadata,
  type SiteMetadataConfig,
} from "@/types/site-metadata";
import "./globals.css";

export const metadata: Metadata = toNextMetadata(
  siteMetadata as SiteMetadataConfig
);

export const viewport: Viewport = {
  themeColor: "#ece4d7",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
