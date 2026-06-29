import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inclusive_Sans } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next"
import { TRPCReactProvider } from "~/trpc/react";
import { SpeedInsights } from "@vercel/speed-insights/next"

import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "Onsen Retreat 2026",
  description:
    "An Experimental One Week Program",
  icons: [
    { rel: "icon", url: "/asterisk-favicon.png", type: "image/png" },
    { rel: "shortcut icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/asterisk-favicon.png" },
  ],
};

// Inclusive Sans — the single default typeface across the site
const inclusive = Inclusive_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inclusive-sans",
});

// Imaginice — display/title-only font used for all titles and headers
const imaginice = localFont({
  src: "../../public/fonts/imaginice-font/imaginice-regular.ttf",
  variable: "--font-display",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${imaginice.variable} ${inclusive.variable}`}
    >
      <body>
        <Analytics />
        <SpeedInsights />
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
