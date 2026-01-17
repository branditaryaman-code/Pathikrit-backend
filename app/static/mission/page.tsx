"use client";

import React, { useState } from "react";

type MissionForm = {
  title: string;
  missionStatement: string;
  description: string;
  coreValues: string;
  goals: string;
};

export default function MissionPageCard() {
  const [formData, setFormData] = useState<MissionForm>({
    title: "Our Mission",
    missionStatement:
      "Our mission is to make healthcare accessible, affordable, and transparent for everyone through digital innovation.",
    description: `We strive to empower patients by providing seamless access to trusted healthcare professionals.
Our platform bridges the gap between patients and providers using modern technology.
We are committed to improving healthcare outcomes and enhancing patient experience.`,
    coreValues: `• Integrity and transparency
• Patient-first approach
• Innovation in healthcare
• Trust and reliability`,
    goals: `• Build a unified healthcare ecosystem
• Expand access to quality care globally
• Leverage technology for better outcomes`,
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
    console.log("Mission Page Saved:", formData);

    await new Promise((resolve) => setTimeout(resolve, 1000));

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
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Mission Statement */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Mission Statement</label>
                <textarea
                  name="missionStatement"
                  className="form-control"
                  rows={4}
                  value={formData.missionStatement}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Detailed Mission Description */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Detailed Mission Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Core Values */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Core Values</label>
                <textarea
                  name="coreValues"
                  className="form-control"
                  rows={5}
                  value={formData.coreValues}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Long-Term Goals */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Long-Term Goals</label>
                <textarea
                  name="goals"
                  className="form-control"
                  rows={5}
                  value={formData.goals}
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
