import * as React from "react";
import { useState, createContext } from "react";

export interface ResultContextInterface {
  shares: number;
  setShares: React.Dispatch<React.SetStateAction<number>>;
  position: number;
  setPosition: React.Dispatch<React.SetStateAction<number>>;
  riskAmount: number;
  setRiskAmount: React.Dispatch<React.SetStateAction<number>>;
  stopLossPrice: number;
  setStopLossPrice: React.Dispatch<React.SetStateAction<number>>;
}

interface Props {
  children: React.ReactNode;
}

export const ResultContext = createContext<ResultContextInterface | null>(null);

const ResultProvider = ({ children }: Props): JSX.Element => {
  const [shares, setShares] = useState(0);
  const [position, setPosition] = useState(0);
  const [riskAmount, setRiskAmount] = useState(0);
  const [stopLossPrice, setStopLossPrice] = useState(0);
  return (
    <ResultContext.Provider
      value={{
        shares,
        setShares,
        position,
        setPosition,
        riskAmount,
        setRiskAmount,
        stopLossPrice,
        setStopLossPrice,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
};

export default ResultProvider;
