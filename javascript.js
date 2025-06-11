// ===== Select DOM Elements =====
const inputBox = document.getElementById("inputBx");
const addButton = document.getElementById("addBtn");
const taskList = document.getElementById("list");

// ===== Load Existing Tasks on Page Load =====
window.addEventListener("load", loadTasks);

// ===== Event Listeners =====
addButton.addEventListener("click", handleAddTask);
inputBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") handleAddTask();
});

// ===== Add New Task =====
function handleAddTask() {
    const taskText = inputBox.value.trim();

    if (!taskText) {
        showToast("Please write something!", "error");
        return;
    }

    const taskItem = createTaskItem(taskText);
    taskList.appendChild(taskItem);

    inputBox.value = "";
    saveTasks();
    showToast("Task added!");
}

// ===== Create Task List Item Element =====
function createTaskItem(text) {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('en-GB'); // DD/MM/YYYY

    const listItem = document.createElement("li");
    listItem.innerHTML = `
    <div>
      <strong>${text}</strong><br>
      <small>🕒 ${date} - ${time}</small>
    </div>
    <i title="Remove task" style="cursor:pointer; color:white;">&times;</i>
  `;

    const removeButton = listItem.querySelector("i");
    removeButton.addEventListener("click", () => {
        showConfirm("Do you really want to delete this task?", () => {
            listItem.remove();
            saveTasks();
            showToast("Task deleted!");
        });
    });

    return listItem;
}

// ===== Save Tasks to localStorage =====
function saveTasks() {
    localStorage.setItem("todoList", taskList.innerHTML);
}

// ===== Load Tasks from localStorage =====
function loadTasks() {
    taskList.innerHTML = localStorage.getItem("todoList") || "";

    taskList.querySelectorAll("li i").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const item = e.target.closest("li");
            showConfirm("Do you really want to delete this task?", () => {
                item.remove();
                saveTasks();
                showToast("Task deleted!");
            });
        });
    });
}

// ===== Show Toast Notification =====
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = `toast ${type}`;
    setTimeout(() => toast.classList.remove("hidden"), 10);
    setTimeout(() => toast.classList.add("hidden"), 3000);
}

// ===== Show Confirm Modal =====
function showConfirm(message, onConfirm) {
    const modal = document.getElementById("confirmModal");
    const msg = document.getElementById("confirmMessage");
    const yesBtn = document.getElementById("confirmYes");
    const noBtn = document.getElementById("confirmNo");

    msg.textContent = message;
    modal.classList.remove("hidden");

    const cleanup = () => {
        modal.classList.add("hidden");
        yesBtn.onclick = null;
        noBtn.onclick = null;
    };

    yesBtn.onclick = () => {
        onConfirm();
        cleanup();
    };

    noBtn.onclick = cleanup;
}
