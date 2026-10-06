(function () {
  'use strict';

  const STORAGE_KEY = 'fox9star-tasks-v1';
  const priorityLabel = { high: '높음', medium: '보통', low: '낮음' };
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  let tasks = loadTasks();
  let activeFilter = 'all';

  const titleInput = document.querySelector('#new-title');
  const dueInput = document.querySelector('#new-due');
  const priorityInput = document.querySelector('#new-priority');
  const addButton = document.querySelector('#add-btn');
  const sortSelect = document.querySelector('#sort-select');
  const list = document.querySelector('#list');
  const stats = document.querySelector('#stats-count');
  const template = document.querySelector('#task-item-template');
  const importFile = document.querySelector('#import-file');

  function makeId() {
    return window.crypto && window.crypto.randomUUID
      ? window.crypto.randomUUID()
      : String(Date.now()) + '-' + Math.random().toString(16).slice(2);
  }

  function loadTasks() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed.filter(isTask) : [];
    } catch (error) {
      return [];
    }
  }

  function isTask(item) {
    return item && typeof item.title === 'string' && typeof item.completed === 'boolean';
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      // Private browsing or a full storage quota should not stop the app.
    }
  }

  function addTask() {
    const title = titleInput.value.trim();
    if (!title) {
      titleInput.focus();
      return;
    }

    tasks.push({
      id: makeId(),
      title,
      due: dueInput.value,
      priority: priorityInput.value,
      completed: false,
      notes: '',
      createdAt: Date.now()
    });
    saveTasks();
    titleInput.value = '';
    dueInput.value = '';
    priorityInput.value = 'medium';
    titleInput.focus();
    render();
  }

  function visibleTasks() {
    const today = new Date().toISOString().slice(0, 10);
    const filtered = tasks.filter((task) => {
      if (activeFilter === 'active') return !task.completed;
      if (activeFilter === 'completed') return task.completed;
      if (activeFilter === 'today') return task.due === today;
      return true;
    });

    return filtered.sort((a, b) => {
      const mode = sortSelect.value;
      if (mode === 'due-asc') return (a.due || '9999-12-31').localeCompare(b.due || '9999-12-31');
      if (mode === 'priority-desc') return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }

  function updateTask(id, changes) {
    tasks = tasks.map((task) => task.id === id ? { ...task, ...changes } : task);
    saveTasks();
  }

  function render() {
    list.textContent = '';
    const filtered = visibleTasks();
    const remaining = tasks.filter((task) => !task.completed).length;
    stats.textContent = `${tasks.length}개 · ${remaining}개 남음`;

    if (!filtered.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = tasks.length ? '이 필터에 맞는 일이 없습니다.' : '아직 할 일이 없습니다. 첫 번째 일을 추가해 보세요.';
      list.appendChild(empty);
      return;
    }

    filtered.forEach((task) => {
      const item = template.content.cloneNode(true);
      const article = item.querySelector('.task-item');
      const complete = item.querySelector('.complete-toggle');
      const title = item.querySelector('.title-input');
      const due = item.querySelector('.due-input');
      const notes = item.querySelector('.notes-input');
      const badge = item.querySelector('.priority');

      article.classList.toggle('is-completed', task.completed);
      complete.checked = task.completed;
      title.value = task.title;
      due.value = task.due || '';
      notes.value = task.notes || '';
      badge.textContent = priorityLabel[task.priority] || priorityLabel.medium;
      badge.dataset.priority = task.priority || 'medium';

      complete.addEventListener('change', () => { updateTask(task.id, { completed: complete.checked }); render(); });
      title.addEventListener('change', () => updateTask(task.id, { title: title.value.trim() || '제목 없는 할 일' }));
      due.addEventListener('change', () => updateTask(task.id, { due: due.value }));
      notes.addEventListener('change', () => updateTask(task.id, { notes: notes.value.trim() }));
      item.querySelector('.dup-btn').addEventListener('click', () => {
        tasks.push({ ...task, id: makeId(), title: `${task.title} 복사본`, completed: false, createdAt: Date.now() });
        saveTasks();
        render();
      });
      item.querySelector('.del-btn').addEventListener('click', () => {
        tasks = tasks.filter((current) => current.id !== task.id);
        saveTasks();
        render();
      });
      list.appendChild(item);
    });
  }

  document.querySelectorAll('.tab').forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll('.tab').forEach((tab) => {
        const selected = tab === button;
        tab.classList.toggle('active', selected);
        tab.setAttribute('aria-selected', String(selected));
      });
      render();
    });
  });

  addButton.addEventListener('click', addTask);
  titleInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') addTask(); });
  sortSelect.addEventListener('change', render);

  document.querySelector('#clear-completed').addEventListener('click', () => {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    render();
  });

  document.querySelector('#export-json').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fox9star-tasks.json';
    link.click();
    URL.revokeObjectURL(url);
  });

  document.querySelector('#import-json').addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', () => {
    const file = importFile.files && importFile.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      try {
        const imported = JSON.parse(reader.result);
        if (!Array.isArray(imported) || !imported.every(isTask)) throw new Error('invalid');
        tasks = imported.map((task) => ({ ...task, id: task.id || makeId(), createdAt: task.createdAt || Date.now() }));
        saveTasks();
        render();
      } catch (error) {
        window.alert('가져올 JSON 형식을 확인해 주세요.');
      } finally {
        importFile.value = '';
      }
    });
    reader.readAsText(file, 'utf-8');
  });

  render();
}());
