FROM  node:20-alpine AS builder

WORKDIR /app

COPY ./main/ /app/

RUN npm install

RUN npm run build --prod


FROM nginx:1.17.10-alpine

RUN rm /etc/nginx/conf.d/default.conf

EXPOSE 3000
#EXPOSE 443

# Копируем сконфигурированный конфиг Nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/
#COPY nginx/self-signed.conf /etc/nginx/snippets/self-signed.conf
#COPY nginx/ssl-params.conf /etc/nginx/snippets/ssl-params.conf

# Копируем собранную статику из этапа сборки
COPY --from=builder /app/dist /var/www


# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]