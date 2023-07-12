document.addEventListener('DOMContentLoaded', function() {
    createCanvas();
});

function refreshCanvas(gridSize) {
    const canvas = document.getElementById('canvas');
    canvas.innerHTML = ''; // Clear the canvas

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const pixel = document.createElement('div');
            pixel.className = 'pixel';
            pixel.style.backgroundColor = '#ffffff'; // default color white
            pixel.addEventListener('click', changeColor);
            canvas.appendChild(pixel);
        }
    }
}
function createCanvas() {
    const gridSize = document.getElementById('grid-size').value;
    const canvas = document.getElementById('canvas');
    canvas.style.setProperty('--grid-dimensions', gridSize); // Set the CSS variable for grid size
    refreshCanvas(gridSize);

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
function populateCSV() {
    const canvas = document.getElementById('canvas');
    const pixels = canvas.getElementsByClassName('pixel');
    const gridSize = Math.sqrt(pixels.length); // Calculate the grid size from the total pixel count
    let csvData = '';

    for (let i = 0; i < pixels.length; i++) {
        let rgb = pixels[i].style.backgroundColor;
        csvData += rgb + ',';

        // Add a newline character at the end of each row of pixels
        if ((i + 1) % gridSize === 0) {
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
