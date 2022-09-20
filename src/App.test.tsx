import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import { ResultContext } from "./context/ResultContext";

import App from "./App";

describe("Rendering", () => {
  test("Renders SplashScreen", () => {
    render(<App />);
    const spinner = screen.getByTestId("spinner");
    expect(spinner).toBeInTheDocument();
  });
  test("Renders main screen after SplashScreen", async () => {
    const providerValues = {
      shares: 0,
      setShares: jest.fn(),
      position: 0,
      setPosition: jest.fn(),
      riskAmount: 0,
      setRiskAmount: jest.fn(),
      stopLossPrice: 0,
      setStopLossPrice: jest.fn(),
    };

    render(
      <ResultContext.Provider value={providerValues}>
        <App />
      </ResultContext.Provider>
    );
    const spinner = screen.getByTestId("spinner");
    await waitForElementToBeRemoved(spinner, { timeout: 2000 }).then(() => {
      const heading = screen.getByRole("heading", { name: /enter/i });
      expect(heading).toBeInTheDocument();
    });
  });
});
