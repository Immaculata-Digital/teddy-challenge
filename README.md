# Teddy Open Finance — Monorepo

Monorepo Nx para o desafio técnico da **Teddy Open Finance**, com front-end React + Vite e back-end NestJS + TypeORM.

---

## Como eu iniciei o projeto

````
# 1. Inicializar workspace Nx
npx -y create-nx-workspace@latest teddy-challenge \
  --preset=apps --nxCloud=skip --pm=npm --no-interactive

cd teddy-challenge

# 2. Instalar plugins Nx
npm install --save-dev @nx/react @nx/vite @nx/nest @nx/node \
  vitest @vitejs/plugin-react vite

# 3. Gerar app React no /front-end
npx nx g @nx/react:app web \
  --directory=front-end \
  --bundler=vite \
  --unitTestRunner=vitest \
  --style=css --routing=true --strict=true \
  --no-interactive

# 4. Gerar app NestJS no /back-end
npx nx g @nx/nest:app --name=api \
  --directory=back-end \
  --strict=true \
  --no-interactive

# 5. Instalar dependências de runtime
npm install @nestjs/common @nestjs/core @nestjs/platform-express \
  @nestjs/typeorm @nestjs/jwt @nestjs/passport typeorm pg \
  reflect-metadata class-validator class-transformer zod

# 6. Instalar devDependencies adicionais
npm install --save-dev @types/node @nestjs/testing jest @types/jest \
  passport passport-jwt passport-local @nestjs/passport \
  @nestjs/swagger swagger-ui-express
  
````


## 📁 Estrutura do Workspace

```
teddy-challenge/
├── front-end/              # App React + Vite + TypeScript
│   ├── src/
│   │   ├── app/            # Componente raiz, rotas
│   │   ├── features/       # Módulos de funcionalidades (clients, auth, etc.)
│   │   └── shared/         # Componentes, hooks, utils e serviços reutilizáveis
│   ├── Dockerfile          # Build multi-stage (contexto: raiz do monorepo)
│   ├── docker-compose.yml  # Stack completa (frontend + backend + postgres)
│   └── nginx.conf          # SPA fallback + cache de assets
│
├── back-end/               # App NestJS + TypeORM + PostgreSQL
│   ├── src/
│   │   ├── app/            # AppModule raiz
│   │   ├── auth/           # Autenticação JWT + Passport
│   │   ├── clients/        # CRUD de clientes (entidade principal)
│   │   ├── metrics/        # Endpoint de métricas
│   │   ├── common/         # Guards, filters, interceptors, pipes, decorators
│   │   └── config/         # ConfigModule + ConfigService tipado
│   ├── Dockerfile          # Build multi-stage NestJS
│   ├── docker-compose.yml  # PostgreSQL para desenvolvimento local
│   └── .env.example        # Template de variáveis de ambiente
│
├── libs/
│   └── shared/             # Biblioteca compartilhada (front + back)
│       └── src/
│           ├── interfaces/ # IUser, IClient, IPagination
│           ├── dtos/       # CreateClientDto, UpdateClientDto, PaginationDto
│           ├── schemas/    # Schemas Zod (client, auth, pagination)
│           └── constants/  # API_ENDPOINTS, PAGINATION_DEFAULTS
│
├── .github/
│   └── workflows/
│       └── ci.yml          # CI: lint → test → build (nx affected)
│
├── nx.json                 # Configuração Nx + targetDefaults + cacheableOperations
├── tsconfig.base.json      # TypeScript base com path aliases (@teddy/shared)
└── package.json            # Scripts unificados + todas as dependências
```

---

## 🚀 Início Rápido

### Pré-requisitos
- Node.js >= 22
- npm >= 10
- Docker + Docker Compose (comando `docker compose` ou `docker-compose`)

> **Dica (macOS):** Se o comando `docker` não for encontrado, instale via Homebrew:
> ```bash
> brew install --cask docker
> ```
> Após instalar, é necessário abrir o aplicativo **Docker** e aguardar o "Docker Engine" iniciar.

### Instalar dependências
```bash
npm install
```

### Variáveis de ambiente (back-end)
```bash
cp back-end/.env.example back-end/.env
# Edite back-end/.env com suas configurações
```

### Subir banco de dados (dev)
```bash
cd back-end && docker compose up -d
# Caso use a versão antiga: cd back-end && docker-compose up -d
```

### Rodar os apps
```bash
# Front-end (http://localhost:4200)
npm run start:frontend

# Back-end (http://localhost:3000/api/v1)
npm run start:backend

# Swagger Docs (http://localhost:3000/api/docs)
```

---

## 🛠️ Scripts Disponíveis

