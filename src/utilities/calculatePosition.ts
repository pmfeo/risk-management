import roundNumber from './roundNumber';

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
	let direction = '';

	if (stopLossType === '1') {
		// Trailing Stop in %
		if (tradeDirection === '1') {
			direction = 'BUY';
			stopPrice = roundNumber(tradePrice - tradePrice * (stopLoss / 100));
		} else {
			direction = 'SELL';
			stopPrice = roundNumber(tradePrice + tradePrice * (stopLoss / 100));
		}
	} else {
		tradeDirection === '1' ? (direction = 'BUY') : (direction = 'SELL');
		stopPrice = stopLoss;
	}

	if (tradeDirection === '1') {
		sharesToTrade = Math.floor(
			(availableFunds * (risk / 100)) / (tradePrice - stopPrice)
		);

		if (sharesToTrade * tradePrice >= availableFunds) {
			sharesToTrade = Math.floor(
				availableFunds / (tradePrice + (tradePrice - stopPrice))
			);
		}
	} else {
		sharesToTrade = Math.floor(
			(availableFunds * (risk / 100)) / (stopPrice - tradePrice)
		);
		if (sharesToTrade * tradePrice >= availableFunds) {
			sharesToTrade = Math.floor(
				availableFunds / (tradePrice + (stopPrice - tradePrice))
			);
		}
	}

	positionValue = roundNumber(sharesToTrade * tradePrice);

	if (tradeDirection === '1') {
		equityAtRisk = roundNumber((tradePrice - stopPrice) * sharesToTrade);
	} else {
		equityAtRisk = roundNumber((stopPrice - tradePrice) * sharesToTrade);
	}

	return {
		sharesToTrade,
		positionValue,
		equityAtRisk,
		stopPrice,
		direction,
	};
}
