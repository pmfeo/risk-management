export default interface ICalculateRiskFormValues {
    availableFunds: number | undefined;
    ticker?: string;
    getActualPrice?: number | undefined;
    risk: number | undefined;
    tradeDirection: string;
    tradePrice: number | undefined;
    stopLoss: number | undefined;
    stopLossType: string | undefined;
  }