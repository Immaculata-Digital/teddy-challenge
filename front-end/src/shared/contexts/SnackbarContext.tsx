import React, { createContext, useContext, useState, useCallback } from 'react';
import '../components/Snackbar/Snackbar.css';

type SnackbarType = 'success' | 'error';

interface SnackbarMessage {
  id: number;
  type: SnackbarType;
  message: string;
}

interface SnackbarContextData {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextData>({} as SnackbarContextData);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<SnackbarMessage[]>([]);

  const removeMessage = useCallback((id: number) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  const addMessage = useCallback((type: SnackbarType, message: string) => {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, type, message }]);

    // Auto remove após 5 segundos
    setTimeout(() => {
      removeMessage(id);
    }, 5000);
  }, [removeMessage]);

  const showSuccess = useCallback((message: string) => addMessage('success', message), [addMessage]);
  const showError = useCallback((message: string) => addMessage('error', message), [addMessage]);

  return (
    <SnackbarContext.Provider value={{ showSuccess, showError }}>
      {children}
      <div className="snackbar-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`snackbar ${msg.type}`}>
            <div className="snackbar-content">{msg.message}</div>
            <button className="snackbar-close" onClick={() => removeMessage(msg.id)}>
              &times;
            </button>
          </div>
        ))}
      </div>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
