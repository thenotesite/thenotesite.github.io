document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addBtn = document.getElementById("add-btn");
  const pendingList = document.getElementById("pending-tasks");
  const completedList = document.getElementById("completed-tasks");
  const chillMessage = document.getElementById("chill-message");
  const toggleBtn = document.getElementById("toggle-completed");
  const clearAllBtn = document.getElementById("clear-all");
  const completionText = document.getElementById("completion-percentage");
  const dateEl = document.getElementById("date");
  const errorMessage = document.getElementById("error-message");
  const exportBtn = document.getElementById("export-btn");
  const importBtn = document.getElementById("import-btn");
  const importFile = document.getElementById("import-file");

  const STORAGE_KEY = "minimal-todo-tasks";
  let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  dateEl.textContent = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  let errorTimeout;
  function showError(msg) {
    errorMessage.textContent = msg;
    if (errorTimeout) clearTimeout(errorTimeout);
    errorTimeout = setTimeout(() => {
      errorMessage.textContent = "";
    }, 3000);
  }

  function clearError() {
    errorMessage.textContent = "";
    if (errorTimeout) clearTimeout(errorTimeout);
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function render() {
    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    const pending = tasks.filter((t) => !t.completed);
    const completed = tasks.filter((t) => t.completed);

    pending.forEach((task) => {
      const li = createTaskItem(task);
      pendingList.appendChild(li);
    });

    completed.forEach((task) => {
      const li = createTaskItem(task);
      li.classList.add("completed");
      completedList.appendChild(li);
    });

    chillMessage.classList.toggle("hidden", pending.length > 0);
    updateStats();
    clearError();
  }

  function createTaskItem(task) {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleComplete(task.id));

    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = "task-text";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => deleteTask(task.id);

    li.append(checkbox, span, deleteBtn);
    return li;
  }

  function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) {
      showError("Task cannot be empty.");
      return;
    }
    tasks.unshift({ id: generateReadableId(), text: trimmed, completed: false });
    save();
    taskInput.value = "";
    render();
  }

  function toggleComplete(id) {
    tasks = tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task));
    save();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    save();
    render();
  }

  function clearAll() {
    tasks = [];
    save();
    render();
    showError("All tasks cleared.");
  }

  function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;

    if (total === 0) {
      completionText.textContent = "";
    } else {
      const percent = Math.round((completed / total) * 100);
      completionText.textContent = `${percent}% complete`;
    }
  }

  // Generate a readable ID based on the current date and time
  function generateReadableId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // +1 because months are 0-indexed
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}19${hours}${minutes}${seconds}`;
  }

  exportBtn.onclick = () => {
    if (tasks.length === 0) {
      showError("No tasks to export.");
      return;
    }
    clearError();

    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, "");

    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });

    const filename = `tasks_${formattedDate}.json`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  importBtn.onclick = () => {
    clearError();
    importFile.click();
  };

  importFile.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedTasks = JSON.parse(event.target.result);
        if (Array.isArray(importedTasks)) {
          tasks = importedTasks
            .map((task) => ({
              id: task.id || generateReadableId(),
              text: typeof task.text === "string" ? task.text : "",
              completed: !!task.completed,
            }))
            .filter((task) => task.text.trim() !== "");
          save();
          render();
          showError("Tasks imported successfully.");
        } else {
          showError("Invalid file format. Please upload a valid tasks JSON file.");
        }
      } catch {
        showError("Failed to parse JSON file. Please check the file format.");
      }
    };
    reader.readAsText(file);

    importFile.value = "";
  };

  addBtn.onclick = () => addTask(taskInput.value);
  taskInput.onkeydown = (e) => {
    if (e.key === "Enter") addTask(taskInput.value);
  };

  toggleBtn.onclick = () => {
    completedList.classList.toggle("hidden");
    toggleBtn.textContent = completedList.classList.contains("hidden") ? "Show" : "Hide";
  };

  clearAllBtn.onclick = clearAll;

  render();
});