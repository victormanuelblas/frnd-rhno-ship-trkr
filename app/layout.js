import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderInnova from "@/components/HeaderInnova";
import "./layout.sass";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Innova Operador Logístico",
  description: "Aplicación de seguimiento de envíos - Rhinoseller.com",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="layout">
        <Providers>
          <HeaderInnova />
            <main>
            {children}
            </main> 
          <footer className="footer">
            &copy; 2025 - rhinoseller - todos los derechos reservados.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
