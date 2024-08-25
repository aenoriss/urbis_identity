import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MiniKitProvider from "@/components/minikit-provider";
import dynamic from "next/dynamic";
import NextAuthProvider from "@/components/next-auth-provider";
import './globals.css'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ErudaProvider = dynamic(
    () => import("../components/Eruda").then((c) => c.ErudaProvider),
    {
      ssr: false,
    }
  );

  return (
    <html lang="en">
      <body>
        <div className={poppins.className}>
          <NextAuthProvider>
            <ErudaProvider>
              <MiniKitProvider>
                {children}
              </MiniKitProvider>
            </ErudaProvider>
          </NextAuthProvider>
        </div>
      </body>
    </html>
  );
}