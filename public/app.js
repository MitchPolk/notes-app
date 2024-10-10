const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Fetch tasks from the server and display them
async function fetchTasks() {
    try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        
        tasks.forEach(task => {
            let li = document.createElement("li");
            li.textContent = task.name;
            listContainer.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Add a task to the list (for later integration with Airtable)
function addTask() {
    if (inputBox.value === '') {
        alert("Please enter a name for your task");
    } else {
        let li = document.createElement("li");
        li.textContent = inputBox.value;
        listContainer.appendChild(li);
        inputBox.value = '';  // Clear input box after adding
    }
}

// Load tasks when the page loads
fetchTasks();