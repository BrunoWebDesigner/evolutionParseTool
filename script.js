let currentData = null;

document.getElementById('generateTable').addEventListener('click', () => {
    const fileInput = document.getElementById('jsonFileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                currentData = JSON.parse(event.target.result);
                generateTable(currentData);
                document.getElementById('exportExcel').disabled = false;
            } catch (e) {
                alert('Invalid JSON file');
            }
        };
        reader.readAsText(file);
    } else {
        alert('Please select a JSON file');
    }
});

document.getElementById('exportExcel').addEventListener('click', () => {
    if (currentData) {
        exportToExcel(currentData);
    } else {
        alert('No data to export');
    }
});

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

function exportToExcel(data) {
    // Convert JSON data to sheet format
    const ws = XLSX.utils.json_to_sheet(Object.values(data.tables).map(game => {
        const obj = { ...game };
        if (obj.virtualTableId) {
            obj.virtualTableId = obj.virtualTableId;
        }
        return obj;
    }));

    // Create a new workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Games');

    // Export the workbook
    XLSX.writeFile(wb, 'games.xlsx');
}