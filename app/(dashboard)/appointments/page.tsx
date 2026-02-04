"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  Timestamp,
   doc,        // ✅ ADD
  updateDoc,  
} from "firebase/firestore";
import { db } from "@/firebase/firebase.config";

/* ================= TYPES ================= */

type Appointment = {
  id: string;
  doctorId: string;
  doctor_name: string;
  patient_name: string;
  patient_phone: string;

  date: string;
  tokenNumber: number;

  doctor_time_start: Timestamp;
  doctor_time_end: Timestamp;

  payment_method: "PAY_AT_CLINIC" | "ONLINE";
  payment_status: "PENDING" | "PAID";

  amount: number;
};

type Doctor = {
  id: string;
  doc_name: string;
};


/* ================= HELPERS ================= */

const formatTime = (t?: Timestamp) => {
  if (!t || !(t instanceof Timestamp)) return "—";
  return t.toDate().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};


/* ================= PAGE ================= */

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
const [selectedDoctorId, setSelectedDoctorId] = useState<string>("ALL");

const [isDrawerOpen, setIsDrawerOpen] = useState(false);
const [selectedAppointment, setSelectedAppointment] =
  useState<Appointment | null>(null);

  const [activeTab, setActiveTab] = useState<"PRESENT" | "PAST">("PRESENT");





  /* ================= FIREBASE ================= */

  const fetchAppointments = async () => {
    const snapshot = await getDocs(collection(db, "appointments"));

    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Appointment, "id">),
    }));

    setAppointments(data);
  };



  const markAsPaid = async (appointmentId: string) => {
  try {
    await updateDoc(doc(db, "appointments", appointmentId), {
      payment_status: "PAID",
    });

    // Optimistic UI update
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId
          ? { ...a, payment_status: "PAID" }
          : a
      )
    );
  } catch (err) {
    console.error(err);
    alert("Failed to update payment status");
  }
};







  useEffect(() => {
    fetchAppointments();
  }, []);


  useEffect(() => {
  const fetchDoctors = async () => {
    const snap = await getDocs(collection(db, "doctor"));

    const data: Doctor[] = snap.docs.map((d) => ({
      id: d.id,
      doc_name: d.data().doc_name,
    }));

    setDoctors(data);
  };

  fetchDoctors();
}, []);


const todayStart = new Date().setHours(0, 0, 0, 0);



const filteredAppointments =
  selectedDoctorId === "ALL"
    ? appointments
    : appointments.filter(
        (a) => a.doctorId === selectedDoctorId
      );


const presentFutureAppointments = filteredAppointments.filter(
  (a: any) => a.dayKey >= todayStart
);

const pastAppointments = filteredAppointments.filter(
  (a: any) => a.dayKey < todayStart
);

