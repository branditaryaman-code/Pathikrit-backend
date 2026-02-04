"use client";

import { useEffect, useState } from "react"; //useState to stote UI and Data and useEffect and fetch data on load
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
  getStorage, // connects app to firebase storage, returns a storage instance
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage"; //used for doctor profile image uploads
import { db, app } from "@/firebase/firebase.config";
//db for firebase instance, app (needed for storage)

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
  symptom: string[]; //multi select
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
}; //represents availability blocks per doctor
//each timeslot lives in a subcollection, can be open(time exists), or closed(time is empty)
// |string exists because before saving form uses string; after saving firestore returns timestamp

type SymptomOption = {
  doc_id: string;
  name: string;
};


const storage = getStorage(app); //Use Firebase Storage for THIS Firebase app, without this cannot upload or download files



/* ================= HELPERS ================= */

//Firestore stores time as Timestamp
const tsToTimeInput = (ts: any) => {
  if (!(ts instanceof Timestamp)) return "";
  const d = ts.toDate();
  return d.toTimeString().slice(0, 5); // HH:mm; hours and minutes
};//closed days have no time, prevents crashes

const timeToTimestamp = (time: string) => {
  if (!time) return null;
  //makes closed days work

  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  //creates a valid JS date for today with selected time

  return Timestamp.fromDate(date);//Converts JS Date → Firestore Timestamp.
};

/* ================= PAGE ================= */

export default function DoctorsPage() {

  /* ===== DOCTORS ===== */
  const [doctors, setDoctors] = useState<Doctor[]>([]); //table data
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); //doctor form
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null); //edit vs add
  const [mode, setMode] = useState<"doctor" | "timeslot">("doctor"); //drawer used for timeslot management 

  const [symptomsList, setSymptomsList] = useState<SymptomOption[]>([]); //available symptoms
  const [isSymptomsOpen, setIsSymptomsOpen] = useState(false);// custom multi-select dropdown



  const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const fetchSymptoms = async () => {
  const snap = await getDocs(collection(db, "symptoms"));

  const data = snap.docs
    .map((d) => ({
      doc_id: d.id,
      name: (d.data() as any).name,
      valid: (d.data() as any).valid,
    }))
    .filter((s) => s.valid); // filters only active symptoms

  setSymptomsList(data);
};



  /* ===== DOCTOR FORM ===== */
  //single object = easier updates and resets
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
    symptom: [] as string[],

    featured: false,
    valid: true,
    image: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  //stores selected image and prevents double submit

  /* ===== TIMESLOTS ===== */
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);//this binds which doctor
  const [selectedDoctorName, setSelectedDoctorName] = useState("");
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]); //this binds which availability
  const [editingTimeslot, setEditingTimeslot] = useState<Timeslot | null>(null);
  const [timeslotForm, setTimeslotForm] = useState({ //this binds form inputs
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
    );//combines firestore document id and firestore document data
  };

  useEffect(() => {
    fetchDoctors();
     fetchSymptoms();
  }, []); //runs once on page load

  /* ================= IMAGE UPLOAD ================= */

  const uploadImage = async (): Promise<string> => {//Returns URL of uploaded image.

    if (!imageFile) return formData.image || "";//  If editing doctor and image unchanged → reuse old image.
    setUploading(true);
    const imageRef = ref(storage, `doctors/${Date.now()}-${imageFile.name}`); //creates a reference (pointer) to a file location in Storage; creates a unique file path to avoid overwriting files
   
    await uploadBytes(imageRef, imageFile); //sends the file over the network to firebase's servers; until this runs, the file is not stored
    const url = await getDownloadURL(imageRef);
    //upload then retrieve public URL
    setUploading(false);
    return url;
  };

  /* ================= DOCTOR SAVE ================= */

  const saveDoctor = async () => {
    const imageUrl = await uploadImage();
{/*payload means the final object that will be sent to the database*/}
//key things payload does, converts numbers, split department string = array, Store serverTimestamp()
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
      symptom: formData.symptom,
      featured: formData.featured,
      valid: formData.valid,
      image: imageUrl,
      date_time: serverTimestamp(), //lets firestore decide the time
    };

    {/*for editing an existing doctor and creating a new doctor*/}
    if (editingDoctor) {
      await updateDoc(doc(db, "doctor", editingDoctor.doc_id), payload); //updates only the fields in payload, does not create a new document, does not change the document id, only editing
    } else {
    const doctorRef = await addDoc(collection(db, "doctor"), payload);

// 🔥 CREATE DEFAULT TIMESLOTS (VERY IMPORTANT)
const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

for (const day of DAYS_OF_WEEK) {
  await addDoc(
    collection(db, "doctor", doctorRef.id, "timeslot"),
    {
      day,
      stime: null,
      etime: null,
      close: true, // default closed
    }
  );
} //no doctor is being edited, user clicked add doctor
    }// add doc creates a new document, automatically generates a unique document id, saves payload as the document data

    closeDrawer();
    fetchDoctors();
  };

  /* ================= TIMESLOTS ================= */
