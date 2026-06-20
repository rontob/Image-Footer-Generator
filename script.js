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

let model;

async function loadAI() {
    model = await cocoSsd.load();
    console.log("AI Loaded");
}

loadAI();
});

async function detectObjects(img){

    const predictions =
        await model.detect(img);

    return predictions;
}

function findBestPosition(img, objects){

    let footerY = img.height - 120;

    if(objects.length > 0){

        let lowest = 0;

        objects.forEach(obj => {

            const bottom =
                obj.bbox[1] + obj.bbox[3];

            if(bottom > lowest){
                lowest = bottom;
            }

        });

        if(lowest > img.height * 0.7){
            footerY = 20;
        }
    }

    return footerY;

    function getAverageBrightness(
    imageData
){

    let total = 0;

    for(let i=0;i<imageData.data.length;i+=4){

        const r = imageData.data[i];
        const g = imageData.data[i+1];
        const b = imageData.data[i+2];

        total += (r+g+b)/3;
    }

    return total /
        (imageData.data.length/4);
    }
}

                           const objects =
    await detectObjects(img);

const footerY =
    findBestPosition(
        img,
        objects
    );

const sample =
    ctx.getImageData(
        0,
        footerY,
        canvas.width,
        100
    );

const brightness =
    getAverageBrightness(sample);

const textColor =
    brightness > 140
    ? "#000000"
    : "#FFFFFF";

ctx.fillStyle =
    brightness > 140
    ? "rgba(255,255,255,.6)"
    : "rgba(0,0,0,.6)";

ctx.fillRect(
    0,
    footerY,
    canvas.width,
    100
);

ctx.fillStyle = textColor;

ctx.font = "36px Arial";

ctx.textAlign = "center";

ctx.fillText(
    `${url} | WA ${wa}`,
    canvas.width/2,
    footerY+55
);
