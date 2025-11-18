import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useAuth } from "./context/AuthContext";
import { Line, Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  CandlestickController,
  CandlestickElement,
  OhlcController,
  OhlcElement,
} from "chartjs-chart-financial";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  CandlestickController,
  CandlestickElement,
  OhlcController,
  OhlcElement
);


const API_BASE_URL = "https://finportbackend.onrender.com";

// Example list of major stock symbols
const STOCK_SYMBOLS = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "TSLA",
  "META",
  "NVDA",
  "JPM",
  "V",
  "UNH",
  "HD",
  "PG",
  "MA",
  "DIS",
  "BAC",
  "ADBE",
  "NFLX",
  "CRM",
  "INTC",
  "PYPL",
  "CSCO",
  "PEP",
  "KO",
  "T",
  "XOM",
  "WMT",
  "CVX",
  "MRK",
  "ABBV",
  "MCD",
];

/* ────────────────────────────────────────────── */
/* styled-components */
/* ────────────────────────────────────────────── */

const Page = styled.div`
  background-color: #ffffff;
  min-height: 100vh;
  padding: 120px 24px 40px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderSection = styled.div`
  margin-bottom: 48px;
  text-align: center;
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 16px;
`;

const HeaderSubtitle = styled.p`
  font-size: 18px;
  color: #6b7280;
  margin-bottom: 32px;
`;

const ControlsCard = styled.div`
  background-color: #f8fafc;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  border: 1px solid #e2e8f0;
`;

const ControlsRow = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;
  flex-wrap: wrap;
`;

const ControlGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const Select = styled.select`
  padding: 12px 16px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background-color: white;
  min-width: 150px;
  outline: none;
  font-weight: 500;
`;

const ChartCard = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #e2e8f0;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const ErrorBox = styled.div`
  color: #ef4444;
  font-size: 16px;
  text-align: center;
  padding: 40px;
`;

const LoaderBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #6b7280;
  font-size: 18px;
`;

const StockInfo = styled.div`
  margin-bottom: 32px;
`;

const StockInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const SymbolBlock = styled.div``;

const SymbolTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
`;

const SymbolSubtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const PriceBox = styled.div`
  background-color: #f0f9ff;
  padding: 16px 24px;
  border-radius: 12px;
  border: 1px solid #0ea5e9;
`;

const PriceText = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #0ea5e9;
`;

const ChartContainer = styled.div`
  height: 400px;
`;

const SymbolsCard = styled.div`
  background-color: #f8fafc;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #e2e8f0;
`;

const SymbolsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
`;

const SymbolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
`;

