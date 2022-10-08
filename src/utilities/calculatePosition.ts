import roundNumber from "./roundNumber";

interface ICalculateParams {
  availableFunds: number;
  risk: number;
  tradeDirection: string;
  tradePrice: number;
  stopLoss: number;
  stopLossType: string;
}

interface ICalculatePositionResults {
  sharesToTrade: number;
  positionValue: number;
  equityAtRisk: number;
  stopPrice: number;
  direction: string;
}

export default function calculatePosition({
  availableFunds,
  risk,
  tradeDirection,
  tradePrice,
  stopLoss,
  stopLossType,
}: ICalculateParams): ICalculatePositionResults {
  let sharesToTrade = 0;
  let positionValue = 0;
  let equityAtRisk = 0;
  let stopPrice = 0;
  let direction = "";

  console.log(`availableFunds`, availableFunds);
  console.log(`risk`, risk);
  console.log(`tradeDirection`, tradeDirection);
  console.log(`tradePrice`, tradePrice);
  console.log(`stopLoss`, stopLoss);
  console.log(`stopLossType`, stopLossType);
  console.log(`---------------------------------------`);

  if (stopLossType === "1") {
    // Trailing Stop in %
    if (tradeDirection === "1") {
      direction = "BUY";
      stopPrice = roundNumber(tradePrice - tradePrice * (stopLoss / 100));
    } else {
      direction = "SELL";
      stopPrice = roundNumber(tradePrice + tradePrice * (stopLoss / 100));
    }
  } else {
    stopPrice = stopLoss;
  }

  if (tradeDirection === "1") {
    sharesToTrade = Math.floor(
      (availableFunds * (risk / 100)) / (tradePrice - stopPrice)
    );

    if (sharesToTrade * tradePrice >= availableFunds) {
      sharesToTrade = Math.floor(
        availableFunds / (tradePrice + (tradePrice - stopPrice))
      );
    }
    console.log(`sharesToTrade`, sharesToTrade);
  } else {
    sharesToTrade = Math.floor(
      (availableFunds * (risk / 100)) / (stopPrice - tradePrice)
    );
    if (sharesToTrade * tradePrice >= availableFunds) {
      sharesToTrade = Math.floor(
        availableFunds / (tradePrice + (stopPrice - tradePrice))
      );
    }
    console.log(`sharesToTrade`, sharesToTrade);
  }

  positionValue = roundNumber(sharesToTrade * tradePrice);

  if (tradeDirection === "1") {
    equityAtRisk = roundNumber((tradePrice - stopPrice) * sharesToTrade);
  } else {
    equityAtRisk = roundNumber((stopPrice - tradePrice) * sharesToTrade);
  }

  // console.log(`sharesToTrade`, sharesToTrade);
  console.log(`positionValue`, positionValue);
  console.log(`equityAtRisk`, equityAtRisk);
  console.log(`stopPrice`, stopPrice);
  console.log(`direction`, direction);

  return {
    sharesToTrade,
    positionValue,
    equityAtRisk,
    stopPrice,
    direction,
  };
}