//main purpose of the function is Open the side drawer in timeslot mode for this doctor and load all of their timeslots from Firestore. Prepares the ui drawer and fetches timeslot data 
  const openTimeslots = async (doctor: Doctor) => {
  {/* for this parameter (doctor: Doctor) the full doctor object is passed when clicking "Timeslot", this gives access to doctor.doc_id(database key)
    doctor.doc_name (ui display)*/}

    setMode("timeslot");//render the timeslot UI, not the doctor form
    {/*drawer supports two modes for doctor add/edit doctor and for timeslot manage availability*/}

    setSelectedDoctorId(doctor.doc_id);
    setSelectedDoctorName(doctor.doc_name);
    {/*these values are used to know which doctor timeslots belong to, build firestore paths, shows the doctor's name in the UI*/}

    setIsDrawerOpen(true);// this makes the side drawer visible, so drawer opens, ui switches to timeslot mode, doctor context is ready

    const snap = await getDocs(
      collection(db, "doctor", doctor.doc_id, "timeslot")
    );//reading from the subcollection timeslot

    setTimeslots(
      snap.docs.map((d) => ({ doc_id: d.id, ...(d.data() as any) }))
    );{/*d.data is document fields and d.id is document id(not included in data) these both are combined so react can render lists (key={doc_id}); and delete/update specific
      timeslots; key tells react which item is which when rendering a list*/}
  };

  const saveTimeslot = async () => {
    if (!selectedDoctorId) return;

    const payload = {
      day: timeslotForm.day,
      stime: timeToTimestamp(timeslotForm.stime),
      etime: timeToTimestamp(timeslotForm.etime),
      close: timeslotForm.close,
    };
    {/*if close===true, stimeand etime become null, Firestore stores closed day without time */}

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

  const deleteTimeslot = async (timeslotId: string) => {
  if (!selectedDoctorId) return;

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this timeslot?"
  );
  if (!confirmDelete) return;

  await deleteDoc(
    doc(db, "doctor", selectedDoctorId, "timeslot", timeslotId)
  );

  // Refresh timeslots
  openTimeslots(
    doctors.find((d) => d.doc_id === selectedDoctorId)!
  );
};


  /* ================= DRAWER ================= */

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setIsSymptomsOpen(false);

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
   symptom: doctor.symptom || [],
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
 const [searchTerm, setSearchTerm] = useState("");//This stores what the admin types into the search box.

