import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Layout from './components/layout/Layout'

import './App.scss'

function App (): JSX.Element {
  return (
  // results
  // shares to buy/sell
  // SL $
  // position value
  // $ at risk

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
            <Form>
              <FloatingLabel
                controlId="available-funds"
                label="Available funds"
                className="mb-3"
              >
                <Form.Control type="number" placeholder="0" />
              </FloatingLabel>

              <FloatingLabel controlId="ticker" label="Ticker" className="mb-3">
                <Form.Control type="text" placeholder="SPY" />
              </FloatingLabel>

              <Row className="mb-3">
                <FloatingLabel
                  as={Col}
                  controlId="get-actual-price"
                  label="Get actual price"
                >
                  {/* Alert on which price is retrieved, if market is closed, etc */}
                  <Form.Control type="number" placeholder="0" />
                </FloatingLabel>
                <Col className="align-self-center">
                  <Button>Get quote</Button>
                </Col>
              </Row>

              <FloatingLabel
                controlId="trade-enter-price"
                label="Trade price"
                className="mb-3"
              >
                <Form.Control type="number" placeholder="0" />
              </FloatingLabel>

              <Form.Group className="mb-3" controlId="trade-direction">
                <Form.Label className="me-3" style={{ paddingLeft: '0.75rem' }}>
                  Trade Direction
                </Form.Label>
                <Form.Check
                  inline
                  label="Long"
                  name="trade-direction"
                  type="radio"
                  id="radio-1"
                />
                <Form.Check
                  inline
                  label="Short"
                  name="trade-direction"
                  type="radio"
                  id="radio-2"
                />
              </Form.Group>

              <FloatingLabel controlId="risk" label="Risk" className="mb-3">
                <Form.Control type="number" placeholder="2%" />
              </FloatingLabel>

              <Row className="mb-3">
                <FloatingLabel
                  as={Col}
                  controlId="risk"
                  label="Stop Loss"
                  className="mb-3"
                >
                  <Form.Control type="number" placeholder="0" />
                </FloatingLabel>
                <Col className='mb-3 align-self-center'>
                   <Form.Check
                    inline
                    label="TS%"
                    name="stop-loss-type"
                    type="radio"
                    id="radio-1"
                  />
                  <Form.Check
                    inline
                    label="Fixed price"
                    name="stop-loss-type"
                    type="radio"
                    id="radio-2"
                  />
                </Col>
              </Row>
              <div className="d-grid gap-2">
              <Button variant="primary" size='lg' type="submit">
                Calculate
              </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Layout>
    </div>
    // TODO: splash screen
    // TODO: i18n
    // TODO: add open positions and recalculate available amount
    // TODO: add total risk over available amount
  )
}

export default App
