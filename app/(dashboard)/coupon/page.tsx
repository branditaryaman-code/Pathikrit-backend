"use client";

import { useEffect, useState } from "react";

{/*The primary purpose of useEffect is to synchronize your component with an external system after the rendering is complete and the DOM is updated. 
  The import { useEffect } from "react"; statement is used to import the useEffect Hook, which allows functional components to manage side effects 
  (operations outside the normal React rendering process, such as data fetching, subscriptions, and manual DOM manipulations).  
  */}

//firestore sdk functions
import {
  collection, //reference a collection
  getDocs, //read documents
  addDoc, //create a document
  updateDoc, //update an existing document
  deleteDoc, //delete a document
  doc, //reference a specific document
  serverTimestamp, //firestore server time
  Timestamp, //firestore timestamp time
} from "firebase/firestore";
import { db } from "@/firebase/firebase.config";

/* ================= TYPES ================= */

type Coupon = {
  doc_id: string;
  coupon_code: string;
  type: "fixed" | "percentage";
  value: number;
  expiry: Timestamp | string; //expiry is union type because firestore gives timestamp, and HTML data input gives string
  valid: boolean;
};

/* ================= HELPERS ================= */

const formatDate = (date: any) => {
  if (!date) return "";
  if (typeof date === "string") return date;
  if (date instanceof Timestamp) {
    return date.toDate().toISOString().split("T")[0];
  }
  return "";
};
{/*this helper converts timestamp to string, leaves string as is, prevents crashes*/}

