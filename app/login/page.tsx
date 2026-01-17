import React from "react";

const Login: React.FC = () => {
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
                <form>
                  <a href="/" className="ad-auth-logo">
                    <img
                      src="/assets/images/logo2.png"
                      alt="SplashDash Logo"
                    />
                  </a>

                  <h2 style={{ paddingTop: "28px" }}>
                    <span className="primary">Hello,</span> Welcome!
                  </h2>
                  <p style={{ paddingTop: "18px" }}>Please Enter Your Details Below to Continue</p>

                  <div className="ad-auth-form">
                    {/* Phone Number */}
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
  />
</div>


                    {/* PASSWORD */}
                    <div className="ad-auth-feilds">
                      <input
                        type="password"
                        placeholder="Password"
                        className="ad-input"
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

          {/* ERROR MESSAGE */}
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
