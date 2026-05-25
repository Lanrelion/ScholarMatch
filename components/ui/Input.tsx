import * as React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, ...props }, ref) => {
    return (
      <div className={`field-wrapper ${className}`}>
        <input
          className="field-input"
          placeholder=" "
          ref={ref}
          {...props}
        />
        <label className="field-label">{label}</label>
        <div className="field-line" />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
