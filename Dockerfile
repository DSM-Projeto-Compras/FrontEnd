# Imagem node
FROM node:20 AS build

# Diretório dos arquivos no container
WORKDIR /app

# Copia os arquivos package*.json ./ para o diretório de arquivo
COPY package*.json ./

# Baixa e instala as dependências
RUN npm install --force

# Copia todos os arquivos da pasta raiz para a pasta de trabalho no container
COPY . .

# Compila a aplicação para produção
RUN npm run build

# Usa a imagem oficial do Nginx (para aws)
# FROM nginx:stable-alpine

# Copia os arquivos da build do React para o diretório padrão do Nginx
# COPY --from=build /app/out /usr/share/nginx/html

# Copia a configuração personalizada do Nginx
# COPY nginx.conf /etc/nginx/nginx.conf

# Criando algumas variáveis de ambiente
# ENV MONGODB_INITDB_ROOT_USERNAME=user
# ENV MONGODB_INITDB_ROOT_PASSWORD=pass
# ENV MONGODB_INITDB_DATABASE=projetocompras

# Porta exposta em que a aplicação roda
EXPOSE 3000
# EXPOSE 80

# Comando utilizado para iniciar a aplicação
CMD [ "npm", "run", "dev" ]
# CMD ["nginx", "-g", "daemon off;"]
