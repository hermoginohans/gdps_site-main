FROM node:22-bookworm-slim AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html vite.config.ts tsconfig.json tailwind.config.js postcss.config.js ./
COPY src ./src
COPY public ./public
RUN npm run build

FROM php:8.4-apache-bookworm
WORKDIR /var/www/html
RUN apt-get update && apt-get install -y git unzip libzip-dev libonig-dev libicu-dev \
    && docker-php-ext-install pdo_mysql mbstring zip intl \
    && a2dismod mpm_event mpm_worker \
    && a2enmod mpm_prefork rewrite \
    && rm -rf /var/lib/apt/lists/*
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY backend/ ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts \
    && mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && php artisan package:discover --ansi \
    && chown -R www-data:www-data storage bootstrap/cache
COPY --from=frontend /app/dist/ ./public/
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf \
    && printf '<Directory /var/www/html/public>\nAllowOverride All\nRequire all granted\nDirectoryIndex index.php\n</Directory>\n' > /etc/apache2/conf-available/gpds.conf \
    && a2enconf gpds \
    && apache2ctl configtest
ENV APP_ENV=production APP_DEBUG=false CACHE_STORE=file SESSION_DRIVER=cookie
CMD ["sh", "-c", "sed -i \"s/Listen 80/Listen ${PORT:-8080}/\" /etc/apache2/ports.conf && sed -i \"s/:80>/:${PORT:-8080}>/\" /etc/apache2/sites-available/000-default.conf && exec apache2-foreground"]
