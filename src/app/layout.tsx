import type { Metadata, Viewport } from "next";
import { Inter, Tajawal } from "next/font/google";
import "./globals.css";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";
import { AppNavigation } from "@/components/AppNavigation";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import { ToastContainer } from "@/components/ui/Toast";
import { CommandPalette } from "@/components/CommandPalette";
import { DeviceTelemetryTracker } from "@/components/DeviceTelemetryTracker";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: {
    default: "PR Agent",
    template: "%s | PR Agent",
  },
  description:
    "PR Agent: إيجنت ذكاء اصطناعي فاهم اللهجة المصرية والعربية للرد الفوري على تعليقات ورسائل إنستجرام وواتساب، واستخراج الأوردرات وتدقيق إيصالات إنستاباي.",
  applicationName: "PR Agent",
  keywords: [
    "PR Agent",
    "خدمة عملاء ذكاء اصطناعي",
    "أتمتة إنستجرام",
    "بوت واتساب",
    "فحص إنستاباي",
    "تجارة إلكترونية مصر",
    "Comment to DM"
  ],
  authors: [{ name: "PR Agent Team" }],
  creator: "PR Agent",
  publisher: "PR Agent",
  metadataBase: new URL("https://pr-agent-ai.vercel.app"),
  openGraph: {
    title: "PR Agent | أتمتة مبيعات الشات وخدمة العملاء بالذكاء الاصطناعي",
    description:
      "حوّل كل تعليق ورسالة لأوردر فوري مع أسطول إيجنتس ذكي وفحص إيصالات إنستاباي آلياً.",
    url: "https://pr-agent-ai.vercel.app",
    siteName: "PR Agent",
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PR Agent | أتمتة مبيعات الشات والتجارة الإلكترونية",
    description:
      "المنصة الأولى لأتمتة خدمة عملاء التجارة الاجتماعية في مصر والشرق الأوسط.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PR Agent",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0F17",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${tajawal.variable} dark`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-[#0B0F17] text-white font-sans antialiased min-h-screen pb-16 md:pb-0">
        <AppNavigation />
        {children}
        <MobileBottomBar />
        <DeviceTelemetryTracker />
        <PwaInstallPrompt />
        <ToastContainer />
        <CommandPalette />
      </body>
    </html>
  );
}
