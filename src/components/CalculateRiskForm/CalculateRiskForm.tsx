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
});

interface CalculateRiskFormValues {
  availableFunds: number | undefined;
  ticker: string;
  getActualPrice: number | undefined;
  risk: number | undefined;
  tradePrice: number | undefined;
  stopLoss: number | undefined;
  stopLossType: string | undefined;
}

const initialValues: CalculateRiskFormValues = {
  availableFunds: undefined,
  ticker: "",
  getActualPrice: undefined,
  risk: undefined,
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
    onSubmit: (values) => {
      console.log(values);

      const { availableFunds, risk, tradePrice, stopLoss, stopLossType } =
        values;
      let sharesToBuy: number | undefined;
      let positionValue: number | undefined;
      let equityAtRisk: number | undefined;
      let stopPrice: number | undefined;

      if (availableFunds && risk && tradePrice && stopLoss && stopLossType) {
        if (stopLossType === "1") {
          stopPrice = round(tradePrice - tradePrice * (stopLoss / 100));
        } else {
          stopPrice = stopLoss;
        }

        sharesToBuy = Math.floor(
          (availableFunds * (risk / 100)) / (tradePrice - stopPrice)
        );

        positionValue = round(sharesToBuy * tradePrice);

        equityAtRisk = round((tradePrice - stopPrice) * sharesToBuy);

        setShares(sharesToBuy);
        setPosition(positionValue);
        setRiskAmount(equityAtRisk);
        setStopLossPrice(stopPrice);
      }
    },
  });

  //   console.log(formik);
  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <FloatingLabel
        controlId="available-funds"
        label="Available funds"
        className="mb-3"
      >
        <Form.Control
          name="availableFunds"
          type="number"
          min="0"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.availableFunds}
          isInvalid={!!formik.errors.availableFunds}
          placeholder="0"
        />
        {formik.errors.availableFunds && formik.touched.availableFunds ? (
          <Form.Control.Feedback type="invalid">
            {formik.errors.availableFunds}
          </Form.Control.Feedback>
        ) : null}
      </FloatingLabel>

      <FloatingLabel controlId="ticker" label="Ticker" className="mb-3">
        {/* search and retrieve data for price */}
        <Form.Control
          name="ticker"
          type="text"
          placeholder="SPY"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.ticker}
          isInvalid={!!formik.errors.ticker}
        />
      </FloatingLabel>

      <Row className="mb-3">
        <FloatingLabel
          as={Col}
          controlId="get-actual-price"
          label="Get actual price"
        >
          {/* Alert on which price is retrieved, if market is closed, etc */}
          <Form.Control
            name="getActualPrice"
            type="number"
            min="0"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.getActualPrice}
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
          name="tradePrice"
          type="number"
          min="0"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.tradePrice}
          isInvalid={!!formik.errors.tradePrice}
          placeholder="0"
        />
      </FloatingLabel>

      <Form.Group className="mb-3" controlId="trade-direction">
        <Form.Label className="me-3" style={{ paddingLeft: "0.75rem" }}>
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
        <Form.Control
          name="risk"
          type="number"
          min="0"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.risk}
          isInvalid={!!formik.errors.risk}
          placeholder="2%"
        />
      </FloatingLabel>

      <Row className="mb-3">
        <FloatingLabel
          as={Col}
          controlId="stopLoss"
          label="Stop Loss"
          className="mb-3"
        >
          <Form.Control
            name="stopLoss"
            type="number"
            min="0"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.stopLoss}
            isInvalid={!!formik.errors.stopLoss}
            placeholder="0"
          />
        </FloatingLabel>
        <Col className="mb-3 align-self-center">
          <Form.Check
            inline
            id="radio-1"
            name="stopLossType"
            type="radio"
            label="TS%"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value="1"
            checked
          />
          <Form.Check
            inline
            id="radio-2"
            name="stopLossType"
            type="radio"
            label="Fixed price"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
