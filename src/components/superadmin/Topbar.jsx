import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const Topbar = () => {
  return (
    <Navbar bg="dark" variant="dark" className="px-4 justify-content-between">
      <Navbar.Brand>🚀 Pluto</Navbar.Brand>
      <Nav>
        <Nav.Link>🔔</Nav.Link>
        <Nav.Link>📧</Nav.Link>
        <Nav.Link>
          <img src="https://via.placeholder.com/30" alt="User" className="rounded-circle" /> John David ⏷
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default Topbar;
