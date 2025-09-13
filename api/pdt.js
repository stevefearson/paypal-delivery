module.exports = async (req, res) => {
  // CORS headers and PDT logic
};

const { tx } = req.query;
const authToken = "JNpQRWAPwNn4sPt3shhD8ABgHc8OaZXyYTokU1-0L0tmIMaQYktsT6NhVTq"; // Replace with your actual sandbox PDT token

if (!tx) return res.status(400).json({ error: "Missing transaction ID" });

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
return res.status(403).json({ error: "Payment not completed" });
}

res.status(200).json(data);
}
