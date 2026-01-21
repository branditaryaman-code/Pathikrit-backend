"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase.config";

type CancellationForm = {
  PageTitle: string;
  CancellationPolicy: string;
  RefundPolicy: string;
};

export default function CancellationPolicyPageCard() {
  const [formData, setFormData] = useState<CancellationForm>({
    PageTitle: "",
    CancellationPolicy: "",
    RefundPolicy: "",
  });

  const [docId, setDocId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ================= FETCH EXISTING DATA ================= */

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, "cancellationpolicy"));
      if (!snap.empty) {
        const d = snap.docs[0];
        setDocId(d.id);
        setFormData(d.data() as CancellationForm);
      }
    };

    fetchData();
  }, []);

  /* ================= HANDLE CHANGE ================= */

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

    await updateDoc(doc(db, "cancellationpolicy", docId), formData);

    setIsSaving(false);
    setSuccess(true);
  };

  /* ================= UI ================= */

  return (
    <div className="card table-card">
      <div className="card-header pb-0">
        <h4>Cancellation Policy Page Content</h4>
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

            {/* Cancellation Policy */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Cancellation Policy</label>
                <textarea
                  name="CancellationPolicy"
                  className="form-control"
                  rows={5}
                  value={formData.CancellationPolicy}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Refund Policy */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Refund Policy</label>
                <textarea
                  name="RefundPolicy"
                  className="form-control"
                  rows={5}
                  value={formData.RefundPolicy}
                  onChange={handleChange}
                />
              </div>
            </div>

          </div>

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="alert alert-success mt-3">
              Cancellation Policy updated successfully!
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="text-right mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Update Cancellation Policy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
