module.exports = async (req, res) => {
  // Allow requests from Blogger domains and your domain
  const allowedOrigins = ['https://www.fearson.online', 'https://www.blogger.com', 'http://www.blogger.com', 'https://www.blogspot.com', 'http://www.blogspot.com'];
  const origin = req.headers.origin;

  app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://example.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
})
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const { tx } = req.query;
    const authToken = "JNpQRWAPwNn4sPt3shhD8ABgHc8OaZXyYTokU1-0L0tmIMaQYktsT6NhVTq";

    if (!tx) {
      return res.status(400).json({ error: "Missing transaction ID" });
    }

    const payload = `cmd=_notify-synch&tx=${tx}&at=${authToken}`;
    const response = await fetch("https://www.sandbox.paypal.com/cgi-bin/webscr", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload,
    });

    const text = await response.text();
    const lines = text.split("\n");
    const data = {};
    lines.forEach(line => {
      const [key, value] = line.split("=");
      if (key && value) data[key.trim()] = decodeURIComponent(value.trim());
    });

    if (data["payment_status"] !== "Completed") {
      return res.status(403).json({ error: "Payment not completed", raw: text });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
