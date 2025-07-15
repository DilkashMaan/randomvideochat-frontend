import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';

const cards = [
  { icon: "📘", bg: "#3b5998", label1: "35k Friends", label2: "128 Feeds" },
  { icon: "🐦", bg: "#1da1f2", label1: "584k Followers", label2: "978 Tweets" },
  { icon: "💼", bg: "#0077b5", label1: "758+ Contacts", label2: "365 Feeds" },
  { icon: "🟥", bg: "#db4437", label1: "450 Followers", label2: "57 Circles" },
];

const SocialCards = () => (
  <Row>
    {cards.map((card, i) => (
      <Col md={3} key={i}>
        <Card className="text-white text-center mb-3" style={{ backgroundColor: card.bg }}>
          <Card.Body>
            <h2>{card.icon}</h2>
            <p>{card.label1}</p>
            <p>{card.label2}</p>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
);

export default SocialCards;
