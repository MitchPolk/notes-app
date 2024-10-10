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
            addDeleteButton(li)
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Add a task to the list (for later integration with Airtable)
async function addTask() {
    if (inputBox.value === '') {
        alert("Please enter a name for your task");
    } else {
        let taskData = {
            name: inputBox.value
        };

        // Frontend: Send task data to the server
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        const data = await response.json();

        // Update front-end if successful
        if (response.ok) {
            console.log("Task added:", data); // For debugging
            let li = document.createElement("li");
            li.textContent = inputBox.value;
            listContainer.appendChild(li);
            addDeleteButton(li);

        } else {
            console.error("Error adding task:", data);
        }

        inputBox.value = '';  // Clear input box after adding
    }
}

function addDeleteButton(li) {
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    span.className = "delete-btn";  // For styling the 'x' button
    li.appendChild(span);

    span.addEventListener('click', () => {
        const taskId = li.getAttribute("data-id");
        deleteTask(taskId, li);
    });
}

function deleteTask(taskId, li) {
    fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
    })
    .then(() => {
        li.remove();  // Remove the task from the UI
    })
    .catch(error => {
        console.error('Error deleting task:', error);
    });
}

// Load tasks when the page loads
fetchTasks();