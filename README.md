# 🛒 Projeto Compras FATEC - Frontend

![npm](https://img.shields.io/badge/npm-v11.3.0-red?logo=npm)
![Jest](https://img.shields.io/badge/jest-v29.7.0-green?logo=jest)
![react](https://img.shields.io/badge/react-v18.2.0-blue?logo=react)
![NextJS](https://img.shields.io/badge/nextjs-v15.0.1-white?logo=nextdotjs)
![docker](https://img.shields.io/badge/docker-v28.3.0-blue?logo=docker)


Aplicação desenvolvida em colaboração com a FATEC Votorantim para auxiliar no manejo dos pedidos de compras realizados pelos funcionários para a Diretoria de Serviços Administrativos.

Projeto desenvolvido com [Next.js](https://nextjs.org) e lançado através do [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🛠️ Ferramentas utilizadas

- **Visualização de dados em mapa de calor:** HotJar 1.0
- **Cliente HTTP:** Axios 1.7
- **Criação de formulários:** Formik 2.4
- **Validação de formulários:** Yup 1.4
- **Estilização:** TailwindCSS 3.4.14

## ⚙️ Configuração
### Instalar dependências
```bash
npm install
```

#### Iniciar instância local do Backend (opcional)
**Requisito**: Ter o repositório baixado e configurado. Acesso pelo [GitHub](https://github.com/DSM-Projeto-Compras/BackEnd).

### 🐋 Docker
Este repositório também possui um container no Docker, para configura-lo, utilize:
```bash
docker-compose up --build
```

### Como inicializar a aplicação

Iniciar através do comando:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abrir [http://localhost:3000](http://localhost:3000) no navegador.


## 📃 Documentação Next.js

Para saber mais sobre o Next.js, você pode acessar a documentação através dos links:

- [Documentação Next.js](https://nextjs.org/docs) - recursos e API do Next.js.
- [Tutorial Next.js](https://nextjs.org/learn) - tutorial de implementação e uso do Next.js.

## 🚀 Deploy no Vercel

Esse projeto tem uma interface ativa provisória que pode ser acessada pelo [Vercel](front-end-five-kappa.vercel.app), impulsionado e facilitado pelo Next.js.

A documentação para esse processo se encontra em [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
