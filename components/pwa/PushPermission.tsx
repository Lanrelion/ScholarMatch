"use client";

import React, { useState } from "react";
import { BellRinging, X } from "@phosphor-icons/react";

export function PushPermission() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-moss-light border border-moss rounded-xl p-5 md:px-6 relative mb-8">
      <button 
        onClick={() => setVisible(false)}
        className="absolute top-4 right-4 text-moss hover:text-moss-dark transition-colors"
        aria-label="Dismiss"
      >
        <X size={16} weight="bold" />
      </button>

      <div className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-full bg-moss/10 flex items-center justify-center text-moss">
          <BellRinging size={20} weight="fill" />
        </div>
        <div>
          <h3 className="text-[15px] font-editorial font-medium text-ink mb-1">
            Never miss a deadline
          </h3>
          <p className="text-[13px] font-ui text-ink-secondary leading-[1.5] max-w-sm mb-4">
            Enable push notifications to get reminded when your saved scholarships are closing soon.
          </p>
          <button className="h-9 px-5 bg-moss text-white rounded-full font-ui font-medium text-[13px] hover:bg-moss-dark transition-colors">
            Enable notifications
          </button>
        </div>
      </div>
    </div>
  );
}
