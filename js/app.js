const file = document.getElementById('file');
const canvas = document.getElementById('canvas');
const titleElement = document.getElementById('title');
const ageElement = document.getElementById('age');
const nameElement = document.getElementById('last_name');
let loaded = false;
let image;
let ctx;

function loadLocalImage(e) {
    const fileData = e.target.files[0];
    if (!fileData.type.match('image.*')) {
        M.toast({ html: '画像を選択してください' })
        return;
    }
    const reader = new FileReader();
    reader.onload = function () {
        const uploadImgSrc = reader.result;
        canvasDraw(uploadImgSrc);
    }
    reader.readAsDataURL(fileData);
}
function canvasDraw(uploadImgSrc) {
    const img = new Image();
    img.src = uploadImgSrc;
    img.onload = function () {
        canvas.width = this.width;
        canvas.height = this.height;
        ctx = canvas.getContext('2d');
        image = this;
        loaded = true;
        drawText();
    }
}

const drawText = (e = false) => {
    if (!loaded) {
        return;
    }
    ctx.strokeCenter = function (str, y, width) {
        const text = this.measureText(str);
        ctx.strokeText(str, (width / 2) - (text.width / 2), y);
    }

    ctx.fillCenter = function (str, y, width) {
        const text = this.measureText(str);
        ctx.fillText(str, (width / 2) - (text.width / 2), y);
    }
    const [width, height] = [image.width, image.height];

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);

    const title = document.getElementById('title').value;
    const name = document.getElementById('last_name').value;
    const age = document.getElementById('age').value;
    const fontSizes = [Math.ceil(height * 42 / 720), Math.ceil(height * 50 / 720)];
    ctx.font = `${fontSizes[0]}px 'Impact'`;
    ctx.lineWidth = "6";
    ctx.lineJoin = "miter";
    ctx.fillStyle = "#ffffff"
    ctx.miterLimit = String(Math.ceil(height * 5 / 720));

    ctx.strokeCenter(title, height * 0.81, width);
    ctx.fillCenter(title, height * 0.81, width);
    ctx.font = `${fontSizes[1]}px 'Impact'`;
    const nameLength = ctx.measureText(name).width;
    const ageLength = ctx.measureText(`(${age})`).width;
    ctx.font = `${fontSizes[0]}px 'Impact'`;
    const sanLength = ctx.measureText(`さん`).width;
    const totalWidth = [nameLength, ageLength, sanLength, 5 * 2].reduce((a, b) => a + b, 0)
    const startx = (width / 2) - (totalWidth / 2);

    ctx.font = `${fontSizes[1]}px 'Impact'`;
    ctx.strokeText(name, startx, (height * 0.81) + fontSizes[0] + 20);
    ctx.fillText(name, startx, (height * 0.81) + fontSizes[0] + 20);

    ctx.font = `${fontSizes[0]}px 'Impact'`;
    ctx.strokeText("さん", startx + nameLength + 5, (height * 0.81) + fontSizes[0] + 20);
    ctx.fillText("さん", startx + nameLength + 5, (height * 0.81) + fontSizes[0] + 20);

    ctx.font = `${fontSizes[1]}px 'Impact'`;
    ctx.strokeText(`(${age})`, startx + nameLength + 5 + sanLength + 5, (height * 0.81) + fontSizes[0] + 20);
    ctx.fillText(`(${age})`, startx + nameLength + 5 + sanLength + 5, (height * 0.81) + fontSizes[0] + 20);


    M.toast({ html: '更新しました' })
}


file.addEventListener('change', loadLocalImage, false);
titleElement.addEventListener('change', drawText, false);
ageElement.addEventListener('change', drawText, false);
nameElement.addEventListener('change', drawText, false);