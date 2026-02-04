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

/* ================= TYPES ================= */

type Medicine = {
  medicine_id: string;
  medicine_name: string;
  brand_name: string;
  batch_number: string;
  category_id: string;
  manufacturer_id: string;
  composition: string;
  form: string;
  dosage: string;
  description: string;
  expiry_date: Timestamp | string;
  mrp: string;
  selling_price: string;
  tax: string;
  stock_quantity: string;
  image_url?: string ;
  status: boolean;
  requires_prescription: boolean;

};

/* ================= HELPERS ================= */

const formatDate = (date: any) => {
  if (!date) return "";
  if (typeof date === "string") return date;
  if (date instanceof Timestamp) {
    return date.toDate().toLocaleDateString();
  }
  return "";
};




/* ================= PAGE ================= */

export default function MedicinesPage() {
  

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Medicine>({
    medicine_id: "",
    medicine_name: "",
    brand_name: "",
    batch_number: "",
    category_id: "",
    manufacturer_id: "",
    composition: "",
    form: "",
    dosage: "",
    description: "",
    expiry_date: "",
    mrp: "",
    selling_price: "0",
    tax: "0",
    stock_quantity: "0",
    image_url: "",
    status: true,
    requires_prescription: false,

  });

  /* ================= FIREBASE ================= */

  const fetchMedicines = async () => {
    const snapshot = await getDocs(collection(db, "medicines"));
    const data = snapshot.docs.map((d) => ({
      medicine_id: d.id,
      ...(d.data() as Omit<Medicine, "medicine_id">),
    }));
    setMedicines(data);
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  /* ================= SAVE ================= */

  const handleSave = async () => {
  try {
    let expiryDateValue = null;

    if (formData.expiry_date instanceof Timestamp) {
      expiryDateValue = formData.expiry_date;
    } else if (
      typeof formData.expiry_date === "string" &&
      formData.expiry_date.trim() !== ""
    ) {
      const parsedDate = new Date(formData.expiry_date);
      if (isNaN(parsedDate.getTime())) {
        alert("Invalid expiry date");
        return;
      }
      expiryDateValue = parsedDate;
    } else {
      alert("Expiry date is required");
      return;
    }

     let imageUrl: string | undefined = formData.image_url;

if (imageFile) {
  const uploadedUrl = await uploadImage();
  imageUrl = uploadedUrl ?? undefined;
}


    const payload = {
      ...formData,
      expiry_date: expiryDateValue,
       image_url: imageUrl,
    };

    if (editingId) {
      await updateDoc(doc(db, "medicines", editingId), {
        ...payload,
        updated_at: serverTimestamp(),
      });
    } else {
      const ref = await addDoc(collection(db, "medicines"), {
        ...payload,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        status: true,
      });

      await updateDoc(ref, {
        medicine_id: ref.id,
      });
    }

    closeDrawer();
    fetchMedicines();
  } catch (err) {
    console.error(err);
    alert("Error saving medicine");
  }
};


  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this medicine?")) return;
    await deleteDoc(doc(db, "medicines", id));
    fetchMedicines();
  };




  const closeDrawer = () => {
  setIsDrawerOpen(false);
  setEditingId(null);
  setFormData({
    medicine_id: "",
    medicine_name: "",
    brand_name: "",
    batch_number: "",
    category_id: "",
    manufacturer_id: "",
    composition: "",
    form: "",
    dosage: "",
    description: "",
    expiry_date: "",
    mrp: "",
    selling_price: "",
    tax: "",
    stock_quantity: "",
    image_url: "",
    status: true,
   requires_prescription: false,

  });
   setImageFile(null);
  setImagePreview(null);
};

/*Search*/
const [searchTerm, setSearchTerm] = useState("");

const filteredMedicines = medicines.filter((medicine) =>
  medicine.medicine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  medicine.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
);

/*Image Upload*/
const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);
const [uploading, setUploading] = useState(false);
const storage = getStorage(app);