/* ================= PAGE ================= */

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]); //Stores all coupons from Firestore
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); //Controls side drawer visibility
  const [editingId, setEditingId] = useState<string | null>(null); //null for add mode, string for edit mode

  const [formData, setFormData] = useState<Coupon>({
    doc_id: "",
    coupon_code: "",
    type: "fixed",
    value: 0,
    expiry: "",
    valid: true,
  }); //this represents what user is editing, what will be saved to firestore

  /* ================= FETCH ================= */

  const fetchCoupons = async () => {
    const snapshot = await getDocs(collection(db, "coupon"));
    const data = snapshot.docs.map((d) => ({
      doc_id: d.id,
      ...(d.data() as Omit<Coupon, "doc_id">),
    }));
    setCoupons(data);
  };  {/*connects to firestore, fetch all documents in coupon collection, convert them into js objects, store them in state*/}

  useEffect(() => {
    fetchCoupons();
  }, []); //Load coupons when page opens

  /* ================= SAVE ================= */

  const handleSave = async () => {
    try {
      let expiryDate: Date;

      if (formData.expiry instanceof Timestamp) {
        expiryDate = formData.expiry.toDate();
      } else if (typeof formData.expiry === "string" && formData.expiry !== "") {
        const parsed = new Date(formData.expiry);
        if (isNaN(parsed.getTime())) {
          alert("Invalid expiry date");
          return;
        }
        expiryDate = parsed;
      } else {
        alert("Expiry date is required");
        return;
      }

      const payload = {
        coupon_code: formData.coupon_code,
        type: formData.type,
        value: Number(formData.value),
        expiry: expiryDate,
        valid: formData.valid,
        updated_at: serverTimestamp(), //uses firestore server time, avoids client clock issues
      };

      if (editingId && editingId.trim() !== "") {
        await updateDoc(doc(db, "coupon", editingId), payload);
      } else {
        await addDoc(collection(db, "coupon"), {
          ...payload,
          created_at: serverTimestamp(),
        });
      } //for adding and editing coupon

      closeDrawer(); // ensures drawer closes
      fetchCoupons(); //ensures table updates
    } catch (err) {
      console.error(err);
      alert("Failed to save coupon");
    }
  }; //this function handles both create and update 

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    await deleteDoc(doc(db, "coupon", id));
    fetchCoupons();
  };

  /* ================= CLOSE DRAWER ================= */

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingId(null);
    setFormData({
      doc_id: "",
      coupon_code: "",
      type: "fixed",
      value: 0,
      expiry: "",
      valid: true,
    });
  };

  /* ================= SEARCH ================= */
  const [searchTerm, setSearchTerm] = useState("");
  const filteredCoupons = coupons.filter((c) =>
  c.coupon_code.toLowerCase().includes(searchTerm.toLowerCase())
);



  /* ================= UI (UNCHANGED) ================= */

  return (
    <>
      {/* ===== PAGE TITLE ===== */}
      <div className="row">
        <div className="colxl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="page-title-wrapper">
            <div className="page-title-box ad-title-box-use">
              <h4 className="page-title">Coupon</h4>
            </div>

          {/*For Search*/}
            <div className="ad-breadcrumb">
              <ul>
                <li>
                  <div className="ad-user-btn">
                    <input
  className="form-control"
  type="text"
  placeholder="Search Here..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

                  </div>
                </li>
              </ul>
            </div>
          {/*Add Mode*/}
            {/*clears form, opens drawer in add mode*/}
            <div style={{ marginTop: "10px" }}>
              <button
                className="btn btn-primary"
                onClick={() => {
    setEditingId(null);
    setFormData({
      doc_id: "",
      coupon_code: "",
      type: "fixed",
      value: 0,
      expiry: "",
      valid: true,
    });
    setIsDrawerOpen(true);
  }}
              >
                + Add Coupon
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="row">
        <div className="col-xl-12">
          <div className="card table-card">
            <div className="card-header pb-0">
              <h4>Coupons List</h4>
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-styled mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Coupon Code</th>
                      <th>Type</th>
                      <th>Value</th>
                      <th>Expiry</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {/*renders row per coupon, uses doc_id as key, shows formatted expiry*/}
                    {filteredCoupons.map((c, i) => (   
                      <tr key={c.doc_id}>
                        <td>{i + 1}</td>
                        <td>{c.coupon_code}</td>
                        <td>{c.type}</td>
                        <td>{c.value}</td>
                        <td>{formatDate(c.expiry)}</td>
                        <td>{c.valid ? "Active" : "Inactive"}</td>
                        <td className="relative">
                           <a className="action-btn" href="#">
                          <svg
                            className="default-size"
                            viewBox="0 0 341.333 341.333"
                          >
                            <path d="M170.667,85.333c23.573,0,42.667-19.093,42.667-42.667S194.24,0,170.667,0 128,19.093,128,42.667s19.093,42.666,42.667,42.666z" />
                            <path d="M170.667,128c-23.573,0-42.667,19.093-42.667,42.667s19.093,42.667,42.667,42.667 42.667-19.093,42.667-42.667S194.24,128,170.667,128z" />
                            <path d="M170.667,256c-23.573,0-42.667,19.093-42.667,42.667 0,23.573,19.093,42.667,42.667,42.667s42.667-19.093,42.667-42.667S194.24,256,170.667,256z" />
                          </svg>
                        </a>
                          <div className="action-option">
                            <ul>
                              <li>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();

                                    {/*switches to edit mode, pre-fills form, converts timestamp into string */}
                                    setEditingId(c.doc_id);
                                    setFormData({
                                      ...c,
                                      expiry: formatDate(c.expiry),
                                    });
                                    setIsDrawerOpen(true);
                                  }}
                                >
                                  Edit
                                </a>
                              </li>
                              <li>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(c.doc_id);
                                  }}
                                >
                                  Delete
                                </a>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SIDE DRAWER ===== */}
      {isDrawerOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "400px",
            height: "100vh",
            background: "#fff",
            boxShadow: "-4px 0 10px rgba(0,0,0,0.2)",
            padding: "20px",
            zIndex: 9999,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>{editingId ? "Edit Coupon" : "Add Coupon"}</h4>
            <button
              onClick={closeDrawer}
              style={{ border: "none", background: "transparent" }}
            >
              ✕
            </button>
          </div>

          <hr />

          <div className="form-group">
            <label>Coupon Code</label>
            <input
              className="form-control"
              value={formData.coupon_code}
              onChange={(e) =>
                setFormData({ ...formData, coupon_code: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Type</label>
            <select
              className="form-control"
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "fixed" | "percentage",
                })
              }
            >
              <option value="fixed">Fixed</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>

          <div className="form-group">
            <label>Value</label>
            <input
              type="number"
              className="form-control"
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: Number(e.target.value) })
              }
            />
          </div>

          <div className="form-group">
            <label>Expiry</label>
            <input
              type="date"
              className="form-control"
              value={formData.expiry as string}
              onChange={(e) =>
                setFormData({ ...formData, expiry: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.valid}
                onChange={(e) =>
                  setFormData({ ...formData, valid: e.target.checked })
                }
              />{" "}
              Valid
            </label>
          </div>

          <button className="btn btn-primary mt-3" onClick={handleSave}>
            {editingId ? "Update" : "Save"}
          </button>
        </div>
      )}
    </>
  );
}
