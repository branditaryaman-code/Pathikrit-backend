"use client";

import React, { useState } from "react";

type CancellationForm = {
  title: string;
  introduction: string;
  cancellationPolicy: string;
  refundPolicy: string;
  exceptions: string;
};

export default function CancellationPolicyPageCard() {
  const [formData, setFormData] = useState<CancellationForm>({
    title: "Cancellation & Refund Policy",
    introduction:
      "This policy outlines the terms related to cancellation and refunds for services booked through our platform.",
    cancellationPolicy:
      "Users may cancel appointments within the allowed cancellation window as mentioned during booking.",
    refundPolicy:
      "Refunds, if applicable, will be processed within 7–10 business days to the original payment method.",
    exceptions:
      "No refunds will be provided for services already rendered or in case of misuse of the platform.",
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

    // 🔥 Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Saved Cancellation Policy:", formData);

    setIsSaving(false);
    setSuccess(true);
  };

  return (
    <div className="card table-card">
      <div className="card-header pb-0">
        <h4>Cancellation Policy Page Content</h4>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">

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

            <div className="col-md-12">
              <div className="form-group">
                <label>Cancellation Policy</label>
                <textarea
                  name="cancellationPolicy"
                  className="form-control"
                  rows={5}
                  value={formData.cancellationPolicy}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Refund Policy</label>
                <textarea
                  name="refundPolicy"
                  className="form-control"
                  rows={5}
                  value={formData.refundPolicy}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Exceptions</label>
                <textarea
                  name="exceptions"
                  className="form-control"
                  rows={5}
                  value={formData.exceptions}
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
