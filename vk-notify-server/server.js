const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const VK_GROUP_TOKEN = process.env.VK_GROUP_TOKEN;

const ADMIN_IDS = [
  54652177
];

app.post("/notify-admins", async (req, res) => {
  try {
    const data = req.body;

    const text =
      `Новая готовность на завтра\n\n` +
      `${data.first_name || ""} ${data.last_name || ""}\n` +
      `Телефон: ${data.phone || "не указан"}\n` +
      `Вопрос: ${data.question || "нет"}\n\n` +
      `Открыть VK: https://vk.com/id${data.vk_id}`;

    for (const adminId of ADMIN_IDS) {
      const params = new URLSearchParams({
        access_token: VK_GROUP_TOKEN,
        v: "5.199",
        user_id: String(adminId),
        random_id: String(Date.now() + adminId),
        message: text
      });

      await fetch("https://api.vk.com/method/messages.send", {
        method: "POST",
        body: params
      });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
});

app.get("/", (req, res) => {
  res.send("VK notify server работает");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));