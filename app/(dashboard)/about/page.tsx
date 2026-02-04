"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase.config";

/* ================= TYPES ================= */

type AboutForm = {
  PageTitle: string;
  Description: string;
  MainContent: string;
};

/* ================= PAGE ================= */

export default function AboutPageCard() {
  const [docId, setDocId] = useState<string | null>(null);

  const [formData, setFormData] = useState<AboutForm>({
    PageTitle: "",
    Description: "",
    MainContent: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchAbout = async () => {
      const snap = await getDocs(collection(db, "about"));
      if (!snap.empty) {
        const d = snap.docs[0];
        setDocId(d.id);
        setFormData(d.data() as AboutForm);
      }
    };

    fetchAbout();
  }, []);

  /* ================= HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!docId) return;

    setIsSaving(true);
    setSuccess(false);

    await updateDoc(doc(db, "about", docId), {
      PageTitle: formData.PageTitle,
      Description: formData.Description,
      MainContent: formData.MainContent,
    });

    setIsSaving(false);
    setSuccess(true);
  };

  /* ================= UI ================= */

  return (
    <div className="card table-card">
      <div className="card-header pb-0">
        <h4>About Page Content</h4>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">

            {/* Page Title */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Page Title</label>
                <input
                  type="text"
                  name="PageTitle"
                  className="form-control"
                  value={formData.PageTitle}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Description */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="Description"
                  className="form-control"
                  rows={3}
                  value={formData.Description}
                  onChange={handleChange}
                />
              </div>
            </div>

           

          </div>

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="alert alert-success mt-3">
              About page updated successfully!
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="text-right mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Update About Page"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
