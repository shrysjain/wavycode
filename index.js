// Dependencies
const sharp = require("sharp");

// URL <-> Base64
function urlToBase64(url) {
  return Buffer.from(url).toString("base64");
}

function base64ToUrl(base64Data) {
  return Buffer.from(base64Data, "base64").toString("utf-8");
}

function encodeChar(char) {
  return char.charCodeAt(0);
}

function decodeChar(code) {
  return String.fromCharCode(code);
}

// Encode
async function encode(url, fileName) {
  const base64Data = urlToBase64(url);
  const imageWidth = 300;
  const imageHeight = 300;
  const stripeWidth = 10;
  const buffer = Buffer.alloc(imageWidth * imageHeight * 4);

  for (let y = 0; y < imageHeight; y++) {
    for (let x = 0; x < imageWidth; x++) {
      const index = (y * imageWidth + x) * 4;
      if (x % stripeWidth < stripeWidth / 2) {
        buffer[index] = 255; // Red
        buffer[index + 1] = 0; // Green
        buffer[index + 2] = 0; // Blue
      } else {
        buffer[index] = 0; // Red
        buffer[index + 1] = 0; // Green
        buffer[index + 2] = 255; // Blue
      }
      buffer[index + 3] = 255; // Alpha
    }
  }

  let dataIndex = 0;
  for (let i = 0; i < base64Data.length; i++) {
    const code = encodeChar(base64Data.charAt(i));
    const x = (i % (imageWidth / stripeWidth)) * stripeWidth;
    const y = Math.floor(i / (imageWidth / stripeWidth)) * stripeWidth;
    const index = (y * imageWidth + x) * 4;
    buffer[index] = code % 256;
    buffer[index + 1] = (code >> 8) % 256;
    buffer[index + 2] = (code >> 16) % 256;
    dataIndex++;
  }

  await sharp(buffer, {
    raw: {
      width: imageWidth,
      height: imageHeight,
      channels: 4,
    },
  }).toFile(fileName);
}

async function decode(fileName) {
  const image = sharp(fileName);
  const { data, info } = await image
    .raw()
    .toBuffer({ resolveWithObject: true });

  let base64Data = "";
  for (let i = 0; i < info.width * info.height; i++) {
    const x = (i % (info.width / 10)) * 10;
    const y = Math.floor(i / (info.width / 10)) * 10;
    const index = (y * info.width + x) * 4;
    const code = data[index] + (data[index + 1] << 8) + (data[index + 2] << 16);
    base64Data += decodeChar(code);
  }

  return base64ToUrl(base64Data);
}

// CLI
const args = process.argv.slice(2);
const command = args[0];
const url = args[1];
fileName = args[2] ? args[2] : args[1];

if (command === "encode" && url && fileName) {
  encode(url, fileName)
    .then(() => {
      console.log(`Image saved as ${fileName}`);
    })
    .catch((err) => {
      console.error("Error generating image:", err);
    });
} else if (command === "decode" && fileName) {
  decode(fileName)
    .then((decodedUrl) => {
      console.log("Decoded URL:", decodedUrl);
    })
    .catch((err) => {
      console.error("Error decoding image:", err);
    });
} else {
  console.log("Usage:");
  console.log(
    "  node index.js encode <url> <fileName>  - To encode a URL into an image"
  );
  console.log(
    "  node index.js decode <fileName>        - To decode an image back to a URL"
  );
}
