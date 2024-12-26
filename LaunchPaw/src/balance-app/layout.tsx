import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TokenVerse - Balance",
  description: "View token balances",
};

export default function BalanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}