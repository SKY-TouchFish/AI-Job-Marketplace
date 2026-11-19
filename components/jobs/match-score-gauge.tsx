"use client";

import { Gauge } from "@mui/x-charts/Gauge";

type MatchScoreGaugeProps = {
  value: number;
};

// 将查询层计算的匹配分数按 0 到 100 的刻度显示。
// Display the match score calculated by the query layer on a 0 to 100 scale.
export function MatchScoreGauge({ value }: MatchScoreGaugeProps) {
  return (
    <div className="match-gauge">
      <Gauge
        value={value}
        valueMax={100}
        startAngle={-110}
        endAngle={110}
        sx={{
          "& .MuiGauge-valueText": {
            fontSize: 24,
            fontFamily: "Georgia, Times New Roman, serif",
            transform: "translate(0px, 0px)"
          }
        }}
        text={({ value: currentValue, valueMax }) => `${currentValue} / ${valueMax}`}
      />
    </div>
  );
}
