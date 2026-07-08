const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const clearCompletedButton = document.getElementById('clear-completed');

const STORAGE_KEY = 'todoTasks';

let tasks = loadTasks();
renderTasks();

function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error cargando tareas:', error);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'task-item';
    emptyItem.textContent = 'No hay tareas. Agrega una tarea para comenzar.';
    taskList.appendChild(emptyItem);
    return;
  }

  tasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';

    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.dataset.id = task.id;

    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;
    if (task.completed) {
      text.classList.add('completed');
    }

    label.appendChild(checkbox);
    label.appendChild(text);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.textContent = '✕';
    deleteButton.dataset.id = task.id;
    deleteButton.title = 'Eliminar tarea';

    taskItem.appendChild(label);
    taskItem.appendChild(deleteButton);
    taskList.appendChild(taskItem);
  });
}

function addTask(text) {
  const newTask = {
    id: Date.now().toString(),
    text: text.trim(),
    completed: false,
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

function toggleTaskCompletion(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function clearCompletedTasks() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

taskForm.addEventListener('submit', event => {
  event.preventDefault();
  const newTaskText = taskInput.value;
  if (newTaskText.trim()) {
    addTask(newTaskText);
    taskInput.value = '';
    taskInput.focus();
  }
});

taskList.addEventListener('click', event => {
  const target = event.target;
  if (target.matches('input[type="checkbox"]')) {
    toggleTaskCompletion(target.dataset.id);
  }

  if (target.matches('.delete-button')) {
    deleteTask(target.dataset.id);
  }
});

clearCompletedButton.addEventListener('click', () => {
  clearCompletedTasks();
});
