const DEFAULT_TOKENS = {
  admin: process.env.SAJILO_ADMIN_TOKEN || "dev-admin-token",
  member: process.env.SAJILO_MEMBER_TOKEN || "dev-member-token",
  businessOwner: process.env.SAJILO_BUSINESS_TOKEN || "dev-business-token",
  rider: process.env.SAJILO_RIDER_TOKEN || "dev-rider-token",
  customer: process.env.SAJILO_CUSTOMER_TOKEN || "dev-customer-token",
  courier: process.env.SAJILO_COURIER_TOKEN || "dev-courier-token",
  driver: process.env.SAJILO_DRIVER_TOKEN || "dev-driver-token"
};

export function authenticateRequest(req) {
  const authHeader = req.headers["authorization"] || "";

  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const found = Object.entries(DEFAULT_TOKENS).find(([_, value]) => value === token);

  return found ? { role: found[0], userId: `default_${found[0]}` } : null;
}

export async function authenticateRequestWithStore(req, store) {
  const authHeader = req.headers["authorization"] || "";

  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const result = await store.resolveToken(token);

  if (result) {
    return result;
  }

  const found = Object.entries(DEFAULT_TOKENS).find(([_, value]) => value === token);
  return found ? { role: found[0], userId: `default_${found[0]}` } : null;
}

export async function authorize(req, store, allowedRoles) {
  const auth = await authenticateRequestWithStore(req, store);

  if (!auth) {
    return { ok: false, statusCode: 401, payload: { error: "Authentication required" } };
  }

  if (!allowedRoles.includes(auth.role)) {
    return {
      ok: false,
      statusCode: 403,
      payload: { error: `Forbidden: requires one of ${allowedRoles.join(", ")} roles` }
    };
  }

  return { ok: true, auth };
}

export function getAuthConfig() {
  return {
    tokens: DEFAULT_TOKENS
  };
}
