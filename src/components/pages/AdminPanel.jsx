import React from 'react';
import { Container, Row, Col, Card, Nav, ListGroup, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={3} lg={2} className="bg-dark text-white vh-100 p-3">
          <div className="d-flex flex-column h-100">
            <div className="mb-4">
              <h4 className="text-center mb-4">Admin Panel</h4>
              <div className="text-center mb-4">
                <div className="bg-secondary rounded-circle d-inline-block p-3 mb-2">
                  <i className="bi bi-person-fill fs-3"></i>
                </div>
                <h5>John David</h5>
                <small className="text-success">
                  <i className="bi bi-circle-fill me-1"></i> Online
                </small>
              </div>
            </div>

            <Nav className="flex-column mb-auto">
              <h6 className="text-muted mb-2">General</h6>
              <Nav.Link href="#" className="text-white active">
                <i className="bi bi-speedometer2 me-2"></i> Dashboard
              </Nav.Link>
              <Nav.Link href="#" className="text-white">
                <i className="bi bi-grid me-2"></i> Widgets
              </Nav.Link>
              <Nav.Link href="#" className="text-white">
                <i className="bi bi-collection me-2"></i> Elements
              </Nav.Link>
              <Nav.Link href="#" className="text-white">
                <i className="bi bi-table me-2"></i> Tables
              </Nav.Link>
              <Nav.Link href="#" className="text-white">
                <i className="bi bi-app-indicator me-2"></i> Apps
              </Nav.Link>
              <Nav.Link href="#" className="text-white">
                <i className="bi bi-tags me-2"></i> Pricing Tables
              </Nav.Link>
              <Nav.Link href="#" className="text-white">
                <i className="bi bi-person-lines-fill me-2"></i> Contact
              </Nav.Link>
              <Nav.Link href="#" className="text-white">
                <i className="bi bi-file-earmark me-2"></i> Additional Pages
              </Nav.Link>
              <Nav.Link href="#" className="text-white">
                <i className="bi bi-map me-2"></i> Map
              </Nav.Link>
              <Nav.Link href="#" className="text-white">
                <i className="bi bi-bar-chart-line me-2"></i> Charts
              </Nav.Link>
              <Nav.Link href="#" className="text-white">
                <i className="bi bi-gear me-2"></i> Settings
              </Nav.Link>
            </Nav>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={9} lg={10} className="p-4">
          <h2 className="mb-4">Dashboard</h2>
          
          {/* Stats Cards */}
          <Row className="mb-4">
            <Col md={6} lg={3} className="mb-3">
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted">Welcome</h6>
                      <h4>2,500</h4>
                    </div>
                    <div className="bg-primary bg-opacity-10 p-3 rounded">
                      <i className="bi bi-people-fill text-primary fs-4"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} lg={3} className="mb-3">
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted">Revenue</h6>
                      <h4>$123.50</h4>
                    </div>
                    <div className="bg-success bg-opacity-10 p-3 rounded">
                      <i className="bi bi-currency-dollar text-success fs-4"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} lg={3} className="mb-3">
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted">Average Time</h6>
                      <h4>1,805</h4>
                    </div>
                    <div className="bg-warning bg-opacity-10 p-3 rounded">
                      <i className="bi bi-clock-fill text-warning fs-4"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} lg={3} className="mb-3">
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted">Collections</h6>
                      <h4>54</h4>
                    </div>
                    <div className="bg-info bg-opacity-10 p-3 rounded">
                      <i className="bi bi-collection-fill text-info fs-4"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Reviews Section */}
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">0 customers reviews</h5>
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="bi bi-plus"></i> Add Review
                </button>
              </div>
              <div className="text-center py-5">
                <i className="bi bi-chat-square-text fs-1 text-muted"></i>
                <p className="text-muted">No reviews yet</p>
              </div>
            </Card.Body>
          </Card>

          {/* Social Stats */}
          <Row>
            <Col md={6} className="mb-4">
              <Card>
                <Card.Body>
                  <h5 className="mb-3">Social Stats</h5>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <div>
                        <i className="bi bi-people-fill text-primary me-2"></i>
                        <span>Friends</span>
                      </div>
                      <span className="badge bg-primary rounded-pill">128</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <div>
                        <i className="bi bi-newspaper text-success me-2"></i>
                        <span>Feeds</span>
                      </div>
                      <span className="badge bg-success rounded-pill">584k</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <div>
                        <i className="bi bi-person-plus-fill text-info me-2"></i>
                        <span>Followers</span>
                      </div>
                      <span className="badge bg-info rounded-pill">978</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <div>
                        <i className="bi bi-twitter text-primary me-2"></i>
                        <span>Tweets</span>
                      </div>
                      <span className="badge bg-primary rounded-pill">758+</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card>
                <Card.Body>
                  <h5 className="mb-3">Network</h5>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <div>
                        <i className="bi bi-person-lines-fill text-warning me-2"></i>
                        <span>Contacts</span>
                      </div>
                      <span className="badge bg-warning rounded-pill">365</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <div>
                        <i className="bi bi-rss-fill text-danger me-2"></i>
                        <span>Feeds</span>
                      </div>
                      <span className="badge bg-danger rounded-pill">450</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <div>
                        <i className="bi bi-google text-success me-2"></i>
                        <span>Followers</span>
                      </div>
                      <span className="badge bg-success rounded-pill">57</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <div>
                        <i className="bi bi-circle-fill text-info me-2"></i>
                        <span>Circles</span>
                      </div>
                      <span className="badge bg-info rounded-pill">57</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Extra Area Chart Placeholder */}
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Extra Area Chart</h5>
                <span className="badge bg-secondary">35k</span>
              </div>
              <div className="bg-light p-5 rounded text-center">
                <i className="bi bi-bar-chart-line fs-1 text-muted"></i>
                <p className="text-muted mt-2 mb-0">Chart will appear here</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;