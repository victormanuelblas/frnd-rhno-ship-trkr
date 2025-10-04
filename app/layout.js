import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import "./layout.sass";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Rhinoseller",
  description: "Ideando solucionaes para negocios",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="layout">
        <Header />
          <main>
          {children}
          </main> 
        <footer className="footer">
          &copy; 2025 - rhinoseller - todos los derechos reservados.
        </footer>
      </body>
    </html>
  );
}
