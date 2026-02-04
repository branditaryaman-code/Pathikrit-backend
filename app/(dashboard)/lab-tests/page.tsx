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

const SAMPLE_TYPE_OPTIONS = [
  { value: "blood", label: "Blood" },
  { value: "urine", label: "Urine" },
]; //easier to add more options later


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
   active: boolean;
   symptoms: string[];
};

type Symptom = {
  id: string;
  name: string;
  valid: boolean;
};


const formatDate = (date: any) => {
  if (!date) return "";
  if (typeof date === "string") return date;
  if (date instanceof Timestamp)
    return date.toDate().toISOString().split("T")[0];
  return "";
}; //this exists because report_time

export default function LabTestsPage() {
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [selectedSymptom, setSelectedSymptom] = useState<string>("");

  const [symptomDropdownOpen, setSymptomDropdownOpen] = useState(false);



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
     active: true,
     symptoms: [],
  });

  /* ================= FETCH ================= */

  const fetchLabTests = async () => {
    const snapshot = await getDocs(collection(db, "lab_tests"));
   const data = snapshot.docs.map((d) => {
  const raw = d.data() as any;

  return {
    ...raw,
    symptoms: Array.isArray(raw.symptoms) ? raw.symptoms : [], // ✅ FIX
    doc_id: d.id,
  };
});

    setLabTests(data);
  };

  useEffect(() => {
    fetchLabTests();
    fetchSymptoms();
  }, []);


  const fetchSymptoms = async () => {
  const snap = await getDocs(collection(db, "symptoms"));
  const data = snap.docs
    .map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Symptom, "id">),
    }))
    .filter((s) => s.valid); // ✅ only valid symptoms

  setSymptoms(data);
};


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
     const reportTimeValue = new Date();

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
    setSymptomDropdownOpen(false);
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
      active: true,
      symptoms: [],
    });
  };

  const filteredLabTests = labTests.filter((t) => {
  const matchesSearch =
    (t.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  const matchesSymptom =
    !selectedSymptom || t.symptoms?.includes(selectedSymptom);

  return matchesSearch && matchesSymptom;
});


const toggleSymptom = (id: string) => {
  setFormData((prev) => {
    const exists = prev.symptoms.includes(id);

    return {
      ...prev,
      symptoms: exists
        ? prev.symptoms.filter((s) => s !== id)
        : [...prev.symptoms, id],
    };
  });
};


  

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

  <select
  className="form-control"
  style={{ width: "220px" }}
  value={selectedSymptom}
  onChange={(e) => setSelectedSymptom(e.target.value)}
>
  <option value="">All Symptoms</option>
  {symptoms.map((s) => (
    <option key={s.id} value={s.id}>
      {s.name}
    </option>
  ))}
</select>





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
    active: true,
    symptoms: [],
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
            <th>Status</th>
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
              <td>
  {t.active ? (
    <span className="badge badge-success">Active</span>
  ) : (
    <span className="badge badge-secondary">Inactive</span>
  )}
</td>


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
  symptoms: Array.isArray(t.symptoms) ? t.symptoms : [], // ✅ FIX
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
          <div className="form-group mb-2">
  <label>Test Name</label>
  <input
    className="form-control"
    value={formData.name}
    onChange={(e) =>
      setFormData({ ...formData, name: e.target.value })
    }
  />
</div>

        <div className="form-group mb-2">
  <label>Description</label>
  <textarea
    className="form-control"
    value={formData.description}
    onChange={(e) =>
      setFormData({ ...formData, description: e.target.value })
    }
  />
</div>

        <div className="form-group mb-2">
  <label>Sample Type</label>
  <select
    className="form-control"
    value={formData.sample_type}
    onChange={(e) =>
      setFormData({ ...formData, sample_type: e.target.value })
    }
  >
    <option value="">Select sample type</option>

    {SAMPLE_TYPE_OPTIONS.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</div>


<div className="form-group mb-2" style={{ position: "relative" }}>
  <label>Symptoms</label>

  {/* DROPDOWN BUTTON */}
  <div
    className="form-control"
    style={{ cursor: "pointer" }}
    onClick={() => setSymptomDropdownOpen((p) => !p)}
  >
    {formData.symptoms.length > 0
      ? `${formData.symptoms.length} symptom(s) selected`
      : "Select symptoms"}
  </div>

  {/* DROPDOWN LIST */}
  {symptomDropdownOpen && (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "4px",
        zIndex: 1000,
        padding: "8px",
      }}
    >
      {symptoms.map((s) => (
        <label
          key={s.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            marginBottom: "6px",
          }}
        >
          <input
            type="checkbox"
            checked={formData.symptoms.includes(s.id)}
            onChange={() => toggleSymptom(s.id)}
          />
          {s.name}
        </label>
      ))}
    </div>
  )}
</div>





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

          <label className="mb-2 d-block">
  <input
    type="checkbox"
    checked={formData.active}
    onChange={(e) =>
      setFormData({ ...formData, active: e.target.checked })
    }
  />{" "}
  Active
</label>


          <div className="form-group mb-2">
  <label>MRP</label>
  <input
    type="number"
    className="form-control"
    value={formData.mrp}
    onChange={(e) =>
      setFormData({ ...formData, mrp: Number(e.target.value) })
    }
  />
</div>


        


          <div className="form-group mb-2">
  <label>Test Image</label>
  <input
    type="file"
    accept="image/*"
    className="form-control"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }}
  />
</div>


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
