"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase.config";

type TermsForm = {
  title: string;
  userResponsibilities: string;
  payments: string;
  legal: string;
};

export default function TermsConditionsPageCard() {
  const [docId, setDocId] = useState<string | null>(null);

  const [formData, setFormData] = useState<TermsForm>({
    title: "",
    userResponsibilities: "",
    payments: "",
    legal: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchTerms = async () => {
      const snap = await getDocs(collection(db, "termsandconditions"));
      if (!snap.empty) {
        const d = snap.docs[0];
        const data = d.data();

        setDocId(d.id);
        setFormData({
          title: data.PageTitle || "",
          userResponsibilities: data.UserResponsibilities || "",
          payments: data.PaymentandRefund || "",
          legal: data.LegalCompliance || "",
        });
      }
    };

    fetchTerms();
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

    await updateDoc(doc(db, "termsandconditions", docId), {
      PageTitle: formData.title,
      UserResponsibilities: formData.userResponsibilities,
      PaymentandRefund: formData.payments,
      LegalCompliance: formData.legal,
    });

    setIsSaving(false);
    setSuccess(true);
  };

  /* ================= UI ================= */

  return (
    <div className="card table-card">
      <div className="card-header pb-0">
        <h4>Terms & Conditions Page Content</h4>
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
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* User Responsibilities */}
            <div className="col-md-12">
              <div className="form-group">
                <label>User Responsibilities</label>
                <textarea
                  name="userResponsibilities"
                  className="form-control"
                  rows={6}
                  value={formData.userResponsibilities}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Payments & Refunds */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Payments & Refunds</label>
                <textarea
                  name="payments"
                  className="form-control"
                  rows={5}
                  value={formData.payments}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Legal & Compliance */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Legal & Compliance</label>
                <textarea
                  name="legal"
                  className="form-control"
                  rows={5}
                  value={formData.legal}
                  onChange={handleChange}
                />
              </div>
            </div>

          </div>

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="alert alert-success mt-3">
              Terms & Conditions updated successfully!
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="text-right mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Update Terms & Conditions"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
