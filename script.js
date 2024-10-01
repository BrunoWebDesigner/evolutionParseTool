let currentData = null;

// Clear the content of the textarea when the 'X' button is clicked
document.getElementById('clearJsonInput').addEventListener('click', () => {
    document.getElementById('jsonInput').value = '';
});

// Handle the 'Generate Table' button click event
document.getElementById('generateTable').addEventListener('click', () => {
    const fileInput = document.getElementById('jsonFileInput');
    const jsonInput = document.getElementById('jsonInput').value;

    if (jsonInput) {
        try {
            currentData = JSON.parse(jsonInput);
            displayCasinoId(currentData);
            generateTable(currentData);
            document.getElementById('copyTable').disabled = false;
        } catch (e) {
            alert('Invalid JSON input');
        }
    } else if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                currentData = JSON.parse(event.target.result);
                displayCasinoId(currentData);
                generateTable(currentData);
                document.getElementById('copyTable').disabled = false;
            } catch (e) {
                alert('Invalid JSON file');
            }
        };
        reader.readAsText(file);
    } else {
        alert('Please select a JSON file or paste JSON data');
    }
});

// Function to display the casinoId parameter
function displayCasinoId(data) {
    const casinoId = data.casinoId || 'No casinoId found';
    document.getElementById('casinoIdDisplay').textContent = `Casino ID: ${casinoId}`;
}

// Handle the 'Copy Table' button click event
document.getElementById('copyTable').addEventListener('click', () => {
    if (currentData) {
        copyTableToClipboard();
    } else {
        alert('No data to copy');
    }
});

// Function to generate the table from JSON data
function generateTable(data) {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = ''; // Clear previous table

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Fields to exclude from the table
    const excludeFields = ['betLimits', 'road', 'history', 'videoSnapshot'];

    // Create an array for the headers (unique and in order)
    let headers = [];

    // Determine the headers based on the first game's keys, excluding unwanted fields
    const sampleGame = Object.values(data.tables)[0];
    Object.keys(sampleGame).forEach(field => {
        if (!excludeFields.includes(field)) {
            headers.push(field);
        }
    });

    // Add 'virtualTableId' to headers if not already included
    if (!headers.includes('virtualTableId')) {
        headers.unshift('virtualTableId'); // Ensure it appears first
    }

    // Create header row
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Create data rows for all games
    Object.values(data.tables).forEach(game => {
        const dataRow = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            const value = game[header];

            // If the value is undefined, set it to an empty string
            td.textContent = value !== undefined ? (typeof value === 'object' ? JSON.stringify(value) : value) : '';
            dataRow.appendChild(td);
        });
        tbody.appendChild(dataRow);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

// Function to copy the table to clipboard
function copyTableToClipboard() {
    const tableContainer = document.getElementById('tableContainer');
    const table = tableContainer.querySelector('table');

    if (table) {
        const range = document.createRange();
        range.selectNode(table);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        try {
            document.execCommand('copy');
            alert('Table copied to clipboard!');
        } catch (err) {
            alert('Failed to copy table');
        }

        selection.removeAllRanges();
    }
}
