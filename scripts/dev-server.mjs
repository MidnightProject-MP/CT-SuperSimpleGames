import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, isAbsolute, join, normalize, relative } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json"
};

export function resolveRequestFile(baseRoot, requestPath) {
  const relativePath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
  let filePath = normalize(join(baseRoot, relativePath));
  let pathFromRoot = relative(baseRoot, filePath);

  if (pathFromRoot.startsWith("..") || isAbsolute(pathFromRoot) || !existsSync(filePath)) {
    return null;
  }

  if (statSync(filePath).isDirectory()) {
    filePath = join(filePath, "index.html");
    pathFromRoot = relative(baseRoot, filePath);
  }

  if (pathFromRoot.startsWith("..") || isAbsolute(pathFromRoot) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    return null;
  }

  return filePath;
}

export function startServer({ baseRoot = root, listenPort = port } = {}) {
  const server = createServer((request, response) => {
    let requestPath;
    try {
      requestPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    } catch {
      response.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
      response.end("Bad request");
      return;
    }

    const filePath = resolveRequestFile(baseRoot, requestPath);
    if (!filePath) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "content-type": types[extname(filePath)] || "application/octet-stream",
      "cache-control": "no-store"
    });
    createReadStream(filePath).pipe(response);
  });

  server.listen(listenPort, "127.0.0.1", () => {
    console.log(`SuperSimpleGames is running at http://localhost:${listenPort}`);
  });

  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer();
}
