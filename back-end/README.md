# Teddy Open Finance - Back-end (API)

Esta é a API robusta do ecossistema Teddy Open Finance, construída com **NestJS**, **TypeORM** e **PostgreSQL**. Ela fornece autenticação JWT, gestão de clientes com auditoria automática e endpoints de observabilidade.

## 🛠 Tecnologias Principais
- **Framework:** NestJS
- **Banco de Dados:** PostgreSQL (TypeORM)
- **Documentação:** Swagger (OpenAPI)
- **Observabilidade:** Prometheus & Terminus (Healthcheck)
- **Segurança:** Passport JWT & Bcrypt

## 📋 Pré-requisitos
- Node.js 22.x
- Instância do PostgreSQL rodando (ou via Docker)

## ⚙️ Variáveis de Ambiente
Crie um arquivo `.env` na raiz do monorepo (ou passe via env do sistema) com:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=teddy
DB_PASS=teddy_secret
DB_NAME=teddy_db
JWT_SECRET=sua_chave_secreta_aqui
PORT=3000
```

## 🚀 Como Rodar
Você pode rodar este projeto de forma isolada através do terminal na raiz do monorepo:

### Desenvolvimento
```bash
npx nx serve api
```

### Testes Unitários
```bash
npx nx test back-end
```

### Docker Compose (Isolado)
Para rodar a API isoladamente via Docker:

1. Certifique-se de que a rede `teddy-network` existe e o banco de dados está acessível:
   ```bash
   docker network create teddy-network
   ```
2. Suba o container:
   ```bash
   docker compose up -d
   ```
A API ficará disponível em `http://localhost:3000/api/v1`.


## 📄 Documentação
Após iniciar o servidor, a documentação Swagger estará disponível em:
`http://localhost:3000/api/docs`

## 🏥 Healthcheck & Metrics
- **Health:** `GET /api/v1/healthz`
- **Metrics:** `GET /api/v1/metrics`
