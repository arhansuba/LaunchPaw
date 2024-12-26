import React, { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  UTCTimestamp,
} from "lightweight-charts";

interface PriceChartProps {
  currentPrice: string;
  tokenSymbol: string;
}

const PriceChart: React.FC<PriceChartProps> = ({
  currentPrice,
  tokenSymbol,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#d1d5db",
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.1)" },
        horzLines: { color: "rgba(255, 255, 255, 0.1)" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      rightPriceScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
      },
      timeScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Create area series
    const areaSeries = chart.addAreaSeries({
      lineColor: "#8b5cf6",
      topColor: "rgba(139, 92, 246, 0.4)",
      bottomColor: "rgba(139, 92, 246, 0.0)",
      lineWidth: 2,
      priceFormat: {
        type: "price",
        precision: 6,
        minMove: 0.000001,
      },
    });

    // Generate mock data for the bonding curve
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const data = [];
    const basePrice = parseFloat(currentPrice);

    for (let i = 0; i < 100; i++) {
      const timestamp = (currentTimestamp - (100 - i) * 3600) as UTCTimestamp;
      // Simulate exponential growth for the bonding curve
      const price = basePrice * Math.exp(i * 0.02);
      data.push({
        time: timestamp,
        value: price,
      });
    }

    areaSeries.setData(data);

    // Add price line for current price
    areaSeries.createPriceLine({
      price: parseFloat(currentPrice),
      color: "#8b5cf6",
      lineWidth: 2,
      lineStyle: 2,
      axisLabelVisible: true,
      title: "Current Price",
    });

    // Fit content and add margin
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [currentPrice]);

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Price Chart</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">{tokenSymbol}/AVAX</div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Current:</span>
            <span className="text-sm font-medium">
              {parseFloat(currentPrice).toFixed(6)} AVAX
            </span>
          </div>
        </div>
      </div>
      <div ref={chartContainerRef} />
      <div className="mt-4 text-xs text-gray-400 text-center">
        Price chart shows simulated bonding curve progression based on current
        token metrics
      </div>
    </div>
  );
};

export default PriceChart;
