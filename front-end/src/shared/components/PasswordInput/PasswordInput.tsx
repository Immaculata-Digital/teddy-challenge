import React, { forwardRef, useState } from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label = 'Senha', error, hint, id = 'password', ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="input-wrapper">
        {label && (
          <label className="input-label" htmlFor={id}>
            {label}
          </label>
        )}
        <div className="input-password-wrap">
          <input
            ref={ref}
            id={id}
            type={visible ? 'text' : 'password'}
            autoComplete="current-password"
            className={`input-field input-field--password ${error ? 'input-field--error' : ''}`}
            placeholder="Digite sua senha"
            {...props}
          />
          <button
            type="button"
            className="input-toggle-visibility"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {visible ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
        {error && <span className="input-error">{error}</span>}
        {hint && !error && <span className="input-hint">{hint}</span>}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
