const imageInput = document.getElementById("imageInput");
const urlInput = document.getElementById("urlInput");
const waInput = document.getElementById("waInput");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

generateBtn.addEventListener("click", () => {

    const file = imageInput.files[0];

    if (!file) {
        alert("Upload gambar terlebih dahulu");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e){

        const img = new Image();

        img.onload = function(){

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img,0,0);

            const footerHeight = Math.round(img.height * 0.08);

            ctx.fillStyle = "rgba(0,0,0,0.65)";
            ctx.fillRect(
                0,
                img.height - footerHeight,
                img.width,
                footerHeight
            );

            const text =
                `${urlInput.value} | WhatsApp: ${waInput.value}`;

            ctx.fillStyle = "#ffffff";
            ctx.font = `${footerHeight * 0.35}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillText(
                text,
                img.width / 2,
                img.height - footerHeight / 2
            );

            downloadBtn.style.display = "block";
        };

        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
});

downloadBtn.addEventListener("click", () => {

    const link = document.createElement("a");

    link.download = "hasil-footer.png";
    link.href = canvas.toDataURL("image/png");

    link.click();
});
