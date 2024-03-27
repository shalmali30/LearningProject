const express = require('express');
const http = require('http');
const path = require('path'); // Import the 'path' module
const qs = require('querystring');
const sql = require('mssql');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure SQL Server connection
const config = {
    user: 'sa',
    password: 'Harami@1711',
    server: 'localhost',
    database: 'Test',
    options: {
        encrypt: false // Change to true if you're using Azure SQL Database
    }
};

// Serve static files from the "public" directory
app.use(express.static('public'));

// Serve the HTML form at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Form.html'));
});

// Create HTTP server
const server = http.createServer(app);

// Define POST endpoint for form processing
app.post('/process_form', (req, res) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);

    let body = '';

    // Collect request data
    req.on('data', chunk => {
        body += chunk.toString();
    });

    // Process form data
    req.on('end', () => {
        const formData = qs.parse(body);

        // Connect to SQL Server and insert data
        sql.connect(config, err => {
            if (err) {
                console.error('Database connection failed:', err);
                res.statusCode = 500;
                res.end('Internal Server Error');
            } else {
                const request = new sql.Request();
                request.input('name', sql.NVarChar, formData.name);
                request.input('email', sql.NVarChar, formData.email);
                request.input('phone', sql.NVarChar, formData.phone);
                request.query('INSERT INTO users (name, email, phone) VALUES (@name, @email, @phone)',
                    (err, result) => {
                        if (err) {
                            console.error('Error executing query:', err);
                            res.statusCode = 500;
                            res.end('Internal Server Error');
                        } else {
                            console.log('New record created successfully');
                            res.statusCode = 200;
                            res.end('Form submitted successfully');
                        }
                        sql.close();
                    });
            }
        });
    });
});

// Define the port to listen on
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
