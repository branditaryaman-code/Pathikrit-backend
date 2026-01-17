"use client";

import React, { useState } from "react";

type TermsForm = {
  title: string;
  introduction: string;
  userResponsibilities: string;
  services: string;
  payments: string;
  legal: string;
};

export default function TermsConditionsPageCard() {
  const [formData, setFormData] = useState<TermsForm>({
    title: "Terms & Conditions",
    introduction:
      "These Terms & Conditions govern the use of our platform and services. By accessing or using our services, you agree to be bound by these terms.",
    userResponsibilities: `Users agree to provide accurate information while using the platform.
Users must not misuse services or attempt unauthorized access.
Any fraudulent activity may result in account suspension.`,
    services: `We act as a facilitator between users and service providers.
We do not guarantee medical outcomes.
Service availability may change without notice.`,
    payments: `All payments are subject to applicable charges.
Refunds are governed by our cancellation and refund policy.
Pricing may change at any time.`,
    legal: `We comply with applicable laws and regulations.
Any disputes shall be subject to jurisdiction of applicable courts.
Violation of terms may result in legal action.`,
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
    console.log("Terms & Conditions Saved:", formData);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);
    setSuccess(true);
  };

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

            {/* Services & Limitations */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Services & Limitations</label>
                <textarea
                  name="services"
                  className="form-control"
                  rows={5}
                  value={formData.services}
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
            <div className="col-md-12">
              <div className="form-group">
                <label>Legal & Compliance</label>
                <textarea
                  name="legal"
                  className="form-control"
                  rows={6}
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
