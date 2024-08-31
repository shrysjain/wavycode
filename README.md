# wavycode

`wavycode` is a custom data encoding protocol that transforms URLs or other information into visually distinctive images using patterns and color variations. Unlike traditional QR codes, WavyCode creates a unique, subtle visual representation of data that can be decoded with specialized tools.

## Usage

1. Clone the Repository

```sh
git clone <repository-url>
cd <repository-directory>
```

2. Install Dependencies

```sh
npm install
```

3. Run the Script
4. You can modify the script to specify your URL and the desired output file name.

```sh
node index.js
```

Replace script.js with the name of your script file. This will generate an image and decode it back to the original URL.

## Example Usage

```sh
node index.js encode https://shrysjain.me output.png # stdout -> Image saved as output.png
node index.js decode output.png # stdout -> Decoded URL: https://shrysjain.me
```

## Dependencies

- `sharp`: A high-performance image processing library for Node.js.

Ensure you have `Node.js` and `npm` on your system. To install the required dependencies, run:

```sh
npm install
```

## How It Works

### Encoding

1. URL to Base64: Converts the URL into a Base64-encoded string.
2. Image Creation: Initializes an image with a stripe pattern (alternating colors) as the background.
3. Data Encoding: Each Base64 character is encoded into RGB values and placed into the image.
4. Save Image: The image with the encoded data is saved to a file.

### Decoding

1. Read Image: Reads the image and extracts the RGB values.
2. Extract Data: Reconstructs the Base64 string from the RGB values.
3. Base64 to URL: Converts the Base64 string back into the original URL.

## Contributing

We welcome contributions to improve `wavycode`. To contribute, please fork the repository and create a pull request with your changes.

## Licensing

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
