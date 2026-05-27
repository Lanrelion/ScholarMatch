import React from "react";
import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react";

interface SectionLabelProps {
  label: string;
  count?: number;
  action?: { text: string; href: string };
  isUrgent?: boolean;
}

export function SectionLabel({ label, count, action, isUrgent = false }: SectionLabelProps) {
  return (
    <div className="flex items-center mb-6">
      {isUrgent && <WarningCircle size={18} weight="fill" className="text-urgent mr-2" />}
      <h3 className={`font-editorial text-[22px] font-normal ${isUrgent ? 'text-urgent' : 'text-ink'}`}>
        {label}
      </h3>
      {count !== undefined && (
        <span className="font-ui text-[13px] text-ink-secondary ml-3 font-medium">
          {count}
        </span>
      )}
      {action && (
        <Link 
          href={action.href}
          className="ml-auto font-ui text-[13px] text-moss hover:text-moss-dark font-medium transition-colors"
        >
          {action.text}
        </Link>
      )}
    </div>
  );
}
