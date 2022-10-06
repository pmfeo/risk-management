interface IQuotePriceAdapter {
  price: string;
}

export const quotePriceAdapter = (data: any): IQuotePriceAdapter => ({
  price: data["Global Quote"]["05. price"],
});
