import { useContext, useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { getQuotePrice } from "../../services/getQuotePrice.service";
import calculatePosition from "../../utilities/calculatePosition";

import {
  ResultContextInterface,
  ResultContext,
} from "../../context/ResultContext";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import NumberInput from "../NumberInput/NumberInput";
import ICalculateRiskFormValues from "../../interfaces/ICalculateRiskFormValues.interface";

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

const initialValues: ICalculateRiskFormValues = {
  availableFunds: undefined,
  ticker: "",
  getActualPrice: undefined,
  risk: undefined,
  tradeDirection: "1",
  tradePrice: undefined,
  stopLoss: undefined,
  stopLossType: "1",
};

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
    setError,
  } = useContext(ResultContext) as ResultContextInterface;

  const [priceFromAPI, setPriceFromAPI] = useState<number | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);

  const availableFundsRef = useRef<any>();
  const tickerRef = useRef<any>();
  const actualPriceRef = useRef<any>();
  const tradePriceRef = useRef<any>();
  const tradeDirection1Ref = useRef<any>();
  const tradeDirection2Ref = useRef<any>();
  const riskRef = useRef<any>();
  const stopLossRef = useRef<any>();
  const stopLossDirection1Ref = useRef<any>();
  const stopLossDirection2Ref = useRef<any>();

  const handleGetPrice: (arg0: string) => Promise<void> = async (
    ticker: string
  ) => {
    setLoading(true);
    try {
      const price = await getQuotePrice(ticker);
      setPriceFromAPI(parseFloat(price));
    } catch (err) {
      console.error(err);
      setError(JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  const validate: any = (values: any) => {
    interface errorsInterface {
      [key: string]: any;
    }
    const errors: errorsInterface = {};

    const {
      availableFunds,
      tradePrice,
      tradeDirection,
      stopLoss,
      stopLossType,
    } = values;

    if (stopLossType === "2" && tradePrice && stopLoss) {
      // Fixed price SL
      if (tradeDirection === "1" && tradePrice <= stopLoss) {
        // Long
        errors.stopLoss = "Stop Price must be smaller than Trade Price";
      }
      if (tradeDirection === "2" && tradePrice >= stopLoss) {
        // Short
        errors.stopLoss = "Stop Price must be greater than Trade Price";
      }
    }

    if (stopLossType === "1" && stopLoss > 100) {
      errors.stopLoss = "Stop Price can't be greater than 100%";
    }

    if (availableFunds < tradePrice) {
      errors.availableFunds =
        "You don't have enough funds to buy a minimun of 1 stock";
    }

    return errors;
  };

  const onSubmit: (values: ICalculateRiskFormValues) => void = (values) => {
    const {
      availableFunds,
      risk,
      tradeDirection,
      tradePrice,
      stopLoss,
      stopLossType,
    } = values;

    if (
      !availableFunds ||
      !risk ||
      !tradeDirection ||
      !tradePrice ||
      !stopLoss ||
      !stopLossType
    ) {
      return;
    }

    const { sharesToTrade, positionValue, equityAtRisk, stopPrice, direction } =
      calculatePosition({
        availableFunds,
        risk,
        tradeDirection,
        tradePrice,
        stopLoss,
        stopLossType,
      });

    if (sharesToTrade < 1) {
      setResultsAvailable(true);
      return setError(
        "Not enough to trade at least 1 share with the given parameters. Please perform another calculation with different ones."
      );
    }

    if (positionValue >= availableFunds) {
      setResultsAvailable(true);
      return setError(
        "Your position value is greater than your TIA. Assuming that you're trading without leverage (1:1), you won't be able to perform this trade. Please enter different values and calculate again."
      );
    }

    setShares(sharesToTrade);
    setPosition(positionValue);
    setRiskAmount(equityAtRisk);
    setStopLossPrice(stopPrice);
    setResultsAvailable(true);
    availableFunds && setTIA(availableFunds);
    direction && setTradeDirection(direction);
    risk && setRiskPercentage(risk);
    setError("");
  };

  const handleReset: () => void = () => {
    availableFundsRef.current.value = undefined;
    tickerRef.current.value = "";
    setPriceFromAPI(undefined);
    actualPriceRef.current.value = undefined;
    tradePriceRef.current.value = undefined;
    tradeDirection1Ref.current.checked = true;
    riskRef.current.value = undefined;
    stopLossRef.current.value = undefined;
    stopLossDirection1Ref.current.checked = true;
  };

  useEffect(() => {
    if (tradeDirection1Ref.current !== undefined) {
      tradeDirection1Ref.current.checked = true;
    }
    if (stopLossDirection1Ref.current !== undefined) {
      stopLossDirection1Ref.current.checked = true;
    }
  }, []);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={CalculateRiskFormValidationSchema}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({
        errors,
        touched,
        values,
        dirty,
        isValid,
        handleSubmit,
        getFieldProps,
        setFieldValue,
        resetForm,
      }) => (
        <>
          <Form onSubmit={handleSubmit} data-testid="calculate-form">
            <FloatingLabel
              controlId="availableFunds"
              label="Total Investable Amount (Available funds)"
              className="mb-3"
            >
              <NumberInput
                ref={availableFundsRef}
                name="availableFunds"
                min="0"
                placeholder="0"
              />
            </FloatingLabel>

            <Row>
              <Col md={4} className="mb-3">
                <FloatingLabel controlId="ticker" label="Ticker">
                  <Form.Control
                    ref={tickerRef}
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
              </Col>

              <Col md={4} className="mb-3">
                <FloatingLabel
                  as={Col}
                  controlId="get-actual-price"
                  // TODO: tooltip with warning icon info
                  // Alert on which price is retrieved, if market is closed, etc
                  label="Actual price"
                >
                  <NumberInput
                    ref={actualPriceRef}
                    name="getActualPrice"
                    min="0"
                    placeholder="0"
                    value={priceFromAPI ?? undefined}
                    disabled
                  />
                </FloatingLabel>
              </Col>

              <Col className="d-flex justify-content-center justify-content-md-end align-items-center mb-3">
                {loading ? (
                  <Button className="btn-lg" disabled>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Loading...
                  </Button>
                ) : (
                  <Button
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={async () =>
                      values?.ticker && (await handleGetPrice(values.ticker))
                    }
                    disabled={
                      values?.ticker?.length === 0 ||
                      (Boolean(errors.ticker) && touched.ticker === true)
                    }
                    className="btn-lg"
                  >
                    Get quote
                  </Button>
                )}

                <Button
                  onClick={() => {
                    const getPrice: number =
                      actualPriceRef?.current?.getAttribute("value");
                    setFieldValue("tradePrice", getPrice);
                  }}
                  disabled={!priceFromAPI}
                  className="btn-lg ms-3"
                >
                  Use this price
                </Button>
              </Col>
            </Row>

            <Row className="align-items-center">
              <FloatingLabel
                as={Col}
                controlId="tradePrice"
                label="Trade price"
                className="mb-3 col-md-6"
              >
                <NumberInput
                  ref={tradePriceRef}
                  name="tradePrice"
                  min="0"
                  placeholder="0"
                />
              </FloatingLabel>

              <ButtonGroup size="lg" className="mb-3 col-md-6">
                <Button
                  className={
                    tradeDirection1Ref?.current?.checked === true
                      ? "active"
                      : ""
                  }
                >
                  <Form.Check
                    ref={tradeDirection1Ref}
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
                </Button>
                <Button
                  className={
                    tradeDirection2Ref?.current?.checked === true
                      ? "active"
                      : ""
                  }
                >
                  <Form.Check
                    ref={tradeDirection2Ref}
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
                </Button>
                {Boolean(errors.tradeDirection) &&
                touched.tradeDirection === true ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.tradeDirection}
                  </Form.Control.Feedback>
                ) : null}
              </ButtonGroup>
            </Row>

            <FloatingLabel controlId="risk" label="Risk" className="mb-3">
              <NumberInput ref={riskRef} name="risk" min="0" placeholder="2%" />
            </FloatingLabel>

            <Row className="align-items-center">
              <FloatingLabel
                as={Col}
                controlId="stopLoss"
                label="Stop Loss"
                className="mb-3 col-md-6"
              >
                <NumberInput
                  ref={stopLossRef}
                  name="stopLoss"
                  min="0"
                  placeholder="0"
                  isInvalid={
                    Boolean(errors.stopLoss) &&
                    touched.stopLoss &&
                    touched.stopLossType
                  }
                />
              </FloatingLabel>
              <ButtonGroup size="lg" className="mb-3 col-md-6">
                <Button
                  className={
                    stopLossDirection1Ref?.current?.checked === true
                      ? "active"
                      : ""
                  }
                >
                  <Form.Check
                    ref={stopLossDirection1Ref}
                    inline
                    id="radio-3"
                    type="radio"
                    label="TS%"
                    isInvalid={
                      Boolean(errors.stopLossType) && touched.stopLossType
                    }
                    {...getFieldProps("stopLossType")}
                    value="1"
                  />
                </Button>
                <Button
                  className={
                    stopLossDirection2Ref?.current?.checked === true
                      ? "active"
                      : ""
                  }
                >
                  <Form.Check
                    ref={stopLossDirection2Ref}
                    inline
                    id="radio-4"
                    type="radio"
                    label="Fixed price"
                    isInvalid={
                      Boolean(errors.stopLossType) && touched.stopLossType
                    }
                    {...getFieldProps("stopLossType")}
                    value="2"
                  />
                </Button>
              </ButtonGroup>
            </Row>

            <Row className="mt-3">
              <Col className="col-md-8">
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
              </Col>
              <Col>
                <div className="d-grid gap-2">
                  <Button
                    variant="secondary"
                    size="lg"
                    type="button"
                    disabled={!touched}
                    onClick={() => {
                      resetForm();
                      handleReset();
                    }}
                  >
                    Reset Form
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </Formik>
  );
}

export default CalculateRiskForm;
