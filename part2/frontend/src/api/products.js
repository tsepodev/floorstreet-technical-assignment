const BASE = "http://localhost:3001/api";

async function handleResponse(res) {
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export const productsApi = {
  getAll: (search = "") => {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    return fetch(`${BASE}/products${params}`).then(handleResponse);
  },

  create: (body) =>
    fetch(`${BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handleResponse),

  update: (id, body) =>
    fetch(`${BASE}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE}/products/${id}`, { method: "DELETE" }).then(handleResponse),
};
