import { useContext } from "react";

import { ResultContextInterface, ResultContext } from "./context/ResultContext";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Layout from "./components/layout/Layout";
import CalculateRiskForm from "./components/CalculateRiskForm/CalculateRiskForm";

import "./App.scss";

function App(): JSX.Element {
  const { shares, position, riskAmount, stopLossPrice } = useContext(
    ResultContext
  ) as ResultContextInterface;

  console.log(shares, position, riskAmount, stopLossPrice);

  return (
    <div className="App">
      <Layout>
        <Row>
          <Col>
            <h1 className="text-center">Risk Management</h1>
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
            <h3>Results:</h3>
            <p>
              Shares: <span>{shares}</span>
            </p>
            <p>
              Position value: <span>{position}</span>
            </p>
            <p>
              Stop Loss $: <span>{stopLossPrice}</span>
            </p>
            <p>
              $ at risk: <span>{riskAmount}</span>
            </p>
          </Col>
        </Row>
      </Layout>
    </div>
    // TODO: form validation
    // TODO: splash screen
    // TODO: a11y
    // TODO: i18n
    // TODO: add open positions and recalculate available amount
    // TODO: add total risk over available amount
  );
}

export default App;
