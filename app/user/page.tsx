"use client";

import { useState } from "react";

type UserForm = {
  name: string;
  email: string;
  date: string;
  status: string;
};

export default function UsersPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [formData, setFormData] = useState<UserForm>({
    name: "",
    email: "",
    date: "",
    status: "Pending",
  });
  const [users, setUsers] = useState<UserForm[]>([
  {
    name: "John",
    email: "[email protected]",
    date: "22/06/2022",
    status: "Pending",
  },
]);


 const handleAddUser = () => {
  setUsers((prev) => [...prev, formData]);

  setIsDrawerOpen(false);
  setFormData({
    name: "",
    email: "",
    date: "",
    status: "Pending",
  });
};


  return (
    <>
      {/* ===== PAGE TITLE ===== */}
      <div className="row">
        <div className="colxl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="page-title-wrapper">
            <div className="page-title-box ad-title-box-use">
              <h4 className="page-title">Users</h4>
            </div>

            <div className="ad-breadcrumb">
              <ul>
                <li>
                  <div className="ad-user-btn">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Search Here..."
                    />
                    <svg viewBox="0 0 56.966 56.966">
                      <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z" />
                    </svg>
                  </div>
                </li>

                
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TABLE (UNCHANGED) ===== */}
      <div className="row">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="card table-card">
            <div className="card-header pb-0">
              <h4>User List</h4>
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-styled mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Customer</th>
                      <th>Progress</th>
                      <th>Deliver Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                 <tbody>
  {users.map((u, index) => (
    <tr key={index}>
      <td>{index + 1}</td>

      <td>
        <span className="img-thumb">
          <img src="assets/images/table/1.jpg" alt="" />
          <span className="ml-2">{u.name}</span>
        </span>
      </td>

      <td>
        <div className="progress">
          <div className="progress-bar bg-primary col-3"></div>
        </div>
      </td>

      <td>{u.date}</td>

      <td>
        <label className="mb-0 badge badge-primary">
          {u.status}
        </label>
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
              <a href="#"><i className="far fa-edit mr-2"></i>Active</a>
            </li>
            <li>
              <a href="#"><i className="far fa-trash-alt mr-2"></i>Block</a>
            </li>
          </ul>
        </div>
      </td>
    </tr>
  ))}
</tbody>

                </table>
              </div>

              {/* PAGINATION */}
              <div className="text-right">
                <ul className="pagination mb-0">
                  <li className="page-item disabled">
                    <a className="page-link" href="#"><i className="fas fa-chevron-left"></i></a>
                  </li>
                  <li className="page-item active">
                    <a className="page-link" href="#">1</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">2</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">3</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#"><i className="fas fa-chevron-right"></i></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="ad-footer-btm">
          <p>Copyright 2022 © SplashDash All Rights Reserved.</p>
        </div>
      </div>

     
    </>
  );
}
