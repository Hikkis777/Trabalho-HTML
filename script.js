let tasks = [];
let taskToConfirm = null; 

const confirmModal = new bootstrap.Modal(document.getElementById("confirmModal"));
document.getElementById("confirmBtn").addEventListener("click", () => {
  if (taskToConfirm !== null) {
    toggleTask(taskToConfirm);
    taskToConfirm = null;
    confirmModal.hide();
  }
});

function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const date = document.getElementById("taskDate").value;
  const time = document.getElementById("taskTime").value;

  if (text === "") return;

  let timestamp;
  if (date && time) {
    timestamp = `${formatDate(date)} ${time}`;
  } else {
    const now = new Date();
    timestamp = now.toLocaleDateString('pt-BR') + " " + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  tasks.push({
    id: Date.now(),
    text,
    done: false,
    time: timestamp
  });

  document.getElementById("taskInput").value = "";
  document.getElementById("taskDate").value = "";
  document.getElementById("taskTime").value = "";

  renderTasks();
}

function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function confirmToggle(id) {
  taskToConfirm = id;
  confirmModal.show();
}

function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, done: !t.done } : t
  );
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("taskList");
  const filter = document.getElementById("filter").value;

  list.innerHTML = "";

  const filtered = tasks.filter(t => {
    if (filter === "concluidas") return t.done;
    if (filter === "pendentes") return !t.done;
    return true;
  });

  filtered.forEach(task => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    const content = document.createElement("div");
    content.className = "d-flex flex-column";

    const text = document.createElement("span");
    text.textContent = task.text;
    if (task.done) text.classList.add("done-text");

    const time = document.createElement("span");
    time.textContent = task.time;
    time.className = "task-time";

    content.appendChild(text);
    content.appendChild(time);

    const buttons = document.createElement("div");

    const doneBtn = document.createElement("button");
    doneBtn.className = "btn btn-success btn-sm me-2";
    doneBtn.textContent = "✔";
    doneBtn.onclick = () => confirmToggle(task.id); 

    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-danger btn-sm";
    delBtn.textContent = "🗑";
    delBtn.onclick = () => deleteTask(task.id);

    buttons.appendChild(doneBtn);
    buttons.appendChild(delBtn);

    li.appendChild(content);
    li.appendChild(buttons);
    list.appendChild(li);
  });
}
