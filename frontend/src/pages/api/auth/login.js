// login.js
import setCookie from 'set-cookie-parser';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const backendRes = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
      credentials: 'include'
    });

    const cookies = setCookie.parse(backendRes.headers.get('set-cookie'), {
      map: false,
    });

    cookies.forEach(cookie => {
      res.setHeader('Set-Cookie', res.getHeader('Set-Cookie') ?? []);
      res.appendHeader('Set-Cookie', cookie.toString());
    });

    const body = await backendRes.text();
    res.status(backendRes.status).json(JSON.parse(body));
  } catch (error) {
    console.error("Login Proxy Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
