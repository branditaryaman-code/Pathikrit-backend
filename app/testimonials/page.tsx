"use client";

import { useState } from "react";

type Testimonial = {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  wallet: string;
  date: string;
};

export default function TestimonialsPage() {
    
    
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: "Scott Henry",
      phone: "+(00) 4512 451",
      email: "[email protected]",
      address: "2210 Grove Street Bethpage, NI 440014",
      wallet: "$6,415",
      date: "22/06/2022",
    },
    {
      id: 2,
      name: "Mark Wood",
      phone: "+(00) 4512 451",
      email: "[email protected]",
      address: "2210 sed do eiusmod tempor ut, NI 440022",
      wallet: "$2,415",
      date: "22/07/2022",
    },
  ]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<Testimonial>({
    id: 0,
    name: "",
    phone: "",
    email: "",
    address: "",
    wallet: "",
    date: "",
  });

  const handleAdd = () => {
    setTestimonials((prev) => [
      ...prev,
      { ...formData, id: Date.now() },
    ]);
    setIsDrawerOpen(false);
    setFormData({
      id: 0,
      name: "",
      phone: "",
      email: "",
      address: "",
      wallet: "",
      date: "",
    });
  };

  return (
    <>
      {/* ===== PAGE TITLE ===== */}
      <div className="row">
        <div className="colxl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="page-title-wrapper">
            <div className="page-title-box ad-title-box-use">
              <h4 className="page-title">Testimonials</h4>
            </div>

            <div className="ad-breadcrumb">
              <ul>
                <li>
                  <div className="ad-user-btn">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Search Here..."
                    />
                    <svg viewBox="0 0 56.966 56.966">
                      <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z" />
                    </svg>
                  </div>
                </li>
              </ul>
            </div>

            {/* ADD BUTTON */}
            <div style={{ marginTop: "10px" }}>
              <button
                className="btn btn-primary"
                onClick={() => setIsDrawerOpen(true)}
              >
                + Add Testimonial
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="row">
        <div className="col-xl-12">
          <div className="card table-card">
            <div className="card-header pb-0">
              <h4>Testimonials List</h4>
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-styled mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Username</th>
                      <th>Phone / Email</th>
                      <th>Address</th>
                      <th>Wallet Balance</th>
                      <th>Joining Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {testimonials.map((t, i) => (
                      <tr key={t.id}>
                        <td>{i + 1}</td>
                        <td>{t.name}</td>
                        <td>
                          {t.phone}
                          <br />
                          <a href="#">{t.email}</a>
                        </td>
                        <td>{t.address}</td>
                        <td>{t.wallet}</td>
                        <td>{t.date}</td>
                        <td className="relative">
                          <a className="action-btn" href="#">
                            <svg
                              className="default-size"
                              viewBox="0 0 341.333 341.333"
                            >
                              <path d="M170.667,85.333c23.573,0,42.667-19.093,42.667-42.667S194.24,0,170.667,0 128,19.093,128,42.667s19.093,42.666,42.667,42.666z" />
                              <path d="M170.667,128c-23.573,0-42.667,19.093-42.667,42.667s19.093,42.667,42.667,42.667 42.667-19.093,42.667-42.667S194.24,128,170.667,128z" />
                              <path d="M170.667,256c-23.573,0-42.667,19.093-42.667,42.667 0,23.573,19.093,42.667,42.667,42.667s42.667-19.093,42.667-42.667S194.24,256,170.667,256z" />
                            </svg>
                          </a>

                            <div className="action-option">
                        <ul>
                          <li>
                            <a href="#">
                              <i className="far fa-edit mr-2"></i>
                             Edit
                            </a>
                          </li>
                         
                          <li>
                            <a href="#">
                              <i className="far fa-trash-alt mr-2"></i>
                              Delete
                            </a>
                          </li>
                        </ul>
                      </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SIDE DRAWER ===== */}
      {isDrawerOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "400px",
            height: "100vh",
            background: "#fff",
            boxShadow: "-4px 0 10px rgba(0,0,0,0.2)",
            padding: "20px",
            zIndex: 9999,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>Add Testimonial</h4>
            <button
              onClick={() => setIsDrawerOpen(false)}
              style={{ border: "none", background: "transparent" }}
            >
              ✕
            </button>
          </div>

          <hr />

          {["name", "phone", "email", "address", "wallet", "date"].map(
            (field) => (
              <div key={field} className="form-group">
                <label>{field}</label>
                <input
                  className="form-control"
                  value={(formData as any)[field]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field]: e.target.value,
                    })
                  }
                />
              </div>
            )
          )}

          <button className="btn btn-primary mt-3" onClick={handleAdd}>
            Save
          </button>
        </div>
      )}
    </>
  );
}
