import { useState, useEffect } from "react";

import Fade from "react-bootstrap/Fade";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Layout from "./components/layout/Layout";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import CalculateRiskForm from "./components/CalculateRiskForm/CalculateRiskForm";
import CalculateRiskResults from "./components/CalculateRiskResults/CalculateRiskResults";

import "./App.scss";

function App(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFadeIn(true);
      setLoading(false);
    }, 1000);
  }, [loading]);

  if (loading) {
    return (
      <Fade in={loading}>
        <SplashScreen />
      </Fade>
    );
  } else {
    return (
      <Fade
        in={fadeIn}
        // timeout={900}
        // appear
      >
        <div className="App">
          <Layout>
            <Row>
              <Col>
                <h1 className="mb-3 mt-3 text-center">Risk Management</h1>
              </Col>
            </Row>
            <Row>
              <Col>
                <h2>Enter your trade info below</h2>
                <CalculateRiskForm />
              </Col>
            </Row>
            <Row>
              <Col>
                <CalculateRiskResults />
              </Col>
            </Row>
          </Layout>
        </div>
      </Fade>
    );
  }

  // TODO: splash screen
  // TODO: results animation
  // TODO: get quote from API
  // TODO: a11y
  // TODO: i18n
  // TODO: add open positions and recalculate available amount
  // TODO: add total risk over available amount
}

export default App;