const displayedAppointments =
  activeTab === "PRESENT"
    ? presentFutureAppointments
    : pastAppointments;



  /* ================= UI ================= */

  return (
    <>
      {/* TITLE */}
      <div className="page-title-wrapper">
        <h4 className="page-title">Appointments</h4>
        <select
  className="form-control"
  style={{ width: "240px" }}
  value={selectedDoctorId}
  onChange={(e) => setSelectedDoctorId(e.target.value)}
>
  <option value="ALL">All Doctors</option>

  {doctors.map((d) => (
    <option key={d.id} value={d.id}>
      {d.doc_name}
    </option>
  ))}
</select>




      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
  <button
    className={`btn ${activeTab === "PRESENT" ? "btn-primary" : "btn-light"}`}
    onClick={() => setActiveTab("PRESENT")}
  >
    Present & Future
  </button>

  <button
    className={`btn ${activeTab === "PAST" ? "btn-primary" : "btn-light"}`}
    onClick={() => setActiveTab("PAST")}
  >
    Past
  </button>
</div>


      {/* TABLE */}
      <div className="card table-card">
        <div className="card-body table-responsive">
          <table className="table table-styled">
            <thead>
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Token</th>
                <th>Time</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {displayedAppointments.map((a, i) => (
                <tr key={a.id}>
                  <td>{i + 1}</td>

                  <td>
                    <strong>{a.patient_name}</strong>
                    <div className="small text-muted">
                      {a.patient_phone}
                    </div>
                  </td>

                  <td>{a.doctor_name}</td>

                  <td>{a.date}</td>

                  <td>{a.tokenNumber}</td>

                  <td>
                    {formatTime(a.doctor_time_start)} –{" "}
                    {formatTime(a.doctor_time_end)}
                  </td>

                  <td>₹{a.amount}</td>

                  <td>{a.payment_method}</td>

                 <td>
  {a.payment_status === "PAID" ? (
    <span className="badge badge-success">Paid</span>
  ) : (
    <span className="badge badge-warning">Pending</span>
  )}
</td>


                  {/* ACTION (same 3-dot UI) */}
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
    setSelectedAppointment(a);
    setIsDrawerOpen(true);
  }}
>
  View
</a>

                        </li>

                         {/* ✅ ADD THIS EXACT BLOCK */}
      {a.payment_method === "PAY_AT_CLINIC" &&
        a.payment_status === "PENDING" && (
          <li>
            <a
              href="#"
              onClick={() => markAsPaid(a.id)}
              style={{ color: "green" }}
            >
              Mark as Paid
            </a>
          </li>
        )}



                      </ul>
                    </div>
                  </td>
                </tr>
              ))}

              {appointments.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          
       {isDrawerOpen && selectedAppointment && (
  <div
    style={{
      position: "fixed",
      top: "64px", // ⬅️ adjust if header height changes
      right: 0,
      width: "420px",
      height: "calc(100vh - 64px)",
      background: "#fff",
      boxShadow: "-4px 0 10px rgba(0,0,0,0.2)",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* ================= HEADER ================= */}
    <div
      style={{
        padding: "16px",
        borderBottom: "1px solid #e5e5e5",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        background: "#fff",
        zIndex: 10,
      }}
    >
      <h5 style={{ margin: 0 }}>Appointment Details</h5>

      <button
        onClick={() => {
          setIsDrawerOpen(false);
          setSelectedAppointment(null);
        }}
        style={{
          border: "none",
          background: "transparent",
          fontSize: "22px",
          cursor: "pointer",
        }}
        aria-label="Close"
      >
        ✕
      </button>
    </div>

    {/* ================= BODY ================= */}
    <div style={{ padding: "16px", overflowY: "auto" }}>
      <div className="mb-3">
        <strong>Patient Name</strong>
        <div>{selectedAppointment.patient_name}</div>
      </div>

      <div className="mb-3">
        <strong>Phone</strong>
        <div>{selectedAppointment.patient_phone}</div>
      </div>

      <div className="mb-3">
        <strong>Doctor</strong>
        <div>{selectedAppointment.doctor_name}</div>
      </div>

      <div className="mb-3">
        <strong>Date</strong>
        <div>{selectedAppointment.date}</div>
      </div>

      <div className="mb-3">
        <strong>Token Number</strong>
        <div>{selectedAppointment.tokenNumber}</div>
      </div>

      <div className="mb-3">
        <strong>Time Slot</strong>
        <div>
          {formatTime(selectedAppointment.doctor_time_start)} –{" "}
          {formatTime(selectedAppointment.doctor_time_end)}
        </div>
      </div>

      <div className="mb-3">
        <strong>Payment Method</strong>
        <div>{selectedAppointment.payment_method}</div>
      </div>

      <div className="mb-3">
        <strong>Payment Status</strong>
        <div>
          {selectedAppointment.payment_status === "PAID" ? (
            <span className="badge badge-success">Paid</span>
          ) : (
            <span className="badge badge-warning">Pending</span>
          )}
        </div>
      </div>

      <div className="mb-3">
        <strong>Amount</strong>
        <div>₹{selectedAppointment.amount}</div>
      </div>
    </div>
  </div>
)}






        </div>
      </div>
    </>
  );
}
