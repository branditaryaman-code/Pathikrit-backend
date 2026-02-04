"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db, app } from "@/firebase/firebase.config";

/* ================= TYPES ================= */

type Symptom = {
  doc_id: string;
  name: string;
  title: string;
  aliases: string[];
  image: string;
  featured: boolean;
  type: boolean;
  valid: boolean;
};

type SymptomForm = Omit<Symptom, "doc_id">;

const storage = getStorage(app);

/* ================= PAGE ================= */

export default function SymptomsPage() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<SymptomForm>({
    name: "",
    title: "",
    aliases: [],
    image: "",
    featured: false,
    type: false,
    valid: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  /* ================= FETCH ================= */

  const fetchSymptoms = async () => {
    const snap = await getDocs(collection(db, "symptoms"));
   const data = snap.docs.map((d) => {
  const raw = d.data() as any;

  return {
    name: raw.name || "",
    title: raw.title || "",
    aliases: Array.isArray(raw.aliases) ? raw.aliases : [], // 🔴 FIX
    image: raw.image || "",
    featured: !!raw.featured,
    type: !!raw.type,
    valid: raw.valid ?? true,
    doc_id: d.id,
  };
});

    setSymptoms(data);
  };

  useEffect(() => {
    fetchSymptoms();
  }, []);

  /* ================= SEARCH ================= */

  const filteredSymptoms = symptoms.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      (s.name || "").toLowerCase().includes(term) ||
      (s.title || "").toLowerCase().includes(term) ||
     (s.aliases || []).join(", ").toLowerCase().includes(term)

    );
  });

  /* ================= IMAGE UPLOAD ================= */

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return formData.image || "";
    const imageRef = ref(
      storage,
      `symptoms/${Date.now()}-${imageFile.name}`
    );
    await uploadBytes(imageRef, imageFile);
    return await getDownloadURL(imageRef);
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    const imageUrl = await uploadImage();

    const payload = {
  ...formData,
  aliases: aliasesInput
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean),
  image: imageUrl,
};

    if (editingId) {
      await updateDoc(doc(db, "symptoms", editingId), payload);
    } else {
      await addDoc(collection(db, "symptoms"), payload);
    }

    closeDrawer();
    fetchSymptoms();
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    if (!id) return;
    if (!confirm("Delete this symptom?")) return;
    await deleteDoc(doc(db, "symptoms", id));
    fetchSymptoms();
  };

  /* ================= DRAWER ================= */

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingId(null);
    setImageFile(null);
     setImagePreview(null);
    setAliasesInput("");
    setFormData({
      name: "",
      title: "",
      aliases: [],
      image: "",
      featured: false,
      type: false,
      valid: true,
    });
  };

  const [aliasesInput, setAliasesInput] = useState("");


  /* ================= UI ================= */

  return (
    <>
      {/* PAGE TITLE */}
      <div className="row">
        <div className="colxl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="page-title-wrapper">
            <div className="page-title-box ad-title-box-use">
              <h4 className="page-title">Symptoms</h4>
            </div>

            <div className="ad-breadcrumb">
              <ul>
                <li>
                  <div className="ad-user-btn">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Search Here..."
                      value={searchTerm}
                      onChange={(e) =>
                        setSearchTerm(e.target.value)
                      }
                    />
                  </div>
                </li>

                 <li>
      <button
        className="btn btn-primary"
        onClick={() => {
          setEditingId(null);          // ADD MODE
          setFormData({
            name: "",
            title: "",
            aliases: [],
            image: "",
            featured: false,
            type: false,
            valid: true,
          });
          setAliasesInput("");
          setImageFile(null);
          setIsDrawerOpen(true);
        }}
      >
        + Add Symptom
      </button>
    </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="row">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="card table-card">
            <div className="card-header pb-0">
              <h4>Symptoms List</h4>
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-styled mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Title</th>
                      <th>Aliases</th>
                      <th>Featured</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredSymptoms.map((s, i) => (
                      <tr key={s.doc_id || `sym-${i}`}>
                        <td>{i + 1}</td>
                        <td>{s.name}</td>
                        <td>{s.title}</td>
                        <td>{(s.aliases || []).join(", ")}</td>
                        <td>{s.featured ? "Yes" : "No"}</td>
                        <td>{s.valid ? "Active" : "Inactive"}</td>

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
                                onClick={() => {
  setEditingId(s.doc_id);

  const { doc_id, ...rest } = s;
  setFormData(rest);

  setAliasesInput((s.aliases || []).join(", "));
  setImagePreview(s.image || null); // ✅ PRELOAD IMAGE
  setImageFile(null);

  setIsDrawerOpen(true);
}}


                                >
                                  <i className="far fa-edit mr-2"></i>Edit
                                </a>
                              </li>
                              <li>
                                <a onClick={() => handleDelete(s.doc_id)}>
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
            <h4>{editingId ? "Edit Symptom" : "Add Symptom"}</h4>
            <button
              onClick={closeDrawer}
              style={{ border: "none", background: "transparent" }}
            >
              ✕
            </button>
          </div>

          <hr />

          <input
            className="form-control mb-2"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <input
            className="form-control mb-2"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <input
  className="form-control mb-2"
  placeholder="Aliases (comma separated)"
  value={aliasesInput}
  onChange={(e) => setAliasesInput(e.target.value)}
/>


         <input
  type="file"
  accept="image/*"
  className="form-control mb-2"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }}
/>


{/* IMAGE PREVIEW */}
  {imagePreview && (
    <img
      src={imagePreview}
      alt="Preview"
      style={{
        width: "100%",
        height: 150,
        objectFit: "cover",
        borderRadius: 6,
      }}
    />
  )}


          <label>
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  featured: e.target.checked,
                })
              }
            />{" "}
            Featured
          </label>

          <br />

          <label>
            <input
              type="checkbox"
              checked={formData.valid}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  valid: e.target.checked,
                })
              }
            />{" "}
            Active
          </label>

          <button className="btn btn-primary mt-3" onClick={handleSave}>
            Save
          </button>
        </div>
      )}
    </>
  );
}
