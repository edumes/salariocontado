import { ThemeProvider } from "@/lib/theme-context";
import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

const InterSans = Inter({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

const InterTight = Inter_Tight({
  variable: "--font-fira-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Salario Contado",
  description: "Veja quanto você está ganhando em tempo real",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${InterSans.variable} ${InterTight.variable} antialiased`}
      >
        <ThemeProvider>
          {/* <Cursor /> */}
          <div className="relative min-h-screen font-sans overflow-hidden">
            {/* <div className="absolute inset-0">
              <BackgroundBeams />
            </div> */}

            <div> {/* className="relative z-10" */}
              {children}
            </div>

            {/* <Footer /> */}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
