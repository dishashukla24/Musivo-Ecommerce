export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
      credentials: 'include',
    });

    const body = await backendRes.text();
    const setCookie = backendRes.headers.get("set-cookie");

    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie);
    }

    res.status(backendRes.status).json(JSON.parse(body));
  } catch (error) {
    console.error("Verify OTP Proxy Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
