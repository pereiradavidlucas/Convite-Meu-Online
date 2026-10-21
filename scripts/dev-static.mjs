import { createServer } from "vite";

const portValue = process.env.PORT?.trim();
const port = portValue ? Number(portValue) : 3000;

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`PORT deve ser um número entre 1 e 65535; recebido: ${JSON.stringify(portValue)}.`);
}

const server = await createServer({
  server: {
    host: "0.0.0.0",
    port,
    strictPort: true,
  },
});

await server.listen();
server.printUrls();

let closing = false;
async function closeServer() {
  if (closing) return;
  closing = true;
  await server.close();
  process.exit(0);
}

process.once("SIGINT", () => void closeServer());
process.once("SIGTERM", () => void closeServer());
