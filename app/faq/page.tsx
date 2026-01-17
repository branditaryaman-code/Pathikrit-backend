"use client";

import { useState } from "react";

type FAQ = {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  wallet: string;
  date: string;
};

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([
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
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);

  const [formData, setFormData] = useState<FAQ>({
    id: 0,
    name: "",
    phone: "",
    email: "",
    address: "",
    wallet: "",
    date: "",
  });

  const openAdd = () => {
    setEditingFAQ(null);
    setFormData({
      id: 0,
      name: "",
      phone: "",
      email: "",
      address: "",
      wallet: "",
      date: "",
    });
    setIsDrawerOpen(true);
  };

  const openEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData(faq);
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    if (editingFAQ) {
      setFaqs((prev) =>
        prev.map((f) => (f.id === editingFAQ.id ? formData : f))
      );
    } else {
      setFaqs((prev) => [...prev, { ...formData, id: Date.now() }]);
    }
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* PAGE TITLE */}
      <div className="row">
        <div className="colxl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="page-title-wrapper">
            <div className="page-title-box ad-title-box-use">
              <h4 className="page-title">FAQ</h4>
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
                  </div>
                </li>
                <li>
                  <button className="btn btn-primary" onClick={openAdd}>
                    + Add FAQ
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="row">
        <div className="col-xl-12">
          <div className="card table-card">
            <div className="card-header pb-0">
              <h4>FAQ List</h4>
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
                    {faqs.map((f, i) => (
                      <tr key={f.id}>
                        <td>{i + 1}</td>
                        <td>{f.name}</td>
                        <td>
                          {f.phone}
                          <br />
                          <a href="#">{f.email}</a>
                        </td>
                        <td>{f.address}</td>
                        <td>{f.wallet}</td>
                        <td>{f.date}</td>
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
                                <a onClick={() => openEdit(f)}>
                                  <i className="far fa-edit mr-2"></i>Edit
                                </a>
                              </li>
                              <li>
                                <a>
                                  <i className="far fa-trash-alt mr-2"></i>Delete
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

      {/* SIDE DRAWER */}
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
          <div className="d-flex justify-content-between">
            <h4>{editingFAQ ? "Edit FAQ" : "Add FAQ"}</h4>
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
              <div className="form-group" key={field}>
                <label>{field}</label>
                <input
                  className="form-control"
                  value={(formData as any)[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                />
              </div>
            )
          )}

          <button className="btn btn-primary mt-3" onClick={handleSave}>
            Save
          </button>
        </div>
      )}
    </>
  );
}
