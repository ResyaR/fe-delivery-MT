import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Food & Drink",
  description: "Created By ResyaR",
};

export default function FoodLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