| Script | Descrição |
|---|---|
| `npm run start:frontend` | Inicia o front-end em modo dev |
| `npm run start:backend` | Inicia o back-end em modo dev |
| `npm run stop:backend` | Mata processos na porta 3000 (evita conflitos) |
| `npm run restart:backend` | Para e reinicia o backend limpo |
| `npm run migration:generate -- [caminho]/[nome]` | Gera nova migration baseada nas Entidades |
| `npm run migration:run` | Executa migrations pendentes no banco |
| `npm run migration:revert` | Desfaz a última migration executada |
| `npm run test` | Executa todos os testes |
| `npm run test:frontend` | Testes do front-end (Vitest) |
| `npm run test:backend` | Testes do back-end (Jest) |
| `npm run test:affected` | Testa apenas projetos afetados por mudanças |
| `npm run lint` | Lint em todos os projetos |
| `npm run lint:affected` | Lint apenas nos projetos afetados |
| `npm run build:all` | Build de todos os projetos |
| `npm run build:affected` | Build apenas nos projetos afetados |
| `npm run graph` | Visualizar o grafo de dependências Nx |
| `npm run format` | Formatar código com Prettier |

---

## 🗄️ Gerenciamento de Banco de Dados

Este projeto utiliza **TypeORM Migrations** para manter a integridade e o versionamento do banco de dados.

### Fluxo de Desenvolvimento
1. Altere uma entidade (ex: `user.entity.ts`).
2. Gere a migration:
   ```bash
   npm run migration:generate -- back-end/src/database/migrations/NomeDaMudanca
   ```
3. Aplique no banco:
   ```bash
   npm run migration:run
   ```

### Scripts de Auxílio
Para evitar erros de `EADDRINUSE` (porta já em uso), use os scripts de parada:
- `npm run stop:backend`: Limpa a porta 3000 se o processo ficar preso.
- `npm run restart:backend`: Atalho para parar e subir o backend em um único comando.

---

## 🐳 Docker & Containers

Este projeto está totalmente containerizado e utiliza uma arquitetura de `docker-compose` granular:

### 1. Stack Completa (Recomendado)
Para subir o Banco de Dados, o Back-end e o Front-end de uma única vez, use o arquivo na raiz:
```bash
docker compose up -d
```

### 2. Apenas Infraestrutura (Banco de Dados)
Se você quiser rodar o banco no Docker mas as aplicações localmente:
```bash
docker compose up -d postgres
```

### 3. Deploys Isolados
Cada aplicação possui seu próprio `docker-compose.yml` para casos de deploy independente:
- **Back-end:** `cd back-end && docker compose up -d`
- **Front-end:** `cd front-end && docker compose up -d`

> **Nota:** Os arquivos isolados utilizam uma rede externa chamada `teddy-network`. Caso suba apenas um deles, certifique-se de criar a rede manualmente com `docker network create teddy-network` ou suba a infra global primeiro.

---

## 📦 Libs Compartilhadas

O alias `@teddy/shared` está configurado em `tsconfig.base.json` e aponta para `libs/shared/src/index.ts`.

```typescript
// Importe de qualquer lugar no monorepo
import { IClient, CreateClientSchema, API_ENDPOINTS } from '@teddy/shared';
```

---

## 🔐 Autenticação

A API usa JWT Bearer Token. Obtenha o token via `POST /api/v1/auth/login` e inclua o header:
```
Authorization: Bearer <token>
```

---

## 📄 API Docs

Com o back-end rodando em dev: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## 🩺 Observabilidade & Health

Para garantir o monitoramento e a resiliência da aplicação (especialmente pensando em um ambiente Cloud como AWS), o projeto expõe os seguintes endpoints:

- **Healthcheck (`GET /api/v1/healthz`)**: Retorna o status de saúde da aplicação e a conectividade com o banco de dados (usando `@nestjs/terminus`). É um requisito fundamental para que Load Balancers (ex: AWS ALB) e Orquestradores (ex: Kubernetes, AWS ECS) saibam se a instância está viva e apta a receber tráfego, ou se precisa ser reiniciada (Self-healing).
- **Métricas (`GET /metrics`)**: Expõe as métricas internas da aplicação (CPU, Memória, requisições HTTP, etc.) no formato nativo do **Prometheus**. Esse formato é o padrão da indústria para observabilidade. Permite que ferramentas de scraping coletem esses dados para exibição em dashboards avançados no **Grafana** e a criação de alertas operacionais automáticos caso algo saia do esperado.

---

## 🧪 Testes & Qualidade