const filteredDoctors = doctors.filter((d) => {
  const term = searchTerm.toLowerCase();
  //Searches should be case-insensitive, Normalizes input



  return (
    (d.doc_name || "").toLowerCase().includes(term) ||
    (d.phone_number || "").toLowerCase().includes(term) ||
    (d.email || "").toLowerCase().includes(term) ||
    (d.specialization || "").toLowerCase().includes(term)
  );
  // this allows searching by doctor name, phone, email, specialization
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

                  {/* ================= Search================= */}

                  <div className="ad-user-btn">
                    <input
  className="form-control"
  type="text"
  placeholder="Search Here..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

                  </div>
                  {/*controlled input(React owns the value), Automatically re-filters filteredDoctors */}
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
                {/*Switches drawer into doctor form mode, clears any existing edit state, opens the drawer */}
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
                       <th>Status</th>
                      
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
                     

                    <td>
        {d.valid ? (
          <span className="badge badge-success">Active</span>
        ) : (
          <span className="badge badge-secondary">Inactive</span>
        )}
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
        <a onClick={() => openEditDoctor(d)}>
          <i className="far fa-edit mr-2"></i>Edit
        </a>
      </li>

      <li>
        <a onClick={() => deleteDoctor(d.doc_id)}>{/*calls firestore deleteDoc to prevents accidental data loss */}
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
      {isDrawerOpen && ( //is conditional because drawer should exist only when needed, Saves memory & avoids stale state
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
            {/*this heading adapts dynamically add doctor, edit doctor amd timeslots */}
            <button
              onClick={closeDrawer}
              style={{ border: "none", background: "transparent" }}
            >
              ✕
            </button>
          </div>

          <hr />

          {/* ===== DOCTOR FORM ===== */}
          {mode === "doctor" && ( //Drawer now acts as doctor CRUD form.
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
                ["no_of_patient", "Patients per Day"],
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
              {/*dynamic input generation, state is the single source of truth, no uncontrolled values */}

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
  <label>Symptoms</label>

  {/* DROPDOWN HEADER */}
  <div
    onClick={() => setIsSymptomsOpen((prev) => !prev)}
    style={{
      border: "1px solid #ddd",
      borderRadius: "6px",
      padding: "8px 10px",
      cursor: "pointer",
      background: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <span style={{ fontSize: "14px", color: "#555" }}>
      {formData.symptom.length > 0
        ? formData.symptom.slice(0, 2).join(", ") + //prevents long text overflow, shows summary
          (formData.symptom.length > 2
            ? ` (+${formData.symptom.length - 2})`
            : "")
        : "Select symptoms"}
    </span>

    <span style={{ fontSize: "12px" }}>
      {isSymptomsOpen ? "▲" : "▼"}
    </span>
  </div>

  {/* DROPDOWN CONTENT */}
  {isSymptomsOpen && (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "6px",
        marginTop: "4px",
        padding: "8px",
        maxHeight: "180px",
        overflowY: "auto",
        background: "#fff",
      }}
    >

      {/*Show a list of checkboxes for all symptoms, and allow selecting multiple ones while keeping state updated.*/}
      {symptomsList.map((s) => ( //each (s) is one symptom document from firestore
        <label
          key={s.doc_id} //react uses this to track each checkbox, Firestore IDs are stable and unique, Prevents rendering bugs
          style={{ display: "block", marginBottom: "6px" }}
        >
          <input
            type="checkbox"

            checked={formData.symptom.includes(s.name)}//checkbox reflects state, supports edit mode correctly

            onChange={(e) => {
              const checked = e.target.checked;

              setFormData((prev: any) => ({ 
                ...prev,
                symptom: checked
                  ? [...prev.symptom, s.name] //adds the symptom to the array, preserves existing ones, immutable update
                  : prev.symptom.filter(
                      (sym: string) => sym !== s.name
                    ), //removes the symptom keeps all others
              }));
            }}
          />{" "}
          {s.name}
        </label>
      ))}

      {symptomsList.length === 0 && (
        <p style={{ fontSize: "13px", color: "#888" }}>
          No symptoms available
        </p>
      )}
    </div>
  )}
</div>


              <div className="form-group">
                <label>Doctor Image</label>
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
                disabled={uploading} //disable prevents double submission and prevents race conditions
              >
                Save
              </button>
            </>
          )}

          {/* ===== TIMESLOT MODE ===== */}
          {mode === "timeslot" && (
            <>
          {timeslots.map((t) => ( //Shows previously saved timeslots.
  <div
    key={t.doc_id} //key tells React which item is which when rendering a list.
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",
      padding: "8px 10px",
      marginBottom: "8px",
      border: "1px solid #eee",
      borderRadius: "6px",
    }}
  >
    {/* LEFT: DAY + TIME */}
    <div>
      <strong>{t.day}</strong>
      <div style={{ fontSize: "13px", color: "#555" }}>
        {tsToTimeInput(t.stime)} – {tsToTimeInput(t.etime)} 
        {/*this helper is used to convert firestore timestamp to hours and minutes, returns empty string for closed days */}
      </div>
    </div>

    {/* MIDDLE: STATUS */}
    <div
      style={{
        fontSize: "12px",
        color: t.close ? "#d9534f" : "#28a745",
        whiteSpace: "nowrap",
      }}
    >
      {t.close ? "Closed" : "Open"}
    </div>

    {/* RIGHT: REMOVE BUTTON */}
    <button
      className="btn btn-sm btn-danger"
      onClick={() => deleteTimeslot(t.doc_id)}
      style={{ whiteSpace: "nowrap" }}
    >
      Remove
    </button>
  </div>
))}



              <hr />

              <div className="form-group">
  <label>Day</label>
  <select //React state is the single source of truth, the dropdown value comes from timeslotForm.day, ui always reflects state
    className="form-control"
    value={timeslotForm.day} //this informs react that the currently selected option should match what's in state
    onChange={(e) =>
      setTimeslotForm({
        ...timeslotForm,
        day: e.target.value,
      })
    }
  >
    <option value="">Select Day</option>
    {DAYS_OF_WEEK.map((day) => (
      <option key={day} value={day}>
        {day}
      </option>
    ))} {/*this loops through the array of days created, creates one <option> per day, prevents repetition*/}
  </select>
</div>


              <div className="form-group">
                <label>Start Time</label>
               <input
  type="time"
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
  type="time"
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
                  {/*this enables closed day without time; stime/etime saved as null */}
                </label>
              </div>

              <button className="btn btn-primary" onClick={saveTimeslot}>
                Save Timeslot
              </button>
              {/*calls logic that builds payload, handles closed/open, saves to subcollection */}
            </>
          )}
        </div>
      )}
    </>
  );
}
