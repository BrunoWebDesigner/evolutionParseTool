# JSON Table Generator with Filters

This project is a web-based tool that allows users to upload a JSON file or paste JSON code to dynamically generate an interactive table. The table includes filters in the header to enable users to filter the data based on specific criteria.

## Features

- **Dynamic Table Generation**: Automatically generates a table from user-provided JSON data.
- **File Upload and Code Input**: Supports JSON file upload or direct JSON code input.
- **Interactive Filters**: Includes filtering capabilities in the table header to search and filter the displayed data.
- **Responsive Design**: Designed to be responsive and user-friendly.

## How to Use
1. Open the Project
2. Open index.html in a web browser.
3. Upload JSON or Paste JSON Code
Upload a JSON File: Click on "Upload JSON File" and select a .json file from your computer.
Paste JSON Code: Alternatively, paste JSON code directly into the provided textarea.
4. Generate the Table
Click the Generate Table button to create the table.
5. Use the Filters
Use the input fields in the table header to filter the data.

## Project Structure
your-project-folder/
│
├── index.html        # Main HTML file
├── styles.css        # CSS for styling the table and layout
├── script.js         # JavaScript for handling table generation and filtering
└── data.json         # (Optional) Sample JSON data file

## Example JSON Format
Here is an example of the JSON format that can be used with this tool:

[
    {
        "product": "Spinomenal",
        "platforms": ["GPL_MOBILE", "GPL_DESKTOP"],
        "name": "Story Of Egypt",
        "game_code": "SlotMachine_StoryOfEgypt",
        "freebet_support": true,
        "enabled": true,
        "category": "Video Slots",
        "blocked_countries": ["AU", "IL", "US", "GB", "IT"]
    },
    {
        "product": "Spinomenal",
        "platforms": ["GPL_MOBILE", "GPL_DESKTOP"],
        "name": "StoryOfHercules-15E",
        "game_code": "SlotMachine_StoryOfHercules-15E",
        "freebet_support": true,
        "enabled": true,
        "category": "Video Slots",
        "blocked_countries": ["AU", "IL", "US", "GB", "IT"]
    }
]

## Dependencies
No external dependencies are required. This project is built using plain HTML, CSS, and JavaScript.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request or open an Issue to improve this project.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