const uploadImage = async (): Promise<string | null> => {
  if (!imageFile) return null;

  setUploading(true);

  const imageRef = ref(
    storage,
    `medicines/${Date.now()}-${imageFile.name}`
  );

  await uploadBytes(imageRef, imageFile);
  const downloadURL = await getDownloadURL(imageRef);

  setUploading(false);
  return downloadURL;
};







  /* ================= UI ================= */

  return (
    <>
      {/* TITLE */}
      <div className="page-title-wrapper">
        <h4 className="page-title">Medicines</h4>


       <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "12px", // 👈 THIS creates space between search & button
    width: "100%",
  }}
>
  {/* SEARCH */}
  <input
    className="form-control"
    type="text"
    placeholder="Search medicines..."
    style={{ width: "220px" }}
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  {/* ADD BUTTON */}
  <button
    className="btn btn-primary"
    onClick={() => {
      setEditingId(null);
      setFormData({
        medicine_id: "",
        medicine_name: "",
        brand_name: "",
        batch_number: "",
        category_id: "",
        manufacturer_id: "",
        composition: "",
        form: "",
        dosage: "",
        description: "",
        expiry_date: "",
        mrp: "",
        selling_price: "0",
        tax: "0",
        stock_quantity: "0",
        image_url: "",
        status: true,
        requires_prescription: false,

      });
      setIsDrawerOpen(true);
    }}
  >
    + Add Medicine
  </button>
</div>

      </div>

      {/* TABLE */}
      <div className="card table-card">
        <div className="card-body table-responsive">
          <table className="table table-styled">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredMedicines.map((m, i) => (
                <tr key={m.medicine_id}>
                  <td>{i + 1}</td>
                  <td>{m.medicine_name}</td>
                  <td>{m.brand_name}</td>
                  <td>{m.stock_quantity}</td>
                  <td>₹{m.selling_price}</td>
                  <td>{formatDate(m.expiry_date)}</td>
                  <td>
  {m.status ? (
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
                        setEditingId(m.medicine_id);
                       setFormData({
  ...m,
  requires_prescription: Boolean(m.requires_prescription), // ✅ ADD
  expiry_date: formatDate(m.expiry_date),
});

                        setIsDrawerOpen(true);
                      }}
                      >
                    
                      Edit
                      </a>
                     
                   
                    </li>

                    <li>
                      <a href="#"
                  
                      onClick={() => handleDelete(m.medicine_id)}
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

      {/* DRAWER */}
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
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  }}
>
  <h4>{editingId ? "Edit Medicine" : "Add Medicine"}</h4>

  <button
    onClick={closeDrawer}
    style={{
      border: "none",
      background: "transparent",
      fontSize: "20px",
      cursor: "pointer",
    }}
    aria-label="Close"
  >
    ✕
  </button>
</div>


    <div className="form-group mb-2">
  <label>Medicine Name</label>
  <input
    className="form-control"
    value={formData.medicine_name}
    onChange={(e) =>
      setFormData({ ...formData, medicine_name: e.target.value })
    }
  />
</div>

<div  className="form-group mb-2">
  <label>Brand Name</label>
    <input
      className="form-control"
      value={formData.brand_name}
      onChange={(e) =>
        setFormData({ ...formData, brand_name: e.target.value })
      }
    />
</div>

   <div className="form-group mb-2">
  <label>Batch Number</label>
  <input
    className="form-control"
    value={formData.batch_number}
    onChange={(e) =>
      setFormData({ ...formData, batch_number: e.target.value })
    }
  />
</div>

<div className="form-group mb-2">
  <label>Category ID</label>
     <input
      className="form-control"
      value={formData.category_id}
      onChange={(e) =>
        setFormData({ ...formData, category_id: String(e.target.value) })
      }
    />
</div>


