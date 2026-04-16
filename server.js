const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const url = require("url");
const { authorize, authenticateRequestWithStore, getAuthConfig } = require("./lib/auth");
const { createStore } = require("./lib/store");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const store = createStore(ROOT);
const API_ALIASES = {
  "/api/rides": "/api/rideshare/overview",
  "/api/rides/requests": "/api/rideshare/requests",
  "/api/food": "/api/food-delivery/overview",
  "/api/food/orders": "/api/food-delivery/orders",
  "/api/courier": "/api/courier/overview",
  "/api/courier/deliveries": "/api/courier/requests"
};

function normalizeApiPath(pathname) {
  return API_ALIASES[pathname] || pathname;
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload, null, 2));
}

function sendText(res, statusCode, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(statusCode, { "Content-Type": contentType });
  res.end(body);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;

      if (body.length > 1_000_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Invalid JSON body"));
      }
    });

    req.on("error", reject);
  });
}

function serveFile(res, filePath) {
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    sendText(res, 404, "Not found");
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".md": "text/markdown; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".jfif": "image/jpeg",
    ".webp": "image/webp"
  };

  res.writeHead(200, {
    "Content-Type": contentTypes[extension] || "application/octet-stream"
  });
  fs.createReadStream(filePath).pipe(res);
}

function resolveStaticPath(pathname) {
  const cleanPath = pathname === "/" ? "/index.html" : pathname;
  const resolved = path.normalize(path.join(ROOT, cleanPath));

  if (!resolved.startsWith(ROOT)) {
    return null;
  }

  return resolved;
}

async function handleApiRead(parsedUrl, auth) {
  const pathname = normalizeApiPath(parsedUrl.pathname);

  if (pathname === "/api/health") {
    return { statusCode: 200, payload: await store.getHealth() };
  }

  if (pathname === "/api/auth/config") {
    return {
      statusCode: 200,
      payload: {
        storage: store.driver,
        supportsAccountAuth:
          typeof store.signup === "function" &&
          typeof store.login === "function" &&
          typeof store.resolveToken === "function",
        demoTokens: getAuthConfig().tokens
      }
    };
  }

  if (pathname === "/api/auth/me") {
    if (!auth) {
      return { statusCode: 401, payload: { error: "Authentication required" } };
    }

    return { statusCode: 200, payload: auth };
  }

  if (pathname === "/api/seed") {
    return { statusCode: 200, payload: await store.getSeed() };
  }

  if (pathname === "/api/overview") {
    return { statusCode: 200, payload: await store.getOverview() };
  }

  if (pathname === "/api/services") {
    return {
      statusCode: 200,
      payload: {
        rideshare: {
          label: "Ridesharing API",
          basePath: "/api/rideshare",
          endpoints: ["GET /api/rideshare/overview", "POST /api/rideshare/requests"]
        },
        foodDelivery: {
          label: "Food Delivery API",
          basePath: "/api/food-delivery",
          endpoints: ["GET /api/food-delivery/overview", "POST /api/food-delivery/orders"]
        },
        courier: {
          label: "Courier API",
          basePath: "/api/courier",
          endpoints: ["GET /api/courier/overview", "POST /api/courier/requests"]
        }
      }
    };
  }

  if (pathname === "/api/platform") {
    return { statusCode: 200, payload: await store.getPlatform() };
  }

  if (pathname === "/api/rideshare/overview") {
    return { statusCode: 200, payload: await store.getRides() };
  }

  if (pathname === "/api/food-delivery/overview") {
    return { statusCode: 200, payload: await store.getFood() };
  }

  if (pathname === "/api/courier/overview") {
    return { statusCode: 200, payload: await store.getCourier() };
  }

  return null;
}

async function handleApiWrite(req, parsedUrl) {
  const pathname = normalizeApiPath(parsedUrl.pathname);
  const payload = await readJsonBody(req);

  if (pathname === "/api/auth/signup") {
    if (typeof store.signup !== "function") {
      return { statusCode: 501, payload: { error: "Signup is not supported by the active storage driver" } };
    }

    return store.signup(payload);
  }

  if (pathname === "/api/auth/login") {
    if (typeof store.login !== "function") {
      return { statusCode: 501, payload: { error: "Login is not supported by the active storage driver" } };
    }

    return store.login(payload);
  }

  if (pathname === "/api/rideshare/requests") {
    return store.createRideRequest(payload);
  }

  if (pathname === "/api/food-delivery/orders") {
    return store.createFoodOrder(payload);
  }

  if (pathname === "/api/courier/requests") {
    return store.createCourierDelivery(payload);
  }

  return { statusCode: 404, payload: { error: "Not found" } };
}

function authorizeForPath(req, pathname) {
  const normalizedPath = normalizeApiPath(pathname);
  if (normalizedPath === "/api/auth/signup" || normalizedPath === "/api/auth/login") {
    return Promise.resolve({ ok: true, auth: null });
  }

  if (normalizedPath === "/api/rideshare/requests") {
    return authorize(req, store, ["admin", "rider"]);
  }

  if (normalizedPath === "/api/food-delivery/orders") {
    return authorize(req, store, ["admin", "customer"]);
  }

  if (normalizedPath === "/api/courier/requests") {
    return authorize(req, store, ["admin", "rider", "customer"]);
  }

  return authenticateRequestWithStore(req, store).then((auth) => ({ ok: true, auth }));
}

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname.startsWith("/api/")) {
      const authResult = await authorizeForPath(req, parsedUrl.pathname);

      if (!authResult.ok) {
        sendJson(res, authResult.statusCode, authResult.payload);
        return;
      }

      if (req.method === "POST") {
        const writeResult = await handleApiWrite(req, parsedUrl);
        sendJson(res, writeResult.statusCode, writeResult.payload);
        return;
      }

      const readResult = await handleApiRead(parsedUrl, authResult.auth);

      if (readResult) {
        sendJson(res, readResult.statusCode, readResult.payload);
        return;
      }
    }

    const filePath = resolveStaticPath(parsedUrl.pathname);

    if (!filePath) {
      sendText(res, 400, "Invalid path");
      return;
    }

    serveFile(res, filePath);
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Unexpected server error" });
  }
});

function getLanAddress() {
  const interfaces = os.networkInterfaces();

  for (const networkGroup of Object.values(interfaces)) {
    for (const network of networkGroup || []) {
      if (network.family === "IPv4" && !network.internal) {
        return network.address;
      }
    }
  }

  return null;
}

server.listen(PORT, HOST, () => {
  const lanAddress = getLanAddress();
  const urls = [`http://localhost:${PORT}`];

  if (HOST === "0.0.0.0" && lanAddress) {
    urls.push(`http://${lanAddress}:${PORT}`);
  } else if (HOST !== "0.0.0.0") {
    urls.push(`http://${HOST}:${PORT}`);
  }

  console.log(`Sajilo Sewa running at ${urls.join(" and ")} using ${store.driver} storage`);
});
