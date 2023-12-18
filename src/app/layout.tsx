import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavigationBar from "./blocks/navigation-bar/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wedding Manager",
  description: "Manage your wedding here.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavigationBar />
        <div className="px-5 my-20">{children}</div>
      </body>
    </html>
  );
}
