import { render, screen } from "@testing-library/react";

import { ResultContext } from "../../context/ResultContext";

import CalculateRiskResults from "./CalculateRiskResults";

describe("Rendering", () => {
  test("Does not render if values are not present", () => {
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
    };

    render(
      <ResultContext.Provider value={providerValues}>
        <CalculateRiskResults />
      </ResultContext.Provider>
    );

    expect(
      screen.queryByRole("heading", { name: /result/i })
    ).not.toBeInTheDocument();
  });
  test("Renders if values are present", () => {
    const providerValues = {
      shares: 9,
      setShares: jest.fn(),
      position: 0,
      setPosition: jest.fn(),
      riskAmount: 0,
      setRiskAmount: jest.fn(),
      stopLossPrice: 0,
      setStopLossPrice: jest.fn(),
      resultsAvailable: true,
      setResultsAvailable: jest.fn(),
      TIA: 0,
      setTIA: jest.fn(),
      tradeDirection: '',
      setTradeDirection: jest.fn(),
      riskPercentage: 0,
      setRiskPercentage: jest.fn(),
    };

    render(
      <ResultContext.Provider value={providerValues}>
        <CalculateRiskResults />
      </ResultContext.Provider>
    );

    expect(
      screen.getByRole("heading", { name: /result/i })
    ).toBeInTheDocument();
  });
});
