import React, { useState } from "react";
import "./style/adminLayout.css";

// Fixed user data with unique IDs
const users = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    status: "active",
    subscription: "Premium",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    status: "banned",
    subscription: "Free",
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    status: "pending",
    subscription: "Free",
  },
  {
    id: 4,
    name: "Diana Prince",
    email: "diana@example.com",
    status: "active",
    subscription: "Premium",
  },
  {
    id: 5,
    name: "Eva Green",
    email: "eva@example.com",
    status: "active",
    subscription: "Free",
  },
  {
    id: 6,
    name: "Frank White",
    email: "frank@example.com",
    status: "banned",
    subscription: "Free",
  },
  {
    id: 7,
    name: "Grace Lee",
    email: "grace@example.com",
    status: "pending",
    subscription: "Premium",
  },
  {
    id: 8,
    name: "Henry Ford",
    email: "henry@example.com",
    status: "active",
    subscription: "Free",
  },
  {
    id: 9,
    name: "Ivy Chen",
    email: "ivy@example.com",
    status: "active",
    subscription: "Premium",
  },
  {
    id: 10,
    name: "Jack Black",
    email: "jack@example.com",
    status: "banned",
    subscription: "Free",
  },
  {
    id: 11,
    name: "Karen Smith",
    email: "karen@example.com",
    status: "pending",
    subscription: "Free",
  },
  {
    id: 12,
    name: "Liam Brown",
    email: "liam@example.com",
    status: "active",
    subscription: "Premium",
  }
];

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Calculate pagination data
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  // Pagination handlers
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // const goToPage = (page) => {
  //   if (page >= 1 && page <= totalPages) {
  //     setCurrentPage(page);
  //   }
  // };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="description">
        View active users, flagged reports, and manage subscriptions.
      </p>

          <div className="card-grid">
         <div className="card">
           <h3>
             <img src="../home-images/active-user.png" alt="Active Users" />Active Users
           </h3>
           <p className="card-value">1,248</p>
         </div>
         <div className="card">
           <h3>
             <img src="../home-images/report.png" alt="Flagged Reports" />Flagged Reports
           </h3>
           <p className="card-value red">7</p>
         </div>
         <div className="card">
           <h3>
             <img src="../home-images/wallet.png" alt="Payment Status" />Payment Status
           </h3>
           <p className="card-value orange">12</p>
         </div>
       </div>

      <div className="table-section">
        <h2>User Management</h2>
        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Subscription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status status-${user.status}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  {/* <td>{user.subscription}</td> */}
                  <td>
                    {user.subscription === "Free" ? (
                      <button className="btn btn-sm btn-blue">Free</button>
                    ) : (
                      <button className="btn btn-sm btn-premium">Premium</button>
                    )}
                  </td>

                  <td>
                    {/* <button className="btn btn-sm btn-primary">Edit</button> */}
                    {user.subscription === "Free" ? (
                      <button className="btn btn-sm btn-green">Upgrade</button>
                    ) : (
                      <button className="btn btn-sm btn-down">Downgrade</button>
                    )}

                    {user.status === "banned" ? (
                      <button className="btn btn-sm btn-unban">UnBan</button>
                    ) : (
                      <button className="btn btn-sm btn-danger">Ban</button>
                    )}


                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
        <div className="pagination">
  <button
    onClick={handlePrev}
    disabled={currentPage === 1}
    className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}
  >
    Previous
  </button>

  <span className="page-info">
    Page {currentPage} of {totalPages}
  </span>

  <button
    onClick={handleNext}
    disabled={currentPage === totalPages}
    className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`}
  >
    Next
  </button>
</div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;