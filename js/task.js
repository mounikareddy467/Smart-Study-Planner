/* ===== task.js =====
   Core logic for tasks: add, edit, delete, complete, render,
   search, filter, sort and the monthly calendar view.
   Beginner-friendly JavaScript using functions, arrays, objects,
   forEach(), filter(), sort() and map().
*/

// State for search / filter / sort
var currentSearch = "";
var currentFilter = { subject: "", priority: "", category: "", status: "" };
var currentSort = "date";

// State for the calendar view
var calendarDate = new Date();

/* ---------- Helpers ---------- */

// Format a date string (yyyy-mm-dd) into a readable form
function formatDate(dateStr) {
  if (!dateStr) return "";
  var parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  return parts[2] + "/" + parts[1] + "/" + parts[0];
}

// Get today's date as yyyy-mm-dd
function getTodayStr() {
  var d = new Date();
  var month = "" + (d.getMonth() + 1);
  var day = "" + d.getDate();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return d.getFullYear() + "-" + month + "-" + day;
}

// Format time from 24h to 12h for display
function formatTime(timeStr) {
  if (!timeStr) return "";
  var parts = timeStr.split(":");
  var h = parseInt(parts[0], 10);
  var m = parts[1];
  var suffix = h >= 12 ? "PM" : "AM";
  var displayH = h % 12;
  if (displayH === 0) displayH = 12;
  return displayH + ":" + m + " " + suffix;
}

// Escape user input to prevent HTML injection
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ---------- Task Card Rendering ---------- */

