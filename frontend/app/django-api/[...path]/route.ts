import { NextRequest, NextResponse } from "next/server";

const DJANGO_ORIGIN = process.env.DJANGO_ORIGIN || "http://127.0.0.1:8000";
const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
]);

async function proxy(request: NextRequest, path: string[]) {
  const search = request.nextUrl.search;
  const url = `${DJANGO_ORIGIN}/api/${path.join("/")}/${search}`;
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const method = request.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const response = await fetch(url, {
    method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    redirect: "manual",
  });

  const outHeaders = new Headers();
  response.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower === "set-cookie") return;
    if (HOP_BY_HOP.has(lower)) return;
    outHeaders.set(key, value);
  });

  const out = new NextResponse(await response.arrayBuffer(), {
    status: response.status,
    headers: outHeaders,
  });

  const setCookies =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : [];
  for (const cookie of setCookies) {
    out.headers.append("set-cookie", cookie);
  }
  return out;
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function OPTIONS(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}
