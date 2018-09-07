FROM node:alpine AS build

WORKDIR /tmp/
COPY package.json /tmp/

RUN npm install

RUN mkdir -p /var/www/luminous

COPY . /tmp/
RUN npm run build
RUN find build/ \( -name '*.js' -or -name '*.css' -or -name '*.svg' -or -name '*.ttf' \) -exec sh -c 'gzip -c9 -k {} > {}.gz && touch -c --reference={} {}.gz' \;
RUN cp -av build/* /var/www/luminous/

FROM nginx:stable-alpine

COPY --from=build /var/www/luminous /var/www

COPY nginx.conf /etc/nginx/
ENTRYPOINT ["/usr/sbin/nginx"]