// Build the HTML for a single task card
function buildTaskCard(task) {
  var priorityClass = "priority-" + task.priority.toLowerCase();
  var priorityBadgeClass = "badge-priority-" + task.priority.toLowerCase();
  var statusClass = task.status === "Completed" ? "completed" : "";
  var statusBadgeClass =
    task.status === "Completed" ? "badge-status-completed" : "badge-status-pending";

  var timeText = "";
  if (task.startTime && task.endTime) {
    timeText = formatTime(task.startTime) + " - " + formatTime(task.endTime);
  } else if (task.startTime) {
    timeText = formatTime(task.startTime);
  }

  var completeBtnText =
    task.status === "Completed"
      ? '<i class="bi bi-arrow-counterclockwise"></i> Pending'
      : '<i class="bi bi-check2"></i> Complete';

  return (
    '<div class="task-card ' + statusClass + '" data-id="' + task.id + '">' +
      '<div class="task-body">' +
        '<div class="task-priority-bar ' + priorityClass + '"></div>' +
        '<div class="task-content">' +
          '<div class="task-subject"><i class="bi bi-book"></i> ' + escapeHtml(task.subject) + '</div>' +
          '<div class="task-title">' + escapeHtml(task.title) + '</div>' +
          (task.description ? '<div class="task-desc">' + escapeHtml(task.description) + '</div>' : '') +
          '<div class="task-meta">' +
            '<span><i class="bi bi-calendar3"></i> ' + formatDate(task.date) + '</span>' +
            (timeText ? '<span><i class="bi bi-clock"></i> ' + timeText + '</span>' : '') +
            '<span><span class="badge ' + priorityBadgeClass + '">' + escapeHtml(task.priority) + '</span></span>' +
            '<span><span class="badge badge-category">' + escapeHtml(task.category) + '</span></span>' +
            '<span><span class="badge ' + statusBadgeClass + '">' + escapeHtml(task.status) + '</span></span>' +
          '</div>' +
          '<div class="task-actions">' +
            '<button class="btn btn-sm btn-success btn-complete">' + completeBtnText + '</button>' +
            '<button class="btn btn-sm btn-outline-primary btn-edit"><i class="bi bi-pencil"></i> Edit</button>' +
            '<button class="btn btn-sm btn-outline-danger btn-delete"><i class="bi bi-trash"></i> Delete</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

// Render the full task list with search / filter / sort applied
function renderTaskList() {
  var listEl = document.getElementById("taskList");
  if (!listEl) return;

  var tasks = getTasks();

  // Apply search
  if (currentSearch !== "") {
    var q = currentSearch.toLowerCase();
    tasks = tasks.filter(function (t) {
      return (
        t.subject.toLowerCase().indexOf(q) !== -1 ||
        t.title.toLowerCase().indexOf(q) !== -1 ||
        (t.description && t.description.toLowerCase().indexOf(q) !== -1)
      );
    });
  }

  // Apply filters
  if (currentFilter.subject) {
    tasks = tasks.filter(function (t) { return t.subject === currentFilter.subject; });
  }
  if (currentFilter.priority) {
    tasks = tasks.filter(function (t) { return t.priority === currentFilter.priority; });
  }
  if (currentFilter.category) {
    tasks = tasks.filter(function (t) { return t.category === currentFilter.category; });
  }
  if (currentFilter.status) {
    tasks = tasks.filter(function (t) { return t.status === currentFilter.status; });
  }

  // Apply sorting
  tasks = tasks.slice(); // copy before sort
  if (currentSort === "date") {
    tasks.sort(function (a, b) {
      return (a.date || "").localeCompare(b.date || "");
    });
  } else if (currentSort === "priority") {
    var order = { High: 1, Medium: 2, Low: 3 };
    tasks.sort(function (a, b) {
      return (order[a.priority] || 0) - (order[b.priority] || 0);
    });
  } else if (currentSort === "subject") {
    tasks.sort(function (a, b) {
      return a.subject.toLowerCase().localeCompare(b.subject.toLowerCase());
    });
  }

  // Update count badge
  var countEl = document.getElementById("taskCount");
  if (countEl) {
    countEl.textContent = tasks.length + (tasks.length === 1 ? " task" : " tasks");
  }

  // Render
  if (tasks.length === 0) {
    listEl.innerHTML =
      '<div class="empty-state">' +
        '<i class="bi bi-inbox"></i>' +
        '<p class="mb-0">No tasks found. Try adding a new task or changing your filters.</p>' +
      '</div>';
    return;
  }

  var html = "";
  tasks.forEach(function (task) {
    html += buildTaskCard(task);
  });
  listEl.innerHTML = html;
}

// Populate the subject filter dropdown with unique subjects
function populateSubjectFilter() {
  var select = document.getElementById("filterSubject");
  if (!select) return;
  var tasks = getTasks();
  var subjects = [];
  tasks.forEach(function (t) {
    if (subjects.indexOf(t.subject) === -1) {
      subjects.push(t.subject);
    }
  });
  subjects.sort();
  var options = '<option value="">All</option>';
  subjects.forEach(function (s) {
    options += '<option value="' + escapeHtml(s) + '">' + escapeHtml(s) + '</option>';
  });
  select.innerHTML = options;
}

/* ---------- Form Handling (Add / Edit) ---------- */

function resetForm() {
  var form = document.getElementById("taskForm");
  if (!form) return;
  form.reset();
  document.getElementById("taskId").value = "";
  document.getElementById("priority").value = "Medium";
  document.getElementById("category").value = "Assignment";
  document.getElementById("formTitle").textContent = "Add Task";
  document.getElementById("submitBtn").innerHTML = '<i class="bi bi-plus-circle"></i> Add Task';
}

function fillFormForEdit(task) {
  document.getElementById("taskId").value = task.id;
  document.getElementById("subject").value = task.subject;
  document.getElementById("title").value = task.title;
  document.getElementById("description").value = task.description || "";
  document.getElementById("date").value = task.date;
  document.getElementById("startTime").value = task.startTime || "";
  document.getElementById("endTime").value = task.endTime || "";
  document.getElementById("priority").value = task.priority;
  document.getElementById("category").value = task.category;
  document.getElementById("formTitle").textContent = "Edit Task";
  document.getElementById("submitBtn").innerHTML = '<i class="bi bi-check2-circle"></i> Update Task';
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleFormSubmit(e) {
  e.preventDefault();
  var id = document.getElementById("taskId").value;
  var subject = document.getElementById("subject").value.trim();
  var title = document.getElementById("title").value.trim();
  var description = document.getElementById("description").value.trim();
  var date = document.getElementById("date").value;
  var startTime = document.getElementById("startTime").value;
  var endTime = document.getElementById("endTime").value;
  var priority = document.getElementById("priority").value;
  var category = document.getElementById("category").value;

  // Basic validation
  if (!subject || !title || !date) {
    alert("Please fill in Subject, Task Title and Date.");
    return;
  }

  if (id) {
    // Edit existing
    var existing = getTasks().filter(function (t) { return t.id === id; })[0];
    var updated = {
      id: id,
      subject: subject,
      title: title,
      description: description,
      date: date,
      startTime: startTime,
      endTime: endTime,
      priority: priority,
      category: category,
      status: existing ? existing.status : "Pending",
      createdAt: existing ? existing.createdAt : Date.now()
    };
    updateTask(updated);
  } else {
    // Add new
    var newTask = {
      id: generateId(),
      subject: subject,
      title: title,
      description: description,
      date: date,
      startTime: startTime,
      endTime: endTime,
      priority: priority,
      category: category,
      status: "Pending",
      createdAt: Date.now()
    };
    addTask(newTask);
  }

  resetForm();
  populateSubjectFilter();
  renderTaskList();
  renderDashboard();
}

/* ---------- Task Actions (complete / edit / delete) ---------- */

// Variable to hold the id of the task pending deletion
var pendingDeleteId = null;

function toggleComplete(id) {
  var tasks = getTasks();
  tasks = tasks.map(function (t) {
    if (t.id === id) {
      t.status = t.status === "Completed" ? "Pending" : "Completed";
    }
    return t;
  });
  saveTasks(tasks);
  renderTaskList();
  renderDashboard();
}

function handleTaskListClick(e) {
  var card = e.target.closest(".task-card");
  if (!card) return;
  var id = card.getAttribute("data-id");

  if (e.target.closest(".btn-complete")) {
    toggleComplete(id);
  } else if (e.target.closest(".btn-edit")) {
    var task = getTasks().filter(function (t) { return t.id === id; })[0];
    if (task) fillFormForEdit(task);
  } else if (e.target.closest(".btn-delete")) {
    pendingDeleteId = id;
    var modal = new bootstrap.Modal(document.getElementById("deleteModal"));
    modal.show();
  }
}

function confirmDelete() {
  if (pendingDeleteId) {
    deleteTaskById(pendingDeleteId);
    pendingDeleteId = null;
    populateSubjectFilter();
    renderTaskList();
    renderDashboard();
  }
  var modalEl = document.getElementById("deleteModal");
  if (modalEl) {
    var modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  }
}

/* ---------- Dashboard Rendering ---------- */

function renderDashboard() {
  var tasks = getTasks();
  var today = getTodayStr();

  var total = tasks.length;
  var completed = tasks.filter(function (t) { return t.status === "Completed"; }).length;
  var pending = total - completed;
  var percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Stats
  setText("statTotal", total);
  setText("statCompleted", completed);
  setText("statPending", pending);
  setText("statPercent", percent + "%");

  // Progress bar
  var bar = document.getElementById("progressBar");
  if (bar) {
    bar.style.width = percent + "%";
    bar.textContent = percent + "%";
  }
  setText("progressText", completed + " of " + total + " tasks completed");

  // Today's tasks
  var todayTasks = tasks.filter(function (t) { return t.date === today; });
  renderMiniList("todayTasks", todayTasks, "No tasks scheduled for today.");

  // Upcoming tasks (future date, not today, pending)
  var upcoming = tasks
    .filter(function (t) { return t.date > today && t.status !== "Completed"; })
    .sort(function (a, b) { return (a.date || "").localeCompare(b.date || ""); })
    .slice(0, 5);
  renderMiniList("upcomingTasks", upcoming, "No upcoming tasks.");

  // Completed tasks
  var done = tasks
    .filter(function (t) { return t.status === "Completed"; })
    .sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); })
    .slice(0, 5);
  renderMiniList("completedTasks", done, "No completed tasks yet.");
}

