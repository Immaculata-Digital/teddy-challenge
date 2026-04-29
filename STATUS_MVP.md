### 1. Observabilidade & Health (Backend)
- [x] **`GET /healthz`:** Criar um módulo de healthcheck (geralmente usando `@nestjs/terminus`) para verificar se o banco de dados e a aplicação estão vivos.
- [x] **`GET /metrics`:** Implementar endpoint expondo formato Prometheus para coleta de métricas (usando pacotes como `@willsoto/nestjs-prometheus` e `prom-client`).
- [x] **Logs de Auditoria:** A tabela `audit_logs` já supre a necessidade de rastreabilidade para o MVP (quem, quando, IP, origem e diff de dados).

### 2. Documentação da API (Backend)
- [x] **Swagger em `/docs`:** Interface visual da API configurada e funcional para testes de endpoints.

### 3. Testes & Qualidade (Ambos)
- [x] **Testes Unitários:** Desenvolver os testes em Jest para regras de negócio críticas do Backend (ex: `ClientsService`, `MetricsService`) e testes de componentes no Frontend.
- [x] **Testes E2E (Diferencial):** Configurar um ambiente de testes de ponta a ponta (Sugestão: Cypress ou Playwright no Frontend, Supertest no Backend).

### 4. Infraestrutura & Docker
- [x] **Arquivos `docker-compose.yml` Isolados:** Criado o `docker-compose.yml` raiz (Full Stack/Infra) e arquivos isolados em `/front-end` e `/back-end` para deploys granulares.
- [x] **Arquivos `README.md` Individuais:** Documentação técnica específica criada para `/front-end` e `/back-end`.

### 5. Pipelines e CI/CD
- [x] **GitHub Actions:** Esteira completa de CI/CD configurada em `.github/workflows/ci-cd.yml` com validação, build Docker e deploy automático para VPS.

### 6. Entrega Final (Documentação Raiz)
- [ ] **Diagrama da Arquitetura AWS:** Desenhar uma topologia cloud que faria sentido para a aplicação (ex: ALB -> ECS Fargate -> RDS PostgreSQL -> Elasticache Redis) e adicionar a imagem ao repositório.
- [x] **README Raiz Completo:**
  - Visão Geral do projeto.
  - Como subir o ambiente local completo.
  - Explicação teórica sobre escalabilidade baseada no diagrama cloud.
  - **Obrigatório:** Explicar *por que* as práticas de observabilidade (Logs estruturados, Healthcheck e Metrics) inseridas no código são fundamentais para sustentar essa arquitetura cloud de forma resiliente.
