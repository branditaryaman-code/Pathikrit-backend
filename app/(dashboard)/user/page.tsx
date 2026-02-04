"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/firebase.config";

/* ================= TYPES ================= */

type User = {
  doc_id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  provider?: string;
  photoURL?: string;
  profileCompleted?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  userId?: string;
};

/* ================= PAGE ================= */

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  /* ================= FETCH USERS ================= */

  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    setUsers(
      snap.docs.map((d) => ({
        doc_id: d.id,
        ...(d.data() as any),
      }))
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= SEARCH ================= */

  const filteredUsers = users.filter((u) =>
    `${u.name || ""} ${u.fullName || ""} ${u.email || ""} ${u.phone || ""} ${
      u.city || ""
    } ${u.state || ""} ${u.provider || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ================= DELETE ================= */

  const deleteUser = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "users", id));
    fetchUsers();
  };



  const downloadCSV = () => {
  if (filteredUsers.length === 0) {
    alert("No users to download");
    return;
  }

  const headers = [
    "Name",
    "Email",
    "Phone",
    "City",
    "State",
    "Zip",
    "Provider",
    "Profile Status",
  ];

  const rows = filteredUsers.map((u) => [
    u.fullName || u.name || "",
    u.email || "",
    u.phone || "",
    u.city || "",
    u.state || "",
    u.zip || "",
    u.provider || "",
    u.profileCompleted ? "Completed" : "Pending",
  ]);

  const csvContent =
    [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `users_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();

  URL.revokeObjectURL(url);
};


  /* ================= UI ================= */

  return (
    <>
      {/* ===== PAGE TITLE ===== */}
      <div className="row">
        <div className="colxl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="page-title-wrapper">
            <div className="page-title-box ad-title-box-use">
              <h4 className="page-title">Users</h4>
            </div>

           <div className="ad-breadcrumb">
  <ul style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-end" }}>
    <li>
      <div className="ad-user-btn">
        <input
          className="form-control"
          type="text"
          placeholder="Search Here..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <svg viewBox="0 0 56.966 56.966">
          <path d="M55.146,51.887L41.588,37.786..." />
        </svg>
      </div>
    </li>

    <li>
      <button
        className="btn btn-outline-primary"
        onClick={downloadCSV}
      >
        ⬇ Download CSV
      </button>
    </li>
  </ul>
</div>

          </div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="row">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="card table-card">
            <div className="card-header pb-0">
              <h4>User List</h4>
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-styled mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>User</th>
                      <th>Contact</th>
                      <th>Location</th>
                      <th>Provider</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map((u, index) => (
                      <tr key={u.doc_id}>
                        <td>{index + 1}</td>

                        <td>
                          <span className="ml-2">
    {u.fullName || u.name || "-"}
  </span>
                        </td>

                        <td>
                          {u.phone || "-"}
                          <br />
                          <a>{u.email || "-"}</a>
                        </td>

                        <td>
                          {u.city || "-"}, {u.state || "-"} {u.zip || ""}
                        </td>

                        <td>{u.provider || "-"}</td>

                        <td>
                          <label className="mb-0 badge badge-primary">
                            {u.profileCompleted
                              ? "Completed"
                              : "Pending"}
                          </label>
                        </td>

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
                                <a
                                  onClick={() => deleteUser(u.doc_id)}
                                >
                                  <i className="far fa-trash-alt mr-2"></i>
                                  Delete
                                </a>
                              </li>

                              <li>
                                <a
                                  onClick={() => {
                                  setSelectedUser(u);
                                  setIsDrawerOpen(true);
                                   }}
                                  >
        <i className="far fa-eye mr-2"></i>
        View Details
      </a>
    </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center" }}>
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* ===== USER DETAILS DRAWER ===== */}
{isDrawerOpen && selectedUser && (
  <div
    style={{
      position: "fixed",
      top: 0,
      right: 0,
      width: "420px",
      height: "100vh",
      background: "#fff",
      boxShadow: "-4px 0 12px rgba(0,0,0,0.2)",
      padding: "20px",
      zIndex: 9999,
      overflowY: "auto",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h4>User Details</h4>
      <button
        onClick={() => {
          setIsDrawerOpen(false);
          setSelectedUser(null);
        }}
        style={{ border: "none", background: "transparent" }}
      >
        ✕
      </button>
    </div>

    <hr />

    <p><strong>Name:</strong> {selectedUser.fullName || selectedUser.name || "-"}</p>
    <p><strong>Email:</strong> {selectedUser.email || "-"}</p>
    <p><strong>Phone:</strong> {selectedUser.phone || "-"}</p>
    <p><strong>Alternate Phone:</strong> {selectedUser.alternatePhone || "-"}</p>
    <p><strong>Gender:</strong> {selectedUser.gender || "-"}</p>

    <hr />

    <p><strong>Address:</strong> {selectedUser.address || "-"}</p>
    <p><strong>City:</strong> {selectedUser.city || "-"}</p>
    <p><strong>State:</strong> {selectedUser.state || "-"}</p>
    <p><strong>Zip:</strong> {selectedUser.zip || "-"}</p>

    <hr />

    <p><strong>Provider:</strong> {selectedUser.provider || "-"}</p>
    <p>
      <strong>Profile Status:</strong>{" "}
      {selectedUser.profileCompleted ? "Completed" : "Pending"}
    </p>

    <hr />

    <p>
      <strong>Created At:</strong>{" "}
      {selectedUser.createdAt
        ? selectedUser.createdAt.toDate().toLocaleString()
        : "-"}
    </p>

    <p>
      <strong>Updated At:</strong>{" "}
      {selectedUser.updatedAt
        ? selectedUser.updatedAt.toDate().toLocaleString()
        : "-"}
    </p>
  </div>
)}










    </>
  );
}
