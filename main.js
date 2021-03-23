const url = 'http://localhost:3000/todos';

displayTodos();

function getTodos() {
	return fetch(url).then((res) => res.json());
}

function getTodoById(id) {
	return fetch(url + '/' + id).then((res) => res.json());
}

//Open form for new TOdo
// const newNoteButton = document.querySelector('#newNoteButton');
const newNoteButton = document.querySelector('#clickableDiv');
newNoteButton.addEventListener('click', displayAddTodo);
function displayAddTodo() {
	editButton.style.display = "none";
	addButton.style.display = "inline";
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
	editButton.style.display = "inline";

    if (editNoteForm.style.display === "none") {
        editNoteForm.style.display = "block";
    }
    else {
        editNoteForm.style.display = "none";
    }

	const todoId = this.getAttribute('todoId');
	editNoteForm.setAttribute('todoId', todoId);

	const currentTodo = await getTodoById(todoId);

	const todoTitle =  document.querySelector('#todoTitle');
	todoTitle.value = currentTodo.title;

	const todoNotes = document.querySelector('#todoNotes');
	todoNotes.value = currentTodo.text;
}

function editTodo(){
	const editNoteForm = document.querySelector('#form');
	
	const title = document.querySelector('#todoTitle').value;
	const text = document.querySelector('#todoNotes').value;

	const todoId = editNoteForm.getAttribute('todoId');

	fetch(`${url}/${todoId}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ text : text,  title : title})
	})
	.then(() => displayTodos());

	clearInput();
	cancelNewTodo();
}

//Cancel todo
const cancelButton = document.querySelector('#cancelNoteButton');
cancelButton.addEventListener('click', cancelNewTodo);
function cancelNewTodo() {
    const newItem = document.getElementById('form');
    
    if (newItem.style.display === "block") {
        newItem.style.display = "none";
    }

	clearInput();
}

//clear input
const clearButton = document.querySelector('#clearNoteInputButton');
clearButton.addEventListener('click', clearInput)
function clearInput() {
    document.getElementById('form').reset();
}

async function displayTodos() {
	var searchInput = document.getElementById('searchBar');
	var filter = searchInput.value;

	const todos = await getTodos();

	var filteredTodos = todos.filter(function(todo) {
		return todo.title.includes(filter) || todo.text.includes(filter);
	  });

	const todosHtml = createTodosHtml(filteredTodos);
	const section = document.querySelector('#todoList');
    section.setAttribute("class", "section");

	// searchInput.removeEventListener('click', displayAddTodo);

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
		const text = document.createElement('li');	

		const buttons = document.createElement('div');
        const deleteItem = document.createElement('span');

		const modifyNote = document.createElement('div');
		const colors = document.createElement('div');
		const checkbox = document.createElement('input');
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

		content.setAttribute("class", "todoContent");

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
		content.setAttribute('todoId', todo.id);
		content.addEventListener('click', displayEditTodo);
		deleteItem.textContent = "X";
		deleteItem.id = todo.id;

		checkbox.type = 'checkbox';
		checkbox.checked = todo.completed;
		checkbox.setAttribute('todoId', todo.id);

        deleteItem.addEventListener('click', deleteTodo);
 
		content.append(title);
        content.append(text);

		buttons.append(deleteItem); 

		colors.append(redNote);
		colors.append(blueNote);
		colors.append(yellowNote);
		colors.append(greenNote);
		colors.append(pinkNote);
		modifyNote.append(checkbox);  
		modifyNote.append(colors);
		
		card.append(buttons);
		card.append(content);
		card.append(modifyNote);

        fragment.append(card);

        card.setAttribute("class",'card');
		checkbox.setAttribute('class', "checkmark");
		modifyNote.setAttribute("class", "modifyNote");
		deleteItem.setAttribute('class', 'cancel');

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
