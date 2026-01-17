"use client";

import Header from "./header";
import Sidebar from "./sidebar";
import FooterBottom from "./footer";
import Script from "next/script";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <div className="app-wrapper">
        <Sidebar />
        <main className="page-content">{children}</main>
      </div>

      <FooterBottom />

      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        strategy="afterInteractive"
      />
    </>
  );
}
  