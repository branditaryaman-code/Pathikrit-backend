"use client";

import { useState } from "react";

type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  wallet: string;
  date: string;
};

const customers: Customer[] = [
  {
    id: 1,
    name: "Scott Henry",
    phone: "+(00) 4512 451",
    email: "scott@email.com",
    address: "2210 Grove Street Bethpage, NI 440014",
    wallet: "$6,415",
    date: "22/06/2022",
  },
  {
    id: 2,
    name: "Mark Wood",
    phone: "+(00) 4512 451",
    email: "mark@email.com",
    address: "2210 sed do eiusmod tempor ut, NI 440022",
    wallet: "$2,415",
    date: "22/07/2022",
  },
  {
    id: 3,
    name: "Mike Doe",
    phone: "+(00) 4512 451",
    email: "mike@email.com",
    address: "4477 labore et dolore magna, NI 440011",
    wallet: "$5,415",
    date: "12/02/2022",
  },
  {
    id: 4,
    name: "Tom John",
    phone: "+(00) 4512 451",
    email: "tom@email.com",
    address: "4877 occaecat cupidatat non proident, NI 2441",
    wallet: "$4,411",
    date: "11/07/2022",
  },
];

export default function CustomersPage() {
  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  return (
    <>
      {/* ===== TABLE ===== */}
      <div className="card table-card">
        <div className="card-header pb-0">
          <h4>Customers List</h4>
        </div>

        <div className="card-body">
          <table className="table table-styled">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone / Email</th>
                <th>Wallet</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>
                    {c.phone}
                    <br />
                    {c.email}
                  </td>
                  <td>{c.wallet}</td>
                  <td>{c.date}</td>
                 <td className="relative" style={{ position: "relative" }}>
  <a
    className="action-btn"
    onClick={() =>
      setOpenActionId(openActionId === c.id ? null : c.id)
    }
  >
   <svg
                          className="default-size"
                          viewBox="0 0 341.333 341.333"
                        >
                          <path d="M170.667,85.333c23.573,0,42.667-19.093,42.667-42.667S194.24,0,170.667,0 128,19.093,128,42.667s19.093,42.666,42.667,42.666z" />
                          <path d="M170.667,128c-23.573,0-42.667,19.093-42.667,42.667s19.093,42.667,42.667,42.667 42.667-19.093,42.667-42.667S194.24,128,170.667,128z" />
                          <path d="M170.667,256c-23.573,0-42.667,19.093-42.667,42.667 0,23.573,19.093,42.667,42.667,42.667s42.667-19.093,42.667-42.667S194.24,256,170.667,256z" />
                        </svg>
  </a>

  {openActionId === c.id && (
    <div className="action-option">
      <ul>
        <li>
          <a
            onClick={() => {
              setSelectedCustomer(c);
              setOpenActionId(null);
            }}
          >
            <i className="far fa-edit mr-2"></i>
            Orders
          </a>
        </li>
      </ul>
    </div>
  )}
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== SIDE DRAWER ===== */}
      {selectedCustomer && (
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
            <h4>Customer Orders</h4>
            <button
              onClick={() => setSelectedCustomer(null)}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          <hr />

          <p>
            <strong>Name:</strong> {selectedCustomer.name}
          </p>
          <p>
            <strong>Phone:</strong> {selectedCustomer.phone}
          </p>
          <p>
            <strong>Email:</strong> {selectedCustomer.email}
          </p>
          <p>
            <strong>Address:</strong> {selectedCustomer.address}
          </p>
          <p>
            <strong>Wallet Balance:</strong> {selectedCustomer.wallet}
          </p>
          <p>
            <strong>Joined On:</strong> {selectedCustomer.date}
          </p>

          <hr />
          <p style={{ color: "#888" }}>
            (Orders list will go here later)
          </p>
        </div>
      )}
    </>
  );
}
