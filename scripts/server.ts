import { stat } from "node:fs/promises";
import path from "node:path";
import { main, parseNumberFlag, parseFlag, resolveRoot } from "./lib.ts";

export type ServerOptions = {
  host: string;
  port: number;
  root: string;
};

const MIME_TYPES: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".wasm": "application/wasm",
  ".zip": "application/zip",
};

function parseRange(range: string | null, size: number): [number, number] | null {
  const match = range?.match(/^bytes=(\d*)-(\d*)$/);
  if (!match) {
    return null;
  }

  const [, rawStart, rawEnd] = match;
  if (!rawStart && !rawEnd) {
    return null;
  }

  if (!rawStart) {
    const suffixLength = Number(rawEnd);
    if (!Number.isInteger(suffixLength) || suffixLength <= 0) {
      return null;
    }
    return [Math.max(size - suffixLength, 0), size - 1];
  }

  const start = Number(rawStart);
  const end = rawEnd ? Number(rawEnd) : size - 1;
  if (!Number.isInteger(start) || !Number.isInteger(end) || start > end || start >= size) {
    return null;
  }

  return [start, Math.min(end, size - 1)];
}

function headersFor(filePath: string, contentLength: number): Headers {
  return new Headers({
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-store",
    "Content-Length": String(contentLength),
    "Content-Type": MIME_TYPES[path.extname(filePath)] ?? "application/octet-stream",
  });
}

export function serve(options: ServerOptions): void {
  const root = path.resolve(options.root);

  Bun.serve({
    hostname: options.host,
    port: options.port,
    async fetch(request) {
      const url = new URL(request.url);
      const pathname = decodeURIComponent(url.pathname);
      const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
      const filePath = path.resolve(path.join(root, relativePath));

      if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
        return new Response("Forbidden", { status: 403 });
      }

      let fileStat;
      try {
        fileStat = await stat(filePath);
      } catch {
        return new Response("Not found", { status: 404 });
      }

      if (!fileStat.isFile()) {
        return new Response("Not found", { status: 404 });
      }

      const range = parseRange(request.headers.get("range"), fileStat.size);
      if (request.headers.has("range") && !range) {
        return new Response("Range not satisfiable", {
          status: 416,
          headers: {
            "Content-Range": `bytes */${fileStat.size}`,
          },
        });
      }

      if (range) {
        const [start, end] = range;
        const headers = headersFor(filePath, end - start + 1);
        headers.set("Content-Range", `bytes ${start}-${end}/${fileStat.size}`);
        return new Response(
          request.method === "HEAD" ? null : Bun.file(filePath).slice(start, end + 1),
          { status: 206, headers },
        );
      }

      return new Response(request.method === "HEAD" ? null : Bun.file(filePath), {
        headers: headersFor(filePath, fileStat.size),
      });
    },
  });

  console.log(`Serving ${root} at http://${options.host}:${options.port}/`);
}

if (import.meta.main) {
  await main(async () => {
    const args = Bun.argv.slice(2);
    serve({
      host: parseFlag(args, "--host", "0.0.0.0")!,
      port: parseNumberFlag(args, "--port", 8000),
      root: path.resolve(parseFlag(args, "--root", resolveRoot("bin/mame"))!),
    });
  });
}
