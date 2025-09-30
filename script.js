document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const taskDate = document.getElementById("taskDate");
  const taskTime = document.getElementById("taskTime");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function formatTime(timeStr) {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":").map(Number);
    const suffix = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${suffix}`;
  }

  function updateProgress() {
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    const percent = total ? (done / total) * 100 : 0;

    progressBar.style.width = percent + "%";
    progressText.textContent = `${done} of ${total} tasks done`;
  }

  function renderTasks() {
    taskList.innerHTML = "";
    const today = new Date().toISOString().split("T")[0];

    // 🔄 Sort tasks by due date and time
    tasks.sort((a, b) => {
      const aDate = new Date(`${a.date || "9999-12-31"}T${a.time || "23:59"}`);
      const bDate = new Date(`${b.date || "9999-12-31"}T${b.time || "23:59"}`);
      return aDate - bDate;
    });

    // 🎨 Group tasks by exact date+time
    const timeGroups = {};
    tasks.forEach((task) => {
      if (task.date && task.time) {
        const key = `${task.date}|${task.time}`;
        timeGroups[key] = (timeGroups[key] || 0) + 1;
      }
    });

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "task-item";
      if (task.done) li.classList.add("completed");
      if (task.date && !task.done && task.date < today) {
        li.classList.add("overdue");
      }

      // 🎨 Highlight tasks with matching date+time
      if (task.date && task.time) {
        const key = `${task.date}|${task.time}`;
        if (timeGroups[key] > 1) {
          const groupIndex = Object.keys(timeGroups).sort().indexOf(key);
          const colors = ["#ff6ec7", "#00ffd5", "#ffa500", "#9dff00", "#ff4f4f"];
          const color = colors[groupIndex % colors.length];
          li.style.borderLeft = `4px solid ${color}`;
          li.style.boxShadow = `inset 0 0 8px ${color}40`;
        }
      }

      const textSpan = document.createElement("span");
      const name = `<strong>${task.text}</strong>`;
      const date = task.date ? `Due: ${task.date}` : "";
      const time = task.time ? `at ${formatTime(task.time)}` : "";
      textSpan.innerHTML = `${name}<br><small>${date} ${time}</small>`;

      const btnGroup = document.createElement("div");
      btnGroup.className = "task-buttons";

      const toggleBtn = document.createElement("button");
      toggleBtn.textContent = task.done ? "Undo" : "Done";
      toggleBtn.addEventListener("click", () => {
        tasks[index].done = !tasks[index].done;
        saveTasks();
        renderTasks();
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

      btnGroup.appendChild(toggleBtn);
      btnGroup.appendChild(deleteBtn);
      li.appendChild(textSpan);
      li.appendChild(btnGroup);
      taskList.appendChild(li);
    });

    updateProgress();
  }

  function addTask() {
    const text = taskInput.value.trim();
    const date = taskDate.value;
    const time = taskTime.value;
    if (!text) return;

    tasks.push({ text, date, time, done: false });
    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";
    saveTasks();
    renderTasks();
  }

  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
  });

  renderTasks();
});
