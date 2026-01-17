"use client";

import { useState } from "react";

type Order = {
  id: string;
  name: string;
  date: string;
  total: string;
  status: string;
  method: string;
};

const orders: Order[] = [
  {
    id: "#JH2033",
    name: "Emily Arnold",
    date: "22/06/2022",
    total: "$600",
    status: "Pending",
    method: "Paypal",
  },
  {
    id: "#MK4433",
    name: "Mark Doe",
    date: "14/07/2022",
    total: "$700",
    status: "Success",
    method: "Visa",
  },
  {
    id: "#MD4578",
    name: "Mark Smith",
    date: "28/08/2022",
    total: "$800",
    status: "Cancel",
    method: "Credit Card",
  },
  {
    id: "#DD1048",
    name: "Mike Wood",
    date: "13/04/2022",
    total: "$880",
    status: "Pending",
    method: "Mastercard",
  },
];

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState("");

  // 🔍 Filter orders based on search input
  const filteredOrders = orders.filter((order) =>
    `${order.id} ${order.name} ${order.status} ${order.method}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      {/* ===== TABLE ===== */}
      <div className="card table-card">
        <div className="card-header pb-0 d-flex justify-content-between align-items-center">
          <h4>Orders List</h4>

          {/* 🔍 Search Input */}
          <input
            type="text"
            placeholder="Search Here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              width: "220px",
              fontSize: "14px",
            }}
          />
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-styled mb-0">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Billing Name</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Method</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.name}</td>
                      <td>{o.date}</td>
                      <td>{o.total}</td>
                      <td>{o.status}</td>
                      <td>{o.method}</td>

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
                              <a href="#">
                                <i className="far fa-edit mr-2"></i>
                                Download Invoice
                              </a>
                            </li>
                            <li>
                              <a
                                href="#"
                                onClick={() => setSelectedOrder(o)}
                              >
                                <i className="far fa-eye mr-2"></i>
                                View Details
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <i className="far fa-check-circle mr-2"></i>
                                Completed
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center" }}>
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===== SIDE PANEL ===== */}
      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "400px",
            height: "100vh",
            background: "#fff",
            boxShadow: "-4px 0 12px rgba(0,0,0,0.2)",
            padding: "20px",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4>Order Details</h4>
            <button
              onClick={() => setSelectedOrder(null)}
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

          <p><strong>Order ID:</strong> {selectedOrder.id}</p>
          <p><strong>Customer:</strong> {selectedOrder.name}</p>
          <p><strong>Date:</strong> {selectedOrder.date}</p>
          <p><strong>Total:</strong> {selectedOrder.total}</p>
          <p><strong>Status:</strong> {selectedOrder.status}</p>
          <p><strong>Payment Method:</strong> {selectedOrder.method}</p>

          <hr />

          <p style={{ color: "#888" }}>
            (More order-related information can be added here)
          </p>
        </div>
      )}
    </>
  );
}
