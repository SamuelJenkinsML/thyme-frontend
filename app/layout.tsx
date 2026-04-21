import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, DM_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Thyme — The Streaming Feature Platform",
  description:
    "Define features in Python, serve them in real-time with a Rust engine. Thyme eliminates training/serving skew with point-in-time correct feature computation.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-dark.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
    ],
  },
  openGraph: {
    title: "Thyme — The Streaming Feature Platform",
    description:
      "Define features in Python, serve them in real-time with a Rust engine. Zero training/serving skew.",
    type: "website",
    siteName: "Thyme",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thyme — The Streaming Feature Platform",
    description:
      "Define features in Python, serve them in real-time with a Rust engine. Zero training/serving skew.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${dmSans.variable} ${newsreader.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