function renderMiniList(elementId, tasks, emptyMsg) {
  var el = document.getElementById(elementId);
  if (!el) return;
  if (tasks.length === 0) {
    el.innerHTML =
      '<div class="empty-state"><i class="bi bi-calendar-x"></i><p class="mb-0 small">' + emptyMsg + '</p></div>';
    return;
  }
  var html = "";
  tasks.forEach(function (t) {
    var doneClass = t.status === "Completed" ? "completed" : "";
    html +=
      '<div class="mini-task ' + doneClass + '">' +
        '<p class="mini-title mb-0">' + escapeHtml(t.title) + '</p>' +
        '<p class="mini-meta">' + escapeHtml(t.subject) + ' &middot; ' + formatDate(t.date) + '</p>' +
      '</div>';
  });
  el.innerHTML = html;
}

function setText(id, value) {
  var el = document.getElementById(id);
  if (el) el.textContent = value;
}

/* ---------- Calendar View ---------- */

function renderCalendar() {
  var grid = document.getElementById("calendarGrid");
  var monthLabel = document.getElementById("calendarMonth");
  if (!grid || !monthLabel) return;

  var tasks = getTasks();
  var year = calendarDate.getFullYear();
  var month = calendarDate.getMonth();

  var monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  monthLabel.textContent = monthNames[month] + " " + year;

  var firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var todayStr = getTodayStr();

  // Build a map of date string -> task count
  var taskMap = {};
  tasks.forEach(function (t) {
    if (!t.date) return;
    if (!taskMap[t.date]) taskMap[t.date] = 0;
    taskMap[t.date]++;
  });

  var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var html = "";
  dayNames.forEach(function (d) {
    html += '<div class="calendar-day-name">' + d + '</div>';
  });

  // Empty cells before the first day
  for (var i = 0; i < firstDay; i++) {
    html += '<div class="calendar-cell empty"></div>';
  }

  // Day cells
  for (var day = 1; day <= daysInMonth; day++) {
    var m = "" + (month + 1);
    var d = "" + day;
    if (m.length < 2) m = "0" + m;
    if (d.length < 2) d = "0" + d;
    var dateStr = year + "-" + m + "-" + d;

    var classes = "calendar-cell";
    if (dateStr === todayStr) classes += " today";
    if (taskMap[dateStr]) classes += " has-task";

    html += '<div class="' + classes + '">';
    html += '<span class="day-num">' + day + '</span>';
    if (taskMap[dateStr]) {
      html += '<div class="task-dots">';
      for (var j = 0; j < Math.min(taskMap[dateStr], 4); j++) {
        html += '<span class="task-dot"></span>';
      }
      html += '</div>';
      html += '<span class="task-count">' + taskMap[dateStr] + ' task' + (taskMap[dateStr] > 1 ? "s" : "") + '</span>';
    }
    html += '</div>';
  }
grid.className = "calendar-grid";
grid.innerHTML = html;
}

