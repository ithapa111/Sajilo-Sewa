const DEFAULT_TOKENS = {
  admin: process.env.SAJILO_ADMIN_TOKEN || "dev-admin-token",
  rider: process.env.SAJILO_RIDER_TOKEN || "dev-rider-token",
  customer: process.env.SAJILO_CUSTOMER_TOKEN || "dev-customer-token",
  courier: process.env.SAJILO_COURIER_TOKEN || "dev-courier-token",
  driver: process.env.SAJILO_DRIVER_TOKEN || "dev-driver-token"
};

function getTokenRecordMap() {
  return {
    [DEFAULT_TOKENS.admin]: { role: "admin", userId: "admin_001" },
    [DEFAULT_TOKENS.rider]: { role: "rider", userId: "rider_001" },
    [DEFAULT_TOKENS.customer]: { role: "customer", userId: "cust_001" },
    [DEFAULT_TOKENS.courier]: { role: "courier", userId: "courier_001" },
    [DEFAULT_TOKENS.driver]: { role: "driver", userId: "driver_001" }
  };
}

function extractBearerToken(req) {
  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {
    return null;
  }

  return header.slice("Bearer ".length).trim();
}

function authenticateRequest(req) {
  const token = extractBearerToken(req);

  if (!token) {
    return null;
  }

  return getTokenRecordMap()[token] || null;
}

async function authenticateRequestWithStore(req, store) {
  const token = extractBearerToken(req);

  if (!token) {
    return null;
  }

  const staticRecord = getTokenRecordMap()[token];

  if (staticRecord) {
    return staticRecord;
  }

  if (!store || typeof store.resolveToken !== "function") {
    return null;
  }

  return store.resolveToken(token);
}

async function authorize(req, store, allowedRoles) {
  const auth = await authenticateRequestWithStore(req, store);

  if (!auth) {
    return {
      ok: false,
      statusCode: 401,
      payload: { error: "Authentication required" }
    };
  }

  if (!allowedRoles.includes(auth.role)) {
    return {
      ok: false,
      statusCode: 403,
      payload: { error: "Forbidden for current role" }
    };
  }

  return {
    ok: true,
    auth
  };
}

function getAuthConfig() {
  return {
    tokens: DEFAULT_TOKENS
  };
}

module.exports = {
  authenticateRequest,
  authenticateRequestWithStore,
  authorize,
  getAuthConfig
};
