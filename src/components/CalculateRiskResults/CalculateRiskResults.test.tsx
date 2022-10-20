import { render, screen } from '@testing-library/react';

import { ResultContext } from '../../context/ResultContext';

import CalculateRiskResults from './CalculateRiskResults';

jest.mock('react-chartjs-2', () => ({
	Doughnut: () => null,
}));

describe('Rendering', () => {
	test('Does not render if values are not present', () => {
		const providerValues = {
			shares: 0,
			setShares: jest.fn(),
			position: 0,
			setPosition: jest.fn(),
			riskAmount: 0,
			setRiskAmount: jest.fn(),
			stopLossPrice: 0,
			setStopLossPrice: jest.fn(),
			resultsAvailable: false,
			setResultsAvailable: jest.fn(),
			TIA: 0,
			setTIA: jest.fn(),
			tradeDirection: '',
			setTradeDirection: jest.fn(),
			riskPercentage: 0,
			setRiskPercentage: jest.fn(),
			error: '',
			setError: jest.fn(),
		};

		render(
			<ResultContext.Provider value={providerValues}>
				<CalculateRiskResults />
			</ResultContext.Provider>
		);

		expect(
			screen.queryByRole('heading', { name: /result/i })
		).not.toBeInTheDocument();
	});
	test('Renders if values are present', () => {
		const providerValues = {
			shares: 1,
			setShares: jest.fn(),
			position: 50,
			setPosition: jest.fn(),
			riskAmount: 20,
			setRiskAmount: jest.fn(),
			stopLossPrice: 30,
			setStopLossPrice: jest.fn(),
			resultsAvailable: true,
			setResultsAvailable: jest.fn(),
			TIA: 3000,
			setTIA: jest.fn(),
			tradeDirection: 'BUY',
			setTradeDirection: jest.fn(),
			riskPercentage: 1,
			setRiskPercentage: jest.fn(),
			error: '',
			setError: jest.fn(),
		};

		render(
			<ResultContext.Provider value={providerValues}>
				<CalculateRiskResults />
			</ResultContext.Provider>
		);

		expect(
			screen.getByRole('heading', { name: /result/i })
		).toBeInTheDocument();
		expect(screen.getByText(/buy/i)).toBeInTheDocument();
		expect(screen.getByText(/units/i)).toBeInTheDocument();
		expect(screen.getByText(/SL price/i)).toBeInTheDocument();
		expect(screen.getByText(/position value/i)).toBeInTheDocument();
		expect(screen.getByText(/at risk/i)).toBeInTheDocument();
	});
});
