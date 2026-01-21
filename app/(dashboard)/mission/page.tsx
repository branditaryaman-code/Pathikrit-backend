"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase.config";

type MissionForm = {
  PageTitle: string;
  MissionStatement: string;
  CoreValues: string;
};

export default function MissionPageCard() {
  const [docId, setDocId] = useState<string | null>(null);

  const [formData, setFormData] = useState<MissionForm>({
    PageTitle: "",
    MissionStatement: "",
    CoreValues: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchMission = async () => {
      const snap = await getDocs(collection(db, "ourmission"));
      if (!snap.empty) {
        const d = snap.docs[0];
        setDocId(d.id);

        const data = d.data();
        setFormData({
          PageTitle: data.PageTitle || "",
          MissionStatement: data.MissionStatement || "",
          CoreValues: data.CoreValues || "",
        });
      }
    };

    fetchMission();
  }, []);

  /* ================= CHANGE ================= */

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

    await updateDoc(doc(db, "ourmission", docId), {
      PageTitle: formData.PageTitle,
      MissionStatement: formData.MissionStatement,
      CoreValues: formData.CoreValues,
    });

    setIsSaving(false);
    setSuccess(true);
  };

  return (
    <div className="card table-card">
      <div className="card-header pb-0">
        <h4>Our Mission Page Content</h4>
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

            {/* Mission Statement */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Mission Statement</label>
                <textarea
                  name="MissionStatement"
                  className="form-control"
                  rows={6}
                  value={formData.MissionStatement}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Core Values */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Core Values</label>
                <textarea
                  name="CoreValues"
                  className="form-control"
                  rows={5}
                  value={formData.CoreValues}
                  onChange={handleChange}
                />
              </div>
            </div>

          </div>

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="alert alert-success mt-3">
              Mission page updated successfully!
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="text-right mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Update Mission Page"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
