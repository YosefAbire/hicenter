import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HiCenter",
  description: "Learn. Plan. Grow — at the center.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
