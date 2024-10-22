FROM composer:latest as builder

WORKDIR /app

#COPY --chown=composer composer.json composer.lock vendor/ ./
COPY . .

RUN composer update --ignore-platform-reqs --no-scripts

#COPY . .

FROM php:8.2-fpm-alpine as fpm_server

WORKDIR /app


RUN apk add --virtual build-dependencies --no-cache ${PHPIZE_DEPS} libxml2-dev oniguruma-dev && \
    docker-php-ext-install -j$(nproc) xml pdo_mysql

COPY --from=builder --chown=www-data:www-data /app /app