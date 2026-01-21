"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase.config";

export default function ContactDetailsCard() {
  const [docId, setDocId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    Officeaddress: "",
    phone: "",
    email: "",
    whatsappnumber: "",
    Facebook: "",
    Instagram: "",
    X: "",
  });

  /* ================= FETCH CONTACT ================= */

  useEffect(() => {
    const fetchContact = async () => {
      const snap = await getDocs(collection(db, "contact"));
      if (!snap.empty) {
        const d = snap.docs[0];
        setDocId(d.id);
        setFormData(d.data() as any);
      }
    };

    fetchContact();
  }, []);

  /* ================= UPDATE CONTACT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!docId) {
      alert("Contact document not found");
      return;
    }

    await updateDoc(doc(db, "contact", docId), formData);
    alert("Contact details updated successfully");
  };

  return (
    <div className="card table-card">
      <div className="card-header pb-0">
        <h4>Contact Details</h4>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">

            {/* Office Address */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Office Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.Officeaddress}
                  onChange={(e) =>
                    setFormData({ ...formData, Officeaddress: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Phone */}
            <div className="col-md-4">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div className="col-md-4">
              <div className="form-group">
                <label>WhatsApp Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.whatsappnumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      whatsappnumber: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Email */}
            <div className="col-md-4">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Facebook */}
            <div className="col-md-4">
              <div className="form-group">
                <label>Facebook</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.Facebook}
                  onChange={(e) =>
                    setFormData({ ...formData, Facebook: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Instagram */}
            <div className="col-md-4">
              <div className="form-group">
                <label>Instagram</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.Instagram}
                  onChange={(e) =>
                    setFormData({ ...formData, Instagram: e.target.value })
                  }
                />
              </div>
            </div>

            {/* X (Twitter) */}
            <div className="col-md-4">
              <div className="form-group">
                <label>X</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.X}
                  onChange={(e) =>
                    setFormData({ ...formData, X: e.target.value })
                  }
                />
              </div>
            </div>

          </div>

          {/* Submit Button */}
          <div className="text-right mt-3">
            <button type="submit" className="btn btn-primary">
              Update Contact Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
