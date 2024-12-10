const express = require("express");
const cors = require("cors");
const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const path = require("path");
const crypto = require("node:crypto");

const app = express();
app.use(cors());

// to use of this way need to be implemented GOOGLE_APPLICATION_CREDENTIALS
const storage = new Storage();

const bucketName = process.env["BUCKET_ID"];
const folderPath = process.env["BUCKET_FOLDER"];

const upload = multer({ storage: multer.memoryStorage() });

app.post("/file/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file part in the request" });

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
            res.status(500).json({ error: "Failed to upload file" });
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

        const [metadata] = await file.getMetadata();
        const contentType = metadata.contentType || "application/octet-stream";

        res.setHeader("Content-Type", contentType);

        // Stream the file to the response
        const stream = file.createReadStream();
        stream.pipe(res);

        stream.on("error", (err) => {
            console.error("Error streaming file:", err);
            res.status(500).json({ error: "Failed to fetch file" });
        });

        stream.on("end", () => {
            console.log("File streamed successfully");
        });
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
