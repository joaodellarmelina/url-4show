import type { Metadata } from "next";

type MetadataAuthor = {
  name: string;
  url?: string;
};

type MetadataOpenGraph = {
  title: string;
  description: string;
  url: string;
  siteName: string;
  locale?: string;
  type?: "website" | "article" | "profile" | "book";
};

type MetadataTwitter = {
  card?: "summary" | "summary_large_image" | "app" | "player";
  title: string;
  description: string;
  creator?: string;
  site?: string;
};

type MetadataRobots = {
  index?: boolean;
  follow?: boolean;
};

export type SiteMetadataConfig = {
  title: string;
  description: string;
  applicationName?: string;
  keywords?: string[];
  authors?: MetadataAuthor[];
  creator?: string;
  publisher?: string;
  metadataBase?: string;
  openGraph?: MetadataOpenGraph;
  twitter?: MetadataTwitter;
  robots?: MetadataRobots;
};

export function toNextMetadata(config: SiteMetadataConfig): Metadata {
  return {
    title: config.title,
    description: config.description,
    applicationName: config.applicationName,
    keywords: config.keywords,
    authors: config.authors,
    creator: config.creator,
    publisher: config.publisher,
    metadataBase: config.metadataBase
      ? new URL(config.metadataBase)
      : undefined,
    openGraph: config.openGraph,
    twitter: config.twitter,
    robots: config.robots,
  };
}
