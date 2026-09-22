import app from "../artifacts/api-server/dist/vercel.mjs";

export default function handler(request, response) {
  const incoming = new URL(request.url, "https://jai-bhole-sweets.local");
  const forwardedPath = incoming.searchParams.get("path") || "";
  incoming.searchParams.delete("path");
  const query = incoming.searchParams.toString();
  request.url = `/api/${forwardedPath}${query ? `?${query}` : ""}`;
  return app(request, response);
}