<div className="form-group mb-2">
  <label>Manufacturer ID</label>
    <input
      className="form-control mb-2"
      value={formData. manufacturer_id}
      onChange={(e) =>
        setFormData({ ...formData,  manufacturer_id: String(e.target.value) })
      }
    />
</div>

<div className="form-group mb-2">
   <label>Composition</label>
    <input
      className="form-control mb-2"
      value={formData. composition}
      onChange={(e) =>
        setFormData({ ...formData, composition: String(e.target.value) })
      }
    />
  </div>

    <div className="form-group mb-2">
    <label>Form</label>
    <select
  className="form-control"
  value={formData.form}
  onChange={(e) =>
    setFormData({ ...formData, form: e.target.value })
  }
>
  <option value="">Select Form</option>
  <option value="Tablet">Tablet</option>
  <option value="Syrup">Syrup</option>
</select>
</div>


<div className="form-group mb-2">
  <label>Expiry Date</label>
   <input
  type="date"
  className="form-control"
  value={
    typeof formData.expiry_date === "string"
      ? formData.expiry_date
      : formData.expiry_date instanceof Timestamp
      ? formData.expiry_date.toDate().toISOString().split("T")[0]
      : ""
  }
  onChange={(e) =>
    setFormData({ ...formData, expiry_date: e.target.value })
  }
/>
</div>

<div className="form-group mb-2">
   <label>Dosage</label>
<input
      className="form-control"
      value={formData. dosage}
      onChange={(e) =>
        setFormData({ ...formData, dosage: String(e.target.value) })
      }
    />
</div>

<div className="form-group mb-2">
  <label>Description</label>
    <input
      className="form-control"
      value={formData. description}
      onChange={(e) =>
        setFormData({ ...formData, description: String(e.target.value) })
      }
    />
</div>

<div className="form-group mb-2">
  <label>MRP</label>
    <input
      className="form-control"
      value={formData.mrp}
      onChange={(e) =>
        setFormData({ ...formData, mrp: String(e.target.value) })
      }
    />
</div>

<div className="form-group mb-2">
  <label>Selling Price</label>
    <input
      className="form-control"
      min={0}
      type="number"
      value={formData.selling_price ?? "0"}
       onChange={(e) => {
      const value = Math.max(0, Number(e.target.value));
      setFormData({
        ...formData,
        selling_price: String(value),
      });
    }}
    />
</div>

<div className="form-group mb-2">
  <label>Stock Quantity</label>
    <input
      className="form-control"
       min={0}
      type="number"
      value={formData.stock_quantity ?? "0"}
     onChange={(e) => {
      const value = Math.max(0, Number(e.target.value));
      setFormData({
        ...formData,
        stock_quantity: String(value),
      });
    }}
    />
</div>

<div className="form-group mb-2">
  <label>Tax</label>
     <input
      className="form-control"
       min={0}
      type="number"
      value={formData.tax ?? "0"}
      onChange={(e) => {
      const value = Math.max(0, Number(e.target.value));
      setFormData({
        ...formData,
        tax: String(value),
      });
    }}
    />
</div>

<div className="form-group mb-2">
  <label>
    <input
      type="checkbox"
      checked={formData.status}
      onChange={(e) =>
        setFormData({ ...formData, status: e.target.checked })
      }
    />{" "}
    Active
  </label>
</div>

<div className="form-group mb-2">
  <label>
   <input
  type="checkbox"
  checked={formData.requires_prescription}
  onChange={(e) =>
    setFormData({
      ...formData,
      requires_prescription: e.target.checked,
    })
  }
/>

    Prescription Required
  </label>
</div>


   {/* IMAGE UPLOAD */}
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
      height: "150px",
      objectFit: "cover",
      borderRadius: "6px",
      marginBottom: "10px",
    }}
  />
)}


<div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
 <button className="btn btn-primary" onClick={handleSave}>
    {editingId ? "Update" : "Save"}
</button>
</div>

  </div>
)}

    </>
  );
}
