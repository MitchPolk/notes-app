var Airtable = require('airtable');

// initialize config variables
require('dotenv').config({path: 'config.env'});
const airtableToken = process.env.TOKEN;
const baseId = process.env.BASE_ID;
const tableTasks = process.env.TASKS_TABLE_ID;
const tableUsers = process.env.USERS_TABLE_ID;

// access the base
var base = new Airtable({apiKey: airtableToken}).base(baseId);

// Read all records
async function readRecords(airtableToken, baseId, tableId, maxRecords){
    var base = new Airtable({apiKey: airtableToken}).base(baseId);

    base(tableId).select({
        maxRecords: maxRecords,
        view: "Grid view",
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
    
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';

        records.forEach(function(record) {
            const task = document.createElement('p');
            task.textContent = record.fields.Name + ' - ' + record.fields.Status;
            taskList.appendChild(task)
            // console.log('Record:', record);
            console.log('Task:', task)
        });
    
        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        if (fetchNextPage) {
            fetchNextPage();
        }
    }, function done(err) {
        if (err) { 
            console.error(err); 
            return; 
        }
    });
}

// readRecords(airtableToken, baseId, tableTasks, 5)

async function createRecord(airtableToken, baseId, tableId, newRecord) {
    var base = new Airtable({apiKey: airtableToken}).base(baseId);

    base(tableId).create([
        {
            "fields": newRecord
        }
    ], function(err, records) {
        if (err) {
            console.error(err);
            return;
        }
        records.forEach(function(record) {
            console.log(record.get());
        });
    });
}

let newRecord = {
    "Name": "Homework",
    "Notes": "Do ALL OF IT",
    "Status": "Todo",
}
// createRecord(airtableToken, baseId, tableTasks, newRecord)

async function updateRecord(airtableToken, baseId, tableId, recordId, newRecord){
    var base = new Airtable({apiKey: airtableToken}).base(baseId);

    base(tableId).update([
        {
            "id": recordId,
            "fields": newRecord
        }
    ], function(err, records) {
        if (err) {
            console.error(err);
            return;
        }
        records.forEach(function(record) {
            console.log(record.get('Status'));
        });
    });
}

let recId1 = 'recEmSJHfKBCkeuSs'
// updateRecord(airtableToken, baseId, tableTasks, recId1, newRecord)

async function deleteRecord(airtableToken, baseId, tableId, recordId) {
    var base = new Airtable({apiKey: airtableToken}).base(baseId);

    base(tableId).destroy([
        recordId
    ], function(err, deletedRecords) {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Deleted", deletedRecords.length, 'records')
    });
}

let recId2 = 'reca27v21rSKl08BU'
//deleteRecord(airtableToken, baseId, tableTasks, recId2)