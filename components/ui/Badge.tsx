import * as React from "react"

export interface BadgeProps {
  deadline: Date | string;
  className?: string;
}

const Badge = ({ deadline, className = "" }: BadgeProps) => {
  const dateObj = new Date(deadline);
  const today = new Date();
  const diffTime = dateObj.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let label = "";
  let css = "";
  
  if (daysLeft <= 7) {
    label = `${daysLeft}d left`;
    css = "urgent";
  } else if (daysLeft <= 30) {
    label = `${daysLeft}d left`;
    css = "warning";
  } else {
    label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    css = "neutral";
  }

  return (
    <span className={`deadline-badge deadline-badge--${css} ${className}`}>
      {label}
    </span>
  )
}

export { Badge }
