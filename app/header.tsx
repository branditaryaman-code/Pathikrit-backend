"use client";
import { useRouter } from "next/navigation";

export default function Header() {
   const router = useRouter();

  const handleLogout = () => {
  // 🔥 HARD DELETE COOKIE (browser-safe)
  document.cookie =
    "auth=logged_in; path=/; max-age=0;";

  document.cookie =
    "auth=; path=/; max-age=0;";

  // 🔄 HARD RELOAD so middleware MUST run
  window.location.replace("/login");
};

  return (
    <header className="header-wrapper main-header">
      <div className="header-inner-wrapper">
        <div className="header-right">
          {/* ===== SEARCH ===== */}
          <div className="serch-wrapper">
            <form>
              <input type="text" placeholder="Search Here..." />
            </form>
            <button className="search-close" type="button">
              <span className="icofont-close-line"></span>
            </button>
          </div>

          {/* ===== LEFT TOGGLE ===== */}
          <div className="header-left">
            <div className="header-links">
              <button className="toggle-btn" type="button" style={{borderStyle: 'none', background: 'none' }}>
                <span></span>
              </button>
            </div>
          </div>

          {/* ===== CONTROLS ===== */}
          <div className="header-controls">
            {/* ===== NOTIFICATION ===== */}
            <div className="notification-wrapper header-links">
              <button className="notification-info" type="button" style={{borderStyle: 'none', background: 'none'}}>
                <span className="header-icon">
                  <svg
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m450.201 407.453c-1.505-.977-12.832-8.912-24.174-32.917-20.829-44.082-25.201-106.18-25.201-150.511-.227-58.589-35.31-109.095-85.514-131.756v-34.657c0-31.45-25.544-57.036-56.942-57.036h-4.719c-31.398 0-56.942 25.586-56.942 57.036v34.655c-50.372 22.734-85.525 73.498-85.525 132.334 0 44.331-4.372 106.428-25.201 150.511-11.341 24.004-22.668 31.939-24.174 32.917-6.342 2.935-9.469 9.715-8.01 16.586 1.473 6.939 7.959 11.723 15.042 11.723h109.947c.614 42.141 35.008 76.238 77.223 76.238s76.609-34.097 77.223-76.238h109.947c7.082 0 13.569-4.784 15.042-11.723 1.457-6.871-1.669-13.652-8.011-16.586z"></path>
                  </svg>
                </span>
                <span className="count-notification"></span>
              </button>

              <div className="recent-notification">
                <div className="drop-down-header">
                  <h4>All Notification</h4>
                  <p>You have 6 new notifications</p>
                </div>

                <ul>
                  <li>
                    <a href="#">
                      <h5>
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        Storage Full
                      </h5>
                      <p>Lorem ipsum dolor sit amet, consectetuer.</p>
                    </a>
                  </li>

                  <li>
                    <a href="#">
                      <h5>
                        <i className="far fa-envelope mr-2"></i>
                        New Membership
                      </h5>
                      <p>Lorem ipsum dolor sit amet, consectetuer.</p>
                    </a>
                  </li>
                </ul>

                <div className="drop-down-footer">
                  <button className="btn sm-btn" type="button">
                    View All
                  </button>
                </div>
              </div>
            </div>

            {/* ===== USER INFO ===== */}
            <div className="user-info-wrapper header-links">
              <button className="user-info" type="button" style={{borderStyle: 'none', background: 'none'}}>
                <img
                  src="/assets/images/user.jpg"
                  alt="User"
                  className="user-img"
                />
                <div className="blink-animation">
                  <span className="blink-circle"></span>
                  <span className="main-circle"></span>
                </div>
              </button>

              <div className="user-info-box">
                <div className="drop-down-header">
                  <h4>John Brown</h4>
                  <p>UI | UX Designer</p>
                </div>

                <ul>
                  <li>
                    <a href="/profile">
                      <i className="far fa-edit"></i> Edit Profile
                    </a>
                  </li>
                  <li>
                    <a href="/setting">
                      <i className="fas fa-cog"></i> Settings
                    </a>
                  </li>
                  <li>
                    <a 
                     href="#"
    onClick={(e) => {
      e.preventDefault();
      handleLogout();
    }}
                    >
                      <i className="fas fa-sign-out-alt"></i> Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
