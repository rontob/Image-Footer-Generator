// =========================
// Footer Image Generator
// =========================

let model = null;

// Load AI Model
async function loadAI() {
    try {
        model = await cocoSsd.load();
        console.log("✅ AI Loaded");
    } catch (err) {
        console.error("❌ Gagal memuat AI:", err);
    }
}

loadAI();

// Ambil elemen HTML
const imageInput = document.getElementById("imageInput");
const urlInput = document.getElementById("urlInput");
const waInput = document.getElementById("waInput");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// =========================
// Simpan URL & WhatsApp Permanen
// =========================

urlInput.value =
    localStorage.getItem("footer_url") || "";

waInput.value =
    localStorage.getItem("footer_wa") || "";

urlInput.addEventListener("input", () => {

    localStorage.setItem(
        "footer_url",
        urlInput.value.trim()
    );

});

waInput.addEventListener("input", () => {

    localStorage.setItem(
        "footer_wa",
        waInput.value.trim()
    );

});

// =========================
// Deteksi Objek AI
// =========================

async function detectObjects(img) {

    if (!model) {
        return [];
    }

    try {
        return await model.detect(img);
    } catch (err) {
        console.error(err);
        return [];
    }
}

// =========================
// Hitung Kecerahan
// =========================

function getAverageBrightness(imageData) {

    let total = 0;

    for (let i = 0; i < imageData.data.length; i += 4) {

        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];

        total += (r + g + b) / 3;
    }

    return total / (imageData.data.length / 4);
}

// =========================
// Generate Gambar
// =========================

generateBtn.addEventListener("click", () => {

    const file = imageInput.files[0];

    if (!file) {
        alert("Upload gambar terlebih dahulu");
        return;
    }

    const url = urlInput.value.trim();

    let wa = waInput.value.trim();

    if (!url) {
        alert("URL wajib diisi");
        return;
    }

    if (!wa) {
        alert("Nomor WhatsApp wajib diisi");
        return;
    }

    // Format nomor Indonesia
    if (wa.startsWith("0")) {
        wa = "+62" + wa.substring(1);
    }

    const reader = new FileReader();

    reader.onload = function (e) {

        const img = new Image();

        img.onload = async function () {

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            ctx.drawImage(
                img,
                0,
                0
            );

            // Jalankan AI (opsional)
            const objects =
                await detectObjects(img);

            console.log(
                "Objek terdeteksi:",
                objects
            );

            // Footer selalu di bawah
            const footerHeight =
                Math.max(
                    50,
                    Math.round(
                        img.height * 0.08
                    )
                );

            const footerY =
                canvas.height -
                footerHeight;

            // Ambil area footer
            const sample =
                ctx.getImageData(
                    0,
                    footerY,
                    canvas.width,
                    footerHeight
                );

            const brightness =
                getAverageBrightness(
                    sample
                );

            const textColor =
                brightness > 140
                    ? "#000000"
                    : "#FFFFFF";

            const bgColor =
                brightness > 140
                    ? "rgba(255,255,255,0.65)"
                    : "rgba(0,0,0,0.65)";

            // Background footer
            ctx.fillStyle =
                bgColor;

            ctx.fillRect(
                0,
                footerY,
                canvas.width,
                footerHeight
            );

            const text =
                `${url} | WhatsApp: ${wa}`;

            // Auto resize font
            let fontSize =
                Math.round(
                    footerHeight * 0.35
                );

            ctx.font =
                `${fontSize}px Arial`;

            while (
                ctx.measureText(
                    text
                ).width >
                    canvas.width - 20 &&
                fontSize > 12
            ) {
                fontSize--;

                ctx.font =
                    `${fontSize}px Arial`;
            }

            // Tulis teks
            ctx.fillStyle =
                textColor;

            ctx.textAlign =
                "center";

            ctx.textBaseline =
                "middle";

            ctx.fillText(
                text,
                canvas.width / 2,
                footerY +
                    footerHeight / 2
            );

            downloadBtn.style.display =
                "block";
        };

        img.onerror =
            function () {

            alert(
                "Gagal membaca gambar"
            );

        };

        img.src =
            e.target.result;
    };

    reader.readAsDataURL(
        file
    );
});

// =========================
// Download Hasil
// =========================

downloadBtn.addEventListener(
    "click",
    () => {

        const link =
            document.createElement(
                "a"
            );

        link.download =
            "hasil-footer-ai.png";

        link.href =
            canvas.toDataURL(
                "image/png",
                1.0
            );

        link.click();
    }
);
