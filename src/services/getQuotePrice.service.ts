import { quotePriceAdapter } from "../adapters";

const apiKey = process.env.REACT_APP_ALPHA_ADVANTAGE;
const baseURL = "https://www.alphavantage.co/";

export const getQuotePrice = async (ticker: string): Promise<string> => {
  const response = await fetch(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    `${baseURL}query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`
  );

  if (!response.ok) {
    throw new Error(`Error! status: ${response.status}`);
  }

  const result = await response.json();
  const { price } = quotePriceAdapter(result);
  return price;
};
