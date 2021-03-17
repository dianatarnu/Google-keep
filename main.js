const url = 'http://localhost:3000/todos';

displayTodos();

const newButton = document.querySelector('#newButton');
newButton.addEventListener('click', newTodo);

const addButton = document.querySelector('#addButton');
addButton.addEventListener('click', addTodo);

const cancelButton = document.querySelector('#cancelButton');
cancelButton.addEventListener('click', cancelNewTodo);

const clearButton = document.querySelector('#clearButton');
clearButton.addEventListener('click', clearInput)

function getTodos() {
	return fetch(url).then((res) => res.json());
}

function newTodo() {
    const newItem = document.querySelector('#form');
    
    if (newItem.style.display === "none") {
        newItem.style.display = "block";
    }
    else {
        newItem.style.display = "none";
    }
}

function cancelNewTodo() {
    const newItem = document.getElementById('form');
    
    if (newItem.style.display === "block") {
        newItem.style.display = "none";
    }
}

function clearInput() {
    document.getElementById('form').reset();
}

function addTodo() {
	const text = document.querySelector('#todoNotes').value;	
	const title = document.querySelector('#todoTitle').value;

	const payload = { 
        text,
        title, 
        completed: false 
    };

	fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	})
		.then(() => displayTodos());
}

async function displayTodos() {
	const todos = await getTodos();
	const todosHtml = createTodosHtml(todos);
	const section = document.querySelector('#todoList');
    section.setAttribute("class", "section");

	section.innerHTML = null;
	section.append(todosHtml);
	section.addEventListener('click', handleCheckboxClick);
}

function createTodosHtml(todos)  {
	const fragment = document.createDocumentFragment();
	
	todos.forEach((todo) => {
        const card = document.createElement('div');
        const title = document.createElement('h2');
		const text = document.createElement('p');
        const deleteItem = document.createElement('button');
		const editItem = document.createElement('button');
		const checkbox = document.createElement('input');

		text.innerHTML = todo.text;
        title.innerHTML = todo.title;
		deleteItem.textContent = "X";
		editItem.textContent = "Edit";

		checkbox.type = 'checkbox';
		checkbox.checked = todo.completed;
		checkbox.setAttribute('todoId', todo.id);

        deleteItem.addEventListener('click', deleteTodo);
		editItem.addEventListener('click', editTodo);

		function deleteTodo() {
			const text = document.querySelector('#todoNotes').value;	
			const title = document.querySelector('#todoTitle').value;
		
			const payload = { 
				text,
				title, 
				completed: false 
			};
		
			fetch(url + "/" + todo.id, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			})
				.then(() => displayTodos());
		}


		text.prepend(checkbox);  
        card.append(title);
        card.append(text); 
        card.append(deleteItem);  
		card.append(editItem); 
        fragment.append(card);

        card.setAttribute("class",'card');

	});

	return fragment;
}

function handleCheckboxClick(event) {
	if (event.target.type !== 'checkbox') {
		return;
	}

	const todoId = event.target.getAttribute('todoId');

	fetch(`${url}/${todoId}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ completed: event.target.checked })
	})
	.then((res) => console.log(res))
}
