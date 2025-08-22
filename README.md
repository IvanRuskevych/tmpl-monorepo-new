# 🚀 Monorepo Setup Guide

Цей документ описує покрокову інструкцію створення **Monorepo** з `frontend (Vite + React + TS)` та
`backend (Express + TS)`.

---

## 📂 Структура проєкту

```
monorepo/
├── package.json
├── tsconfig.base.json
├── node_modules/
├── packages/
│   ├── frontend/      <-- frontend (Vite + React + TS)
│   └── backend/       <-- backend (Express + TS)
└── eslint.config.js
```

---

## ✅ Крок 1: Ініціалізація монорепо

```bash
    mkdir monorepo
    cd monorepo
    npm init -y
```

Додай у `package.json`:

```json
{
    "private"    : true,
    "workspaces" : [ "packages/*" ],
    "type"       : "module"
}
```

> 💡 **Примітка:** Workspaces — вбудована функція `npm` (починаючи з npm 7+).

---

## 🐶 Крок 2: Husky + lint-staged (pre-commit)

### 📦 Встановлення

```bash
    yarn add -D --exact husky lint-staged
    npx husky init
```

Це створить папку `.husky/` із файлом `pre-commit`.

🔧 Заміни вміст `.husky/pre-commit` на:

```
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

⚙️ Створи файл **`.lintstagedrc`**:

```json
{
    "*.{ts,tsx}" : [
        "eslint --fix",
        "prettier --write"
    ]
}

```

- або додай у `package.json`:

```json
{
    "lint-staged" : {
        "*.{ts,tsx}" : [
            "eslint --fix",
            "prettier --write"
        ]
    }
}
```

### 🧪 Перевірка Husky

```bash
    git add .
    git commit -m "test"
# Husky запустить ESLint + Prettier тільки для змінених .ts/.tsx файлів
```

---

## ⚙️ Крок 3: Налаштування TypeScript

Створи **tsconfig.base.json** у корені:

```json
{
    "compilerOptions" : {
        /* 📚 Type Support */
        "typeRoots"                        : [ "./src/types", "./node_modules/@types" ],
        
        /* 🧠 Strictness & Type Safety */
        "strict"                           : true,
        "strictNullChecks"                 : true,
        "noImplicitAny"                    : true,
        "noUnusedLocals"                   : true,
        "noUnusedParameters"               : true,
        "noFallthroughCasesInSwitch"       : true,
        "forceConsistentCasingInFileNames" : true,
        "skipLibCheck"                     : true,
        "isolatedModules"                  : true,
        "resolveJsonModule"                : true,
        
        /* 🌐 Module Interop */
        "allowSyntheticDefaultImports"     : true,
        "esModuleInterop"                  : true
    },
    
    /* 📁 File System Scope */
    "exclude"         : [ "node_modules", "dist", "**/*.spec.ts" ]
}

```

---

## 🎨 Крок 4: Ініціалізація фронтенду (Vite + React + TS)

```bash
    mkdir packages/frontend
    cd packages/frontend
    yarn create vite .
```

Встанови залежності для користування alias-ами в імпортах:

```bash
  yarn add -D vite-tsconfig-paths
```

🔧 Налаштуй **vite.config.ts**:

```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          mui: ['@emotion/react', '@emotion/styled', '@mui/icons-material', '@mui/material'],
        },
      },
    },
  },
})
```

Оновити tsconfig налаштування:

- без змін: `packages/frontend/tsconfig.node.json` та `packages/frontend/tsconfig.json`
- замінити: `packages/frontend/tsconfig.app.json`
- створити: `packages/frontend/tsconfig.eslint.json`

📌 Змінити `tsconfig.app.json`:

```json
{
    "extends"         : "../../tsconfig.base.json",
    
    "compilerOptions" : {
        /* 🎯 Target & Environment */
        "target"                       : "ES2022",
        "lib"                          : [ "ES2022", "DOM", "DOM.Iterable" ],
        
        /* 🔧 Module settings & Bundler */
        "module"                       : "ESNext",
        "moduleResolution"             : "bundler",
        "moduleDetection"              : "force",
        "allowImportingTsExtensions"   : true,
        "verbatimModuleSyntax"         : true,
        
        /* 📤 Output & Build Info */
        "tsBuildInfoFile"              : "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
        "noEmit"                       : true,
        "sourceMap"                    : true,
        "declaration"                  : true,
        "declarationMap"               : true,
        "removeComments"               : true,
        
        /* 🧠 Strictness & Type Safety specific for frontend */
        "noUncheckedSideEffectImports" : true,
        "erasableSyntaxOnly"           : true,
        
        /* 📚 Type Support */
        "types"                        : [ "vite/client" ],
        
        /* ⚛ JSX & React */
        "jsx"                          : "react-jsx",
        "useDefineForClassFields"      : true,
        
        /* 🔗 Path Aliases */
        "baseUrl"                      : ".",
        "paths"                        : { "~/*" : [ "./src/*" ] }
    },
    
    /* 📁 File System Scope */
    "include"         : [ "src", "vite.config.ts", "codegen.ts" ],
    "exclude"         : [ "node_modules", "dist", "**/*.spec.ts" ]
}

