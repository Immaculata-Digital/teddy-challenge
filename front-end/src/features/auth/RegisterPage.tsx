import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, EmailInput, PasswordInput, Button } from '../../shared/components';
import { authService } from '../../shared/services/auth.service';
import { useAuth } from '../../shared/contexts/AuthContext';
import './RegisterPage.css';

interface RegisterForm {
  fullName: string;
  email: string;
  password: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { loginState } = useAuth();
  const [form, setForm] = useState<RegisterForm>({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!form.fullName) {
      newErrors.fullName = 'Nome completo é obrigatório.';
    } else if (form.fullName.length < 2) {
      newErrors.fullName = 'Informe um nome válido.';
    }
    
    if (!form.email) {
      newErrors.email = 'E-mail é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Informe um e-mail válido.';
    }
    
    if (!form.password) {
      newErrors.password = 'Senha é obrigatória.';
    } else if (form.password.length < 6) {
      newErrors.password = 'A senha deve ter no mínimo 6 caracteres.';
    } else if (form.password.length < 8) {
      // Just a tip, the back-end usually demands 8 characters based on DTO
      newErrors.password = 'A senha deve ter no mínimo 8 caracteres.';
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
      const response = await authService.register(form);
      loginState(response.user, response.access_token);
      navigate('/');
    } catch (err: any) {
      setGlobalError(err.message || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-logo-wrap">
          <img
            src="/images/logo-teddy.png"
            alt="Teddy Open Finance"
            className="register-logo"
          />
        </div>

        <div className="register-header">
          <h1 className="register-title">Crie sua conta</h1>
          <p className="register-subtitle">Preencha seus dados para começar.</p>
        </div>

        {globalError && (
          <div style={{ color: 'var(--color-error)', backgroundColor: 'var(--color-error-light)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', textAlign: 'center' }}>
            {globalError}
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <TextInput
            id="register-fullname"
            label="Nome Completo"
            placeholder="Digite seu nome"
            value={form.fullName}
            onChange={(e) => {
              setForm((f) => ({ ...f, fullName: e.target.value }));
              if (errors.fullName) setErrors((err) => ({ ...err, fullName: undefined }));
            }}
            error={errors.fullName}
            autoFocus
          />
          
          <EmailInput
            id="register-email"
            label="E-mail"
            value={form.email}
            onChange={(e) => {
              setForm((f) => ({ ...f, email: e.target.value }));
              if (errors.email) setErrors((err) => ({ ...err, email: undefined }));
            }}
            error={errors.email}
          />

          <PasswordInput
            id="register-password"
            label="Senha"
            value={form.password}
            onChange={(e) => {
              setForm((f) => ({ ...f, password: e.target.value }));
              if (errors.password) setErrors((err) => ({ ...err, password: undefined }));
            }}
            error={errors.password}
            hint="Mínimo 8 caracteres."
          />

          <div className="register-actions">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Cadastrar
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              fullWidth
              disabled={loading}
              onClick={() => navigate('/login')}
            >
              Já tem uma conta? Entrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
