import React from 'react';

type ErrorStateProps = {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
};

export function ErrorState({ icon, title, description, action, secondaryAction }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      {icon && (
        <div className="w-12 h-12 flex items-center justify-center text-gray-300 mb-3">
          {icon}
        </div>
      )}
      <h3 className="text-base font-medium text-gray-700 mt-1">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 max-w-[280px]">
        {description}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 w-full max-w-[280px] min-h-[44px] rounded-xl bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] active:scale-[0.98] transition-all"
        >
          {action.label}
        </button>
      )}
      
      {secondaryAction && (
        <button
          onClick={secondaryAction.onClick}
          className="mt-3 text-sm text-gray-500 underline hover:text-[var(--color-primary)] transition-colors min-h-[44px] px-4"
        >
          {secondaryAction.label}
        </button>
      )}
    </div>
  );
}
