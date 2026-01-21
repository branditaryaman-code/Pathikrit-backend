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

type FAQ = {
  doc_id: string;
  question: string;
  answer: string;
};

/* ================= PAGE ================= */

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  /* ================= FETCH ================= */

  const fetchFAQs = async () => {
    const snap = await getDocs(collection(db, "faq"));
    const data: FAQ[] = snap.docs.map((d) => ({
      doc_id: d.id,
      ...(d.data() as Omit<FAQ, "doc_id">),
    }));
    setFaqs(data);
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  /* ================= ADD / UPDATE ================= */

  const handleSave = async () => {
    if (!formData.question || !formData.answer) {
      alert("Please fill all fields");
      return;
    }

    if (editingFAQ) {
      await updateDoc(doc(db, "faq", editingFAQ.doc_id), {
        question: formData.question,
        answer: formData.answer,
      });
    } else {
      await addDoc(collection(db, "faq"), {
        question: formData.question,
        answer: formData.answer,
        created_at: serverTimestamp(),
      });
    }

    closeDrawer();
    fetchFAQs();
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    await deleteDoc(doc(db, "faq", id));
    fetchFAQs();
  };

  /* ================= DRAWER ================= */

  const openAdd = () => {
    setEditingFAQ(null);
    setFormData({ question: "", answer: "" });
    setIsDrawerOpen(true);
  };

  const openEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
    });
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingFAQ(null);
    setFormData({ question: "", answer: "" });
  };

  /* ================= UI ================= */

  return (
    <>
      {/* ===== PAGE TITLE ===== */}
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

      {/* ===== TABLE ===== */}
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
                      <th>Question</th>
                      <th>Answer</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {faqs.map((f, i) => (
                      <tr key={f.doc_id}>
                        <td>{i + 1}</td>
                        <td>{f.question}</td>
                        <td>{f.answer}</td>

                        <td className="relative">
                          <a className="action-btn">
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
                                <a onClick={() => handleDelete(f.doc_id)}>
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
          <div className="d-flex justify-content-between">
            <h4>{editingFAQ ? "Edit FAQ" : "Add FAQ"}</h4>
            <button
              onClick={closeDrawer}
              style={{ border: "none", background: "transparent" }}
            >
              ✕
            </button>
          </div>

          <hr />

          <div className="form-group">
            <label>Question</label>
            <input
              className="form-control"
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Answer</label>
            <textarea
              className="form-control"
              rows={4}
              value={formData.answer}
              onChange={(e) =>
                setFormData({ ...formData, answer: e.target.value })
              }
            />
          </div>

          <button className="btn btn-primary mt-3" onClick={handleSave}>
            Save
          </button>
        </div>
      )}
    </>
  );
}
