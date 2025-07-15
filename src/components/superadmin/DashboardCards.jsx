import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';

const stats = [
  { title: "Welcome", value: 2500, icon: "👋" },
  { title: "Average Time", value: 123.5, icon: "⏱️" },
  { title: "Collections", value: 1805, icon: "📥" },
  { title: "Comments", value: 54, icon: "💬" },
];

const DashboardCards = () => (
  <Row className="my-4">
    {stats.map((item, i) => (
      <Col md={3} key={i}>
        <Card className="text-center shadow-sm">
          <Card.Body>
            <h1>{item.icon}</h1>
            <h5>{item.value}</h5>
            <small>{item.title}</small>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
);

export default DashboardCards;
