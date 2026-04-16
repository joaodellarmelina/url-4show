import { LinkExhibition } from "@/components/link-exhibition";
import links from "@/data/links.json";
import type { LinkEntry } from "@/types/link-entry";

export default function Home() {
  return <LinkExhibition links={links as LinkEntry[]} />;
}
