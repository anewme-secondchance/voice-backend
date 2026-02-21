import express from "express";
import multer from "multer";
import OpenAI from "openai";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/speech", upload.single("file"), async (req, res) => {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: "whisper-1",
    });

    fs.unlinkSync(req.file.path);

    res.json({ text: transcription.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Speech failed" });
  }
});

app.listen(3000, () => console.log("Server running"));
