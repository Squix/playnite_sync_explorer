FROM denoland/deno:latest

WORKDIR /app

COPY . .
RUN deno task build
RUN deno cache main.ts

EXPOSE 8000

CMD ["run", "-A", "main.ts"]