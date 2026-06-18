import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { ThemeScript } from "@/components/ThemeScript";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "GRIP — Don't have grip on your System?",
  description:
    "GRIP gives you a live grip on your revenue pipeline — one system, one truth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-theme-preference="dark"
      className={`${geist.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full" suppressHydrationWarning>
        <ThemeProvider>
          {children}
          <ThemeSwitcher />
        </ThemeProvider>
      </body>
    </html>
  );
}
