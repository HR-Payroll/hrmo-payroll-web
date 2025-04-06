import type { Metadata } from "next";
import { Arimo } from "next/font/google";
import "./globals.css";

const arimo = Arimo({ variable: "--font-arimo", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HRMO Payroll Management",
  description: "By Precious Hope T. Jumuad",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${arimo.variable} antialiased bg-[var(--slate)]`}>
        {children}
      </body>
    </html>
  );
}
