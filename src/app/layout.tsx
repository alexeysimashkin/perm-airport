// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css"; // Если используете стили Tailwind

export const metadata: Metadata = {
  title: "Аэропорт Кондратово (KON) - Пермь",
  description: "Официальный сайт и онлайн-табло аэропорта",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-slate-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
