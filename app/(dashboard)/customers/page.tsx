"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebase.config";

/* ================= TYPES ================= */

type Customer = {
  userId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  created_at?: any;
};

type Order = {
  id: string;
  userId: string;
  orderId: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  created_at?: any;
};

/* ================= PAGE ================= */

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);

  /* ================= FETCH CUSTOMERS ================= */

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    // 1️⃣ Fetch all orders
    const ordersSnap = await getDocs(collection(db, "orders"));

    const ordersData: Order[] = ordersSnap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));

    setOrders(ordersData);

    // 2️⃣ Get unique userIds who placed orders
    const userIds = Array.from(
      new Set(ordersData.map((o) => o.userId))
    );

    if (userIds.length === 0) return;

    // 3️⃣ Fetch users
    const usersSnap = await getDocs(collection(db, "users"));

    const usersData: Customer[] = usersSnap.docs
      .map((d) => d.data() as any)
      .filter((u) => userIds.includes(u.userId));

    setCustomers(usersData);
  };

  /* ================= OPEN ORDERS ================= */

  const openOrders = (customer: Customer) => {
  router.push(`/orders?userId=${customer.userId}`);
};


  const router = useRouter();


  /* ================= UI ================= */

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
                <th>Orders</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((c) => (
                <tr key={c.userId}>
                  <td>{c.name}</td>
                  <td>
                    {c.phone}
                    <br />
                    {c.email}
                  </td>
                  <td>
                    {
                      orders.filter(
                        (o) => o.userId === c.userId
                      ).length
                    }
                  </td>
                  <td>
                    {c.created_at?.toDate
                      ? c.created_at.toDate().toLocaleDateString()
                      : "-"}
                  </td>

                  {/* ACTION */}
                  <td className="relative">
                    <a
                      className="action-btn"
                      onClick={() =>
                        setOpenActionId(
                          openActionId === c.userId
                            ? null
                            : c.userId
                        )
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

                    {openActionId === c.userId && (
                      <div className="action-option">
                        <ul>
                          <li>
                            <a onClick={() => openOrders(c)}>
                              <i className="far fa-eye mr-2"></i>
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
            overflowY: "auto",
          }}
        >
          <div className="d-flex justify-content-between">
            <h4>Customer Orders</h4>
            <button
              onClick={() => setSelectedCustomer(null)}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "18px",
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
            <strong>Email:</strong> {selectedCustomer.email}
          </p>
          <p>
            <strong>Phone:</strong> {selectedCustomer.phone}
          </p>
          <p>
            <strong>Address:</strong> {selectedCustomer.address}
          </p>

          <hr />

          <h5>Orders</h5>

          {customerOrders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            customerOrders.map((o) => (
              <div
                key={o.id}
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "10px 0",
                }}
              >
                <p>
                  <strong>Order ID:</strong> {o.orderId}
                </p>
                <p>
                  <strong>Total:</strong> ₹{o.totalAmount}
                </p>
                <p>
                  <strong>Status:</strong> {o.status}
                </p>
                <p>
                  <strong>Payment:</strong> {o.paymentMethod}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
