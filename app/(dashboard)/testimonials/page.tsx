"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/firebase.config";

/* ================= TYPES ================= */

type Testimonial = {
  id: string;
  name: string;
  testimonial: string;
  designation: string;
  rating: number;
  active: boolean;
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Testimonial, "id">>({
    name: "",
    testimonial: "",
    designation: "",
    rating: 5,
    active: true,
  });

  /* ================= FETCH ================= */

  const fetchTestimonials = async () => {
    const snap = await getDocs(collection(db, "testimonials"));
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Testimonial, "id">),
    }));
    setTestimonials(data);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  /* ================= SAVE ================= */

  const handleSave = async () => {
    const payload = {
      ...formData,
      rating: Number(formData.rating),
      updated_at: serverTimestamp(),
    };

    if (editingId) {
      await updateDoc(doc(db, "testimonials", editingId), payload);
    } else {
      await addDoc(collection(db, "testimonials"), {
        ...payload,
        created_at: serverTimestamp(),
      });
    }

    closeDrawer();
    fetchTestimonials();
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await deleteDoc(doc(db, "testimonials", id));
    fetchTestimonials();
  };

  /* ================= CLOSE DRAWER ================= */

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingId(null);
    setFormData({
      name: "",
      testimonial: "",
      designation: "",
      rating: 5,
      active: true,
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

            {/* ADD BUTTON */}
            <div style={{ marginTop: "10px" }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    name: "",
                    testimonial: "",
                    designation: "",
                    rating: 5,
                    active: true,
                  });
                  setIsDrawerOpen(true);
                }}
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
                      <th>Name</th>
                      <th>Testimonial</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {testimonials.map((t, i) => (
                      <tr key={t.id}>
                        <td>{i + 1}</td>
                        <td>{t.name}</td>
                        <td>{t.testimonial}</td>
                        <td>
                          {t.active ? (
                            <span className="badge badge-success">Active</span>
                          ) : (
                            <span className="badge badge-secondary">
                              Inactive
                            </span>
                          )}
                        </td>

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
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setEditingId(t.id);
                                    setFormData({
                                      name: t.name,
                                      testimonial: t.testimonial,
                                      designation: t.designation,
                                      rating: t.rating,
                                      active: t.active,
                                    });
                                    setIsDrawerOpen(true);
                                  }}
                                >
                                  Edit
                                </a>
                              </li>

                              <li>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(t.id);
                                  }}
                                >
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
            <h4>{editingId ? "Edit Testimonial" : "Add Testimonial"}</h4>
            <button
              onClick={closeDrawer}
              style={{ border: "none", background: "transparent" }}
            >
              ✕
            </button>
          </div>

          <hr />

          <div className="form-group">
            <label>Name</label>
            <input
              className="form-control"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Designation</label>
            <input
              className="form-control"
              value={formData.designation}
              onChange={(e) =>
                setFormData({ ...formData, designation: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Testimonial</label>
            <textarea
              className="form-control"
              value={formData.testimonial}
              onChange={(e) =>
                setFormData({ ...formData, testimonial: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Rating (1–5)</label>
            <input
              type="number"
              min={1}
              max={5}
              className="form-control"
              value={formData.rating}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rating: Math.max(1, Math.min(5, Number(e.target.value))),
                })
              }
            />
          </div>

          <label className="d-block">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.checked })
              }
            />{" "}
            Active
          </label>

          <button className="btn btn-primary mt-3" onClick={handleSave}>
            {editingId ? "Update" : "Save"}
          </button>
        </div>
      )}
    </>
  );
}
