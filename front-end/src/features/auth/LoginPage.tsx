import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailInput } from '../../shared/components/EmailInput/EmailInput';
import { PasswordInput } from '../../shared/components/PasswordInput/PasswordInput';
import { Button } from '../../shared/components/Button/Button';
import { authService } from '../../shared/services/auth.service';
import { useAuth } from '../../shared/contexts/AuthContext';
import './LoginPage.css';

interface LoginForm {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const { loginState } = useAuth();
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!form.email) {
      newErrors.email = 'E-mail é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Informe um e-mail válido.';
    }
    if (!form.password) {
      newErrors.password = 'Senha é obrigatória.';
    } else if (form.password.length < 6) {
      newErrors.password = 'A senha deve ter no mínimo 6 caracteres.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await authService.login(form);
      loginState(response.user, response.access_token);
      navigate('/');
    } catch (err: any) {
      setGlobalError(err.message || 'Erro ao realizar login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo-wrap">
          <img
            src="/images/logo-teddy.png"
            alt="Teddy Open Finance"
            className="login-logo"
          />
        </div>

        <div className="login-header">
          <h1 className="login-title">Bem-vindo de volta</h1>
          <p className="login-subtitle">Acesse sua conta para continuar.</p>
        </div>

        {globalError && (
          <div style={{ color: 'var(--color-error)', backgroundColor: 'var(--color-error-light)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', textAlign: 'center' }}>
            {globalError}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <EmailInput
            id="login-email"
            label="E-mail"
            value={form.email}
            onChange={(e) => {
              setForm((f) => ({ ...f, email: e.target.value }));
              if (errors.email) setErrors((err) => ({ ...err, email: undefined }));
            }}
            error={errors.email}
            autoFocus
          />

          <PasswordInput
            id="login-password"
            label="Senha"
            value={form.password}
            onChange={(e) => {
              setForm((f) => ({ ...f, password: e.target.value }));
              if (errors.password) setErrors((err) => ({ ...err, password: undefined }));
            }}
            error={errors.password}
          />

          <div className="login-actions">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Entrar
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              fullWidth
              onClick={() => navigate('/register')}
            >
              Não tem uma conta? Crie aqui
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
