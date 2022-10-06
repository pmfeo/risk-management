import { useContext } from "react";

import {
  ResultContextInterface,
  ResultContext,
} from "../../context/ResultContext";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import styles from "./CalculateRiskResults.module.scss";
import { Alert } from "react-bootstrap";

ChartJS.register(ArcElement, Tooltip, Legend);

function CalculateRiskResults(): JSX.Element {
  const {
    shares,
    position,
    riskAmount,
    stopLossPrice,
    TIA,
    tradeDirection,
    // riskPercentage,
    error,
  } = useContext(ResultContext) as ResultContextInterface;

  // const allIn = 100 - riskPercentage;

  const data = {
    labels: [`TIA`, `Risk`],
    datasets: [
      {
        // labels: [`TIA`, `Risk`],
        data: [TIA, riskAmount],
        backgroundColor: ["rgba(54, 162, 235, 0.8)", "rgba(255, 99, 132, 0.8)"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <>
      {error ? (
        <Alert variant={"danger"}>{error}</Alert>
      ) : (
        <>
          {shares && <h2 className="text-center mb-4">Results</h2>}

          {shares > 0 && tradeDirection !== "" && (
            <div className={styles.shares}>
              <div
                className={styles.shares__direction}
                style={{
                  color: tradeDirection === "BUY" ? "green" : "red",
                  borderColor: tradeDirection === "BUY" ? "green" : "red",
                }}
              >
                {tradeDirection}
              </div>
              <div className={styles.shares__units}>
                {shares} <span>units</span>
              </div>
            </div>
          )}

          {/* {stopLossPrice > 0 && ( */}
            <div className={styles.sl}>
              <div className={styles.sl__title}>SL Price</div>
              <div className={styles.sl__amount}>
                <span>$</span> {stopLossPrice}
              </div>
            </div>
          {/* )} */}

          {position > 0 && (
            <div className={styles.sl}>
              <div className={styles.sl__title}>Position value</div>
              <div className={styles.sl__amount}>
                <span>$</span> {position}
              </div>
            </div>
          )}

          {riskAmount > 0 && (
            <div className={styles.sl}>
              <div className={styles.sl__title}>$ at risk</div>
              <div className={styles.sl__amount}>
                <span>$</span> {riskAmount}
              </div>
            </div>
          )}

          <div>
            <Doughnut data={data} />
          </div>

          {/* <div className={styles.strike}>
  <div className={styles.strike__text}>
    At this risk you&#39;d need a <span>10 trades</span> losing strike to
    burn your account.
  </div>
</div> */}
        </>
      )}
    </>
  );
}

export default CalculateRiskResults;
