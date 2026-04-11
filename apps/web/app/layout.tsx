import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer"; // Import the new Footer

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MzansiBuilds | Derivco Code Skills Challenge",
  description: "Track your milestones, collaborate with peers, and earn your spot on the Celebration Wall.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* flex & min-h-screen ensure the footer gets pushed to the absolute bottom */}
      <body className={`${inter.className} bg-white text-gray-900 antialiased min-h-screen flex flex-col`}>
        <Header />
        
        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>

        {/* The New Footer */}
        <Footer />
      </body>
    </html>
  );
}