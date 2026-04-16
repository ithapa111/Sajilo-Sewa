const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const { authorize, authenticateRequestWithStore, getAuthConfig } = require("./lib/auth");
const { createStore } = require("./lib/store");

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

function hasStoreMethod(name) {
  return typeof store[name] === "function";
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

  if (pathname === "/api/marketplace/categories") {
    if (!hasStoreMethod("getMarketplaceCategories")) {
      return { statusCode: 501, payload: { error: "Marketplace categories are not supported by the active storage driver" } };
    }

    return { statusCode: 200, payload: await store.getMarketplaceCategories() };
  }

  if (pathname === "/api/marketplace/businesses") {
    if (!hasStoreMethod("getMarketplaceBusinesses")) {
      return { statusCode: 501, payload: { error: "Marketplace search is not supported by the active storage driver" } };
    }

    return { statusCode: 200, payload: await store.getMarketplaceBusinesses(parsedUrl.query) };
  }

  const businessReviewsMatch = pathname.match(/^\/api\/marketplace\/businesses\/([^/]+)\/reviews$/);
  if (businessReviewsMatch) {
    if (!hasStoreMethod("getMarketplaceReviews")) {
      return { statusCode: 501, payload: { error: "Marketplace reviews are not supported by the active storage driver" } };
    }

    return { statusCode: 200, payload: await store.getMarketplaceReviews(decodeURIComponent(businessReviewsMatch[1])) };
  }

  const businessDetailMatch = pathname.match(/^\/api\/marketplace\/businesses\/([^/]+)$/);
  if (businessDetailMatch) {
    if (!hasStoreMethod("getMarketplaceBusinessBySlug")) {
      return { statusCode: 501, payload: { error: "Marketplace business details are not supported by the active storage driver" } };
    }

    const payload = await store.getMarketplaceBusinessBySlug(decodeURIComponent(businessDetailMatch[1]));
    return payload
      ? { statusCode: 200, payload }
      : { statusCode: 404, payload: { error: "Business not found" } };
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

async function handleApiWrite(req, parsedUrl, auth) {
  const pathname = normalizeApiPath(parsedUrl.pathname);
  const payload = await readJsonBody(req);

  if (pathname === "/api/auth/member/signup") {
    if (typeof store.signup !== "function") {
      return { statusCode: 501, payload: { error: "Signup is not supported by the active storage driver" } };
    }

    return store.signup({ ...payload, role: "member" });
  }

  if (pathname === "/api/auth/business/signup") {
    if (typeof store.signup !== "function") {
      return { statusCode: 501, payload: { error: "Signup is not supported by the active storage driver" } };
    }

    return store.signup({
      ...payload,
      fullName: payload.fullName || payload.contactName || payload.businessName,
      role: "business_owner"
    });
  }

  if (pathname === "/api/auth/signup") {
    if (typeof store.signup !== "function") {
      return { statusCode: 501, payload: { error: "Signup is not supported by the active storage driver" } };
    }

    return store.signup(payload);
  }

  if (pathname === "/api/auth/member/login") {
    if (typeof store.login !== "function") {
      return { statusCode: 501, payload: { error: "Login is not supported by the active storage driver" } };
    }

    return store.login(payload, ["member", "customer", "rider"]);
  }

  if (pathname === "/api/auth/business/login") {
    if (typeof store.login !== "function") {
      return { statusCode: 501, payload: { error: "Login is not supported by the active storage driver" } };
    }

    return store.login(payload, ["business_owner"]);
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

  const reviewMatch = pathname.match(/^\/api\/marketplace\/businesses\/([^/]+)\/reviews$/);
  if (reviewMatch) {
    if (!hasStoreMethod("createMarketplaceReview")) {
      return { statusCode: 501, payload: { error: "Marketplace reviews are not supported by the active storage driver" } };
    }

    return store.createMarketplaceReview(decodeURIComponent(reviewMatch[1]), auth, payload);
  }

  const favoriteMatch = pathname.match(/^\/api\/marketplace\/businesses\/([^/]+)\/favorite$/);
  if (favoriteMatch) {
    if (!hasStoreMethod("createMarketplaceFavorite")) {
      return { statusCode: 501, payload: { error: "Marketplace favorites are not supported by the active storage driver" } };
    }

    return store.createMarketplaceFavorite(decodeURIComponent(favoriteMatch[1]), auth);
  }

  const draftMatch = pathname.match(/^\/api\/marketplace\/businesses\/([^/]+)\/draft$/);
  if (draftMatch) {
    if (!hasStoreMethod("createBusinessProfileDraft")) {
      return { statusCode: 501, payload: { error: "Business drafts are not supported by the active storage driver" } };
    }

    return store.createBusinessProfileDraft(decodeURIComponent(draftMatch[1]), auth, payload);
  }

  if (pathname === "/api/marketplace/service-requests") {
    if (!hasStoreMethod("createMarketplaceServiceRequest")) {
      return { statusCode: 501, payload: { error: "Marketplace service requests are not supported by the active storage driver" } };
    }

    return store.createMarketplaceServiceRequest(auth, payload);
  }

  if (pathname === "/api/marketplace/business-claims") {
    if (!hasStoreMethod("createBusinessClaim")) {
      return { statusCode: 501, payload: { error: "Business claims are not supported by the active storage driver" } };
    }

    return store.createBusinessClaim(auth, payload);
  }

  return { statusCode: 404, payload: { error: "Not found" } };
}

async function handleApiDelete(parsedUrl, auth) {
  const pathname = normalizeApiPath(parsedUrl.pathname);
  const favoriteMatch = pathname.match(/^\/api\/marketplace\/businesses\/([^/]+)\/favorite$/);

  if (favoriteMatch) {
    if (!hasStoreMethod("deleteMarketplaceFavorite")) {
      return { statusCode: 501, payload: { error: "Marketplace favorites are not supported by the active storage driver" } };
    }

    return store.deleteMarketplaceFavorite(decodeURIComponent(favoriteMatch[1]), auth);
  }

  return { statusCode: 404, payload: { error: "Not found" } };
}

function authorizeForPath(req, pathname) {
  const normalizedPath = normalizeApiPath(pathname);
  if (
    normalizedPath === "/api/auth/signup" ||
    normalizedPath === "/api/auth/login" ||
    normalizedPath === "/api/auth/member/signup" ||
    normalizedPath === "/api/auth/member/login" ||
    normalizedPath === "/api/auth/business/signup" ||
    normalizedPath === "/api/auth/business/login"
  ) {
    return Promise.resolve({ ok: true, auth: null });
  }

  if (normalizedPath === "/api/rideshare/requests") {
    return authorize(req, store, ["admin", "member", "rider"]);
  }

  if (normalizedPath === "/api/food-delivery/orders") {
    return authorize(req, store, ["admin", "member", "customer"]);
  }

  if (normalizedPath === "/api/courier/requests") {
    return authorize(req, store, ["admin", "member", "rider", "customer"]);
  }

  if (
    normalizedPath === "/api/marketplace/service-requests" ||
    /^\/api\/marketplace\/businesses\/[^/]+\/(reviews|favorite)$/.test(normalizedPath)
  ) {
    return authorize(req, store, ["admin", "member", "customer", "rider"]);
  }

  if (
    normalizedPath === "/api/marketplace/business-claims" ||
    /^\/api\/marketplace\/businesses\/[^/]+\/draft$/.test(normalizedPath)
  ) {
    return authorize(req, store, ["admin", "business_owner"]);
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
        const writeResult = await handleApiWrite(req, parsedUrl, authResult.auth);
        sendJson(res, writeResult.statusCode, writeResult.payload);
        return;
      }

      if (req.method === "DELETE") {
        const writeResult = await handleApiDelete(parsedUrl, authResult.auth);
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
