import * as React from "react"

export type SignalBreakdown = Record<string, {
  label: string;
  pass?: boolean;
  partial?: boolean;
}>;

export interface EligibilitySignalsProps {
  breakdown: SignalBreakdown;
}

export const EligibilitySignals = ({ breakdown }: EligibilitySignalsProps) => (
  <div className="eligibility-signals">
    {Object.entries(breakdown)
      .filter(([_, v]) => v.label)
      .map(([key, signal]) => (
        <span key={key} className={`signal signal--${signal.pass ? 'pass' : signal.partial ? 'partial' : 'fail'}`}>
          {signal.pass ? '✓' : signal.partial ? '◐' : '✗'} {signal.label}
        </span>
      ))}
  </div>
)
