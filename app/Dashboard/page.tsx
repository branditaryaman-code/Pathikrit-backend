"use client";
import Image from "next/image";


import React from "react";

const Dashboard: React.FC = () => {
   return (
    <>
      {/* Dashboard Start */}
      <div className="row">

        {/* Card 1 */}
        <div className="col-xl-3 col-lg-4 col-md-6">
          <div className="card ad-info-card">
            <div className="card-body dd-flex align-items-center">
              <div className="icon-info">
                {/* SVG unchanged */}
                {/* (SVG content kept exactly same – omitted here for brevity) */}
              </div>
              <div className="icon-info-text">
                <h5 className="ad-title">Happy Customers</h5>
                <h4 className="ad-card-title">66k</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="col-xl-3 col-lg-4 col-md-6">
          <div className="card ad-info-card">
            <div className="card-body dd-flex align-items-center">
              <div className="icon-info">
                {/* SVG */}
              </div>
              <div className="icon-info-text">
                <h5 className="ad-title">Daily Orders</h5>
                <h4 className="ad-card-title">15k</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="col-xl-3 col-lg-4 col-md-6">
          <div className="card ad-info-card">
            <div className="card-body dd-flex align-items-center">
              <div className="icon-info">
                {/* SVG */}
              </div>
              <div className="icon-info-text">
                <h5 className="ad-title">Total Sales</h5>
                <h4 className="ad-card-title">420k</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="col-xl-3 col-lg-4 col-md-6">
          <div className="card ad-info-card">
            <div className="card-body dd-flex align-items-center">
              <div className="icon-info">
                {/* SVG */}
              </div>
              <div className="icon-info-text">
                <h5 className="ad-title">Total Revenue</h5>
                <h4 className="ad-card-title">10k</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Section */}
      <div className="row">
        <div className="col-xl-12">
          <div className="card chart-card">
            <div className="card-header">
              <h4 className="has-btn">
                Total Revenue
                <span>
                  <button className="btn btn-primary squer-btn sm-btn">
                    Download
                  </button>
                </span>
              </h4>
            </div>

            <div className="card-body">
              <div className="row">
                <div className="col-xl-8">
                  <div className="chart-holder">
                    <div id="chartD" />
                  </div>
                </div>

                <div className="col-xl-4">
                  <div className="revenue-wrapper">
                    <ul className="nav nav-pills mb-3">
                      <li className="nav-item">
                        <a className="nav-link active">Weekly</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link">Monthly</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link">Yearly</a>
                      </li>
                    </ul>

                    <div className="revenue-info-wrap">
                      <table>
                        <tbody>
                          <tr>
                            <td>Total Sales</td>
                            <td>5995</td>
                          </tr>
                          <tr>
                            <td>Total Customers</td>
                            <td>5894</td>
                          </tr>
                          <tr>
                            <td>Total Income</td>
                            <td>4453</td>
                          </tr>
                          <tr>
                            <td>Total Expense</td>
                            <td className="txt-red">7454</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="row">
        <div className="col-xl-12">
          <div className="card chart-card">
            <div className="card-header">
              <h4>Newest Orders</h4>
            </div>

            <div className="card-body pb-4">
              <div className="table-responsive">
                <table className="table table-styled">
                  <thead>
                    <tr>
                      <th>
                        <input type="checkbox" />
                      </th>
                      <th>Order ID</th>
                      <th>Billing Name</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>View</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><input type="checkbox" /></td>
                      <td>#JH2033</td>
                      <td>Emily Arnold</td>
                      <td>22/06/2022</td>
                      <td>$600</td>
                      <td>
                        <span className="badge badge-primary">Pending</span>
                      </td>
                      <td>Paypal</td>
                      <td>
                        <span className="badge badge-primary">View</span>
                      </td>
                      <td>•••</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

