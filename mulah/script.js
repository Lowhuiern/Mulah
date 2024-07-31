document.addEventListener('DOMContentLoaded', function() {
    const csvFilePath = 'Table_Input.csv';

    // Function to fetch the CSV file and parse it
    function fetchCSV() {
        fetch(csvFilePath)
            .then(response => response.text())
            .then(csvData => {
                parseCSV(csvData);
            })
            .catch(error => console.error('Error fetching the CSV file:', error));
    }

    // Function to parse the CSV data
    function parseCSV(data) {
        Papa.parse(data, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                generateTable(results.data);
                generateTable2(results.data);
            }
        });
    }

    // Function to generate the HTML table for the CSV data
    function generateTable(data) {
        const tableBody = document.querySelector('#table1 tbody');
        tableBody.innerHTML = '';

        data.forEach(row => {
            const tr = document.createElement('tr');
            const tdIndex = document.createElement('td');
            const tdValue = document.createElement('td');

            tdIndex.textContent = row['Index #'];
            tdValue.textContent = row['Value'];

            tr.appendChild(tdIndex);
            tr.appendChild(tdValue);
            tableBody.appendChild(tr);
        });
    }

    // Function to perform the operations and generate the table 2
    function generateTable2(data) {
        const tableBody = document.querySelector('#table2 tbody');
        tableBody.innerHTML = '';

        const dataMap = {};
        data.forEach(row => {
            dataMap[row['Index #']] = parseInt(row['Value'], 10);
        });

        const operations = [
            { category: 'Alpha', formula: 'A5 + A20' },
            { category: 'Beta', formula: 'A15 / A7' },
            { category: 'Charlie', formula: 'A13 * A12' }
        ];

        operations.forEach(operation => {
            const tr = document.createElement('tr');
            const tdCategory = document.createElement('td');
            const tdValue = document.createElement('td');

            tdCategory.textContent = operation.category;

            const result = evaluateFormula(operation.formula, dataMap);
            tdValue.textContent = isNaN(result) ? 'N/A' : result;

            tr.appendChild(tdCategory);
            tr.appendChild(tdValue);
            tableBody.appendChild(tr);
        });
    }

    // Function to evaluate a formula given a data map
    function evaluateFormula(formula, dataMap) {
        const tokens = formula.split(' ');
        let result = null;

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            if (token in dataMap) {
                const value = dataMap[token];
                if (result === null) {
                    result = value;
                } else {                            //perform the operation on the formula
                    const operator = tokens[i - 1];
                    switch (operator) {
                        case '+':
                            result += value;
                            break;
                        case '-':
                            result -= value;
                            break;
                        case '*':
                            result *= value;
                            break;
                        case '/':
                            result /= value;
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        return result;
    }

    // Fetch the CSV file when the page is loaded
    fetchCSV();
});
