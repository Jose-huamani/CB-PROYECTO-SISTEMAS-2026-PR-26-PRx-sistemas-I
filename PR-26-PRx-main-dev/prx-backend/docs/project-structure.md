├── package-lock.json
├── package.json
├── prisma
│   ├── migrations
│   │   ├── 20260410231023_init
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── prisma.config.ts
├── src
│   ├── app.module.ts
│   ├── config
│   │   ├── env.config.ts
│   │   └── swagger.config.ts
│   ├── main.ts
│   ├── modules
│   │   ├── auth
│   │   │   ├── application
│   │   │   │   ├── commands
│   │   │   │   │   ├── confirm-register
│   │   │   │   │   │   ├── confirm-register.command.ts
│   │   │   │   │   │   └── confirm-register.handler.ts
│   │   │   │   │   ├── forgot-password
│   │   │   │   │   │   ├── forgot-password.command.ts
│   │   │   │   │   │   └── forgot-password.handler.ts
│   │   │   │   │   ├── login
│   │   │   │   │   │   ├── login.command.ts
│   │   │   │   │   │   └── login.handler.ts
│   │   │   │   │   ├── logout
│   │   │   │   │   │   ├── logout.command.ts
│   │   │   │   │   │   └── logout.handler.ts
│   │   │   │   │   ├── refresh-token
│   │   │   │   │   │   ├── refresh-token.command.ts
│   │   │   │   │   │   └── refresh-token.handler.ts
│   │   │   │   │   ├── register-request
│   │   │   │   │   │   ├── register-request.command.ts
│   │   │   │   │   │   └── register-request.handler.ts
│   │   │   │   │   ├── resend-verification-code
│   │   │   │   │   │   ├── resend-verification-code.command.ts
│   │   │   │   │   │   └── resend-verification-code.handler.ts
│   │   │   │   │   └── reset-password
│   │   │   │   │       ├── reset-password.command.ts
│   │   │   │   │       └── reset-password.handler.ts
│   │   │   │   ├── dto
│   │   │   │   │   ├── requests
│   │   │   │   │   │   ├── confirm-register.dto.ts
│   │   │   │   │   │   ├── forgot-password.dto.ts
│   │   │   │   │   │   ├── login.dto.ts
│   │   │   │   │   │   ├── logout.dto.ts
│   │   │   │   │   │   ├── refresh-token.dto.ts
│   │   │   │   │   │   ├── register-request.dto.ts
│   │   │   │   │   │   ├── resend-code.dto.ts
│   │   │   │   │   │   └── reset-password.dto.ts
│   │   │   │   │   └── responses
│   │   │   │   │       └── auth-response.dto.ts
│   │   │   │   ├── mappers
│   │   │   │   │   └── auth-response.mapper.ts
│   │   │   │   └── queries
│   │   │   │       └── me
│   │   │   │           ├── me.handler.ts
│   │   │   │           └── me.query.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── domain
│   │   │   │   ├── entities
│   │   │   │   │   ├── password-reset.entity.ts
│   │   │   │   │   ├── refresh-token.entity.ts
│   │   │   │   │   ├── session.entity.ts
│   │   │   │   │   └── verification-code.entity.ts
│   │   │   │   └── repositories
│   │   │   │       ├── password-reset.repository.ts
│   │   │   │       ├── refresh-token.repository.ts
│   │   │   │       ├── session.repository.ts
│   │   │   │       └── verification-code.repository.ts
│   │   │   ├── infrastructure
│   │   │   │   ├── adapters
│   │   │   │   │   ├── bcrypt.service.ts
│   │   │   │   │   ├── jwt-token.service.ts
│   │   │   │   │   └── verification-code.service.ts
│   │   │   │   ├── mappers
│   │   │   │   │   ├── password-reset-prisma.mapper.ts
│   │   │   │   │   ├── refresh-token-prisma.mapper.ts
│   │   │   │   │   ├── session-prisma.mapper.ts
│   │   │   │   │   └── verification-code-prisma.mapper.ts
│   │   │   │   └── persistence
│   │   │   │       ├── prisma-password-reset.repository.ts
│   │   │   │       ├── prisma-refresh-token.repository.ts
│   │   │   │       ├── prisma-session.repository.ts
│   │   │   │       └── prisma-verification-code.repository.ts
│   │   │   └── presentation
│   │   │       └── controllers
│   │   │           └── auth.controller.ts
│   │   └── users
│   │       ├── application
│   │       │   ├── dto
│   │       │   │   └── responses
│   │       │   │       └── user-response.dto.ts
│   │       │   ├── mappers
│   │       │   │   └── user-response.mapper.ts
│   │       │   └── queries
│   │       │       ├── get-user-by-id
│   │       │       │   ├── get-user-by-id.handler.ts
│   │       │       │   └── get-user-by-id.query.ts
│   │       │       └── get-users
│   │       │           ├── get-users.handler.ts
│   │       │           └── get-users.query.ts
│   │       ├── domain
│   │       │   ├── entities
│   │       │   │   └── user.entity.ts
│   │       │   └── repositories
│   │       │       └── user.repository.ts
│   │       ├── infrastructure
│   │       │   ├── mappers
│   │       │   │   └── user-prisma.mapper.ts
│   │       │   └── persistence
│   │       │       └── prisma-user.repository.ts
│   │       ├── presentation
│   │       │   └── controllers
│   │       │       └── users.controller.ts
│   │       └── users.module.ts
│   └── shared
│       ├── application
│       │   ├── decorators
│       │   │   ├── transforms
│       │   │   │   ├── no-spaces.decorator.ts
│       │   │   │   ├── normalize-spaces.decorator.ts
│       │   │   │   ├── slugify.decorator.ts
│       │   │   │   ├── to-lowercase.decorator.ts
│       │   │   │   └── to-uppercase.decorator.ts
│       │   │   └── validators
│       │   │       └── is-hex-color.decorator.ts
│       │   └── dto
│       │       ├── api-response.dto.ts
│       │       └── paginated-response.dto.ts
│       ├── constants
│       │   ├── auth.constants.ts
│       │   ├── messages.constants.ts
│       │   ├── pagination.constants.ts
│       │   └── storage.constants.ts
│       ├── domain
│       │   ├── auditable.entity.ts
│       │   ├── base.entity.ts
│       │   ├── ports-example
│       │   │   ├── find-all.repository.port.ts
│       │   │   └── find-paginated.repository.port.ts
│       │   ├── repository.port.ts
│       │   └── use-case.ts
│       ├── enums
│       │   └── token-type.enum.ts
│       ├── infrastructure
│       │   ├── avatar
│       │   │   └── avatar.service.ts
│       │   ├── mail
│       │   │   ├── assets
│       │   │   │   └── prx-logo.png
│       │   │   ├── mail.module.ts
│       │   │   ├── mail.service.ts
│       │   │   └── templates
│       │   │       ├── auth
│       │   │       │   ├── forgot-password.template.ts
│       │   │       │   ├── register-request.template.ts
│       │   │       │   └── resend-verification-code.template.ts
│       │   │       ├── layouts
│       │   │       │   └── base.layout.ts
│       │   │       └── partials
│       │   │           └── code-email.template.ts
│       │   ├── persistence
│       │   │   └── base-prisma.repository.ts
│       │   ├── prisma
│       │   │   ├── prisma.module.ts
│       │   │   └── prisma.service.ts
│       │   └── storage
│       │       ├── storage.module.ts
│       │       └── tigris-storage.service.ts
│       ├── presentation
│       │   ├── decorators
│       │   │   ├── current-user.decorator.ts
│       │   │   ├── public.decorator.ts
│       │   │   └── roles.decorator.ts
│       │   ├── filters
│       │   │   └── http-exception.filter.ts
│       │   ├── guards
│       │   │   ├── custom-throttler.guard.ts
│       │   │   ├── jwt-auth.guard.ts
│       │   │   └── roles.guard.ts
│       │   └── interceptors
│       │       └── transform-response.interceptor.ts
│       ├── types
│       │   ├── jwt-base-payload.type.ts
│       │   ├── jwt-payload.type.ts
│       │   └── tigris-config.type.ts
│       └── utils
│           ├── env.util.ts
│           └── time.util.ts
├── tsconfig.build.json
└── tsconfig.json