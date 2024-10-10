const express = require('express');
const Airtable = require('airtable');
require('dotenv').config({path: 'config.env'});

const app = express();
const port = 3000;

// Set up Airtable configuration
const airtableToken = process.env.TOKEN;
const baseId = process.env.BASE_ID;
const tableTasks = process.env.TASKS_TABLE_ID;
var base = new Airtable({ apiKey: airtableToken }).base(baseId);

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files (your front-end code)
app.use(express.static('public'));

// Endpoint to get all tasks
app.get('/api/tasks', (req, res) => {
    let tasks = [];

    base(tableTasks).select({
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
            tasks.push({
                id: record.id,
                name: record.fields.Name,
                status: record.fields.Status
            });
        });
        fetchNextPage();
    }, function done(err) {
        if (err) {
            console.error(err);
            return res.status(500).send("Error retrieving tasks");
        }
        res.json(tasks);
    });
});

// Endpoint to create a new task
app.post('/api/tasks', (req, res) => {
    const { name, status } = req.body;

    base(tableTasks).create([
        {
            "fields": {
                "Name": name,
                "Status": status
            }
        }
    ], function(err, records) {
        if (err) {
            console.error(err);
            return res.status(500).send("Error creating task");
        }
        const newTask = {
            id: records[0].id,
            name: records[0].fields.Name,
            status: records[0].fields.Status
        };
        res.json(newTask);
    });
});

// Endpoint to delete a task
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;

    base(tableTasks).destroy([taskId], function(err, deletedRecords) {
        if (err) {
            console.error(err);
            return res.status(500).send("Error deleting task");
        }
        res.status(204).send();  // Send back no content to confirm deletion
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});