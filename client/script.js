todoForm.title.addEventListener('keyup', (e) => validateField(e.target));
todoForm.title.addEventListener('blur', (e) => validateField(e.target));
todoForm.description.addEventListener('input', (e) => validateField(e.target));
todoForm.description.addEventListener('blur', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('input', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('blur', (e) => validateField(e.target));

todoForm.addEventListener('submit', onSubmit);

const todoListElement = document.getElementById('todoList');

let titleValid = true;
let descriptionValid = true;
let dueDateValid = true;

const api = new Api('http://localhost:5000/tasks');

function validateField(field) {
  const { name, value } = field;

  let = validationMessage = '';

  switch (name) {
    case 'title': {
      if (value.length < 2) {
        titleValid = false;
        validationMessage = "The 'Title' field must contain at least 2 characters.";
      } else if (value.length > 100) {
        titleValid = false;
        validationMessage = "The 'Title' field must not contain more than 100 characters.";
      } else {
        titleValid = true;
      }
      break;
    }
    case 'description': {
      if (value.length > 500) {
        descriptionValid = false;
        validationMessage = "The 'Description' field must not contain more than 500 characters.";
      } else {
        descriptionValid = true;
      }
      break;
    }
    case 'dueDate': {
      if (value.length === 0) { // for making diffrenet on value 
        dueDateValid = false;
        validationMessage = "The field 'Completed latest' is mandatory.";
      } else {
        dueDateValid = true;
      }
      break;
    }
  }

  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove('hidden');
}

function onSubmit(e) {
  e.preventDefault();
  if (titleValid && descriptionValid && dueDateValid) {
    console.log('Submit');
    saveTask();
  }
}

function saveTask() {
  const task = {
    title: todoForm.title.value,
    description: todoForm.description.value,
    dueDate: todoForm.dueDate.value,
    completed: false
  };

  api.create(task).then((task) => {
    if (task) {
      renderList();
    }
  });
}

function renderList() {
  console.log('rendering');
  api.getAll().then((tasks) => {
    todoListElement.innerHTML = '';
    if (tasks && tasks.length > 0) {
      let one = tasks.filter((task) => task.completed == true);
      let two = tasks.filter((task) => task.completed == false);
      
      one.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      two.sort((a, b) => new Date(a.dueDate) - new Date( b.dueDate));

      let sortList = [...two,...one]

      sortList.forEach((task) => {
        todoListElement.insertAdjacentHTML('beforeend', renderTask(task));
        
      });
    }
  });
}

function renderTask({ id, title, description, dueDate, completed }) {
  let html = `
    <li class="select-none mt-2 py-2 border-b border-black">
      <div class="flex items-center">
      <input id="default-checkbox" type="checkbox" onclick="check(event, ${id})" value="" 
      class="mr-4 w-4 h-5 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 
      dark:focus:ring-blue-600 dark:ring-offset-pink-800 focus:ring-2 dark:bg-pink-700 dark:border-pink-600" `;
      completed && (html += `checked`);
      html +=`>
        <h3 class="flex-1 text-xl font-bold text-pink-800 uppercase">${title}</h3>
        <div>
          <span>${dueDate}</span>
          <button onclick="deleteTask(${id})" class="inline-block bg-yellow-500 text-xs text- border-1 border-black px-3 py-1 rounded-md ml-2">Ta bort</button>
        </div>
      </div>`;
  description &&
    (html += `
      <p class="ml-8 mt-2 text-xs italic">${description}</p>
  `);
  html += `
    </li>`;

  return html;
}

function check(e, id) {
    const comp = e.target.checked
    const data = {
      completed: comp
    };
  api.update(id, data).then(data => renderList());
}

function deleteTask(id) {
  api.remove(id).then((result) => {
    renderList();
  });
}
renderList();