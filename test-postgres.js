const { PostgresStore } = require("./lib/postgres-store");

async function testPostgres() {
  if (!process.env.DATABASE_URL) {
    console.error("Please set DATABASE_URL environment variable.");
    process.exit(1);
  }

  const store = new PostgresStore();
  console.log("Testing PostgresStore...");

  try {
    const health = await store.getHealth();
    console.log("Health check:", health);

    const signupData = {
      fullName: "Test User",
      email: `test_${Date.now()}@example.com`,
      password: "password123",
      role: "rider",
      phone: "+15551234567"
    };

    console.log("Testing signup...");
    const signupResult = await store.signup(signupData);
    console.log("Signup result:", signupResult.statusCode, signupResult.payload);

    if (signupResult.statusCode !== 201) {
      throw new Error("Signup failed");
    }

    const token = signupResult.payload.token;
    console.log("Testing resolveToken...");
    const auth = await store.resolveToken(token);
    console.log("ResolveToken result:", auth);

    if (!auth || auth.userId !== signupResult.payload.user.userId) {
      throw new Error("Token resolution failed");
    }

    console.log("Testing login...");
    const loginResult = await store.login({
      email: signupData.email,
      password: signupData.password
    });
    console.log("Login result:", loginResult.statusCode, loginResult.payload);

    if (loginResult.statusCode !== 200) {
      throw new Error("Login failed");
    }

    console.log("PostgresStore tests passed!");
  } catch (err) {
    console.error("Test failed:", err.message);
    if (err.stdout) console.error("PSQL Output:", err.stdout);
  }
}

testPostgres();
