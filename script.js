const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

let todos = [];

function loadData() {
  const stored = localStorage.getItem("todos");
  if (stored) {
    todos = JSON.parse(stored);
  } else {
    todos = [];
  }
  render();
}

function saveData() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function render() {
  listContainer.innerHTML = "";

  if (todos.length === 0) {
    const emptyMsg = document.createElement("li");
    emptyMsg.textContent = " No tasks yet. Add one above!";
    emptyMsg.className = "empty-message";
    listContainer.appendChild(emptyMsg);
    return;
  }

  todos.forEach((todo, index) => {
    let li = document.createElement("li");
    li.dataset.index = index;
    li.draggable = true;

    li.addEventListener("dragstart", handleDragStart);
    li.addEventListener("dragover", handleDragOver);
    li.addEventListener("drop", handleDrop);
    li.addEventListener("dragend", handleDragEnd);

    let textSpan = document.createElement("span");
    textSpan.textContent = todo.text;
    textSpan.className = "todo-text";
    li.appendChild(textSpan);

    if (todo.completed) {
      li.classList.add("checked");
    }

    let buttonGroup = document.createElement("div");
    buttonGroup.className = "button-group";

    let editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.title = "Edit task";
    let editImg = document.createElement("img");
    editImg.src = "images/Edit.png";
    editImg.alt = "Edit";
    editImg.style.width = "18px";
    editImg.style.height = "18px";
    editBtn.appendChild(editImg);
    buttonGroup.appendChild(editBtn);

    let deleteBtn = document.createElement("span");
    deleteBtn.innerHTML = "\u00d7";
    deleteBtn.className = "delete-btn";
    deleteBtn.title = "Delete task";
    buttonGroup.appendChild(deleteBtn);

    li.appendChild(buttonGroup);
    listContainer.appendChild(li);
  });
}

let draggedIndex = null;

function handleDragStart(e) {
  draggedIndex = parseInt(e.target.dataset.index);
  e.target.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", draggedIndex);
}

function handleDragOver(e) {
  e.preventDefault();
  const targetLi = e.target.closest("li");
  if (!targetLi || targetLi.classList.contains("dragging")) return;
  targetLi.classList.add("drag-over");
}

function handleDrop(e) {
  e.preventDefault();
  const targetLi = e.target.closest("li");
  if (!targetLi) return;

  targetLi.classList.remove("drag-over");
  const targetIndex = parseInt(targetLi.dataset.index);

  if (draggedIndex !== targetIndex) {
    const [draggedItem] = todos.splice(draggedIndex, 1);
    todos.splice(targetIndex, 0, draggedItem);
    saveData();
    render();
  }
}

function handleDragEnd(e) {
  e.target.classList.remove("dragging");
  document.querySelectorAll(".drag-over").forEach((el) => {
    el.classList.remove("drag-over");
  });
}

function addTask() {
  const text = inputBox.value.trim();

  if (text === "") {
    alert("You must write something!");
    return;
  }

  const newTodo = {
    text: text,
    completed: false,
  };

  todos.push(newTodo);
  saveData();
  render();
  inputBox.value = "";
  inputBox.focus();
}

listContainer.addEventListener("click", function (e) {
  const li = e.target.closest("li");
  if (!li) return;

  const index = parseInt(li.dataset.index);
  if (isNaN(index)) return;
  if (e.target.classList.contains("delete-btn")) {
    todos.splice(index, 1);
    saveData();
    render();
    return;
  }
  if (e.target.closest(".edit-btn")) {
    const newText = prompt("Edit your task:", todos[index].text);
    if (newText !== null && newText.trim() !== "") {
      todos[index].text = newText.trim();
      saveData();
      render();
    }
    return;
  }

  todos[index].completed = !todos[index].completed;
  saveData();
  render();
});

inputBox.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

loadData();