/* ---------- Initialize Task Page ---------- */

function initTaskPage() {
  var form = document.getElementById("taskForm");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }
  var resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetForm);
  }
  var listEl = document.getElementById("taskList");
  if (listEl) {
    listEl.addEventListener("click", handleTaskListClick);
  }
  var confirmBtn = document.getElementById("confirmDelete");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", confirmDelete);
  }

  // Search
  var searchBox = document.getElementById("searchBox");
  if (searchBox) {
    searchBox.addEventListener("input", function (e) {
      currentSearch = e.target.value.trim();
      renderTaskList();
    });
  }

  // Filters
  var filterSubject = document.getElementById("filterSubject");
  if (filterSubject) {
    filterSubject.addEventListener("change", function (e) {
      currentFilter.subject = e.target.value;
      renderTaskList();
    });
  }
  var filterPriority = document.getElementById("filterPriority");
  if (filterPriority) {
    filterPriority.addEventListener("change", function (e) {
      currentFilter.priority = e.target.value;
      renderTaskList();
    });
  }
  var filterCategory = document.getElementById("filterCategory");
  if (filterCategory) {
    filterCategory.addEventListener("change", function (e) {
      currentFilter.category = e.target.value;
      renderTaskList();
    });
  }
  var filterStatus = document.getElementById("filterStatus");
  if (filterStatus) {
    filterStatus.addEventListener("change", function (e) {
      currentFilter.status = e.target.value;
      renderTaskList();
    });
  }

  // Sort
  var sortBy = document.getElementById("sortBy");
  if (sortBy) {
    sortBy.addEventListener("change", function (e) {
      currentSort = e.target.value;
      renderTaskList();
    });
  }

  populateSubjectFilter();
  renderTaskList();
}

/* ---------- Initialize Dashboard Page ---------- */

function initDashboardPage() {
  renderDashboard();
  renderCalendar();

  var prev = document.getElementById("prevMonth");
  var next = document.getElementById("nextMonth");
  if (prev) {
    prev.addEventListener("click", function () {
      calendarDate.setMonth(calendarDate.getMonth() - 1);
      renderCalendar();
    });
  }
  if (next) {
    next.addEventListener("click", function () {
      calendarDate.setMonth(calendarDate.getMonth() + 1);
      renderCalendar();
    });
  }
}
