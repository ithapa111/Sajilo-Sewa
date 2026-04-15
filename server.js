const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const { authorize, authenticateRequestWithStore, getAuthConfig } = require("./lib/auth");
const { createStore } = require("./lib/store");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const store = createStore(ROOT);

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
    ".md": "text/markdown; charset=utf-8"
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
  const pathname = parsedUrl.pathname;

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

  if (pathname === "/api/platform") {
    return { statusCode: 200, payload: await store.getPlatform() };
  }

  if (pathname === "/api/rides") {
    return { statusCode: 200, payload: await store.getRides() };
  }

  if (pathname === "/api/food") {
    return { statusCode: 200, payload: await store.getFood() };
  }

  if (pathname === "/api/courier") {
    return { statusCode: 200, payload: await store.getCourier() };
  }

  return null;
}

async function handleApiWrite(req, parsedUrl) {
  const payload = await readJsonBody(req);

  if (parsedUrl.pathname === "/api/auth/signup") {
    if (typeof store.signup !== "function") {
      return { statusCode: 501, payload: { error: "Signup is not supported by the active storage driver" } };
    }

    return store.signup(payload);
  }

  if (parsedUrl.pathname === "/api/auth/login") {
    if (typeof store.login !== "function") {
      return { statusCode: 501, payload: { error: "Login is not supported by the active storage driver" } };
    }

    return store.login(payload);
  }

  if (parsedUrl.pathname === "/api/rides/requests") {
    return store.createRideRequest(payload);
  }

  if (parsedUrl.pathname === "/api/food/orders") {
    return store.createFoodOrder(payload);
  }

  if (parsedUrl.pathname === "/api/courier/deliveries") {
    return store.createCourierDelivery(payload);
  }

  return { statusCode: 404, payload: { error: "Not found" } };
}

function authorizeForPath(req, pathname) {
  if (pathname === "/api/auth/signup" || pathname === "/api/auth/login") {
    return Promise.resolve({ ok: true, auth: null });
  }

  if (pathname === "/api/rides/requests") {
    return authorize(req, store, ["admin", "rider"]);
  }

  if (pathname === "/api/food/orders") {
    return authorize(req, store, ["admin", "customer"]);
  }

  if (pathname === "/api/courier/deliveries") {
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

server.listen(PORT, () => {
  console.log(`Sajilo Sewa running at http://localhost:${PORT} using ${store.driver} storage`);
});