Para garantir a confiabilidade da aplicação e demonstrar a viabilidade técnica da arquitetura, implementamos suítes de testes automatizados em diferentes níveis:

### Testes Unitários
- **Back-end (Jest)**: Desenvolvemos testes isolados para regras de negócio críticas. Por exemplo, o `MetricsService` possui testes unitários (`metrics.service.spec.ts`) que utilizam *mocking* na injeção de dependências do TypeORM (`Repository` e `QueryBuilder`). O teste simula o retorno do banco e valida se os cálculos do Dashboard de KPIs, distribuição de salário e conversão de dados operam perfeitamente.
- **Front-end (Vitest + React Testing Library)**: Implementamos testes de componentes, como o `ClientCard.spec.tsx`. O teste assegura que as propriedades (como nomes e moedas BRL) são renderizadas corretamente no DOM e valida se os eventos de click (`onEdit`, `onDelete`, `onView`) disparam as *callback functions* injetadas da forma esperada.

### Testes End-to-End (E2E) - Diferencial
Fazemos uso da infraestrutura avançada gerada pelo Nx para testes de ponta a ponta em projetos isolados:
- **Front-end (Playwright)**: O diretório `front-end-e2e` conta com testes automatizados (`auth.spec.ts`) que controlam um navegador real. Eles validam os fluxos de navegação, provando que rotas protegidas (como o Dashboard) barram usuários sem token e que o roteamento para o registro funciona de fato.
- **Back-end (Supertest + Jest)**: A suíte E2E na pasta `back-end-e2e` já se encontra estruturada para testar a integração da API NestJS de ponta a ponta, enviando requisições HTTP reais para os *endpoints*.

### Como rodar os testes

**Testes Unitários:**
```bash
# Rodar todos os testes unitários do workspace
npm run test

# Rodar testes unitários apenas do Front-end (Vitest)
npx nx test front-end

# Rodar testes unitários apenas do Back-end (Jest)
npx nx test back-end
```

**Testes End-to-End (E2E):**
```bash
# Rodar testes E2E do Front-end (Playwright)
# Nota: Requer o frontend rodando na porta 4200
npx nx e2e front-end-e2e

# Rodar testes E2E do Back-end (Jest + Supertest)
npx nx e2e back-end-e2e
```

### O que nossos testes contemplam?

> **Nota sobre o MVP:** Os testes atualmente implementados focam nos fluxos mais críticos de infraestrutura, interatividade básica e integração, por se tratar de um produto em estágio **MVP** (Minimum Viable Product). Numa evolução do projeto, implementaríamos testes mais extensivos, focando em manipulação profunda de dados em todos os endpoints, "edge cases" de regras de negócios, e testes visuais (regression).

#### 1. Testes Unitários (Front-end)
* **Fluxo do Componente Base (App) `[app.spec.tsx]`:** Verifica se a aplicação inteira consegue ser inicializada com sucesso, validando se o React Router renderiza as páginas principais adequadamente sem quebras na tela.
* **Fluxo de Interatividade da UI `[ClientCard.spec.tsx]`:** Valida a apresentação do card de cliente, garantindo que o nome, salário (em BRL) e o valor da empresa sejam formatados e exibidos. Também cobre testes de eventos: simulando o clique natural do usuário nas opções de Visualizar, Editar e Excluir para certificar que os callbacks são acionados na interface Pai.

#### 2. Testes Unitários (Back-end)
* **Fluxo de Lógica de KPIs `[metrics.service.spec.ts]`:** Destinado à lógica de negócios complexa de geração do dashboard. Com o banco de dados sendo "mockado" (interceptado), simulamos as agregações do TypeORM e testamos se o `MetricsService` processa as somas corretas, entrega distribuições de métricas válidas e tira as médias da folha salarial dos clientes de forma determinística.

#### 3. Testes End-to-End (Front-end)
* **Fluxo de Navegação e Autorização `[auth.spec.ts]`:** Abre uma instância invisível de um navegador real (*Playwright*). O teste entra na aplicação e verifica o roteamento protegido (redirecionando da base para a página de `/login`). Também assegura a navegação fluída, localizando e interagindo ativamente com a interface ao clicar em criar um cadastro para validar se o usuário é guiado adequadamente para o `/register`.

#### 4. Testes End-to-End (Back-end)
* **Fluxo de Integridade Base da API `[api.spec.ts]`:** Efetua requisições HTTP reais de ponta a ponta na API conectada (`Axios`/`Supertest`). O teste visa o endpoint central da infraestrutura do Terminus `GET /api/v1/healthz`. O objetivo é validar que o banco de dados inicializou com sucesso e a API do NestJS está aceitando conexões, checando se a resposta é `200 OK` associado a um payload `status: 'ok'`.

