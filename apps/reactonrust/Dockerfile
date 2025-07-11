FROM denoland/deno:1.40.0

WORKDIR /app

COPY deno.json .
COPY src/ ./src/
COPY rsbuild.config.ts .
COPY tsconfig.json .

RUN deno cache --allow-all src/index.tsx

EXPOSE 20007

CMD ["deno", "run", "--allow-all", "npm:@rsbuild/core", "dev", "--port", "20007", "--host", "0.0.0.0"]
