"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db, app } from "@/firebase/firebase.config";

/* ================= TYPES ================= */

type Doctor = {
  doc_id: string;
  doc_name: string;
  email: string;
  phone_number: string;
  whatsapp_no: string;
  specialization: string;
  department: string[];
  degree: string;
  experience: string;
  charges: number;
  no_of_patient: number;
  about: string;
  symptom: string[];
  image: string;
  featured: boolean;
  valid: boolean;
  date_time?: Timestamp;
};

type Timeslot = {
  doc_id: string;
  day: string;
  stime: Timestamp | string;
  etime: Timestamp | string;
  close: boolean;
};

const storage = getStorage(app);

/* ================= HELPERS ================= */

const tsToInput = (ts: any) =>
  ts instanceof Timestamp ? ts.toDate().toISOString().slice(0, 16) : "";

const inputToTimestamp = (val: string) =>
  val ? Timestamp.fromDate(new Date(val)) : null;

/* ================= PAGE ================= */

export default function DoctorsPage() {
  /* ===== DOCTORS ===== */
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [mode, setMode] = useState<"doctor" | "timeslot">("doctor");

  /* ===== DOCTOR FORM ===== */
  const [formData, setFormData] = useState<any>({
    doc_name: "",
    email: "",
    phone_number: "",
    whatsapp_no: "",
    specialization: "",
    department: "",
    degree: "",
    experience: "",
    charges: "",
    no_of_patient: "",
    about: "",
    symptom: "",
    featured: false,
    valid: true,
    image: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  /* ===== TIMESLOTS ===== */
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedDoctorName, setSelectedDoctorName] = useState("");
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [editingTimeslot, setEditingTimeslot] = useState<Timeslot | null>(null);
  const [timeslotForm, setTimeslotForm] = useState({
    day: "",
    stime: "",
    etime: "",
    close: false,
  });

  /* ================= FETCH DOCTORS ================= */

  const fetchDoctors = async () => {
    const snap = await getDocs(collection(db, "doctor"));
    setDoctors(
      snap.docs.map((d) => ({ doc_id: d.id, ...(d.data() as any) }))
    );
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  /* ================= IMAGE UPLOAD ================= */

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return formData.image || "";
    setUploading(true);
    const imageRef = ref(storage, `doctors/${Date.now()}-${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    const url = await getDownloadURL(imageRef);
    setUploading(false);
    return url;
  };

  /* ================= DOCTOR SAVE ================= */

  const saveDoctor = async () => {
    const imageUrl = await uploadImage();

    const payload = {
      doc_name: formData.doc_name,
      email: formData.email,
      phone_number: formData.phone_number,
      whatsapp_no: formData.whatsapp_no,
      specialization: formData.specialization,
      department: formData.department
        .split(",")
        .map((d: string) => d.trim()),
      degree: formData.degree,
      experience: formData.experience,
      charges: Number(formData.charges),
      no_of_patient: Number(formData.no_of_patient),
      about: formData.about,
      symptom: formData.symptom
        .split(",")
        .map((s: string) => s.trim()),
      featured: formData.featured,
      valid: formData.valid,
      image: imageUrl,
      date_time: serverTimestamp(),
    };

    if (editingDoctor) {
      await updateDoc(doc(db, "doctor", editingDoctor.doc_id), payload);
    } else {
      await addDoc(collection(db, "doctor"), payload);
    }

    closeDrawer();
    fetchDoctors();
  };

  /* ================= TIMESLOTS ================= */

  const openTimeslots = async (doctor: Doctor) => {
    setMode("timeslot");
    setSelectedDoctorId(doctor.doc_id);
    setSelectedDoctorName(doctor.doc_name);
    setIsDrawerOpen(true);
    const snap = await getDocs(
      collection(db, "doctor", doctor.doc_id, "timeslot")
    );
    setTimeslots(
      snap.docs.map((d) => ({ doc_id: d.id, ...(d.data() as any) }))
    );
  };

  const saveTimeslot = async () => {
    if (!selectedDoctorId) return;

    const payload = {
      day: timeslotForm.day,
      stime: inputToTimestamp(timeslotForm.stime),
      etime: inputToTimestamp(timeslotForm.etime),
      close: timeslotForm.close,
    };

    if (editingTimeslot) {
      await updateDoc(
        doc(
          db,
          "doctor",
          selectedDoctorId,
          "timeslot",
          editingTimeslot.doc_id
        ),
        payload
      );
    } else {
      await addDoc(
        collection(db, "doctor", selectedDoctorId, "timeslot"),
        payload
      );
    }

    setEditingTimeslot(null);
    setTimeslotForm({ day: "", stime: "", etime: "", close: false });
    openTimeslots(
      doctors.find((d) => d.doc_id === selectedDoctorId)!
    );
  };

  /* ================= DRAWER ================= */

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setMode("doctor");
    setEditingDoctor(null);
    setImageFile(null);
  };



  const openEditDoctor = (doctor: Doctor) => {
  setMode("doctor");
  setEditingDoctor(doctor);

  setFormData({
    doc_name: doctor.doc_name || "",
    email: doctor.email || "",
    phone_number: doctor.phone_number || "",
    whatsapp_no: doctor.whatsapp_no || "",
    specialization: doctor.specialization || "",
    department: doctor.department?.join(", ") || "",
    degree: doctor.degree || "",
    experience: doctor.experience || "",
    charges: doctor.charges?.toString() || "",
    no_of_patient: doctor.no_of_patient?.toString() || "",
    about: doctor.about || "",
    symptom: doctor.symptom?.join(", ") || "",
    featured: doctor.featured || false,
    valid: doctor.valid ?? true,
    image: doctor.image || "",
  });

  setIsDrawerOpen(true);
};

const deleteDoctor = async (doctorId: string) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this doctor?"
  );
  if (!confirmDelete) return;

  await deleteDoc(doc(db, "doctor", doctorId));
  fetchDoctors();
};


 /* ================= SEARCH ================= */
 const [searchTerm, setSearchTerm] = useState("");
const filteredDoctors = doctors.filter((d) => {
  const term = searchTerm.toLowerCase();

  return (
    (d.doc_name || "").toLowerCase().includes(term) ||
    (d.phone_number || "").toLowerCase().includes(term) ||
    (d.email || "").toLowerCase().includes(term) ||
    (d.specialization || "").toLowerCase().includes(term)
  );
});



  /* ================= UI ================= */

  return (
    <>
      {/* ===== PAGE TITLE & SEARCH (UNCHANGED) ===== */}
      <div className="row">
        <div className="colxl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="page-title-wrapper">
            <div className="page-title-box ad-title-box-use">
              <h4 className="page-title">Doctors</h4>
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
  onChange={(e) => setSearchTerm(e.target.value)}
/>

                  </div>
                </li>
                <li>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setMode("doctor");
                      setEditingDoctor(null);
                      setIsDrawerOpen(true);
                    }}
                  >
                    + Add Doctor
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TABLE (UNCHANGED) ===== */}
      <div className="row">
        <div className="col-xl-12">
          <div className="card table-card">
            <div className="card-header pb-0">
              <h4>Doctors List</h4>
            </div>
            <div className="card-body">
              <table className="table table-styled mb-0">
                 <thead>
                    <tr>
                      <th>#</th>
                      <th>Doctor's Name</th>
                      <th>Phone Number</th>
                      <th>Department</th>
                      
                      <th>Action</th>
                    </tr>
                  </thead>
                <tbody>
                  {filteredDoctors.map((d, i) => (
                    <tr key={d.doc_id}>
                      <td>{i + 1}</td>
                      <td>{d.doc_name}</td>
                      <td>{d.phone_number}</td>
                      <td>{d.specialization}</td>
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
        <a onClick={() => openEditDoctor(d)}>
          <i className="far fa-edit mr-2"></i>Edit
        </a>
      </li>

      <li>
        <a onClick={() => deleteDoctor(d.doc_id)}>
          <i className="far fa-trash-alt mr-2"></i>Delete
        </a>
      </li>

      <li>
        <a onClick={() => openTimeslots(d)}>
          <i className="far fa-clock mr-2"></i>Timeslot
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

      {/* ===== SIDE DRAWER (RESTORED EXACTLY) ===== */}
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
            <h4>
              {mode === "doctor"
                ? editingDoctor
                  ? "Edit Doctor"
                  : "Add Doctor"
                : `Timeslots – ${selectedDoctorName}`}
            </h4>
            <button
              onClick={closeDrawer}
              style={{ border: "none", background: "transparent" }}
            >
              ✕
            </button>
          </div>

          <hr />

          {/* ===== DOCTOR FORM ===== */}
          {mode === "doctor" && (
            <>
              {[
                ["doc_name", "Name"],
                ["email", "Email"],
                ["phone_number", "Phone"],
                ["whatsapp_no", "WhatsApp"],
                ["specialization", "Specialization"],
                ["degree", "Degree"],
                ["experience", "Experience"],
                ["charges", "Charges"],
                ["no_of_patient", "Patients"],
              ].map(([key, label]) => (
                <div className="form-group" key={key}>
                  <label>{label}</label>
                  <input
                    className="form-control"
                    value={formData[key]}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                  />
                </div>
              ))}

              <div className="form-group">
                <label>About</label>
                <textarea
                  className="form-control"
                  value={formData.about}
                  onChange={(e) =>
                    setFormData({ ...formData, about: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Departments (comma separated)</label>
                <input
                  className="form-control"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      department: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Symptoms (comma separated)</label>
                <input
                  className="form-control"
                  value={formData.symptom}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      symptom: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Image</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) =>
                    setImageFile(e.target.files?.[0] || null)
                  }
                />
              </div>

              <div className="form-group">
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
              </div>

              <div className="form-group">
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
              </div>

              <button
                className="btn btn-primary mt-3"
                onClick={saveDoctor}
                disabled={uploading}
              >
                Save
              </button>
            </>
          )}

          {/* ===== TIMESLOT MODE ===== */}
          {mode === "timeslot" && (
            <>
              {timeslots.map((t) => (
                <div key={t.doc_id} style={{ marginBottom: "10px" }}>
                  <strong>{t.day}</strong>
                  <div>
                    {tsToInput(t.stime)} – {tsToInput(t.etime)}
                  </div>
                </div>
              ))}

              <hr />

              <div className="form-group">
                <label>Day</label>
                <input
                  className="form-control"
                  value={timeslotForm.day}
                  onChange={(e) =>
                    setTimeslotForm({
                      ...timeslotForm,
                      day: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={timeslotForm.stime}
                  onChange={(e) =>
                    setTimeslotForm({
                      ...timeslotForm,
                      stime: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>End Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={timeslotForm.etime}
                  onChange={(e) =>
                    setTimeslotForm({
                      ...timeslotForm,
                      etime: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={timeslotForm.close}
                    onChange={(e) =>
                      setTimeslotForm({
                        ...timeslotForm,
                        close: e.target.checked,
                      })
                    }
                  />{" "}
                  Closed
                </label>
              </div>

              <button className="btn btn-primary" onClick={saveTimeslot}>
                Save Timeslot
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
