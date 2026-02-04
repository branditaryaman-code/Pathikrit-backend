"use client";

import React, { useState } from "react"; //purpose to make specific components and functions from the React library availabe for use within that file
import { useRouter } from "next/navigation"; //to programmitically navigate between routes amd refresh data; this is related to router.push

const Login: React.FC = () => {
  const router = useRouter(); // to programmatically manage page navigation, such as pushing new routes, replacing current history, or moving back/forward. It is essential for navigation based on user events (e.g., button clicks) or conditional logic. 

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  {/* What this means:

Each input:

Is controlled by React

Always reflects component state

Updates via onChange

This is standard React, not Next.js-specific.
    */}

  return (
    <div className="ad-auth-wrapper">
      <div className="container">
        <div className="ad-auth-box">
          <div className="row align-items-center min-vh-100">
            {/* LEFT IMAGE */}
            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
              <div className="ad-auth-img text-center">
                <img
                  src="/assets/images/auth-img1.png"
                  alt="Authentication"
                />
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
              <div className="ad-auth-content">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    if (!email || !phone || !password) {
                      alert("Please fill all fields");
                      return;
                    }

                    // ✅ Auth flag for middleware
                    //document.cookie is a browser API, used to create, read and update cookies, cookies are sent automatically with every HTTP request
                    document.cookie = "auth=logged_in; path=/"; // path=/ Cookie is available on all routes

                    // auth - cookie name
                    //logged_in - cookie value
                    

                    router.push("/dashboard"); // url changes to /dashboard, next js fetches the page, react renders it
                    // main purpose of router.push is client-side naviagtion, no full page reload, SPA style transition
                  }}
                >
                  <a href="/" className="ad-auth-logo">
                    <img
                      src="/assets/images/logo2.png"
                      alt="SplashDash Logo"
                    />
                  </a>

                  <h2 style={{ paddingTop: "28px" }}>
                    <span className="primary">Hello,</span> Welcome!
                  </h2>
                  <p style={{ paddingTop: "18px" }}>
                    Please Enter Your Details Below to Continue
                  </p>

                  <div className="ad-auth-form">
                    {/* EMAIL */}
                    <div className="ad-auth-feilds mb-30">
                      <input
                        type="email"
                        placeholder="Email"
                        className="ad-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    {/* PHONE NUMBER */}
                    <div
                      className="ad-auth-feilds mb-30"
                      style={{ paddingTop: "8px" }}
                    >
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        className="ad-input"
                        inputMode="tel"
                        pattern="[0-9]*"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    {/* PASSWORD */}
                    <div className="ad-auth-feilds">
                      <input
                        type="password"
                        placeholder="Password"
                        className="ad-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* OPTIONS */}
                  <div className="ad-other-feilds">
                    <label className="ad-checkbox">
                      <input type="checkbox" />
                      <span> Remember Me</span>
                    </label>

                    <a className="forgot-pws-btn" href="/forgot-pws">
                      Forgot Password?
                    </a>
                  </div>

                  {/* BUTTON */}
                  <div className="ad-auth-btn">
                    <button
                      type="submit"
                      className="ad-btn ad-login-member"
                    >
                      Login
                    </button>
                  </div>

                  <p className="ad-register-text">
                    Don&apos;t have an account?{" "}
                    <a href="/register">Click Here</a>
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* ERROR MESSAGE (unchanged placeholder) */}
          <div className="ad-notifications ad-error">
            <p>
              <span>Duhh!</span> Something Went Wrong
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
