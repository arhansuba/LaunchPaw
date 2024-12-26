import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TokenVerse - Explorer",
  description: "Explore blockchain transactions and blocks",
};

export default function ExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}