 // Elements selection 
 const todoForm = document.querySelector('#todo-form');
 const todoInput = document.querySelector('#todo-input');
 const todoList = document.querySelector('#todo-list');
 const editForm = document.querySelector('#edit-form');
 const editInput = document.querySelector('#edit-input');
 const cancelEditBtn = document.querySelector('#cancel-edit-btn');
 const filterSelect = document.querySelector('#filter-select');
 const optionSelected = filterSelect.options[filterSelect.selectedIndex]
 const searchInput = document.querySelector('#search-input');
 const eraseBtn = document.querySelector('#erase-button');

let oldInputValue; 


 // Functions
 const saveTodo = (text, done = 0, save = 1) => { //save by default is equal to one, so after that execute saveTodoLocalStorage function  

         const todoTask = document.createElement('div')
         todoTask.classList.add('todo')
 
         const todoTitle = document.createElement('h3')
         todoTitle.innerText = text //item
         todoTask.appendChild(todoTitle)
 
         const doneBtn = document.createElement('button')
         doneBtn.classList.add('finish-todo')
         doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
         todoTask.appendChild(doneBtn)
 
         const editBtn = document.createElement('button')
         editBtn.classList.add('edit-todo')
         editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
         todoTask.appendChild(editBtn)
 
         const deleteBtn = document.createElement('button')
         deleteBtn.classList.add('remove-todo')
         deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
         todoTask.appendChild(deleteBtn)
 
         // putting todo on general list
         todoList.appendChild(todoTask)

         // treating todo input when receive a click  
         todoInput.value = '';
         todoInput.focus();
         
         if(save) {
           saveTodoLocalStorage({text, done})
         }

        const todos = getItemsFromLocalStorage();
        let tasks = Array.from(todoList.childNodes);
        
        if (tasks.length > 0 && tasks[0].nodeType === Node.TEXT_NODE) {
            tasks.shift();
        }
        
        tasks.forEach((task, index) => {

          if(todos[index]?.done === 1) {
            task.classList.add('done');
          }
          else {
            task.classList?.remove('done');
          }
        })
        
}

 const toggleForms = () => {
     editForm.classList.toggle('hide');
     todoForm.classList.toggle('hide');
     todoList.classList.toggle('hide');
 }
 
 const updateTodo = (text) => {
    const tasks = getItemsFromLocalStorage();
    const todos = document.querySelectorAll(".todo");

     todos.forEach((todo, index) => {
         let todoTitles = todo.querySelector('h3')
        
         // Verify which todo have the same as oldinputvalue to then change the title value to the new input title   

         if(todoTitles.innerText === oldInputValue) {
             todoTitles.innerText = text
             console.log(todoTitles)
         }
         tasks[index].text = todoTitles.innerText;
     })
     localStorage.setItem("todos", JSON.stringify(tasks));
 }
 

 // Filter
 const updateFilter = () => {
   const option = document.getElementById('filter-select').value;
   const todos = document.querySelectorAll(".todo");
   const tasks = getItemsFromLocalStorage();

   
     if(option === 'done') {
         todos.forEach((todo, index) => {

           if(todo.classList.contains('done')) {
                todo.classList.remove('hide');
                tasks[index].done = 1;
             }
             else {
                 todo.classList.add('hide');
                 tasks[index].done = 0;
             }
         })
         localStorage.setItem("todos", JSON.stringify(tasks));
        
     }
     else if(option === 'todo') {
         todos.forEach((todo) => {
             if(!todo.classList.contains('done')) {
                 todo.classList.remove('hide');
             }
             else {
                 todo.classList.add('hide');
             }
         })
     }
     else if(option === 'all') {
         todos.forEach((todo) => {
             todo.classList.remove('hide');
         })
     }
 
 }
 
 // Task search
 const searchTodo = () => {
    const todos = getItemsFromLocalStorage();   
    let todoListDOM = []
    
    //looping through the child elements of the task list (todoList) and storing the elements containing the task titles in the todoListDOM array. This is done so that you can compare task titles with corresponding elements in the DOM later on.
    for(let i = 0; i < todoList.children.length; i++) {
        todoListDOM[i] = todoList.childNodes[i + 1].childNodes[0];
    }

    searchInput.focus();

    const searchValue = searchInput.value.trim().toLocaleLowerCase(); // Normalizando o valor de busca
  
    todos.forEach(todo => {
        const todoText = todo.text.trim().toLocaleLowerCase(); // Treating data

        // Looking for the corresponding element on DOM using task title value for then it can be add or removed hide class7
        const todoElement = todoListDOM.find(element => element.textContent.trim().toLocaleLowerCase() === todoText);
       

        if (todoText.includes(searchValue)) {
            if (todoElement) {
                todoElement.parentElement.classList.remove('hide');
            }
        } else {
            if (todoElement) {
                todoElement.parentElement.classList.add('hide');
            }
        }
    });
  }

 
 // Events
 todoForm.addEventListener('submit', (e) => {
     e.preventDefault()
 
     const inputValue = todoInput.value;
      // verify iff there is/are just blank spaces
     if(inputValue && !(/^\s*$/.test(inputValue))) {
         saveTodo(inputValue)
         
     }
 
 })
 
 document.addEventListener('click', (e) => {
     const targetEl = e.target
     const parentEl = targetEl.closest("div")
     let todoTitle
    
 
     if(parentEl && parentEl.querySelector('h3')) {
         todoTitle = parentEl.querySelector('h3').innerText;
     }
     
     if(targetEl.classList.contains('finish-todo')) {

         parentEl.classList.toggle('done');

         const todos = document.querySelectorAll('.todo');
         const tasks = getItemsFromLocalStorage();

         todos.forEach((todo, index)=> {

           if(todo === parentEl) {
              tasks[index].done = tasks[index].done === 0 ? 1 : 0;
            }
            
          });
          localStorage.setItem("todos", JSON.stringify(tasks));
     }
     if(targetEl.classList.contains('remove-todo')) {
         parentEl.remove();
  
         removeTodoLocalStorage(todoTitle);
     }
 
     if(targetEl.classList.contains('edit-todo')) {
         toggleForms()
         // this operation makes the current todo title appear on the input field so then it make the change
         editInput.value = todoTitle;
         oldInputValue = todoTitle;
         
        }
      
 })
 
 cancelEditBtn.addEventListener('click', (e) => {
     e.preventDefault()
 
     toggleForms()
 }) 
 
 editForm.addEventListener('submit', (e) => {
     e.preventDefault()
 
     const editInputValue = editInput.value;
     
     if(editInputValue) {
         updateTodo(editInputValue)
     }
 
     toggleForms()

 })
 
 searchInput.addEventListener('keyup', (e) => {
     e.preventDefault();
     searchTodo()
 })
 eraseBtn.addEventListener('click', (e) => {
     e.preventDefault();
  
     searchInput.value = '';
     searchTodo()
    
 })
 
 filterSelect.addEventListener('change', (e) => {
     updateFilter()
 })
 
 
 // Local Storage
 
 function getItemsFromLocalStorage() {
     const savedItems = localStorage.getItem('todos');
     return savedItems ? JSON.parse(savedItems) : [];
 };

 const saveTodoLocalStorage = (todo) => {
  const todos = getItemsFromLocalStorage();

  todos.push(todo);
  
  localStorage.setItem("todos", JSON.stringify(todos));
};

  const removeTodoLocalStorage = (text) => {
      let todos = getItemsFromLocalStorage();
      let position = 0;
      todoSize = Object.keys(todos).length;

      for(let i = 0; i < todoSize; i++) {
          if(todos[i].text === text) {
              position = i
            }  
      }
      todos.splice(position, 1)
      localStorage.setItem("todos", JSON.stringify(todos));
      
  }

 const loadTodos = () => {
    const todos = getItemsFromLocalStorage();
    todos.forEach((todo) => {
      // this parameter zero makes the function saveTodo (on page refresh) not save the items on the local storage (again = prevents duplication)
      // at the meantime saveTodo it's gonna create the saved todos (storaged on local storage) 
      saveTodo(todo.text, 0, 0);
      
    });

  };

loadTodos()









/* // Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

// Funções
const saveTodo = (text, done = 0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  // Utilizando dados da localStorage
  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({ text, done: 0 });
  }

  todoList.appendChild(todo);

  todoInput.value = "";
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;

      // Utilizando dados da localStorage
      updateTodoLocalStorage(oldInputValue, text);
    }
  });
};

const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    todo.style.display = "flex";

    console.log(todoTitle);

    if (!todoTitle.includes(search)) {
      todo.style.display = "none";
    }
  });
};

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));

      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );

      break;

    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );

      break;

    default:
      break;
  }
};

// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodo(inputValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText || "";
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");

    updateTodoStatusLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();

    // Utilizando dados da localStorage
    removeTodoLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue);
  }

  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  getSearchedTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});

// Local Storage
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.text != todoText);

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoText ? (todo.done = !todo.done) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

loadTodos(); */