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
  resultsAvailable: boolean;
  setResultsAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  TIA: number;
  setTIA: React.Dispatch<React.SetStateAction<number>>;
  tradeDirection: string;
  setTradeDirection: React.Dispatch<React.SetStateAction<string>>;
  riskPercentage: number;
  setRiskPercentage: React.Dispatch<React.SetStateAction<number>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
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
  const [resultsAvailable, setResultsAvailable] = useState(false);
  const [TIA, setTIA] = useState(0);
  const [tradeDirection, setTradeDirection] = useState('');
  const [riskPercentage, setRiskPercentage] = useState(0);
  
  const [error, setError] = useState('');
  
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
        resultsAvailable,
        setResultsAvailable,
        TIA,
        setTIA,
        tradeDirection,
        setTradeDirection,
        riskPercentage,
        setRiskPercentage,
        error, setError
      }}
    >
      {children}
    </ResultContext.Provider>
  );
};

export default ResultProvider;
