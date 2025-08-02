FROM node:lts AS build


WORKDIR /ui

COPY . .

RUN npm install pnpm -g && \
    cd src/ui && \
    pnpm install && \
    pnpm build:standlone

FROM node:lts AS prod

COPY --from=build /ui/src/ui/dist /ui/dist

RUN npm install -g serve

CMD [ "serve", "-s", "/ui/dist", "-l", "3000"]