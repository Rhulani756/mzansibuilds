import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "../components/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MzansiBuilds | Build in Public",
  description: "Derivco Code Skills Challenge submission",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-mzansi-light text-mzansi-dark`}>
        
        <Header />

        {/* Dynamic Page Content */}
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Simple Footer */}
        <footer className="bg-mzansi-dark text-gray-400 py-6 text-center text-sm border-t border-gray-800">
          <p>Built for the Derivco Code Skills Challenge.</p>
        </footer>

      </body>
    </html>
  );
}