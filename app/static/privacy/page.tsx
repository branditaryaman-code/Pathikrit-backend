"use client";

import React, { useState } from "react";

type PrivacyForm = {
  title: string;
  introduction: string;
  informationCollected: string;
  usage: string;
  sharing: string;
  security: string;
  userRights: string;
};

export default function PrivacyPolicyPageCard() {
  const [formData, setFormData] = useState<PrivacyForm>({
    title: "Privacy Policy",
    introduction:
      "This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.",
    informationCollected: `We may collect personal details such as name, email, phone number, and address.
Usage data including device and browser information may also be collected.
Payment information is processed securely through third-party gateways.`,
    usage: `To provide and improve our services.
To communicate important updates and notifications.
To ensure platform security and compliance.`,
    sharing: `We do not sell personal data to third parties.
Information may be shared with trusted partners for service delivery.
Disclosure may occur if required by law.`,
    security: `We implement industry-standard security measures.
Access to personal data is restricted to authorized personnel.
Despite safeguards, no system is completely secure.`,
    userRights: `Users have the right to access, update, or delete their personal information.
Users may opt out of certain communications.
Requests can be made via our contact channels.`,
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

    // 🔗 Replace with real API call later
    console.log("Privacy Policy Saved:", formData);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);
    setSuccess(true);
  };

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
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Introduction */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Introduction</label>
                <textarea
                  name="introduction"
                  className="form-control"
                  rows={4}
                  value={formData.introduction}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Information We Collect */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Information We Collect</label>
                <textarea
                  name="informationCollected"
                  className="form-control"
                  rows={6}
                  value={formData.informationCollected}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* How We Use Information */}
            <div className="col-md-6">
              <div className="form-group">
                <label>How We Use Information</label>
                <textarea
                  name="usage"
                  className="form-control"
                  rows={5}
                  value={formData.usage}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Data Sharing */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Data Sharing & Disclosure</label>
                <textarea
                  name="sharing"
                  className="form-control"
                  rows={5}
                  value={formData.sharing}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Data Protection */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Data Protection & Security</label>
                <textarea
                  name="security"
                  className="form-control"
                  rows={6}
                  value={formData.security}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* User Rights */}
            <div className="col-md-12">
              <div className="form-group">
                <label>User Rights</label>
                <textarea
                  name="userRights"
                  className="form-control"
                  rows={5}
                  value={formData.userRights}
                  onChange={handleChange}
                />
              </div>
            </div>

          </div>

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="alert alert-success mt-3">
              Privacy Policy updated successfully!
            </div>
          )}

          {/* SUBMIT BUTTON */}
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
