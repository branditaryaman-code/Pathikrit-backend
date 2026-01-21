"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/firebase.config";

/* ================= TYPES ================= */

type Admin = {
  id: string;
  name: string;
  phonenumber: string;
  password: string;
  permissions: string[];
  active: boolean;
};

/* ================= CONSTANTS ================= */

const PAGES = [
  "dashboard",
  "doctors",
  "medicines",
  "symptoms",
  "lab_tests",
  "orders",
  "coupons",
  "admins",
];

/* ================= PAGE ================= */

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [search, setSearch] = useState("");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  const [formData, setFormData] = useState<Omit<Admin, "id">>({
    name: "",
    phonenumber: "",
    password: "",
    permissions: [],
    active: true,
  });

  /* ================= FETCH ADMINS ================= */

  const fetchAdmins = async () => {
    const snap = await getDocs(collection(db, "admins"));
    setAdmins(
      snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }))
    );
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  /* ================= SEARCH ================= */

  const filteredAdmins = admins.filter((a) =>
    `${a.name} ${a.phonenumber}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ================= DRAWER HANDLERS ================= */

  const openAdd = () => {
    setEditingAdmin(null);
    setFormData({
      name: "",
      phonenumber: "",
       password: "",
      permissions: [],
      active: true,
    });
    setIsDrawerOpen(true);
  };

  const openEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      phonenumber: admin.phonenumber,
       password: admin.password || "",
      permissions: admin.permissions || [],
      active: admin.active ?? true,
    });
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingAdmin(null);
  };

  /* ================= SAVE ADMIN ================= */

  const handleSave = async () => {
    if (!formData.name || !formData.phonenumber) {
      alert("Name and phone number are required");
      return;
    }

    if (editingAdmin) {
      await updateDoc(doc(db, "admins", editingAdmin.id), {
        name: formData.name,
        phonenumber: formData.phonenumber,
        password: formData.password,
        permissions: formData.permissions,
        active: true,
      });
    } else {
      await addDoc(collection(db, "admins"), {
        name: formData.name,
        phonenumber: formData.phonenumber,
        password: formData.password,
        permissions: formData.permissions,
        active: true,
        createdAt: serverTimestamp(),
      });
    }

    closeDrawer();
    fetchAdmins();
  };

  /* ================= DELETE ADMIN ================= */

  const deleteAdmin = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    await deleteDoc(doc(db, "admins", id));
    fetchAdmins();
  };

   /* ================= Dropdown ================= */
   const [showPermissions, setShowPermissions] = useState(false);


  /* ================= UI ================= */

  return (
    <>
      {/* PAGE TITLE */}
      <div className="row">
        <div className="col-12">
          <div className="page-title-wrapper">
            <div className="page-title-box">
              <h4 className="page-title">Admins</h4>
            </div>

            <div className="ad-breadcrumb">
              <ul>
                <li>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Search Here..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </li>
                <li>
                  <button className="btn btn-primary" onClick={openAdd}>
                    + Add Admin
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="row">
        <div className="col-12">
          <div className="card table-card">
            <div className="card-header pb-0">
              <h4>Admins List</h4>
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-styled mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Permissions</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAdmins.map((a, i) => (
                      <tr key={a.id}>
                        <td>{i + 1}</td>
                        <td>{a.name}</td>
                        <td>{a.phonenumber}</td>
                        <td>{a.permissions?.join(", ")}</td>

                        <td className="relative">
                          <a className="action-btn">
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
                                <a onClick={() => openEdit(a)}>
                                  <i className="far fa-edit mr-2"></i>Edit
                                </a>
                              </li>
                              <li>
                                <a onClick={() => deleteAdmin(a.id)}>
                                  <i className="far fa-trash-alt mr-2"></i>
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

      {/* SIDE DRAWER */}
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
            overflowY: "auto",
          }}
        >
          <div className="d-flex justify-content-between">
            <h4>{editingAdmin ? "Edit Admin" : "Add Admin"}</h4>
            <button
              onClick={closeDrawer}
              style={{ border: "none", background: "transparent" }}
            >
              ✕
            </button>
          </div>

          <hr />

          {/* NAME */}
          <div className="form-group">
            <label>Name</label>
            <input
              className="form-control"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* PHONE */}
          <div className="form-group">
            <label>Phone Number</label>
            <input
              className="form-control"
              value={formData.phonenumber}
              onChange={(e) =>
                setFormData({ ...formData, phonenumber: e.target.value })
              }
            />
          </div>

 {/* Password */}
          <div className="form-group">
  <label>Password</label>
  <input
    type="password"
    className="form-control"
    value={formData.password}
    onChange={(e) =>
      setFormData({ ...formData, password: e.target.value })
    }
  />
</div>


          {/* PERMISSIONS */}
        <div className="form-group">
  <label>Permissions</label>

  {/* Dropdown Button */}
  <div
  className="form-control d-flex justify-content-between align-items-center"
  style={{
    cursor: "pointer",
    userSelect: "none",
  }}
  onClick={() => setShowPermissions(!showPermissions)}
>
  <span>
    {formData.permissions.length > 0
      ? `${formData.permissions.length} selected`
      : "Select permissions"}
  </span>

  {/* Dropdown Arrow */}
  <span
    style={{
      transform: showPermissions ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.2s ease",
      fontSize: "12px",
    }}
  >
    ▼
  </span>
</div>


  {/* Dropdown Content */}
  {showPermissions && (
    <div
      style={{
        border: "1px solid #ddd",
        borderTop: "none",
        padding: "10px",
        maxHeight: "200px",
        overflowY: "auto",
        background: "#fff",
      }}
    >
      {PAGES.map((page) => (
        <div key={page} className="form-check mb-1">
          <input
            type="checkbox"
            className="form-check-input"
            checked={formData.permissions.includes(page)}
            onChange={(e) => {
              if (e.target.checked) {
                setFormData({
                  ...formData,
                  permissions: [...formData.permissions, page],
                });
              } else {
                setFormData({
                  ...formData,
                  permissions: formData.permissions.filter(
                    (p) => p !== page
                  ),
                });
              }
            }}
          />
          <label className="form-check-label">{page}</label>
        </div>
      ))}
    </div>
  )}
</div>


          <button className="btn btn-primary mt-3" onClick={handleSave}>
            Save
          </button>
        </div>
      )}
    </>
  );
}
