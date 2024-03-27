const http = require('http');
const qs = require('querystring');
const sql = require('mssql');

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


// Create HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/process_form') {
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
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
