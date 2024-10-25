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
            populateCurrencyDropdown(currentData);
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
                populateCurrencyDropdown(currentData);
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

// Function to populate the currency dropdown
function populateCurrencyDropdown(data) {
    const currencySelect = document.getElementById('currencySelect');
    currencySelect.innerHTML = ''; // Clear any previous options

    // Extract available currencies from betLimits
    const sampleGame = Object.values(data.tables)[0];
    const currencies = Object.keys(sampleGame.betLimits);

    // Populate the select dropdown with the available currencies
    currencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;
        currencySelect.appendChild(option);
    });
}

// Function to apply the selected currency to the table columns
document.getElementById('applyCurrency').addEventListener('click', () => {
    if (currentData) {
        const selectedCurrency = document.getElementById('currencySelect').value;
        updateTableWithCurrency(currentData, selectedCurrency);
    } else {
        alert('No data to apply');
    }
});

// Function to display the casinoId parameter
function displayCasinoId(data) {
    const casinoId = data.casinoId || 'No casinoId found';
    document.getElementById('casinoIdDisplay').textContent = `Casino ID: ${casinoId}`;
}

// Function to update the table based on selected currency
function updateTableWithCurrency(data, currency) {
    const tableContainer = document.getElementById('tableContainer');
    const table = tableContainer.querySelector('table');

    // Update the betLimits column for the selected currency
    if (table) {
        Object.values(data.tables).forEach((game, index) => {
            const row = table.rows[index + 1]; // Skip header row
            const betLimits = game.betLimits[currency];
            if (betLimits) {
                const betLimitCell = document.createElement('td');
                betLimitCell.textContent = `${betLimits.symbol} min: ${betLimits.min}, max: ${betLimits.max}`;
                row.appendChild(betLimitCell);
            }
        });
    }
}

// Function to generate the table from JSON data
function generateTable(data) {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = ''; // Clear previous table

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const excludeFields = ['betLimits', 'road', 'history', 'videoSnapshot'];
    let headers = [];

    const sampleGame = Object.values(data.tables)[0];
    Object.keys(sampleGame).forEach(field => {
        if (!excludeFields.includes(field)) {
            headers.push(field);
        }
    });

    if (!headers.includes('virtualTableId')) {
        headers.unshift('virtualTableId');
    }

    // Add 'Row Number' as the first header
    const headerRow = document.createElement('tr');
    const rowNumberHeader = document.createElement('th');
    rowNumberHeader.textContent = 'Row Number';
    headerRow.appendChild(rowNumberHeader);

    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Generate rows with row numbers
    Object.values(data.tables).forEach((game, index) => {
        const dataRow = document.createElement('tr');

        // Create a cell for the row number
        const rowNumberCell = document.createElement('td');
        rowNumberCell.textContent = index + 1;  // Row number starts from 1
        dataRow.appendChild(rowNumberCell);

        headers.forEach(header => {
            const td = document.createElement('td');
            const value = game[header];
            td.textContent = value !== undefined ? (typeof value === 'object' ? JSON.stringify(value) : value) : '';
            dataRow.appendChild(td);
        });
        tbody.appendChild(dataRow);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);
}


// Function to copy the table content to the clipboard
function copyTableContent() {
    const tableContainer = document.getElementById('tableContainer');
    const table = tableContainer.querySelector('table');

    if (!table) {
        alert('No table to copy.');
        return;
    }

    // Create a temporary textarea to hold the table content
    const textarea = document.createElement('textarea');
    let tableContent = '';

    // Extract text content from the table
    Array.from(table.rows).forEach(row => {
        const cells = Array.from(row.cells).map(cell => cell.textContent);
        tableContent += cells.join('\t') + '\n'; // Use tabs for separation
    });

    textarea.value = tableContent.trim(); // Trim to remove last newline
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy'); // Copy to clipboard
    document.body.removeChild(textarea);

    alert('Table content copied to clipboard!');
}

// Add event listener for the copy button
document.getElementById('copyTable').addEventListener('click', copyTableContent);
