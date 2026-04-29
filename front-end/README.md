# Teddy Open Finance - Front-end (Web)

Interface administrativa premium do Teddy Open Finance, desenvolvida com **React**, **Vite** e **TypeScript**. O foco está na experiência do usuário (UX), performance e design moderno.

## 🛠 Tecnologias Principais
- **Framework:** React 19 + Vite
- **Estilização:** CSS Custom Properties (Aesthetics Premium)
- **Estado & Rotas:** React Router 7
- **Consumo de API:** Axios (com Interceptors para JWT)
- **Qualidade:** Vitest & Playwright

## 📋 Pré-requisitos
- Node.js 22.x
- API do Backend rodando em `http://localhost:3000` (ou conforme configurado)

## ⚙️ Variáveis de Ambiente
Crie um arquivo `.env` na pasta do projeto ou na raiz:
```env
VITE_API_URL=http://localhost:3000/api/v1
```

## 🚀 Como Rodar
Você pode rodar este projeto de forma isolada através do terminal na raiz do monorepo:

### Desenvolvimento
```bash
npx nx serve front-end
```

### Testes Unitários (Vitest)
```bash
npx nx test front-end
```

### Testes E2E (Playwright)
```bash
npx nx e2e front-end-e2e
```

### Docker Compose (Isolado)
Para rodar apenas o frontend em um container (útil para testar o build de produção localmente):

1. Certifique-se de que a rede `teddy-network` existe:
   ```bash
   docker network create teddy-network
   ```
2. Suba o container:
   ```bash
   docker compose up -d
   ```
O frontend ficará disponível em `http://localhost:4200`.


## 🎨 Design System
O projeto utiliza um sistema de design proprietário focado em:
- **Vibrant Colors:** Paleta harmoniosa e modo escuro/claro nativo via variáveis CSS.
- **Glassmorphism:** Efeitos de transparência e profundidade.
- **Micro-interações:** Hover effects e transições suaves em todos os botões e cards.
