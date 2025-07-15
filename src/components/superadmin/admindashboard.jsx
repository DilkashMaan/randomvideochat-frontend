import React, { useState, useEffect } from 'react';

const PaymentPlans = () => {
  // State for different sections
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data fetch - in a real app, you'd call your backend API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock users data
      setUsers([
        { id: 1, email: 'user1@example.com', gender: 'male', premium: false, lastActive: '2023-05-15T10:30:00Z' },
        { id: 2, email: 'user2@example.com', gender: 'female', premium: true, lastActive: '2023-05-15T11:15:00Z' },
        { id: 3, email: 'user3@example.com', gender: 'unspecified', premium: false, lastActive: '2023-05-14T09:45:00Z' },
      ]);

      // Mock reports data
      setReports([
        { id: 1, reporterId: 1, reportedId: 3, reason: 'Inappropriate behavior', status: 'pending', timestamp: '2023-05-15T10:45:00Z' },
        { id: 2, reporterId: 2, reportedId: 1, reason: 'Spam', status: 'resolved', timestamp: '2023-05-14T15:20:00Z' },
      ]);

      // Mock analytics data
      setAnalytics({
        totalUsers: 1250,
        premiumUsers: 320,
        genderRatio: { male: 45, female: 40, unspecified: 15 },
        dailyActiveUsers: 850,
        avgSessionTime: '12 minutes',
        skipStats: { maleSkips: 1200, femaleSkips: 300 }
      });

      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle premium status
  const togglePremium = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, premium: !user.premium } : user
    ));
  };

  // Update report status
  const updateReportStatus = (reportId, newStatus) => {
    setReports(reports.map(report => 
      report.id === reportId ? { ...report, status: newStatus } : report
    ));
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Video Chat Admin Panel</h1>
      </header>

      <nav style={styles.nav}>
        <button 
          style={activeTab === 'users' ? { ...styles.navButton, ...styles.activeNavButton } : styles.navButton}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          style={activeTab === 'reports' ? { ...styles.navButton, ...styles.activeNavButton } : styles.navButton}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
        <button 
          style={activeTab === 'analytics' ? { ...styles.navButton, ...styles.activeNavButton } : styles.navButton}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </nav>

      <main style={styles.main}>
        {isLoading ? (
          <div style={styles.loading}>Loading...</div>
        ) : (
          <>
            {activeTab === 'users' && (
              <div>
                <div style={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder="Search users by email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                  />
                </div>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Gender</th>
                      <th style={styles.th}>Premium</th>
                      <th style={styles.th}>Last Active</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} style={styles.tr}>
                        <td style={styles.td}>{user.id}</td>
                        <td style={styles.td}>{user.email}</td>
                        <td style={styles.td}>{user.gender}</td>
                        <td style={styles.td}>{user.premium ? 'Yes' : 'No'}</td>
                        <td style={styles.td}>{formatDate(user.lastActive)}</td>
                        <td style={styles.td}>
                          <button 
                            style={user.premium ? styles.demoteButton : styles.promoteButton}
                            onClick={() => togglePremium(user.id)}
                          >
                            {user.premium ? 'Demote' : 'Promote'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reports' && (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Reporter</th>
                    <th style={styles.th}>Reported</th>
                    <th style={styles.th}>Reason</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Timestamp</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(report => (
                    <tr key={report.id} style={styles.tr}>
                      <td style={styles.td}>{report.id}</td>
                      <td style={styles.td}>User #{report.reporterId}</td>
                      <td style={styles.td}>User #{report.reportedId}</td>
                      <td style={styles.td}>{report.reason}</td>
                      <td style={styles.td}>{report.status}</td>
                      <td style={styles.td}>{formatDate(report.timestamp)}</td>
                      <td style={styles.td}>
                        {report.status === 'pending' && (
                          <>
                            <button 
                              style={styles.resolveButton}
                              onClick={() => updateReportStatus(report.id, 'resolved')}
                            >
                              Resolve
                            </button>
                            <button 
                              style={styles.rejectButton}
                              onClick={() => updateReportStatus(report.id, 'rejected')}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'analytics' && (
              <div style={styles.analyticsContainer}>
                <div style={styles.analyticsCard}>
                  <h3>User Statistics</h3>
                  <p>Total Users: {analytics.totalUsers}</p>
                  <p>Premium Users: {analytics.premiumUsers} ({Math.round((analytics.premiumUsers / analytics.totalUsers) * 100)}%)</p>
                  <p>Daily Active Users: {analytics.dailyActiveUsers}</p>
                </div>

                <div style={styles.analyticsCard}>
                  <h3>Gender Ratio</h3>
                  <p>Male: {analytics.genderRatio?.male}%</p>
                  <p>Female: {analytics.genderRatio?.female}%</p>
                  <p>Unspecified: {analytics.genderRatio?.unspecified}%</p>
                </div>

                <div style={styles.analyticsCard}>
                  <h3>Session Data</h3>
                  <p>Average Session Time: {analytics.avgSessionTime}</p>
                </div>

                <div style={styles.analyticsCard}>
                  <h3>Skip Statistics</h3>
                  <p>Male Skips: {analytics.skipStats?.maleSkips}</p>
                  <p>Female Skips: {analytics.skipStats?.femaleSkips}</p>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

// Basic styling using inline styles
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    backgroundColor: '#4a76a8',
    color: 'white',
    padding: '20px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  nav: {
    display: 'flex',
    marginBottom: '20px',
    gap: '10px',
  },
  navButton: {
    padding: '10px 15px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  activeNavButton: {
    backgroundColor: '#4a76a8',
    color: 'white',
  },
  main: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
  },
  searchContainer: {
    marginBottom: '20px',
  },
  searchInput: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#4a76a8',
    color: 'white',
    padding: '12px',
    textAlign: 'left',
  },
  tr: {
    borderBottom: '1px solid #ddd',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  td: {
    padding: '12px',
  },
  promoteButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  demoteButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  resolveButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
    marginRight: '5px',
  },
  rejectButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  analyticsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  analyticsCard: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '5px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
};

export default PaymentPlans;