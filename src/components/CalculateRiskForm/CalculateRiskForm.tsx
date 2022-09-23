import { useContext, useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import {
  ResultContextInterface,
  ResultContext,
} from "../../context/ResultContext";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";

const apiKey = process.env.REACT_APP_ALPHA_ADVANTAGE;

const CalculateRiskFormValidationSchema = Yup.object().shape({
  availableFunds: Yup.number()
    .min(1, "Please enter an amount greater than 0")
    .required("Required"),
  ticker: Yup.string().min(3).max(4),
  getActualPrice: Yup.number(),
  tradePrice: Yup.number()
    .positive()
    .min(1, "Please enter an amount greater than 0")
    .required("Required"),
  tradeDirection: Yup.string().length(1).required("Required"),
  risk: Yup.number().moreThan(0).max(100).required("Required"),
  stopLoss: Yup.number().moreThan(0).required("Required"),
  stopLossType: Yup.string().length(1).required("Required"),
});

interface CalculateRiskFormValues {
  availableFunds: number | undefined;
  ticker: string;
  getActualPrice: number | undefined;
  risk: number | undefined;
  tradeDirection: string;
  tradePrice: number | undefined;
  stopLoss: number | undefined;
  stopLossType: string | undefined;
}

const initialValues: CalculateRiskFormValues = {
  availableFunds: undefined,
  ticker: "",
  getActualPrice: undefined,
  risk: undefined,
  tradeDirection: "1",
  tradePrice: undefined,
  stopLoss: undefined,
  stopLossType: "1",
};

// helper
function round(num: number): number {
  const m = Number((Math.abs(num) * 100).toPrecision(15));
  return (Math.round(m) / 100) * Math.sign(num);
}

function CalculateRiskForm(): JSX.Element {
  const {
    setShares,
    setPosition,
    setRiskAmount,
    setStopLossPrice,
    setResultsAvailable,
    setTIA,
    setTradeDirection,
    setRiskPercentage,
  } = useContext(ResultContext) as ResultContextInterface;

  const [data, setData] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const actualPriceRef = useRef<any>();
  const tradePriceRef = useRef<any>();

  const handleGetPrice: (arg0: string) => Promise<void> = async (
    ticker: string
  ) => {
    setLoading(true);
    try {
      if (apiKey) {
        const response = await fetch(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`
        );

        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();
        const price = result["Global Quote"]["05. price"];
        setData(parseFloat(price));
      }
      return;
    } catch (err) {
      console.error(error);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUsePrice: () => void = () => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (actualPriceRef.current && tradePriceRef.current) {
      const getPrice: number = actualPriceRef.current?.getAttribute("value");
      tradePriceRef?.current?.setAttribute("value", getPrice);
    }
  };

  const validate: any = (values: any) => {
    interface errorsInterface {
      [key: string]: any;
    }
    const errors: errorsInterface = {};

    const { tradeDirection, tradePrice, stopLoss, stopLossType } = values;

    if (stopLossType === "2" && tradePrice && stopLoss) {
      // Fixed price SL
      if (tradeDirection === "1" && tradePrice < stopLoss) {
        // Long
        errors.stopLoss = "Stop Price must be smaller than Trade Price";
      }
      if (tradeDirection === "2" && tradePrice > stopLoss) {
        // Short
        errors.stopLoss = "Stop Price must be greater than Trade Price";
      }
      return;
    }

    return errors;
  };

  const onSubmit: any = (values: CalculateRiskFormValues) => {
    const {
      availableFunds,
      risk,
      tradeDirection,
      tradePrice,
      stopLoss,
      stopLossType,
    } = values;

    let sharesToTrade: number = 0;
    let positionValue: number = 0;
    let equityAtRisk: number = 0;
    let stopPrice: number = 0;
    let direction: string | undefined;

    if (
      availableFunds &&
      risk &&
      tradeDirection &&
      tradePrice &&
      stopLoss &&
      stopLossType
    ) {
      if (stopLossType === "1") {
        // Trailing Stop in %
        if (tradeDirection === "1") {
          direction = "BUY";
          stopPrice = round(tradePrice - tradePrice * (stopLoss / 100));
        } else {
          direction = "SELL";
          stopPrice = round(tradePrice + tradePrice * (stopLoss / 100));
        }
      } else {
        stopPrice = stopLoss;
      }

      if (tradeDirection === "1") {
        sharesToTrade = Math.floor(
          (availableFunds * (risk / 100)) / (tradePrice - stopPrice)
        );
      } else {
        sharesToTrade = Math.floor(
          (availableFunds * (risk / 100)) / (stopPrice - tradePrice)
        );
      }

      positionValue = round(sharesToTrade * tradePrice);

      if (tradeDirection === "1") {
        equityAtRisk = round((tradePrice - stopPrice) * sharesToTrade);
      } else {
        equityAtRisk = round((stopPrice - tradePrice) * sharesToTrade);
      }
    }

    setShares(sharesToTrade);
    setPosition(positionValue);
    setRiskAmount(equityAtRisk);
    setStopLossPrice(stopPrice);
    setResultsAvailable(true);
    availableFunds && setTIA(availableFunds);
    direction && setTradeDirection(direction);
    risk && setRiskPercentage(risk);

    return { sharesToTrade, positionValue, equityAtRisk, stopPrice };
  };

  useEffect(() => {
    console.log(`loading`, loading);
  }, [loading]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CalculateRiskFormValidationSchema}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({
        errors,
        touched,
        handleSubmit,
        getFieldProps,
        values,
        dirty,
        isValid,
      }) => (
        <>
          <Form onSubmit={handleSubmit} data-testid="calculate-form">
            <FloatingLabel
              controlId="available-funds"
              label="Available funds"
              className="mb-3"
            >
              <Form.Control
                aria-describedby="available-funds"
                type="number"
                min="0"
                step="any"
                isInvalid={
                  Boolean(errors.availableFunds) && touched.availableFunds
                }
                {...getFieldProps("availableFunds")}
                placeholder="0"
              />

              {Boolean(errors.availableFunds) &&
              touched.availableFunds === true ? (
                <Form.Control.Feedback type="invalid">
                  {errors.availableFunds}
                </Form.Control.Feedback>
              ) : null}
            </FloatingLabel>

            <FloatingLabel controlId="ticker" label="Ticker" className="mb-3">
              <Form.Control
                aria-describedby="ticker"
                type="text"
                placeholder="SPY"
                isInvalid={Boolean(errors.ticker) && touched.ticker}
                {...getFieldProps("ticker")}
              />
              {Boolean(errors.ticker) && touched.ticker === true ? (
                <Form.Control.Feedback type="invalid">
                  {errors.ticker}
                </Form.Control.Feedback>
              ) : null}
            </FloatingLabel>

            <Row className="mb-3">
              <FloatingLabel
                as={Col}
                controlId="get-actual-price"
                // TODO: tooltip with warning icon info
                // Alert on which price is retrieved, if market is closed, etc
                label="Actual price"
              >
                <Form.Control
                  aria-describedby="get-actual-price"
                  type="number"
                  min="0"
                  step="any"
                  {...getFieldProps("getActualPrice")}
                  ref={actualPriceRef}
                  value={data ?? undefined}
                  placeholder="0"
                  disabled
                />
              </FloatingLabel>
              <Col className="align-self-center">
                <Button
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={async () => await handleGetPrice(values.ticker)}
                  disabled={
                    values.ticker.length === 0 ||
                    (Boolean(errors.ticker) && touched.ticker === true)
                  }
                >
                  Get quote
                </Button>
                <Button
                  onClick={handleUsePrice}
                  disabled={!data}
                  className="ms-3"
                >
                  Use this price
                </Button>
              </Col>
            </Row>

            <FloatingLabel
              controlId="trade-enter-price"
              label="Trade price"
              className="mb-3"
            >
              <Form.Control
                aria-describedby="trade-enter-price"
                type="number"
                min="0"
                step="any"
                isInvalid={Boolean(errors.tradePrice) && touched.tradePrice}
                {...getFieldProps("tradePrice")}
                ref={tradePriceRef}
                placeholder="0"
              />
              {Boolean(errors.tradePrice) && touched.tradePrice === true ? (
                <Form.Control.Feedback type="invalid">
                  {errors.tradePrice}
                </Form.Control.Feedback>
              ) : null}
            </FloatingLabel>

            <Form.Group className="mb-3">
              <Form.Label className="me-3" style={{ paddingLeft: "0.75rem" }}>
                Trade Direction
              </Form.Label>
              <Form.Check
                inline
                id="radio-1"
                label="Long"
                type="radio"
                isInvalid={
                  Boolean(errors.tradeDirection) && touched.tradeDirection
                }
                {...getFieldProps("tradeDirection")}
                value="1"
              />
              <Form.Check
                inline
                id="radio-2"
                label="Short"
                type="radio"
                isInvalid={
                  Boolean(errors.tradeDirection) && touched.tradeDirection
                }
                {...getFieldProps("tradeDirection")}
                value="2"
              />
              {Boolean(errors.tradeDirection) &&
              touched.tradeDirection === true ? (
                <Form.Control.Feedback type="invalid">
                  {errors.tradeDirection}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>

            <FloatingLabel controlId="risk" label="Risk" className="mb-3">
              <Form.Control
                type="number"
                min="0"
                step="any"
                isInvalid={Boolean(errors.risk) && touched.risk}
                {...getFieldProps("risk")}
                placeholder="2%"
              />
              {Boolean(errors.risk) && touched.risk === true ? (
                <Form.Control.Feedback type="invalid">
                  {errors.risk}
                </Form.Control.Feedback>
              ) : null}
            </FloatingLabel>

            <Row className="mb-3">
              <FloatingLabel
                as={Col}
                controlId="stopLoss"
                label="Stop Loss"
                className="mb-3"
              >
                <Form.Control
                  type="number"
                  min="0"
                  step="any"
                  isInvalid={Boolean(errors.stopLoss) && touched.stopLoss}
                  {...getFieldProps("stopLoss")}
                  placeholder="0"
                />
                {Boolean(errors.stopLoss) && touched.stopLoss === true ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.stopLoss}
                  </Form.Control.Feedback>
                ) : null}
              </FloatingLabel>
              <Col className="mb-3 align-self-center">
                <Form.Check
                  inline
                  id="radio-1"
                  type="radio"
                  label="TS%"
                  isInvalid={
                    Boolean(errors.stopLossType) && touched.stopLossType
                  }
                  {...getFieldProps("stopLossType")}
                  value="1"
                />
                <Form.Check
                  inline
                  id="radio-2"
                  type="radio"
                  label="Fixed price"
                  isInvalid={
                    Boolean(errors.stopLossType) && touched.stopLossType
                  }
                  {...getFieldProps("stopLossType")}
                  value="2"
                />
              </Col>
            </Row>

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={!(isValid && dirty)}
              >
                Calculate
              </Button>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
}

export default CalculateRiskForm;
