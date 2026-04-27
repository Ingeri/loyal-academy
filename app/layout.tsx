import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// Inter for body text (clean and modern)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Playfair Display for headings (elegant and "Royal")
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Royal Academy | Excellence in Learning",
  description:
    "A prestigious platform for modern education and academic mastery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Main Wrapper */}
          <div className="relative flex min-h-screen flex-col">
            <Navbar />

            {/* Content Area */}
            <main className="flex-1">
              {children}
            </main>

            {/* Footer at the very bottom */}
            <Footer /> 
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
