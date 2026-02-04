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

type VisionForm = {
  PageTitle: string;
  Visionstatement: string;
  FocusAreas: string;
};

export default function VisionPageCard() {
  const [formData, setFormData] = useState<VisionForm>({
    PageTitle: "",
    Visionstatement: "",
    FocusAreas: "",
  });

  const [docId, setDocId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchVision = async () => {
      const snap = await getDocs(collection(db, "ourvision"));

      if (!snap.empty) {
        const d = snap.docs[0];
        setDocId(d.id);
        setFormData(d.data() as VisionForm);
      }
    };

    fetchVision();
  }, []);

  /* ================= CHANGE ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SAVE ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docId) return;

    setIsSaving(true);
    setSuccess(false);

    await updateDoc(doc(db, "ourvision", docId), formData);

    setIsSaving(false);
    setSuccess(true);
  };

  /* ================= UI (UNCHANGED) ================= */

  return (
    <div className="card table-card">
      <div className="card-header pb-0">
        <h4>Our Vision Page Content</h4>
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

            {/* Vision Statement */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Vision Statement</label>
                <textarea
                  name="Visionstatement"
                  className="form-control"
                  rows={5}
                  value={formData.Visionstatement}
                  onChange={handleChange}
                />
              </div>
            </div>

           
          </div>

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="alert alert-success mt-3">
              Vision page updated successfully!
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="text-right mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Update Vision Page"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
