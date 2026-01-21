"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase.config";
import jsPDF from "jspdf";

/* ================= TYPES ================= */

type Order = {
  doc_id: string;
  billing: any;
  items: any[];
  coupon: any;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  discount: number;
  discountedSubtotal: number;
  cgst: number;
  sgst: number;
  tax: number;
  total: number;
  userId: string;
  createdAt: string;
};

/* ================= HELPERS ================= */

const formatDate = (val: any) => {
  if (val instanceof Timestamp) {
    return val.toDate().toLocaleString();
  }
  return "";
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState("");

  /* ================= FETCH ORDERS ================= */

  const fetchOrders = async () => {
    const snap = await getDocs(collection(db, "orders"));

    const data: Order[] = snap.docs.map((d) => {
      const o = d.data() as any;

      return {
        doc_id: d.id,
        billing: o.billing || {},
        items: o.items || [],
        coupon: o.coupon || null,
        paymentMethod: o.paymentMethod || "",
        paymentStatus: o.paymentStatus || "",
        subtotal: o.subtotal || 0,
        discount: o.discount || 0,
        discountedSubtotal: o.discountedSubtotal || 0,
        cgst: o.cgst || 0,
        sgst: o.sgst || 0,
        tax: o.tax || 0,
        total: o.total || 0,
        userId: o.userId || "",
        createdAt: formatDate(o.createdAt),
      };
    });

    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);




  const searchParams = useSearchParams();
const userIdFromUrl = searchParams.get("userId");
  /* ================= SEARCH ================= */

 const filteredOrders = orders
  .filter((o) => {
    if (!userIdFromUrl) return true;
    return o.userId === userIdFromUrl;
  })
  .filter((o) =>
    `${o.doc_id} ${o.billing?.firstName || ""} ${o.billing?.lastName || ""} ${
      o.paymentStatus
    } ${o.paymentMethod}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  /* ================= DOWNLOAD INVOICE ================= */

 const downloadInvoice = (order: Order) => {
  const doc = new jsPDF();

  let y = 10;

  /* ===== HEADER ===== */
  doc.setFontSize(18);
  doc.text("INVOICE", 105, y, { align: "center" });

  y += 10;
  doc.setFontSize(10);
  doc.text(`Order ID: ${order.doc_id}`, 10, y);
  doc.text(`Date: ${order.createdAt}`, 150, y);

  y += 8;
  doc.line(10, y, 200, y);

  /* ===== BILLING ===== */
  y += 8;
  doc.setFontSize(12);
  doc.text("Billing Details", 10, y);

  doc.setFontSize(10);
  y += 6;
  Object.entries(order.billing).forEach(([key, value]) => {
    doc.text(`${key}: ${String(value)}`, 10, y);
    y += 5;
  });

  /* ===== ITEMS ===== */
  y += 5;
  doc.line(10, y, 200, y);
  y += 6;

  doc.setFontSize(12);
  doc.text("Items", 10, y);
  y += 6;

  doc.setFontSize(10);
  order.items.forEach((item, index) => {
    doc.text(
      `${index + 1}. ${item.medicine_name} | Qty: ${item.quantity} | ₹${item.total_price}`,
      10,
      y
    );
    y += 5;
  });

  /* ===== TOTALS ===== */
  y += 5;
  doc.line(10, y, 200, y);
  y += 6;

  doc.text(`Subtotal: ₹${order.subtotal}`, 140, y);
  y += 5;
  doc.text(`Discount: ₹${order.discount}`, 140, y);
  y += 5;
  doc.text(`CGST: ₹${order.cgst}`, 140, y);
  y += 5;
  doc.text(`SGST: ₹${order.sgst}`, 140, y);
  y += 5;
  doc.text(`Tax: ₹${order.tax}`, 140, y);

  y += 6;
  doc.setFontSize(12);
  doc.text(`TOTAL: ₹${order.total}`, 140, y);

  /* ===== PAYMENT ===== */
  y += 10;
  doc.setFontSize(10);
  doc.text(`Payment Method: ${order.paymentMethod}`, 10, y);
  y += 5;
  doc.text(`Payment Status: ${order.paymentStatus}`, 10, y);

  /* ===== SAVE ===== */
  doc.save(`invoice-${order.doc_id}.pdf`);
};





  return (
    <>
      {/* ===== TABLE ===== */}
      <div className="card table-card">
        <div className="card-header pb-0 d-flex justify-content-between align-items-center">
          <h4>Orders List</h4>

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
                {filteredOrders.map((o) => (
                  <tr key={o.doc_id}>
                    <td>{o.doc_id}</td>
                    <td>
                      {o.billing?.firstName} {o.billing?.lastName}
                    </td>
                    <td>{o.createdAt}</td>
                    <td>₹{o.total}</td>
                    <td>{o.paymentStatus}</td>
                    <td>{o.paymentMethod}</td>

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
                            <a onClick={() => downloadInvoice(o)}>
                              <i className="far fa-edit mr-2"></i>
                              Download Invoice
                            </a>
                          </li>
                          <li>
                            <a onClick={() => setSelectedOrder(o)}>
                              <i className="far fa-eye mr-2"></i>
                              View Details
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
            overflowY: "auto",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>Order Details</h4>
            <button
              onClick={() => setSelectedOrder(null)}
              style={{ border: "none", background: "transparent" }}
            >
              ✕
            </button>
          </div>

          <hr />

          <p><strong>Order ID:</strong> {selectedOrder.doc_id}</p>
          <p><strong>User ID:</strong> {selectedOrder.userId}</p>
          <p><strong>Date:</strong> {selectedOrder.createdAt}</p>

          <hr />

          <strong>Billing</strong>
          {Object.entries(selectedOrder.billing).map(([k, v]) => (
            <p key={k}>
              <strong>{k}:</strong> {String(v)}
            </p>
          ))}

          <hr />

          <strong>Items</strong>
          {selectedOrder.items.map((item, i) => (
            <p key={i}>
              {item.medicine_name} — Qty {item.quantity} — ₹
              {item.total_price}
            </p>
          ))}

          <hr />

          <p>Subtotal: ₹{selectedOrder.subtotal}</p>
          <p>Discount: ₹{selectedOrder.discount}</p>
          <p>Discounted Subtotal: ₹{selectedOrder.discountedSubtotal}</p>
          <p>CGST: ₹{selectedOrder.cgst}</p>
          <p>SGST: ₹{selectedOrder.sgst}</p>
          <p>Tax: ₹{selectedOrder.tax}</p>
          <p><strong>Total: ₹{selectedOrder.total}</strong></p>

          <hr />

          <p>Payment Method: {selectedOrder.paymentMethod}</p>
          <p>Payment Status: {selectedOrder.paymentStatus}</p>
        </div>
      )}
    </>
  );
}
