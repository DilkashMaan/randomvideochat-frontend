import React from 'react';
import { Card, Button, Badge, Dropdown } from 'react-bootstrap';
import { FaUsers, FaFlag, FaCreditCard, FaChartPie, FaUserShield, FaTransgender, FaForward, FaHeart } from 'react-icons/fa';
import './Sidebar.css';

const dataSummary = [
  { icon: <FaUsers />, label: 'Active Users', value: 3421, color: 'primary' },
  { icon: <FaFlag />, label: 'Flagged Reports', value: 18, color: 'danger' },
  { icon: <FaCreditCard />, label: 'Payments', value: '$3.4k', color: 'success' },
  { icon: <FaChartPie />, label: 'Conversion Rate', value: '27%', color: 'info' },
  { icon: <FaUserShield />, label: 'Premium Users', value: 781, color: 'warning' },
  { icon: <FaTransgender />, label: 'Gender Ratio', value: '60% M / 40% F', color: 'secondary' },
  { icon: <FaForward />, label: 'Skips', value: 124, color: 'dark' },
  { icon: <FaHeart />, label: 'Matches', value: 384, color: 'pink' }
];

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="header-section">
        <h2>🧑‍💻 Admin Panel</h2>
        <p>Overview of user activity, reports, payments, and subscriptions.</p>
      </div>

      <div className="card-section">
        {dataSummary.map((item, index) => (
          <Card key={index} className={`dashboard-card ${item.color}`}>
            <div className="icon-container">{item.icon}</div>
            <div className="card-details">
              <h4>{item.value}</h4>
              <p>{item.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="filter-section">
        <h5>Manage Subscriptions</h5>
        <Dropdown>
          <Dropdown.Toggle variant="primary">Actions</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Promote to Premium</Dropdown.Item>
            <Dropdown.Item>Demote from Premium</Dropdown.Item>
            <Dropdown.Item>Ban User</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="order-card-section">
        <Card className="order-card">
          <Card.Body>
            <div className="order-header">
              <h6>User: Alex Trie</h6>
              <Badge bg="info">New</Badge>
            </div>
            <p><strong>Email:</strong> alex@example.com</p>
            <p><strong>Status:</strong> Premium</p>
            <p><strong>Recent Activity:</strong> Skipped 3 sessions</p>
            <Button variant="outline-dark">View Details</Button>
          </Card.Body>
        </Card>

        <Card className="order-card">
          <Card.Body>
            <div className="order-header">
              <h6>User: Jerome Bell</h6>
              <Badge bg="warning">Flagged</Badge>
            </div>
            <p><strong>Email:</strong> jerome@example.com</p>
            <p><strong>Status:</strong> Free</p>
            <p><strong>Reports:</strong> 2 flagged chats</p>
            <Button variant="outline-dark">Review Reports</Button>
          </Card.Body>
        </Card>

        <Card className="order-card">
          <Card.Body>
            <div className="order-header">
              <h6>User: Annette Black</h6>
              <Badge bg="success">Active</Badge>
            </div>
            <p><strong>Email:</strong> annette@example.com</p>
            <p><strong>Status:</strong> Premium</p>
            <p><strong>Matches:</strong> 12 matches this week</p>
            <Button variant="outline-dark">User Details</Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
