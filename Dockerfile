FROM denoland/deno:latest

WORKDIR /app

COPY . .
RUN deno task build
RUN deno cache main.ts

EXPOSE 3000

CMD ["run", "-A", "main.ts"]