import React, { useTransition } from "react";
import { Clock, Bell, CheckCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { UrgencyIndicator } from "./UrgencyIndicator";
import { useRouter } from "next/navigation";
import { dismissDeadlineAlert, dismissChangeAlert } from "@/app/actions/alerts";

export type AlertType = 'deadline' | 'update';

export interface AlertItem {
  id: string; // SavedScholarship ID
  type: AlertType;
  scholarshipId: string;
  title: string;
  timestamp: Date; // e.g. deadline or last updated
  daysLeft?: number;
}

interface AlertRowProps {
  alert: AlertItem;
  onDismissed: (id: string) => void;
}

export function AlertRow({ alert, onDismissed }: AlertRowProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Optimistic UI update
    onDismissed(alert.id);
    
    // Background action
    startTransition(async () => {
      if (alert.type === 'deadline') {
        await dismissDeadlineAlert(alert.id);
      } else if (alert.type === 'update') {
        await dismissChangeAlert(alert.id);
      }
    });
  };

  const handleRowClick = () => {
    router.push(`/scholarship/${alert.scholarshipId}`);
  };

  const isDeadline = alert.type === 'deadline';
  const Icon = isDeadline ? Clock : Bell;
  const iconColor = isDeadline ? "text-urgent" : "text-moss";
  
  return (
    <div 
      onClick={handleRowClick}
      className={cn(
        "group relative flex items-center gap-4 py-3 px-4 -mx-4 rounded-lg cursor-pointer transition-colors",
        "hover:bg-surface-hover border-b border-border/50 last:border-0"
      )}
    >
      {/* Icon Column */}
      <div className="shrink-0 pt-0.5">
        <Icon size={18} weight="fill" className={iconColor} />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <h4 className="text-[14px] font-ui font-semibold text-ink truncate">
            {alert.title}
          </h4>
          {isDeadline && alert.daysLeft !== undefined && (
            <UrgencyIndicator daysLeft={alert.daysLeft} />
          )}
          {!isDeadline && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-ui font-medium shrink-0 bg-moss/10 text-moss border border-moss/20">
              Updated
            </span>
          )}
        </div>
        <p className="text-[12px] font-ui text-ink-secondary truncate mt-0.5">
          {isDeadline 
            ? "Deadline is approaching. Action is required to complete your application." 
            : "This opportunity has been updated since you last saved it."}
        </p>
      </div>

      {/* Timestamp / Actions (Hover) */}
      <div className="shrink-0 flex items-center justify-end w-20">
        <span className="text-[12px] font-ui text-ink-tertiary group-hover:hidden whitespace-nowrap">
          {isDeadline && alert.daysLeft !== undefined
            ? alert.timestamp.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
            : "Just now"}
        </span>

        {/* Hover Actions */}
        <div className="hidden group-hover:flex items-center gap-2">
          <button
            onClick={handleDismiss}
            disabled={isPending}
            className="p-1.5 rounded-md text-ink-secondary hover:bg-surface hover:text-ink transition-colors"
            title="Mark as done"
          >
            <CheckCircle size={18} weight="regular" />
          </button>
        </div>
      </div>
    </div>
  );
}
