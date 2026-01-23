// src/app/layout.tsx
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { Toaster } from "@/shared/ui";
import "./globals.css";

const nunito = Nunito_Sans({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Запись на курсы | my.itmo",
  description: "Платформа записи на курсы университета",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${nunito.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
