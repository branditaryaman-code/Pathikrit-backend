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
  Timestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db, app } from "@/firebase/firebase.config";

const storage = getStorage(app);

type LabTest = {
  doc_id: string;
  labtest_id: number;
  name: string;
  description: string;
  category_id: number;
  sample_type: string;
  fasting_required: boolean;
  mrp: number;
  image_url?: string;
  report_time: Timestamp | string;
};

const formatDate = (date: any) => {
  if (!date) return "";
  if (typeof date === "string") return date;
  if (date instanceof Timestamp)
    return date.toDate().toISOString().split("T")[0];
  return "";
};

export default function LabTestsPage() {
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  type LabTestForm = Omit<LabTest, "doc_id">;

  const [formData, setFormData] = useState<LabTestForm>({
   
    labtest_id: 0,
    name: "",
    description: "",
    category_id: 0,
    sample_type: "",
    fasting_required: false,
    mrp: 0,
    image_url: "",
    report_time: "",
  });

  /* ================= FETCH ================= */

  const fetchLabTests = async () => {
    const snapshot = await getDocs(collection(db, "lab_tests"));
    const data = snapshot.docs.map((d) => ({
      ...(d.data() as Omit<LabTest, "doc_id">),
      doc_id: d.id,
    }));
    setLabTests(data);
  };

  useEffect(() => {
    fetchLabTests();
  }, []);

  /* ================= IMAGE UPLOAD ================= */

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    setUploading(true);
    const imageRef = ref(
      storage,
      `lab-tests/${Date.now()}-${imageFile.name}`
    );
    await uploadBytes(imageRef, imageFile);
    const url = await getDownloadURL(imageRef);
    setUploading(false);
    return url;
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
  try {
    let reportTimeValue: Date;

    // ✅ Normalize report_time safely
    if (formData.report_time instanceof Timestamp) {
      reportTimeValue = formData.report_time.toDate();
    } else if (
      typeof formData.report_time === "string" &&
      formData.report_time.trim() !== ""
    ) {
      const parsed = new Date(formData.report_time);
      if (isNaN(parsed.getTime())) {
        alert("Invalid report time");
        return;
      }
      reportTimeValue = parsed;
    } else {
      alert("Report time is required");
      return;
    }

    let imageUrl: string | undefined = formData.image_url;

if (imageFile) {
  const uploadedUrl = await uploadImage();
  imageUrl = uploadedUrl ?? undefined;
}


    const payload = {
      ...formData,
      report_time: reportTimeValue,
      image_url: imageUrl,
      updated_at: serverTimestamp(),
    };

    if (editingId) {
      await updateDoc(doc(db, "lab_tests", editingId), payload);
    } else {
     const refDoc = await addDoc(collection(db, "lab_tests"), {
  ...payload,
  created_at: serverTimestamp(),
  labtest_id: Date.now(),
});

// 🔴 FORCE REFRESH so doc_id is guaranteed
await fetchLabTests();

     
    }

    closeDrawer();
    fetchLabTests();
  } catch (error) {
    console.error(error);
    alert("Failed to save lab test");
  }
};


  /* ================= DELETE ================= */

 const handleDelete = async (id: string) => {
  if (!id) {
    console.error("Delete blocked: invalid doc_id", id);
    alert("Unable to delete this item. Please refresh the page.");
    return;
  }

  if (!confirm("Delete this lab test?")) return;

  await deleteDoc(doc(db, "lab_tests", id));
  fetchLabTests();
};


  /* ================= CLOSE DRAWER ================= */

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    setFormData({
     
      labtest_id: 0,
      name: "",
      description: "",
      category_id: 0,
      sample_type: "",
      fasting_required: false,
      mrp: 0,
      image_url: "",
      report_time: "",
    });
  };

  const filteredLabTests = labTests.filter((t) =>
  (t.name || "").toLowerCase().includes(searchTerm.toLowerCase())
);
  

  return (
    <>
      <h4>Lab Tests</h4>

     <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
  }}
>
  {/* SEARCH */}
  <input
    className="form-control"
    placeholder="Search lab tests..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ width: "220px" }}
  />

  {/* ADD BUTTON */}
  <button
    className="btn btn-primary"
    onClick={() => {
  setEditingId(null);
  setFormData({
    labtest_id: 0,
    name: "",
    description: "",
    category_id: 0,
    sample_type: "",
    fasting_required: false,
    mrp: 0,
    image_url: "",
    report_time: "",
  });
  setImageFile(null);
  setImagePreview(null);
  setIsDrawerOpen(true);
}}

  >
    + Add Lab Test
  </button>
</div>



        {/* ================= Table ================= */}
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Sample</th>
            <th>Fasting</th>
            <th>MRP</th>
            <th>Report Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredLabTests.map((t, i) => (
           <tr key={t.doc_id || `temp-${i}`}>

              <td>{i + 1}</td>
              <td>{t.name}</td>
              <td>{t.sample_type}</td>
              <td>{t.fasting_required ? "Yes" : "No"}</td>
              <td>₹{t.mrp}</td>
              <td>{formatDate(t.report_time)}</td>

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
               <a href="#"
                  onClick={() => {
                    setEditingId(t.doc_id);
                    setFormData({
                      ...t,
                      report_time: formatDate(t.report_time),
                    });
                    setImagePreview(t.image_url || null);
                    setIsDrawerOpen(true);
                  }}
                  >
                
                  Edit
                  </a>
               
                </li>

                <li>
                  <a href="#"
              
                  onClick={() => handleDelete(t.doc_id)}
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

      {/* ================= SIDE DRAWER (FIXED) ================= */}
      {isDrawerOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "400px",
            height: "100vh",
            background: "#fff",
            padding: "20px",
            boxShadow: "-4px 0 10px rgba(0,0,0,0.2)",
            zIndex: 9999,
            overflowY: "auto",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4>{editingId ? "Edit Lab Test" : "Add Lab Test"}</h4>
            <button
              onClick={closeDrawer}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          <hr />

          {/* FORM */}
          <input
            className="form-control mb-2"
            placeholder="Test Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <textarea
            className="form-control mb-2"
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <input
            className="form-control mb-2"
            placeholder="Sample Type"
            value={formData.sample_type}
            onChange={(e) =>
              setFormData({ ...formData, sample_type: e.target.value })
            }
          />

          <label className="mb-2 d-block">
            <input
              type="checkbox"
              checked={formData.fasting_required}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fasting_required: e.target.checked,
                })
              }
            />{" "}
            Fasting Required
          </label>

          <input
            type="number"
            className="form-control mb-2"
            placeholder="MRP"
            value={formData.mrp}
            onChange={(e) =>
              setFormData({ ...formData, mrp: Number(e.target.value) })
            }
          />

         <input
  type="date"
  className="form-control mb-2"
  value={
    typeof formData.report_time === "string"
      ? formData.report_time
      : formData.report_time instanceof Timestamp
      ? formData.report_time.toDate().toISOString().split("T")[0]
      : ""
  }
  onChange={(e) =>
    setFormData({ ...formData, report_time: e.target.value })
  }
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

          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              style={{
                width: "100%",
                height: 150,
                objectFit: "cover",
                marginBottom: 10,
              }}
            />
          )}

          {/* ACTIONS */}
          <div style={{ marginTop: 20 }}>
            <button className="btn btn-secondary mr-2" onClick={closeDrawer}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              {uploading ? "Uploading..." : editingId ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