const SymbolChip = styled.div`
  background-color: white;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

/* ────────────────────────────────────────────── */
/* Component Logic */
/* ────────────────────────────────────────────── */

const Dashboard: React.FC = () => {
  const { user } = useAuth();


  const [symbol, setSymbol] = useState("AAPL");
  const [stockData, setStockData] = useState<any>(null);
  const [candleData, setCandleData] = useState<any>(null);
  const [priceHistory, setPriceHistory] = useState<
    { time: string; price: number }[]
  >([]);
  const [chartType, setChartType] = useState<"line" | "candle">("line");
  const chartRef = useRef<any>(null);

  useEffect(() => {
    // Fetch stock price
    setStockData(null);
    setCandleData(null);
    setPriceHistory([]);
    const fetchPrice = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/stock/price?symbol=${symbol}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setStockData(data);
        if (data.price && data.time) {
          setPriceHistory([{ time: data.time, price: data.price }]);
        }
      } catch (err) {
        console.error('Price fetch error:', err);
        setStockData({ error: "Failed to fetch price. Please check CORS configuration." });
      }
    };
    const fetchCandles = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/stock/candles?symbol=${symbol}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        });
        
        if (!res.ok) {
          if (res.status === 500) {
            console.warn(`Candles endpoint returned 500 for ${symbol}. Candle chart will be unavailable.`);
            setCandleData({ error: "Candlestick data temporarily unavailable" });
            return;
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setCandleData(data);
      } catch (err) {
        console.error('Candles fetch error:', err);
        setCandleData({ error: "Candlestick data temporarily unavailable" });
      }
    };
    fetchPrice();
    fetchCandles();
  }, [symbol]);

  const handleSymbolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSym = e.target.value;
    setSymbol(newSym);
  };

  const mergedHistory = [
    ...(candleData && candleData.candles
      ? candleData.candles.map((c: any) => ({
          time: c.time,
          price: c.close,
        }))
      : []),
    ...priceHistory,
  ];

  const lineChartData = {
    labels: mergedHistory.map((p) => p.time),
    datasets: [
      {
        label: `${symbol} Price`,
        data: mergedHistory.map((p) => p.price),
        fill: false,
        backgroundColor: "#007bff",
        borderColor: "#007bff",
        tension: 0.2,
        pointRadius: 2,
      },
    ],
  };

  const candleChartData =
    candleData && candleData.candles
      ? {
          labels: candleData.candles.map((c: any) => c.time),
          datasets: [
            {
              label: `${symbol} Candlesticks`,
              data: candleData.candles.map((c: any) => ({
                x: c.time,
                o: c.open,
                h: c.high,
                l: c.low,
                c: c.close,
              })),
              borderColor: "#2E7D32",
              backgroundColor: "rgba(46, 125, 50, 0.1)",
            },
          ],
        }
      : null;

  const lineChartOptions: any = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: `Real-Time Price for ${symbol}`,
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Time" },
        ticks: { autoSkip: true, maxTicksLimit: 10 },
      },
      y: {
        title: { display: true, text: "Price (USD)" },
        beginAtZero: false,
      },
    },
  };

  const candleChartOptions: any = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: `Candlestick Chart for ${symbol} (Last 30 Days)`,
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Date" },
        ticks: { autoSkip: true, maxTicksLimit: 10 },
      },
      y: {
        title: { display: true, text: "Price (USD)" },
        beginAtZero: false,
      },
    },
  };

  return (
    <Page>
      <Container>
        <HeaderSection>
          <HeaderTitle>Trading Dashboard</HeaderTitle>
          <HeaderSubtitle>
            Welcome back, {user?.name}! Monitor your investments in real-time.
          </HeaderSubtitle>
        </HeaderSection>

        {/* Controls */}
        <ControlsCard>
          <ControlsRow>
            <ControlGroup>
              <Label htmlFor="symbol">Stock Symbol</Label>
              <Select id="symbol" value={symbol} onChange={handleSymbolChange}>
                {STOCK_SYMBOLS.map((sym) => (
                  <option key={sym} value={sym}>
                    {sym}
                  </option>
                ))}
              </Select>
            </ControlGroup>

            <ControlGroup>
              <Label htmlFor="chartType">Chart Type</Label>
              <Select
                id="chartType"
                value={chartType}
                onChange={(e) =>
                  setChartType(e.target.value as "line" | "candle")
                }
              >
                <option value="candle">Candlestick</option>
                <option value="line">Real-time Line</option>
              </Select>
            </ControlGroup>
          </ControlsRow>
        </ControlsCard>

        {/* Chart card */}
        <ChartCard>
          {stockData ? (
            stockData.error ? (
              <ErrorBox>Error: {stockData.error}</ErrorBox>
            ) : (
              <>
                <StockInfo>
                  <StockInfoRow>
                    <SymbolBlock>
                      <SymbolTitle>{stockData.symbol}</SymbolTitle>
                      <SymbolSubtitle>
                        Latest Trading Day: {stockData.time}
                      </SymbolSubtitle>
                    </SymbolBlock>

                    <PriceBox>
                      <PriceText>${stockData.price}</PriceText>
                    </PriceBox>
                  </StockInfoRow>
                </StockInfo>

                <ChartContainer>
                  {chartType === "line" ? (
                    <Line
                      ref={chartRef}
                      data={lineChartData}
                      options={lineChartOptions}
                    />
                  ) : candleChartData ? (
                    <Chart
                      ref={chartRef}
                      type="candlestick"
                      data={candleChartData}
                      options={candleChartOptions}
                    />
                  ) : candleData?.error ? (
                    <ErrorBox>{candleData.error}</ErrorBox>
                  ) : (
                    <LoaderBox>Loading candlestick data...</LoaderBox>
                  )}
                </ChartContainer>
              </>
            )
          ) : (
            <LoaderBox>Loading real-time data...</LoaderBox>
          )}
        </ChartCard>

        {/* Symbols list */}
        <SymbolsCard>
          <SymbolsTitle>Available Stock Symbols</SymbolsTitle>
          <SymbolsGrid>
            {STOCK_SYMBOLS.map((sym) => (
              <SymbolChip key={sym}>{sym}</SymbolChip>
            ))}
          </SymbolsGrid>
        </SymbolsCard>
      </Container>
    </Page>
  );
};

export default Dashboard;
