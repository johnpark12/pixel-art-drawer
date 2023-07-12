document.addEventListener('DOMContentLoaded', function() {
    refreshCanvas();
});

function refreshCanvas() {
    const canvas = document.getElementById('canvas');
    canvas.innerHTML = ''; // Clear the canvas

    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            const pixel = document.createElement('div');
            pixel.className = 'pixel';
            pixel.style.backgroundColor = '#ffffff'; // default color white
            pixel.addEventListener('click', changeColor);
            canvas.appendChild(pixel);
        }
    }
}

function compressImageData(inputData) {
    const colorMap = new Map(); // Maintain a unique list of colors
    const pixels = []; // The pixel data (color indices)
    let colorIndex = 0; // Index for the next unique color we encounter

    inputData.forEach(row => {
        const pixelRow = [];
        row.forEach(color => {
            if (!colorMap.has(color)) {
                colorMap.set(color, colorIndex++);
            }
            pixelRow.push(colorMap.get(color));
        });
        pixels.push(pixelRow);
    });

    // Convert the colorMap keys to an array for our palette
    const palette = Array.from(colorMap.keys());

    return [palette, pixels];
}

function expandImageData(compressedData) {
    const [palette, pixels] = compressedData; // Decompose the compressed data
    const expandedData = []; // The expanded data

    pixels.forEach(pixelRow => {
        const expandedRow = [];
        pixelRow.forEach(index => {
            expandedRow.push(palette[index]); // Map the color index back to the color
        });
        expandedData.push(expandedRow);
    });

    return expandedData;
}

function createCanvas() {
    refreshCanvas()

    // const textarea = document.getElementById('csv-input');
    // const content = textarea.value;

    // // const textAreaData = document.getElementById("your-textarea-id").value;
    // const inputData = content.split("\n").map(row => row.split(","));

    let textAreaData = document.getElementById("csv-input").value;

    if (textAreaData !== '') {
        // const inputData = JSON.parse(textAreaData)
        // NOTE not sure if eval is the best choice here.
        const inputData = eval(textAreaData)
        const expandedData = expandImageData(inputData)

        drawCanvas(expandedData)
    }    
}

function drawCanvas(inputData) {
    const canvas = document.getElementById('canvas');
    const pixels = canvas.getElementsByClassName('pixel');

    let index = 0;

    // Assuming inputData is a 2D array
    for (let i = 0; i < inputData.length; i++) {
        for (let j = 0; j < inputData[i].length; j++) {
            pixels[index].style.backgroundColor = inputData[i][j];
            index++;
        }
    }
}

function changeColor(event) {
    const colorPicker = document.getElementById('color-picker');
    event.target.style.backgroundColor = colorPicker.value;
}

function rgbToCSV(rgb) {
    // Remove "rgb(" and ")" and split on ", "
    return rgb.substring(4, rgb.length-1).replace(/ /g, '').split(',');
}

function populateCSV() {
    const canvas = document.getElementById('canvas');
    const pixels = canvas.getElementsByClassName('pixel');
    let csvData = '';

    for (let i = 0; i < pixels.length; i++) {
        // let rgb = rgbToCSV(pixels[i].style.backgroundColor);
        let rgb = pixels[i].style.backgroundColor;
        // console.log(pixels[i].style.backgroundColor)
        // csvData += rgb.join(',') + ',';
        csvData += rgb + ',';

        // Add a newline character at the end of each row of pixels
        if ((i + 1) % 16 === 0) {
            csvData = csvData.slice(0, -1); // Remove trailing comma
            csvData += '\n';
        }
    }

    // Remove the last newline character
    csvData = csvData.slice(0, -1);

    const inputData = csvData.split("\n").map(row => row.match(/rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)/g));

    testData = compressImageData(inputData)
    console.log(testData)
    testData = JSON.stringify(testData)
    // Populate the textarea with the CSV data
    const csvInput = document.getElementById('csv-input');
    csvInput.value = testData;
}
