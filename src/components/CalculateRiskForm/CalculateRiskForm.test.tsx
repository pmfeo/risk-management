// TODO: NOT WORKING handleSubmit mock
// handleSubmit is not being passed to form
// maybe a Formik behaviour?
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ResultContext } from "../../context/ResultContext";

import CalculateRiskForm from "./CalculateRiskForm";

const providerValues = {
  shares: 0,
  setShares: jest.fn(),
  position: 0,
  setPosition: jest.fn(),
  riskAmount: 0,
  setRiskAmount: jest.fn(),
  stopLossPrice: 0,
  setStopLossPrice: jest.fn(),
  resultsAvailable: false,
  setResultsAvailable: jest.fn(),
  TIA: 0,
  setTIA: jest.fn(),
  tradeDirection: '',
  setTradeDirection: jest.fn(),
  riskPercentage: 0,
  setRiskPercentage: jest.fn(),
  error: '',
  setError: jest.fn(),
};

beforeEach(() => {
  render(
    <ResultContext.Provider value={providerValues}>
      <CalculateRiskForm />
    </ResultContext.Provider>
  );
});

describe("Form is on screen", () => {
  test("Form markup is on the page", () => {
    expect(screen.getByTestId("calculate-form")).toBeInTheDocument();
  });

  test("Should render the input fields", () => {
    const availableFunds = screen.getByLabelText(/available/i);
    const ticker = screen.getByLabelText(/ticker/i);
    const getActualPrice = screen.getByLabelText(/actual/i);
    const tradePrice = screen.getByLabelText(/trade price/i);
    const tradeDirectionLong = screen.getByLabelText(/long/i);
    const tradeDirectionShort = screen.getByLabelText(/short/i);
    const risk = screen.getByLabelText(/risk/i);
    const stopLoss = screen.getByLabelText(/stop loss/i);
    const stopLossTypeTS = screen.getByLabelText(/TS/i);
    const stopLossTypeFixed = screen.getByLabelText(/fixed/i);

    expect(availableFunds).toBeInTheDocument();
    expect(ticker).toBeInTheDocument();
    expect(getActualPrice).toBeInTheDocument();
    expect(tradePrice).toBeInTheDocument();
    expect(tradeDirectionLong).toBeInTheDocument();
    expect(tradeDirectionShort).toBeInTheDocument();
    expect(risk).toBeInTheDocument();
    expect(stopLoss).toBeInTheDocument();
    expect(stopLossTypeTS).toBeInTheDocument();
    expect(stopLossTypeFixed).toBeInTheDocument();
  });

  test("Should render submit button", () => {
    const submitButton = screen.getByRole("button", { name: /calculate/i });
    expect(submitButton);
  });
});

describe.skip("Submit form without values", () => {
  // as we are disabling button while form is invalid
  // there are no required mesagges any more
  test.skip("Should display an error message", async () => {
    const submitButton = screen.getByRole("button", { name: /calculate/i });
    expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
    userEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getAllByText(/required/i).length > 0).toBeTruthy();
    });
  });

  test("Submit button should be disabled while submmiting", async () => {
    const availableFunds = screen.getByLabelText(/available/i);
    const tradePrice = screen.getByLabelText(/trade price/i);
    const tradeDirectionLong = screen.getByLabelText(/long/i);
    const risk = screen.getByLabelText(/risk/i);
    const stopLoss = screen.getByLabelText(/stop loss/i);
    const stopLossTypeTS = screen.getByLabelText(/TS/i);
    const submitButton = screen.getByRole("button", { name: /calculate/i });

    userEvent.type(availableFunds, "1000");
    userEvent.type(tradePrice, "105");
    userEvent.click(tradeDirectionLong);
    userEvent.type(risk, "1");
    userEvent.type(stopLoss, "1");
    userEvent.click(stopLossTypeTS);
    expect(submitButton).not.toBeDisabled();
    userEvent.click(submitButton);
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});
