const express = require("express");
const cors = require("cors");
const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const path = require("path");
const crypto = require("node:crypto");

const app = express();
app.use(cors());

process.env["GOOGLE_APPLICATION_CREDENTIALS"] = "./google-credentials.json";

const storage = new Storage();

const bucketName = "dev-tiankii-env";
const folderPath = "uploaded-files";
const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file part in the request" });
        }

        const generateUniqueId = () => crypto.randomBytes(20).toString("hex");

        const fileExtension = path.extname(req.file.originalname);
        const uniqueFilename = `${generateUniqueId()}${fileExtension}`;
        const destinationBlobName = `${folderPath}/${uniqueFilename}`;

        const bucket = storage.bucket(bucketName);
        const blob = bucket.file(destinationBlobName);

        const stream = blob.createWriteStream({
            resumable: false,
            contentType: req.file.mimetype,
        });

        stream.on("error", (err) => {
            console.error("Error uploading file:", err);
            return res.status(500).json({ error: "Failed to upload file" });
        });

        stream.on("finish", () => {
            res.status(200).json({
                message: "File uploaded successfully",
                id: uniqueFilename,
            });
        });

        stream.end(req.file.buffer);
    } catch (error) {
        console.error("Error processing upload:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/file/:id", async (req, res) => {
    try {
        const fileId = req.params.id;
        const destinationBlobName = `${folderPath}/${fileId}`;
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(destinationBlobName);

        const [exists] = await file.exists();
        if (!exists) return res.status(404).json({ error: "File not found" });

        const [signedUrl] = await file.getSignedUrl({
            version: "v4",
            action: "read",
            expires: Date.now() + 15 * 60 * 1000,
        });

       return res.status(200).json({ url: signedUrl });
    } catch (error) {
        console.error("Error fetching file:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.use((req, res, next) => {
    res.status(404).json({ error: "Endpoint not found" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
