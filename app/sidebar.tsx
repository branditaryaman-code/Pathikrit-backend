"use client";


import React, { useState } from "react";

const Sidebar: React.FC = () => {
   const [isStaticOpen, setIsStaticOpen] = useState(false);
   const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  return (
    <aside className="sidebar-wrapper">
      
      <div className="logo-wrapper">
        <a href="/" className="admin-logo">
          <img src="/assets/images/logo.png" alt="Logo" className="sp_logo" />
          <img
            src="/assets/images/mini_logo.png"
            alt="Mini Logo"
            className="sp_mini_logo"
          />
        </a>
      </div>

      <div className="side-menu-wrap">
       
        <ul className="main-menu">
          {/* Dashboard */}
          <li>
            <a href= "/dashboard" className="active">
              <span className="icon-menu feather-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </span>
              <span className="menu-text">Dashboard</span>
            </a>
            </li>

            
              <li>
                <a href="/admin">
                <span className="icon-menu feather-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </span>
                            <span className="menu-text">
                               Admin
                            </span>
                </a>
              </li>
             <li>
                        <a href="/user">
                            <span className="icon-menu feather-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </span>
                            <span className="menu-text">
                               Users
                            </span>
                        </a>
                    </li>

          

          





         
           



{/* ===== Doctors Section ===== */}

                      <li>
                        <a href="/doctors">
                            <span className="icon-menu feather-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </span>
                            <span className="menu-text">
                               Doctors
                            </span>
                        </a>
                    </li>


                    {/* =====Appointments ===== */}
                     <li>
                        <a href="/appointments">
                            <span className="icon-menu feather-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </span>
                            <span className="menu-text">
                               Appointments
                            </span>
                        </a>
                    </li>


                  {/* ===== Symptoms Section ===== */}
                    <li>
                        <a href="/symptoms">
                            <span className="icon-menu feather-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </span>
                            <span className="menu-text">
                              Symptoms
                            </span>
                        </a>
                    </li>



                    {/*Testimonials */}
                    <li>
                        <a href="/testimonials">
                            <span className="icon-menu feather-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </span>
                            <span className="menu-text">
                               Testimonials
                            </span>
                        </a>
                    </li>

                       {/* Lab-tests */}
                     <li>
                        <a href="/lab-tests">
                            <span className="icon-menu feather-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </span>
                            <span className="menu-text">
                               Lab-Tests
                            </span>
                        </a>
                    </li>

                      {/* Medicines */}
                     <li>
                        <a href="/medicines">
                            <span className="icon-menu feather-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </span>
                            <span className="menu-text">
                              Medicines
                            </span>
                        </a>
                    </li>

                    {/* Coupon */}

                     <li>
                        <a href="/coupon">
                            <span className="icon-menu feather-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </span>
                            <span className="menu-text">
                              Coupon
                            </span>
                        </a>
                    </li>


                    {/* Contact */}
                    <li>
                        <a href="/contact">
                            <span className="icon-menu feather-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </span>
                            <span className="menu-text">
                              Contact
                            </span>
                        </a>
                    </li>


                    {/* ===== Static Pages Dropdown ===== */}
<li className={`has-submenu ${isStaticOpen ? "open" : ""}`}>
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      setIsStaticOpen(!isStaticOpen);
    }}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span className="icon-menu feather-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4h16v16H4z" />
          <path d="M4 9h16" />
          <path d="M4 14h16" />
        </svg>
      </span>

      <span className="menu-text">Static Pages</span>
    </span>

    <span className="menu-arrow">
      {isStaticOpen ? "▾" : "▸"}
    </span>
  </a>

  {isStaticOpen && (
    <ul className="submenu">
      <li><a href="/about">About</a></li>
      <li><a href="/mission">Our Mission</a></li>
      <li><a href="/vision">Our Vision</a></li>
      <li><a href="/terms">Terms & Conditions</a></li>
      <li><a href="/privacy">Privacy Policy</a></li>
      <li><a href="/cancellation">Cancellation Policy</a></li>
    </ul>
  )}
</li>













                     {/* FAQ */}
                    <li>
                        <a href="/faq">
                            <span className="icon-menu feather-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </span>
                            <span className="menu-text">
                              FAQ
                            </span>
                        </a>
                    </li>
















          {/* Orders */}
       {/* ===== Orders Dropdown ===== */}
<li className={`has-submenu ${isOrdersOpen ? "open" : ""}`}>
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      setIsOrdersOpen(!isOrdersOpen);
    }}
  >
    <span className="menu-text">Orders</span>

    <span className="menu-arrow">
      {isOrdersOpen ? "▾" : "▸"}
    </span>
  </a>

  {isOrdersOpen && (
    <ul className="submenu">
      <li>
        <a href="/orders/pending">Pending Orders</a>
      </li>
      <li>
        <a href="/orders/completed">Completed Orders</a>
      </li>
    </ul>
  )}
</li>



          {/* Customers */}
          <li>
            <a href="/customers">
              <span className="icon-menu feather-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </span>
              <span className="menu-text">Customers</span>
            </a>
          </li>

         

         
         
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
