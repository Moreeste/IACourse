const STORAGE_KEY = 'todo-1-tasks';
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');

let tasks = [];

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  tasks = stored ? JSON.parse(stored) : [];
}

function updateSummary() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  taskCount.textContent = `${total} tarea${total === 1 ? '' : 's'} • ${completed} completada${completed === 1 ? '' : 's'}`;
}

function createTaskItem(task) {
  const listItem = document.createElement('li');
  listItem.className = 'task-item';
  if (task.completed) {
    listItem.classList.add('completed');
  }

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.id = `task-${task.id}`;

  const label = document.createElement('label');
  label.htmlFor = checkbox.id;

  const text = document.createElement('p');
  text.className = 'task-text';
  text.textContent = task.text;

  label.appendChild(checkbox);
  label.appendChild(text);

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-button';
  deleteButton.textContent = 'Eliminar';

  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    listItem.classList.toggle('completed', task.completed);
    saveTasks();
    updateSummary();
  });

  deleteButton.addEventListener('click', () => {
    tasks = tasks.filter(item => item.id !== task.id);
    renderTasks();
    saveTasks();
  });

  listItem.appendChild(label);
  listItem.appendChild(deleteButton);
  return listItem;
}

function renderTasks() {
  taskList.innerHTML = '';
  if (tasks.length === 0) {
    const emptyItem = document.createElement('p');
    emptyItem.textContent = 'No hay tareas. Agrega una arriba.';
    emptyItem.style.color = '#6b7280';
    emptyItem.style.margin = '0';
    taskList.appendChild(emptyItem);
  } else {
    tasks.forEach(task => {
      taskList.appendChild(createTaskItem(task));
    });
  }
  updateSummary();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    taskInput.focus();
    return;
  }

  const newTask = {
    id: Date.now(),
    text,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
}

addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', event => {
  if (event.key === 'Enter') {
    addTask();
  }
});

loadTasks();
renderTasks();
