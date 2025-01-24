# Notoriun Self Registration

Sistema de auto-registro com verificação de email e localização geográfica.

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

### Variáveis de Ambiente

#### Backend (.env)
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=user
DATABASE_PASSWORD=password
DATABASE_NAME=mydatabase
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user
SMTP_PASS=password
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_ARCGIS_API_KEY=your_arcgis_key
```

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd notoriun-self-registration
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

4. Inicie os containers:
```bash
docker-compose up -d
```

### Desenvolvimento

```bash
# Desenvolvimento de todos os pacotes
pnpm dev

# Desenvolvimento específico
pnpm --filter web dev
pnpm --filter api dev

# Build
pnpm build

# Testes
pnpm test
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