```

📌 Створити `tsconfig.eslint.json`:

```json
{
    "extends" : "./tsconfig.app.json",
    "include" : [
        "src",
        "vite.config.ts",
        "vite-env.d.ts"
    ]
}

```

---

## 🧹 Крок 5: ESLint + Prettier (загальні)

Встанови залежності у корені:

```bash
    yarn add -D --exact \
     prettier \
     typescript typescript-eslint \
     eslint @eslint/js \
     eslint-plugin-react-hooks eslint-plugin-react-refresh \
     eslint-plugin-prettier eslint-config-prettier \
     globals
```

Видалити залежності у packages/frontend/package.json - видалити залежності для eslint.

```bash
    yarn remove \
     prettier \
     typescript typescript-eslint \
     eslint @eslint/js \
     eslint-plugin-react-hooks eslint-plugin-react-refresh \
     eslint-plugin-prettier eslint-config-prettier \
     globals
```

Створи у корені **.prettierrc**:

```json
{
    "semi"          : true,
    "printWidth"    : 120,
    "tabWidth"      : 2,
    "trailingComma" : "all",
    "arrowParens"   : "always",
    "endOfLine"     : "lf"
}
```

Додай скрипти у `package.json`:

```json
{
    "scripts" : {
        "prepare"   : "husky",
        "lint"      : "eslint packages/backend packages/frontend --cache",
        "lint:warn" : "eslint packages/backend packages/frontend --cache || true",
        "lint:fix"  : "eslint packages/backend packages/frontend --fix"
    }
}
```

> 💡 **Примітка:** scripts/lint поки не перевіряти, спочатку налаштуй backend
---

## ⚙️ Крок 6: Ініціалізація бекенду (Express + TS)

```bash
    mkdir packages/backend
    cd packages/backend
    npm init -y
    
    yarn add --exact express cors dotenv cookie-parser 
    yarn add -D --exact typescript tsx @types/node @types/express @types/cors @types/cookie-parser tsconfig-paths tsc-alias rimraf cpx concurrently nodemon
```

Створи структуру:

```bash
    mkdir src
    touch src/main.ts
    touch tsconfig.json
    touch tsconfig.eslint.json
```

📌 Змінити: `tsconfig.json`:

```json
{
    "extends"         : "../../tsconfig.base.json",
    
    "compilerOptions" : {
        /* 🎯 Target & Environment */
        "target"                 : "ES2020",
        "lib"                    : [ "ES2020" ],
        
        /* 🔧 Module settings & Bundler */
        "module"                 : "NodeNext", // required for ESM + .js extensions with "type": "module"
        "moduleResolution"       : "NodeNext", // required for ESM + .js extensions with "type": "module"
        
        /* 📤 Output & Build Info */
        "outDir"                 : "dist",
        "rootDir"                : "src",
        "sourceMap"              : true,
        "declaration"            : true,
        "declarationMap"         : true,
        "removeComments"         : true,
        "incremental"            : false,
        
        /* 🧪 Experimental & decorators */
        "emitDecoratorMetadata"  : true,
        "experimentalDecorators" : true,
        
        /* 🔗 Path Aliases */
        "baseUrl"                : ".",
        "paths"                  : { "~/*" : [ "./src/*" ] }
    },
    
    /* 📁 File System Scope */
    "include"         : [ "src/**/*" ],
    "exclude"         : [ "dist", "node_modules" ]
}
```

📌 Створити: `tsconfig.eslint.json`:

```json
{
    "extends" : "./tsconfig.json",
    "include" : [ "src/**/*" ],
    "exclude" : [ "dist", "node_modules" ]
}

```

📌 Створити: `src/main.ts`:

```ts
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const PORT = process.env.PORT || 4000

// const CLIENT_URL = process.env.CLIENT_URL;

async function startServer() {
  const app = express()
  
  app.use(cors({ origin: true, credentials: true })) // origin: CLIENT_URL
  app.use(cookieParser())
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  
  app.get('/', (_req, res) => res.send('Hello from ESM!')) // TODO: use for testing
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  })
}

startServer().catch(console.error)
```

📌 Додай скрипти у `package.json` бекенду:

```json
{
    "type"    : "module",
    "scripts" : {
        "dev"        : "tsx watch src/main.ts",
        "build"      : "rimraf dist && tsc && tsc-alias",
        "start"      : "node dist/main.js",
        "serve"      : "npm run build && concurrently \"tsc -w\" \"tsc-alias -w\" \"nodemon dist/main.js\"",
        "start:prod" : "NODE_ENV=production node dist/main.js",
        "lint"       : "eslint \"src/**/*.ts\" --fix",
        "format"     : "prettier --write \"src/**/*.ts\""
    }
}
```

---

## 🧪 Крок 7: Для запуску Monorepo:

- скопіювати: `git clone <repo>`
- в корені виконати: `yarn install`