---

## 🏛️ Visão Geral e Arquitetura

A escolha por um **Monorepo com Nx** permite o compartilhamento de contratos (DTOs) e validações (Zod) entre as pontas, garantindo que o Backend e o Frontend falem a mesma língua sem duplicação de código.

### ☁️ Escalabilidade e Nuvem (AWS)

Embora o projeto rode localmente via Docker Compose, ele foi arquitetado para ser "Cloud Ready". Em um ambiente de produção (ex: AWS), a topologia recomendada seria:

1.  **Ingresso de Dados:** Um **Application Load Balancer (ALB)** distribuindo tráfego HTTPS.
2.  **Compute:** Instâncias do **ECS Fargate** para o Back-end, permitindo o *Auto Scaling* baseado no consumo de CPU/Memória. O Front-end seria servido via **S3 + CloudFront** (CDN) para baixíssima latência.
3.  **Banco de Dados:** Um **RDS PostgreSQL** com Multi-AZ para alta disponibilidade e backups automáticos.
4.  **Cache/Performance:** Um cluster **ElastiCache (Redis)** para reduzir a carga no banco em consultas repetitivas de métricas.

---

## 📊 Observabilidade e Resiliência

Uma arquitetura de microsserviços ou aplicações distribuídas em nuvem só é sustentável com **Observabilidade**. Implementamos três pilares fundamentais:

### 1. Healthchecks (`GET /healthz`)
**Por que é fundamental?** No Kubernetes ou ECS, o orquestrador precisa saber se o container está "vivo" (Liveness) e "pronto para receber tráfego" (Readiness). O endpoint de healthcheck automatiza o self-healing: se o container trava ou perde a conexão com o banco, o orquestrador o reinicia automaticamente antes que o usuário sinta a falha.

### 2. Métricas e Prometheus (`GET /metrics`)
**Por que é fundamental?** "O que não é medido não é gerenciado". Através das métricas expostas, conseguimos criar dashboards no Grafana para monitorar a taxa de erro, tempo de resposta e consumo de recursos. Isso permite que o time antecipe problemas de performance antes que eles causem indisponibilidade.

### 3. Logs de Auditoria e Estruturados
**Por que é fundamental?** Em sistemas financeiros, a rastreabilidade é inegociável. Nossa tabela de `audit_logs` garante o "Quem, Quando e Onde" de cada mudança.

---

## 📝 Considerações do MVP
Este projeto foi desenvolvido seguindo as melhores práticas de Clean Code, SOLID e Dry. Por ser um MVP, o foco foi na solidez da infraestrutura e nos fluxos críticos de negócio, garantindo uma base que pode escalar tanto em código quanto em infraestrutura sem necessidade de refatoração pesada.


## Justificativas do porquê utilizar:

## Docker
O Docker foi utilizado para garantir que o ambiente de desenvolvimento fosse consistente com o ambiente de produção. Além disso, o Docker Compose foi utilizado para facilitar a orquestração dos serviços, permitindo que o desenvolvimento e o teste fossem realizados de forma isolada.

## Github Actions
O Github Actions foi utilizado para automatizar o processo de CI/CD, garantindo que as alterações fossem testadas e implantadas de forma consistente. 

## Nginx
O Nginx foi utilizado para servir o front-end de forma estática, além de atuar como proxy reverso para o back-end.

## Nx Monorepo
O Nx foi utilizado para gerenciar o monorepo, permitindo que o desenvolvimento e o teste fossem realizados de forma isolada. Além disso, o Nx permite o compartilhamento de contratos (DTOs) e validações (Zod) entre as pontas, garantindo que o Backend e o Frontend falem a mesma língua sem duplicação de código.

## TypeORM com Clean Code
O TypeORM foi utilizado para persistir os dados no banco de dados, seguindo os princípios de Clean Code e SOLID. 

## JWT
O JWT foi utilizado para autenticação e autorização dos usuários.

## JEST
O Jest foi utilizado para testar o back-end, garantindo que as alterações fossem testadas e implantadas de forma consistente. 

## Playwright
O Playwright foi utilizado para testar o front-end, garantindo que as alterações fossem testadas e implantadas de forma consistente. 

## Prettier
O Prettier foi utilizado para formatar o código, garantindo que as alterações fossem testadas e implantadas de forma consistente. 

## ESLint
O ESLint foi utilizado para garantir que o código fosse consistente, seguindo as melhores práticas de Clean Code e SOLID. 

## Prometheus
O Prometheus foi utilizado para monitorar o back-end, garantindo que as alterações fossem testadas e implantadas de forma consistente. 

