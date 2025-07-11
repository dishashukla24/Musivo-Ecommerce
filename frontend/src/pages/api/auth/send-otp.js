// pages/api/auth/send-otp.js

export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  
    try {
      const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
  
      const contentType = backendRes.headers.get("content-type");
  
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await backendRes.json();
      } else {
        const text = await backendRes.text();
        data = { error: text };
      }
  
      return res.status(backendRes.status).json(data);
    } catch (error) {
      console.error("Send OTP API Error:", error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
  
