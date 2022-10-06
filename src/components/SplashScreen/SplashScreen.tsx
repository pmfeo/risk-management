import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Spinner } from "react-bootstrap";

import styles from "./SplashScreen.module.scss";

function SplashScreen(): JSX.Element {
  return (
    <Container className={`${styles["full-centered"]} text-bg-primary`} fluid>
      <Row>
        <Col>
          <div className="mb-3 text-capitalize fs-3 fw-bold fst-italic">
            Risk Management
            <br />
            <span className="fs-1">

            Trade Position Calculator
            </span>
          </div>
          <Spinner animation="border" data-testid="spinner" />
        </Col>
      </Row>
    </Container>
  );
}

export default SplashScreen;
