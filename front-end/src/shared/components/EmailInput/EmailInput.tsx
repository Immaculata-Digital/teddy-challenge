import React, { forwardRef } from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const EmailInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label = 'E-mail', error, hint, id = 'email', ...props }, ref) => {
    return (
      <div className="input-wrapper">
        {label && (
          <label className="input-label" htmlFor={id}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          type="email"
          autoComplete="email"
          className={`input-field ${error ? 'input-field--error' : ''}`}
          placeholder="Digite seu e-mail"
          {...props}
        />
        {error && <span className="input-error">{error}</span>}
        {hint && !error && <span className="input-hint">{hint}</span>}
      </div>
    );
  }
);

EmailInput.displayName = 'EmailInput';
