# Desafio Fullstack Notoriun

## Para testar a aplicação, acesse: [https://notoriunweb.ojostechnology.com](https://notoriunweb.ojostechnology.com)
![image](https://github.com/user-attachments/assets/2e4166bb-5f72-4a1e-896a-83f6593372c5)

Desafio Fullstack para empresa Notoriun - Sistema de auto-registro com verificação de email e localização geográfica.
## Video Demonstrativo
Para ver uma demonstração de como rodar o projeto localmente, acesse: [https://drive.google.com/file/d/1eSw0b_dEOpiHqDpzwHZXjYzj6TtTXgZo/view?usp=sharing](https://drive.google.com/file/d/1eSw0b_dEOpiHqDpzwHZXjYzj6TtTXgZo/view?usp=sharing)

## Funcionalidades Principais

- Registro de usuário em múltiplas etapas
- Verificação de email com código de 6 dígitos
- Autenticação JWT
- Seleção de localização via mapa interativo
- Dashboard administrativo
- Interface responsiva e moderna
- Gerenciamento de estado com Pinia
- Proteção de rotas
- Sistema de notificações toast

## Tecnologias

### Frontend (Vue.js)
- Vue 3 com Composition API
- TypeScript
- Vite para build e desenvolvimento
- Pinia para gerenciamento de estado
- Vue Router para navegação
- ArcGIS API para JavaScript (@arcgis/core) para mapas
- Tailwind CSS para estilização
- Shadcn Vue para componentes de UI
- Axios para requisições HTTP
- Lucide Vue para ícones

### Backend (NestJS)
- NestJS como framework
- TypeORM para ORM
- PostgreSQL como banco de dados
- JWT para autenticação
- Bcrypt para hash de senhas
- Nodemailer para envio de emails
- Class Validator e Class Transformer
- Handlebars para templates de email

### DevOps & Ferramentas
- Docker e Docker Compose
- Turborepo para monorepo
- PNPM como gerenciador de pacotes
- ESLint e Prettier para linting e formatação

## Estrutura do Projeto

```
/apps
  /web          # Frontend Vue.js
    /src
      /components   # Componentes reutilizáveis
      /views       # Páginas da aplicação
      /stores      # Store Pinia
      /lib         # Configurações e utilitários
  /api          # Backend NestJS
    /src
      /auth        # Autenticação e JWT
      /users       # Gerenciamento de usuários
      /mailer      # Serviço de email
      /config      # Configurações
```

## Fluxo de Registro

1. **Registro Inicial**
   - Nome, email, telefone
   - Validação de campos
   - Envio de código de verificação

2. **Verificação de Email**
   - Código de 6 dígitos
   - Expiração em 1 hora
   - Reenvio de código

3. **Completar Registro**
   - Senha
   - CNPJ
   - Informações adicionais

4. **Configuração de Localização**
   - Seleção via mapa interativo
   - Busca de endereços
   - Geocodificação reversa

## Setup do Projeto

### Pré-requisitos
- Node.js >= 20
- PNPM >= 8
- Docker e Docker Compose
- PostgreSQL

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Deyvi-dev/challenge-notoriun
cd challenge-notoriun
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:

#### Backend (.env)
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=postgres
JWT_SECRET=your_jwt_secret
EMAIL_HOST=localhost
EMAIL_PORT=1025
EMAIL_USERNAME=test@example
EMAIL_PASSWORD=test123
EMAIL_SECURE=false
EMAIL_FROM=test@example
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

4. Inicie os containers:
```bash
docker compose -f docker-compose.dev.yml  up -d
```

### Desenvolvimento

1. Primeiro, execute as migrações do banco de dados:
```bash

# Execute as migrações pendentes

pnpm --filter api migration:run

```

2. Inicie os serviços:
```bash
# Desenvolvimento do frontend
pnpm --filter web dev

# Desenvolvimento do backend (em outro terminal)
pnpm --filter api start:dev

# Ou para rodar todos os serviços simultaneamente
pnpm dev
```

3. Acesse:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Database Migrations

```bash

# Run pending migrations
pnpm --filter api migration:run

# Revert last migration
pnpm --filter api migration:revert
```

## Segurança

- Autenticação JWT com expiração
- Hash de senhas com Bcrypt
- Proteção contra CSRF
- Validação de dados em ambas as camadas
- Rate limiting
- Sanitização de inputs

## API Endpoints

### Autenticação
- `POST /auth/login` - Login
- `GET /auth/me` - Perfil do usuário autenticado

### Usuários
- `POST /users` - Criar usuário
- `POST /users/verify-email` - Verificar email
- `POST /users/resend-code/:email` - Reenviar código
- `PUT /users/profile` - Atualizar perfil
- `PUT /users/profile/location` - Atualizar localização
