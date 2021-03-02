const url = 'http://localhost:3000/todos';

displayTodos();

const addTodoButton = document.querySelector('#addTodoButton');
addTodoButton.addEventListener('click', addTodo);

function getTodos() {
	return fetch(url).then((res) => res.json());
}

function addTodo() {
	const text = document.querySelector('#todoText').value;
	const payload = { text, completed: false };

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

	section.innerHTML = null;
	section.append(todosHtml);
	section.addEventListener('click', handleCheckboxClick);
}

function createTodosHtml(todos)  {
	const fragment = document.createDocumentFragment();
	
	todos.forEach((todo) => {
		const text = document.createElement('p');
		text.innerHTML = todo.text;

		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.checked = todo.completed;
		checkbox.setAttribute('todoId', todo.id);

		text.prepend(checkbox);
		fragment.append(text);
	});

	return fragment;
}

function handleCheckboxClick(event) {
	if (event.target.type !== 'checkbox') {
		return;
	}

	const todoId = event.target.getAttribute('todoId')

	fetch(`${url}/${todoId}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ completed: event.target.checked })
	})
	.then((res) => console.log(res))

}
