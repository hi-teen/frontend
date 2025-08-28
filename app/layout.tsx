import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../src/styles/globals.css";
import ClientLayout from "./_component/ClientLayout";
import ErrorBoundary from "./_component/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HiTeen - 고딩을 위한 익명 커뮤니티",
  description: "고딩들을 위한 따뜻한 익명 커뮤니티",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='ko'>
      <body className={`${inter.className} bg-gray-50`}>
        <ErrorBoundary>
          <ClientLayout>{children}</ClientLayout>
        </ErrorBoundary>
      </body>
    </html>
  );
}