export async function useFetchData({ path, body = null, token = null, method = "GET" }) {
  console.log('Entrando ');
  
  try {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["x-access-token"] = token;

    console.log('url: ', `${process.env.NEXT_PUBLIC_BASE_ENDPOINT_AUTH}${path}`);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT_AUTH}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    const data = await res.json();
    if (!res.ok) return { error: true, data };
    return { error: false, data };
  } catch (error) {
    return { error: true, data: { message: error.message } };
  }
}
