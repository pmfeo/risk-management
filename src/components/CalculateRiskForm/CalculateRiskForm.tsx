/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { useContext } from "react";
import { useFormik } from "formik";
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

const CalculateRiskFormValidationSchema = Yup.object().shape({
  availableFunds: Yup.number()
    .min(1, "Please enter an amount greater than 0")
    .required("Required"),
  ticker: Yup.string().min(3).max(4),
  getActualPrice: Yup.number(),
  tradePrice: Yup.number()
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

// utility
function round(num: number): number {
  const m = Number((Math.abs(num) * 100).toPrecision(15));
  return (Math.round(m) / 100) * Math.sign(num);
}

function CalculateRiskForm(): JSX.Element {
  const { setShares, setPosition, setRiskAmount, setStopLossPrice } =
    useContext(ResultContext) as ResultContextInterface;

  const formik = useFormik({
    initialValues,
    validationSchema: CalculateRiskFormValidationSchema,
    validate: (values) => {
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
    },
    onSubmit: (values) => {
      console.log(values);
      console.log(formik);

      const {
        availableFunds,
        risk,
        tradeDirection,
        tradePrice,
        stopLoss,
        stopLossType,
      } = values;

      let sharesToBuy: number = 0;
      let positionValue: number = 0;
      let equityAtRisk: number = 0;
      let stopPrice: number = 0;

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
            // Long
            stopPrice = round(tradePrice - tradePrice * (stopLoss / 100));
          } else {
            // Short
            stopPrice = round(tradePrice + tradePrice * (stopLoss / 100));
          }
        } else {
          stopPrice = stopLoss;
        }

        if (tradeDirection === "1") {
          sharesToBuy = Math.floor(
            (availableFunds * (risk / 100)) / (tradePrice - stopPrice)
          );
        } else {
          sharesToBuy = Math.floor(
            (availableFunds * (risk / 100)) / (stopPrice - tradePrice)
          );
        }

        positionValue = round(sharesToBuy * tradePrice);

        if (tradeDirection === "1") {
          equityAtRisk = round((tradePrice - stopPrice) * sharesToBuy);
        } else {
          equityAtRisk = round((stopPrice - tradePrice) * sharesToBuy);
        }

        setShares(sharesToBuy);
        setPosition(positionValue);
        setRiskAmount(equityAtRisk);
        setStopLossPrice(stopPrice);
      }
    },
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <FloatingLabel
        controlId="available-funds"
        label="Available funds"
        className="mb-3"
      >
        <Form.Control
          type="number"
          min="0"
          isInvalid={
            Boolean(formik.errors.availableFunds) &&
            formik.touched.availableFunds
          }
          {...formik.getFieldProps("availableFunds")}
          placeholder="0"
        />
        {Boolean(formik.errors.availableFunds) &&
        formik.touched.availableFunds === true ? (
          <Form.Control.Feedback type="invalid">
            {formik.errors.availableFunds}
          </Form.Control.Feedback>
        ) : null}
      </FloatingLabel>

      <FloatingLabel controlId="ticker" label="Ticker" className="mb-3">
        {/* search and retrieve data for price */}
        <Form.Control
          type="text"
          placeholder="SPY"
          isInvalid={Boolean(formik.errors.ticker) && formik.touched.ticker}
          {...formik.getFieldProps("ticker")}
        />
        {Boolean(formik.errors.ticker) && formik.touched.ticker === true ? (
          <Form.Control.Feedback type="invalid">
            {formik.errors.ticker}
          </Form.Control.Feedback>
        ) : null}
      </FloatingLabel>

      <Row className="mb-3">
        <FloatingLabel
          as={Col}
          controlId="get-actual-price"
          label="Get actual price"
        >
          {/* Alert on which price is retrieved, if market is closed, etc */}
          <Form.Control
            type="number"
            min="0"
            {...formik.getFieldProps("getActualPrice")}
            placeholder="0"
            disabled
          />
        </FloatingLabel>
        <Col className="align-self-center">
          <Button
            onClick={async () => {
              formik.setFieldValue("getActualPrice", 123);
              await Promise.resolve();
            }}
          >
            Get quote
          </Button>
        </Col>
      </Row>

      <FloatingLabel
        controlId="trade-enter-price"
        label="Trade price"
        className="mb-3"
      >
        <Form.Control
          type="number"
          min="0"
          isInvalid={
            Boolean(formik.errors.tradePrice) && formik.touched.tradePrice
          }
          {...formik.getFieldProps("tradePrice")}
          placeholder="0"
        />
        {Boolean(formik.errors.tradePrice) &&
        formik.touched.tradePrice === true ? (
          <Form.Control.Feedback type="invalid">
            {formik.errors.tradePrice}
          </Form.Control.Feedback>
        ) : null}
      </FloatingLabel>

      <Form.Group className="mb-3" controlId="trade-direction">
        <Form.Label className="me-3" style={{ paddingLeft: "0.75rem" }}>
          Trade Direction
        </Form.Label>
        <Form.Check
          inline
          id="radio-1"
          label="Long"
          type="radio"
          isInvalid={
            Boolean(formik.errors.tradeDirection) &&
            formik.touched.tradeDirection
          }
          {...formik.getFieldProps("tradeDirection")}
          value="1"
        />
        <Form.Check
          inline
          id="radio-2"
          label="Short"
          type="radio"
          isInvalid={
            Boolean(formik.errors.tradeDirection) &&
            formik.touched.tradeDirection
          }
          {...formik.getFieldProps("tradeDirection")}
          value="2"
        />
        {Boolean(formik.errors.tradeDirection) &&
        formik.touched.tradeDirection === true ? (
          <Form.Control.Feedback type="invalid">
            {formik.errors.tradeDirection}
          </Form.Control.Feedback>
        ) : null}
      </Form.Group>

      <FloatingLabel controlId="risk" label="Risk" className="mb-3">
        <Form.Control
          type="number"
          min="0"
          isInvalid={Boolean(formik.errors.risk) && formik.touched.risk}
          {...formik.getFieldProps("risk")}
          placeholder="2%"
        />
        {Boolean(formik.errors.risk) && formik.touched.risk === true ? (
          <Form.Control.Feedback type="invalid">
            {formik.errors.risk}
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
            isInvalid={
              Boolean(formik.errors.stopLoss) && formik.touched.stopLoss
            }
            {...formik.getFieldProps("stopLoss")}
            placeholder="0"
          />
          {Boolean(formik.errors.stopLoss) &&
          formik.touched.stopLoss === true ? (
            <Form.Control.Feedback type="invalid">
              {formik.errors.stopLoss}
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
              Boolean(formik.errors.stopLossType) && formik.touched.stopLossType
            }
            {...formik.getFieldProps("stopLossType")}
            value="1"
          />
          <Form.Check
            inline
            id="radio-2"
            type="radio"
            label="Fixed price"
            isInvalid={
              Boolean(formik.errors.stopLossType) && formik.touched.stopLossType
            }
            {...formik.getFieldProps("stopLossType")}
            value="2"
          />
        </Col>
      </Row>

      <div className="d-grid gap-2">
        <Button variant="primary" size="lg" type="submit">
          Calculate
        </Button>
      </div>
    </Form>
  );
}

export default CalculateRiskForm;
