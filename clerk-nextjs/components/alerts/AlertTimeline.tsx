import React, { useState } from "react";
import { AlertItem, AlertRow } from "./AlertRow";

interface AlertTimelineProps {
  initialAlerts: AlertItem[];
}

export function AlertTimeline({ initialAlerts }: AlertTimelineProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);

  const handleDismissed = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Grouping logic
  const actionRequired = alerts.filter(a => 
    a.type === 'update' || (a.type === 'deadline' && a.daysLeft !== undefined && a.daysLeft <= 7)
  );

  const upcoming = alerts.filter(a => 
    a.type === 'deadline' && a.daysLeft !== undefined && a.daysLeft > 7
  );

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center mt-20">
        <h2 className="text-[28px] font-editorial font-light italic text-ink mb-3">
          Inbox Zero
        </h2>
        <p className="text-[15px] font-ui text-ink-secondary max-w-xs leading-relaxed">
          You have cleared all your alerts. You're completely caught up.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {actionRequired.length > 0 && (
        <section>
          <h3 className="text-[12px] uppercase tracking-[0.08em] text-ink-tertiary font-medium mb-3 pl-2">
            Action Required
          </h3>
          <div className="bg-bg">
            {actionRequired.map(alert => (
              <AlertRow key={alert.id} alert={alert} onDismissed={handleDismissed} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h3 className="text-[12px] uppercase tracking-[0.08em] text-ink-tertiary font-medium mb-3 pl-2">
            Upcoming
          </h3>
          <div className="bg-bg">
            {upcoming.map(alert => (
              <AlertRow key={alert.id} alert={alert} onDismissed={handleDismissed} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
