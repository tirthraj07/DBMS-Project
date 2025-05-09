import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar/Navbar"
import { headers, cookies } from 'next/headers';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const cookieStore = cookies();

  const isLoggedIn = cookieStore.has('webToken')
  const userRole = cookieStore.get("role")?.value || "user"


  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-20 overflow-hidden">
            <Navbar isLoggedIn={isLoggedIn} userRole={userRole}></Navbar>
          </div>
          <div style={{ minHeight: "calc(100vh - 5rem)" }}>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
