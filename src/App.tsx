import { useState, useEffect, useContext } from "react";

import { CSSTransition, TransitionGroup } from "react-transition-group";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Layout from "./components/layout/Layout";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import CalculateRiskForm from "./components/CalculateRiskForm/CalculateRiskForm";
import CalculateRiskResults from "./components/CalculateRiskResults/CalculateRiskResults";

import "./App.scss";
import { Button, Modal } from "react-bootstrap";
import { ResultContext, ResultContextInterface } from "./context/ResultContext";

function App(): JSX.Element {
  const { resultsAvailable, setResultsAvailable } = useContext(
    ResultContext
  ) as ResultContextInterface;

  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  const handleClose = (): void => {
    setResultsAvailable(false)
    setShow(false)
  };
  // const handleShow = (): void => setShow(true);

  useEffect(() => {
    // splash screen duration
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [loading]);

  useEffect(() => {
    // show results
    if (resultsAvailable) {
      setShow(true);
    }
  }, [resultsAvailable]);

  return (
    <TransitionGroup>
      {loading ? (
        <SplashScreen />
      ) : (
        <CSSTransition timeout={250} classNames="item">
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
                  {/* <Button variant="primary" onClick={handleShow}>
                    Launch demo modal
                  </Button> */}

                  <Modal show={show} onHide={handleClose}>
                    <Modal.Body className="p-4">
                      <CalculateRiskResults />
                    </Modal.Body>
                    <Modal.Footer style={{border: 0}}>
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </Col>
              </Row>
            </Layout>
          </div>
        </CSSTransition>
      )}
    </TransitionGroup>
  );
}

// TODO: results animation
// TODO: get quote from API
// TODO: a11y
// TODO: i18n
// TODO: add open positions and recalculate available amount
// TODO: add total risk over available amount

export default App;
