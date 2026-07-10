const STORAGE_KEY = 'gym-routines';
const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const weekGrid = document.getElementById('weekGrid');
const newRoutineBtn = document.getElementById('newRoutineBtn');
const routineModal = document.getElementById('routineModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const routineForm = document.getElementById('routineForm');
const routineNameInput = document.getElementById('routineName');
const routineDayInput = document.getElementById('routineDay');
const exerciseNameInput = document.getElementById('exerciseName');
const exerciseSetsInput = document.getElementById('exerciseSets');
const exerciseRepsInput = document.getElementById('exerciseReps');
const exerciseRestInput = document.getElementById('exerciseRest');
const addExerciseBtn = document.getElementById('addExerciseBtn');
const draftExercisesContainer = document.getElementById('draftExercises');

let routines = loadRoutines();
let draftExercises = [];

function loadRoutines() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveRoutines() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
}

function openModal() {
  routineModal.classList.remove('hidden');
  routineModal.setAttribute('aria-hidden', 'false');
  routineForm.reset();
  draftExercises = [];
  renderDraftExercises();
}

function closeModal() {
  routineModal.classList.add('hidden');
  routineModal.setAttribute('aria-hidden', 'true');
  routineForm.reset();
  draftExercises = [];
  renderDraftExercises();
}

function addExerciseToDraft() {
  const name = exerciseNameInput.value.trim();
  const sets = exerciseSetsInput.value.trim();
  const reps = exerciseRepsInput.value.trim();
  const rest = exerciseRestInput.value.trim();

  if (!name || !sets || !reps || !rest) {
    alert('Completa todos los campos del ejercicio.');
    return;
  }

  draftExercises.push({ name, sets, reps, rest });
  renderDraftExercises();
  exerciseNameInput.value = '';
  exerciseSetsInput.value = '';
  exerciseRepsInput.value = '';
  exerciseRestInput.value = '';
  exerciseNameInput.focus();
}

function removeDraftExercise(index) {
  draftExercises.splice(index, 1);
  renderDraftExercises();
}

function renderDraftExercises() {
  if (!draftExercises.length) {
    draftExercisesContainer.innerHTML = '<p class="empty-state">Todavía no agregaste ejercicios.</p>';
    return;
  }

  draftExercisesContainer.innerHTML = draftExercises
    .map((exercise, index) => `
      <div class="draft-exercise">
        <span><strong>${exercise.name}</strong> · ${exercise.sets} series · ${exercise.reps} reps · ${exercise.rest}</span>
        <button class="small-btn" type="button" data-index="${index}">Eliminar</button>
      </div>
    `)
    .join('');
}

function renderRoutines() {
  weekGrid.innerHTML = '';

  dayNames.forEach((day) => {
    const dayRoutines = routines.filter((routine) => routine.day === day);

    const card = document.createElement('article');
    card.className = 'day-card';
    card.innerHTML = `
      <h3>${day}</h3>
      ${dayRoutines.length ? dayRoutines.map((routine) => `
        <div class="routine-card">
          <header>
            <div>
              <h4>${routine.name}</h4>
              <p>${routine.exercises.length} ejercicio${routine.exercises.length === 1 ? '' : 's'}</p>
            </div>
            <button class="small-btn" data-delete-routine="${routine.id}" type="button">Eliminar</button>
          </header>
          <div class="exercise-list">
            ${routine.exercises.map((exercise, index) => `
              <div class="exercise-item">
                <strong>${exercise.name}</strong>
                <div>Series: ${exercise.sets}</div>
                <div>Repeticiones: ${exercise.reps}</div>
                <div>Descanso: ${exercise.rest}</div>
                <button class="small-btn" data-delete-exercise="${routine.id}" data-index="${index}" type="button">Eliminar ejercicio</button>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('') : '<p class="empty-state">Sin rutinas para este día.</p>'}
    `;

    weekGrid.appendChild(card);
  });
}

function saveRoutine(event) {
  event.preventDefault();

  const name = routineNameInput.value.trim();
  const day = routineDayInput.value;

  if (!name || !day) {
    alert('Completa el nombre de la rutina y el día.');
    return;
  }

  if (!draftExercises.length) {
    alert('Agrega al menos un ejercicio antes de guardar la rutina.');
    return;
  }

  routines.push({
    id: Date.now(),
    name,
    day,
    exercises: draftExercises
  });

  saveRoutines();
  renderRoutines();
  closeModal();
}

function deleteRoutine(id) {
  routines = routines.filter((routine) => routine.id !== Number(id));
  saveRoutines();
  renderRoutines();
}

function deleteExerciseFromRoutine(routineId, index) {
  routines = routines.map((routine) => {
    if (routine.id === Number(routineId)) {
      routine.exercises.splice(index, 1);
      if (!routine.exercises.length) {
        return null;
      }
    }
    return routine;
  }).filter(Boolean);

  saveRoutines();
  renderRoutines();
}

newRoutineBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
addExerciseBtn.addEventListener('click', addExerciseToDraft);
routineForm.addEventListener('submit', saveRoutine);

draftExercisesContainer.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-index]');
  if (!button) return;
  removeDraftExercise(Number(button.dataset.index));
});

weekGrid.addEventListener('click', (event) => {
  const deleteRoutineButton = event.target.closest('button[data-delete-routine]');
  if (deleteRoutineButton) {
    deleteRoutine(deleteRoutineButton.dataset.deleteRoutine);
    return;
  }

  const deleteExerciseButton = event.target.closest('button[data-delete-exercise]');
  if (deleteExerciseButton) {
    deleteExerciseFromRoutine(deleteExerciseButton.dataset.deleteExercise, Number(deleteExerciseButton.dataset.index));
  }
});

window.addEventListener('click', (event) => {
  if (event.target === routineModal) {
    closeModal();
  }
});

renderRoutines();
