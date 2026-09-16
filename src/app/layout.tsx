import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Международный аэропорт Кондратово (KON)",
  description: "Онлайн-табло и мульти-система управления рейсами",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ backgroundColor: "#0b0f19", color: "#f1f5f9", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
