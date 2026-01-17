"use client";

import React, { useState } from "react";

type AboutForm = {
  title: string;
  shortDescription: string;
  mainContent: string;
};

export default function AboutPageCard() {
  const [formData, setFormData] = useState<AboutForm>({
    title: "About Us",
    shortDescription:
      "We are a healthcare platform dedicated to making medical services more accessible, transparent, and reliable.",
    mainContent: `Our platform connects patients with trusted doctors, labs, and pharmacies.
We focus on quality healthcare, transparency, and seamless digital experience.
Our mission is to bridge the gap between patients and healthcare providers.`,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 🔥 critical

    setIsSaving(true);
    setSuccess(false);

    // 🔗 Later: replace with real API call
    console.log("About Page Saved:", formData);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);
    setSuccess(true);
  };

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
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Short Description</label>
                <textarea
                  name="shortDescription"
                  className="form-control"
                  rows={3}
                  value={formData.shortDescription}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Main Content</label>
                <textarea
                  name="mainContent"
                  className="form-control"
                  rows={6}
                  value={formData.mainContent}
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
