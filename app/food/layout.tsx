import type { Metadata } from "next";
import "./food.css";

export const metadata: Metadata = {
  title: "Food & Drink",
  description: "Created By ResyaR",
};

export default function FoodLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <div className="food-app">{children}</div>
      </body>
    </html>
  );
}
