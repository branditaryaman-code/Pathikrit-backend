import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./assets/css/auth.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/calender.css";
import "./assets/css/datatables.css";
import { Poppins } from "next/font/google";
import "./assets/css/font-awesome.min.css";
import "./assets/css/icofont.min.css";
import "./assets/css/style.css";
import "./assets/css/range.css";
import "./assets/css/theme.css";
import "./assets/css/nice-select.css";
import "./assets/css/jqvmap.min.css";
import Script from "next/script";

import Header from "./header";
import FooterBottom from "./footer";
import Sidebar from "./sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SplashDash",
  description: "SplashDash Admin Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
     <body
  className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
>

        {/* === Page Wrapper (REQUIRED by template CSS) === */}
        <div className="page-wrapper">
          
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="main-content">
            
            {/* Header */}
            <Header />

            {/* Page Content */}
            <div className="container-fluid">
              <main>{children}</main>
            </div>

            {/* Footer */}
            <FooterBottom />
          </div>
        </div>

        {/* Bootstrap JS (already correct) */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
