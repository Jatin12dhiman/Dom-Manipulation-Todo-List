function loadTodos() {
    // This function will load the todos from the browser
    const todos = JSON.parse(localStorage.getItem("todos")) || { "todoList": [] };
    console.log(todos);
    return todos;
}
function refreshTodos(todos) {
    localStorage.setItem("todos", JSON.stringify(todos))
}

function addTodoToLocalStorage(todo) {
    // Corrected: Defined 'todos' within the function
    let todos = loadTodos();
    todos.todoList.push({ ...todo, id: todos.todoList.length });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function executeFilterAction(event) {
    const todoList = document.getElementById("todoList");
    const element = event.target;
    const value = element.getAttribute("data-filter");
    todoList.innerHTML = '';
    const todos = loadTodos();

    if (value == "all") {
        todos.todoList.forEach(todo => {
            appendTodoInHtml(todo);
        });
    } else if (value == "pending") {
        todos.todoList.forEach(todo => {
            if (!todo.isCompleted) {
                appendTodoInHtml(todo);
            }
        });
    } else if (value == "completed") {
        todos.todoList.forEach(todo => {
            if (todo.isCompleted) {
                appendTodoInHtml(todo);
            }
        });
    }
}


function appendTodoInHtml(todo) {
    const todoList = document.getElementById("todoList");
    const todoItem = document.createElement("li");

    // Added: 'data-id' attribute to help identify each todo item
    todoItem.setAttribute("data-id", todo.id);
    const textDiv = document.createElement("div");
    if (todo.isCompleted) {
        textDiv.classList.add("Completed")
    }

    textDiv.textContent = todo.text;
    todoItem.classList.add("todoItem");

    const wrapper = document.createElement("div");
    wrapper.classList.add("todoButtons");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("editBtn");
    editBtn.addEventListener("click",editTodo)

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.addEventListener("click", deleteTodo)

    const completedBtn = document.createElement("button");
    completedBtn.textContent = (todo.isCompleted) ? "Reset" : "Completed";
    completedBtn.classList.add("completeBtn");
    completedBtn.addEventListener("click", toggleTodo)

    wrapper.appendChild(editBtn);
    wrapper.appendChild(deleteBtn);
    wrapper.appendChild(completedBtn);

    todoItem.appendChild(textDiv);
    todoItem.appendChild(wrapper);

    todoList.appendChild(todoItem);
}

function resetHTMLTodos(todos) {
    const todoList = document.getElementById("todoList");
    todoList.innerHTML = '';
    todos.todoList.forEach(todo => {
        appendTodoInHtml(todo)
    });
}

function toggleTodo(event) {
    console.log("toggling")
    const todoItem = event.target.parentElement.parentElement
    const todoId = todoItem.getAttribute("data-id");
    const todos = loadTodos()
    todos.todoList.forEach(todo => {
        if (todo.id == todoId) {
            todo.isCompleted = !todo.isCompleted;
        }
    });

    refreshTodos(todos)
    resetHTMLTodos(todos)

}
function editTodo(event){
    const todoItem = event.target.parentElement.parentElement
    const todoId = todoItem.getAttribute("data-id");
    let todos = loadTodos()
    const response = prompt("What is the new Todo value you want to set ?")
    todos.todoList.forEach(todo => {
        if (todo.id == todoId) {
            todo.text = response;
        }
    });
    refreshTodos(todos)
    resetHTMLTodos(todos)
}

function deleteTodo(event) {
    const todoItem = event.target.parentElement.parentElement
    const todoId = todoItem.getAttribute("data-id");
    let todos = loadTodos()
    todos.todoList = todos.todoList.filter(todo => todo.id != todoId);
    refreshTodos(todos)
    resetHTMLTodos(todos)
}
function addNewTodo(){
    const todoText = todoInput.value;
        if (todoText === '') {
            alert("Please write something for the todo");
        } else {
            // Corrected: Loading todos before adding a new one
            const todos = loadTodos();
            const id = todos.todoList.length;
            const newTodo = { text: todoText, isCompleted: false, id };
            addTodoToLocalStorage(newTodo);
            appendTodoInHtml(newTodo);
            todoInput.value = '';
        }
}
document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById("todoInput");
    const submitButton = document.getElementById("addTodo");
    let todos = loadTodos()
    const todoList = document.getElementById("todoList");


    const filterBtns = document.getElementsByClassName("filterBtn");
    for (const btn of filterBtns) {
        btn.addEventListener("click", executeFilterAction);
    }


    submitButton.addEventListener("click",addNewTodo);

    todoInput.addEventListener("change", (event) => {
        const todoText = event.target.value;
        event.target.value = todoText.trim();
    });

    // Corrected: Append todos to the HTML on page load

    todos.todoList.forEach(todo => appendTodoInHtml(todo));

    document.addEventListener("keypress",(event)=>{
        if(event.code=='Enter'){
            addNewTodo()
        }
    })
});
