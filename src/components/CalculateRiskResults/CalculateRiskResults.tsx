import { useContext } from "react";

import {
  ResultContextInterface,
  ResultContext,
} from "../../context/ResultContext";

function CalculateRiskResults(): JSX.Element {
  const { shares, position, riskAmount, stopLossPrice } = useContext(
    ResultContext
  ) as ResultContextInterface;

  return (
    <>
      {shares > 0 && (
        <>
          <h3>Results:</h3>
          <p>
            Shares: <span>{shares}</span>
          </p>
        </>
      )}
      {position > 0 && (
        <p>
          Position value: <span>{position}</span>
        </p>
      )}
      {stopLossPrice > 0 && (
        <p>
          Stop Loss $: <span>{stopLossPrice}</span>
        </p>
      )}
      {riskAmount > 0 && (
        <p>
          $ at risk: <span>{riskAmount}</span>
        </p>
      )}
    </>
  );
}

export default CalculateRiskResults;
