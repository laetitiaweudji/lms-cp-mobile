#!/usr/bin/env node
/**
 * Load-tests one backend API endpoint by logging in for real (via Supabase's
 * password grant, the same flow the app itself uses) and hammering an
 * endpoint with concurrent requests via autocannon.
 *
 * IMPORTANT: only run this against a deployment you have explicit permission
 * to load-test. This generates real traffic against the real backend and
 * real Supabase project — running it without coordinating with whoever owns
 * that deployment can look like (and have the effect of) a denial-of-service
 * attack, and may exhaust database connections shared with real users.
 *
 * Usage:
 *   LOAD_TEST_EMAIL=student@gmail.com LOAD_TEST_PASSWORD=123456 \
 *     npm run load-test -- --path /api/student/dashboard --connections 10 --duration 15
 *
 * Required env vars (reads from .env automatically):
 *   EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, EXPO_PUBLIC_API_BASE_URL
 *   LOAD_TEST_EMAIL, LOAD_TEST_PASSWORD — a real test account's credentials
 */

require("dotenv").config();
const autocannon = require("autocannon");

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag, fallback) => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : fallback;
  };
  return {
    path: get("--path", "/api/student/dashboard"),
    connections: Number(get("--connections", "10")),
    duration: Number(get("--duration", "15")),
  };
}

async function login() {
  const { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, LOAD_TEST_EMAIL, LOAD_TEST_PASSWORD } =
    process.env;

  if (!EXPO_PUBLIC_SUPABASE_URL || !EXPO_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY (check .env).");
  }
  if (!LOAD_TEST_EMAIL || !LOAD_TEST_PASSWORD) {
    throw new Error(
      "Missing LOAD_TEST_EMAIL / LOAD_TEST_PASSWORD env vars. Provide a real test account's credentials."
    );
  }

  const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: EXPO_PUBLIC_SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: LOAD_TEST_EMAIL, password: LOAD_TEST_PASSWORD }),
  });

  const data = await response.json();
  if (!response.ok || !data.access_token) {
    throw new Error(`Login failed: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function main() {
  const { path, connections, duration } = parseArgs();
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("Missing EXPO_PUBLIC_API_BASE_URL (check .env).");
  }

  console.log(`Logging in as ${process.env.LOAD_TEST_EMAIL}...`);
  const token = await login();
  console.log("Got a real access token. Starting load test — Ctrl+C to abort.\n");

  const url = `${baseUrl.replace(/\/$/, "")}${path}`;
  console.log(`Target:      ${url}`);
  console.log(`Connections: ${connections}`);
  console.log(`Duration:    ${duration}s\n`);

  const result = await autocannon({
    url,
    connections,
    duration,
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log(autocannon.printResult(result));

  if (result.non2xx > 0 || result.errors > 0) {
    console.error(
      `\n${result.non2xx} non-2xx responses, ${result.errors} errors — investigate before treating this endpoint as load-ready.`
    );
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
