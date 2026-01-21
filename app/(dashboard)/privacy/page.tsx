"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase.config";

type PrivacyForm = {
  PageTitle: string;
  InformationweCollect: string;
  DataSharingandDisclosure: string;
  DataProtectionandSecurity: string;
  UserRights: string;
};

export default function PrivacyPolicyPageCard() {
  const [formData, setFormData] = useState<PrivacyForm>({
    PageTitle: "",
    InformationweCollect: "",
    DataSharingandDisclosure: "",
    DataProtectionandSecurity: "",
    UserRights: "",
  });

  const [docId, setDocId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ================= FETCH EXISTING DATA ================= */

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      const snap = await getDocs(collection(db, "PrivacyPolicy"));
      if (!snap.empty) {
        const d = snap.docs[0];
        setDocId(d.id);
        setFormData(d.data() as PrivacyForm);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= UPDATE ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docId) return;

    setIsSaving(true);
    setSuccess(false);

    await updateDoc(doc(db, "PrivacyPolicy", docId), formData);

    setIsSaving(false);
    setSuccess(true);
  };

  /* ================= UI (UNCHANGED) ================= */

  return (
    <div className="card table-card">
      <div className="card-header pb-0">
        <h4>Privacy Policy Page Content</h4>
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

            {/* Information We Collect */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Information We Collect</label>
                <textarea
                  name="InformationweCollect"
                  className="form-control"
                  rows={6}
                  value={formData.InformationweCollect}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Data Sharing */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Data Sharing & Disclosure</label>
                <textarea
                  name="DataSharingandDisclosure"
                  className="form-control"
                  rows={6}
                  value={formData.DataSharingandDisclosure}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Data Protection */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Data Protection & Security</label>
                <textarea
                  name="DataProtectionandSecurity"
                  className="form-control"
                  rows={6}
                  value={formData.DataProtectionandSecurity}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* User Rights */}
            <div className="col-md-12">
              <div className="form-group">
                <label>User Rights</label>
                <textarea
                  name="UserRights"
                  className="form-control"
                  rows={5}
                  value={formData.UserRights}
                  onChange={handleChange}
                />
              </div>
            </div>

          </div>

          {success && (
            <div className="alert alert-success mt-3">
              Privacy Policy updated successfully!
            </div>
          )}

          <div className="text-right mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Update Privacy Policy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
