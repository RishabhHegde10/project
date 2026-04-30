/**
 * api.js
 * ──────
 * Centralised fetch helpers for the DysLearnAI Flask backend.
 * Import individual functions wherever needed.
 *
 * Base URL: http://127.0.0.1:5000
 */

const BASE_URL = "http://127.0.0.1:5000";

// ── Generic request wrapper ───────────────────────────────────────────────────
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = { error: "Invalid response from server" };
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || `HTTP ${res.status}`);
  }

  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

/**
 * POST /login
 * @param {string} email
 * @param {string} password
 * @returns {{ user_id, email, child_name, ... }}
 */
export async function loginUser(email, password) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * POST /register
 * @param {{ email, password, child_name, age }} payload
 * @returns {{ user_id, message, ... }}
 */
export async function registerUser({ email, password, child_name, age }) {
  return request("/register", {
    method: "POST",
    body: JSON.stringify({ email, password, child_name, age }),
  });
}

// ── Prediction ────────────────────────────────────────────────────────────────

/**
 * POST /predict
 * Sends assessment data to the ML model and returns risk prediction.
 *
 * @param {{
 *   typing_speed:      number,
 *   overall_accuracy:  number,
 *   total_errors:      number,
 *   cognitive_score?:  number,
 *   user_id:           number
 * }} payload
 * @returns {{ risk_level, probability, prediction, ... }}
 */
export async function sendPrediction({ typing_speed, overall_accuracy, total_errors, cognitive_score, user_id }) {
  return request("/predict", {
    method: "POST",
    body: JSON.stringify({
      typing_speed:     Number(typing_speed)     || 0,
      overall_accuracy: Number(overall_accuracy) || 0,
      total_errors:     Number(total_errors)     || 0,
      ...(cognitive_score != null ? { cognitive_score: Number(cognitive_score) } : {}),
      user_id: Number(user_id),
    }),
  });
}

// ── History ───────────────────────────────────────────────────────────────────

/**
 * GET /history/<user_id>
 * Fetches all previous assessment results for a user.
 *
 * @param {number} user_id
 * @returns {Array<{ id, typing_speed, overall_accuracy, total_errors, cognitive_score, risk_level, probability, ... }>}
 */
export async function fetchHistory(user_id) {
  return request(`/history/${user_id}`);
}

// ── LocalStorage helpers ──────────────────────────────────────────────────────

export function saveUserToStorage(user) {
  localStorage.setItem("user_id",    user.user_id);
  localStorage.setItem("user_email", user.email      || "");
  localStorage.setItem("child_name", user.child_name || "");
}

export function loadUserFromStorage() {
  const user_id = localStorage.getItem("user_id");
  if (!user_id) return null;
  return {
    user_id:    Number(user_id),
    email:      localStorage.getItem("user_email") || "",
    child_name: localStorage.getItem("child_name") || "",
  };
}

export function clearUserFromStorage() {
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_email");
  localStorage.removeItem("child_name");
}
