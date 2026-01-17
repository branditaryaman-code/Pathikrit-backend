"use client";

import React, { useState } from "react";

type VisionForm = {
  title: string;
  visionStatement: string;
  description: string;
  focusAreas: string;
  futureImpact: string;
};

export default function VisionPageCard() {
  const [formData, setFormData] = useState<VisionForm>({
    title: "Our Vision",
    visionStatement:
      "Our vision is to redefine the future of healthcare by building a trusted, digital-first healthcare ecosystem.",
    description: `We envision a future where healthcare is seamless, inclusive, and technology-driven.
Our platform aims to eliminate barriers between patients and providers.
By leveraging innovation, we strive to deliver high-quality healthcare experiences worldwide.`,
    focusAreas: `• Digital healthcare accessibility
• Patient empowerment
• Data-driven medical decisions
• Scalable healthcare solutions`,
    futureImpact: `• Improved patient outcomes
• Enhanced provider collaboration
• Global healthcare reach`,
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
    e.preventDefault(); // 🔥 REQUIRED

    setIsSaving(true);
    setSuccess(false);

    // 🔗 Replace with real API call
    console.log("Vision Page Saved:", formData);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);
    setSuccess(true);
  };

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
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Vision Statement */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Vision Statement</label>
                <textarea
                  name="visionStatement"
                  className="form-control"
                  rows={4}
                  value={formData.visionStatement}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Detailed Vision */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Detailed Vision Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Focus Areas */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Focus Areas</label>
                <textarea
                  name="focusAreas"
                  className="form-control"
                  rows={5}
                  value={formData.focusAreas}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Future Impact */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Future Impact</label>
                <textarea
                  name="futureImpact"
                  className="form-control"
                  rows={5}
                  value={formData.futureImpact}
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
