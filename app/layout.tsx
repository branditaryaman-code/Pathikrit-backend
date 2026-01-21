import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import "./assets/css/auth.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/calender.css";
import "./assets/css/datatables.css";
import "./assets/css/font-awesome.min.css";
import "./assets/css/icofont.min.css";
import "./assets/css/style.css";
import "./assets/css/range.css";
import "./assets/css/theme.css";
import "./assets/css/nice-select.css";
import "./assets/css/jqvmap.min.css";
import Script from "next/script";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
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
      <body className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable}`}>
        {children}

        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
