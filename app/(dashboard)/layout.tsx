"use client";

import Header from "../header";
import Sidebar from "../sidebar";
import FooterBottom from "../footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-wrapper">
      <Sidebar />

      <div className="main-content">
        <Header />

        <div className="container-fluid">
          <main>{children}</main>
        </div>

        <FooterBottom />
      </div>
    </div>
  );
}
