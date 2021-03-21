const url = 'http://localhost:3000/todos';

displayTodos();

function getTodos() {
	return fetch(url).then((res) => res.json());
}

function getTodoById(id) {
	return fetch(url + '/' + id).then((res) => res.json());
}

//Open form for new TOdo
const newNoteButton = document.querySelector('#newNoteButton');
newNoteButton.addEventListener('click', displayAddTodo);
function displayAddTodo() {
	editButton.style.display = "none";
    const addNoteForm = document.querySelector('#form');
    
    if (addNoteForm.style.display === "none") {
        addNoteForm.style.display = "block";
    }
    else {
        addNoteForm.style.display = "none";
    }
}

//Add new TODO
const addButton = document.querySelector('#addNoteButton');
addButton.addEventListener('click', addTodo);
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

	clearInput();
	cancelNewTodo();
}

//Edit TODO
const editButton = document.querySelector('#editNoteButton');
editButton.addEventListener('click', editTodo);
async function displayEditTodo(){
	const editNoteForm = document.querySelector('#form');
	addButton.style.display = "none";

    if (editNoteForm.style.display === "none") {
        editNoteForm.style.display = "block";
    }
    else {
        editNoteForm.style.display = "none";
    }

	const todoId = this.getAttribute('todoId');
	editNoteForm.setAttribute('todoId', todoId);

	const currentTodo = await getTodoById(todoId);

	const todoTitle =  document.querySelector('#todoNotes');
	todoTitle.value = currentTodo.title;

	const todoNotes = document.querySelector('#todoTitle');
	todoNotes.value = currentTodo.text;
}

function editTodo(){
	const editNoteForm = document.querySelector('#form');
	const text = document.querySelector('#todoNotes').value;	
	const title = document.querySelector('#todoTitle').value;

	const todoId = editNoteForm.getAttribute('todoId');

	fetch(`${url}/${todoId}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ text : text,  title : title})
	})
	.then(() => displayTodos());

	cancelNewTodo();
}

//Delete TODO
function deleteTodo() {
	deleteTodoById(this.id);	
}

function deleteTodoById(id) {
	fetch(url + "/" + id, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' }
	})
		.then(() => displayTodos());
}

//Cancel todo
const cancelButton = document.querySelector('#cancelNoteButton');
cancelButton.addEventListener('click', cancelNewTodo);
function cancelNewTodo() {
    const newItem = document.getElementById('form');
    
    if (newItem.style.display === "block") {
        newItem.style.display = "none";
    }
}

//clear input
const clearButton = document.querySelector('#clearNoteInputButton');
clearButton.addEventListener('click', clearInput)
function clearInput() {
    document.getElementById('form').reset();
}

async function displayTodos() {
	searcInput = document.getElementById('searchBar');
	filter = searcInput.value;

	const todos = await getTodos();

	var filteredTodos = todos.filter(function(todo) {
		return todo.title.includes(filter) || todo.text.includes(filter);
	  });

	const todosHtml = createTodosHtml(filteredTodos);
	const section = document.querySelector('#todoList');
    section.setAttribute("class", "section");

	section.innerHTML = null;
	section.append(todosHtml);
	section.addEventListener('click', handleCheckboxClick);
}

function createTodosHtml(todos)  {
	const fragment = document.createDocumentFragment();
	
	todos.forEach((todo) => {
        const card = document.createElement('section');

		const content = document.createElement('div');
        const title = document.createElement('h2');
		const text = document.createElement('p');	
		const checkbox = document.createElement('input');

		const buttons = document.createElement('div');
        const deleteItem = document.createElement('span');
		// const editItem = document.createElement('button');

		const colors = document.createElement('div');

		const redNote = document.createElement('button');
		const blueNote = document.createElement('button');
		const yellowNote = document.createElement('button');
		const greenNote = document.createElement('button');
		const pinkNote = document.createElement('button');

		redNote.setAttribute("class", "redNote colorButton");
		blueNote.setAttribute("class", "blueNote colorButton");
		yellowNote.setAttribute("class", "yellowNote colorButton");
		greenNote.setAttribute("class", "greenNote colorButton");
		pinkNote.setAttribute("class", "pinkNote colorButton");

		redNote.addEventListener('click', colorNoteRed);
		blueNote.addEventListener('click', colorNoteBlue);
		yellowNote.addEventListener('click', colorNoteYellow);
		greenNote.addEventListener('click', colorNoteGreen);
		pinkNote.addEventListener('click', colorNotePink);


		function colorNoteRed() {
			card.setAttribute('class', 'redNote card');
		}

		function colorNoteBlue() {
			card.setAttribute('class', 'blueNote card');
		}

		function colorNoteYellow() {
			card.setAttribute('class', 'yellowNote card');
		}

		function colorNoteGreen() {
			card.setAttribute('class', 'greenNote card');
		}

		function colorNotePink() {
			card.setAttribute('class', 'card');
		}

		text.innerHTML = todo.text;
        title.innerHTML = todo.title;
		title.setAttribute('todoId', todo.id);
		title.addEventListener('click', displayEditTodo);
		deleteItem.textContent = "X";
		deleteItem.id = todo.id;

		checkbox.type = 'checkbox';
		checkbox.checked = todo.completed;
		checkbox.setAttribute('todoId', todo.id);

        deleteItem.addEventListener('click', deleteTodo);
 
		text.prepend(checkbox);         
		content.append(title);
        content.append(text);

		buttons.append(deleteItem);  

		colors.append(redNote);
		colors.append(blueNote);
		colors.append(yellowNote);
		colors.append(greenNote);
		colors.append(pinkNote);
		
		card.append(buttons);
		card.append(content);
		card.append(colors);

        fragment.append(card);

		colors.setAttribute("class", 'colorPanel');
        card.setAttribute("class",'card');
		deleteItem.setAttribute('class', 'cancel')
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
