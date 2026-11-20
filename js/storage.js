/* ===== storage.js =====
   Handles saving and loading tasks from Browser Local Storage.
   Uses localStorage.setItem / getItem with JSON.stringify / JSON.parse.
*/

var STORAGE_KEY = "smartStudyPlannerTasks";

// Get all tasks from local storage (returns an array)
function getTasks() {
  var data = localStorage.getItem(STORAGE_KEY);
  if (data === null) {
    return [];
  }
  try {
    var tasks = JSON.parse(data);
    return Array.isArray(tasks) ? tasks : [];
  } catch (e) {
    console.error("Error parsing tasks from local storage:", e);
    return [];
  }
}

// Save all tasks to local storage
function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Add a single new task
function addTask(task) {
  var tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
}

// Update an existing task by id
function updateTask(updatedTask) {
  var tasks = getTasks();
  tasks = tasks.map(function (t) {
    if (t.id === updatedTask.id) {
      return updatedTask;
    }
    return t;
  });
  saveTasks(tasks);
}

// Delete a task by id
function deleteTaskById(id) {
  var tasks = getTasks();
  tasks = tasks.filter(function (t) {
    return t.id !== id;
  });
  saveTasks(tasks);
}

// Generate a simple unique id
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
