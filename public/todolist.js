const todolist = document.getElementById('todolist');
const itemtext = document.getElementById('itemtext');
const add = document.getElementById('add');
const delete_ = document.getElementById('delete');

const update_list = $(function(list){
	todolist.innerHTML = ('');
	if (list && list.items && Array.isArray(list.items)) {
	// Access each item in the list
	list.items.forEach(item => {
		todolist.innerHTML += ('<li draggable=\"true\">' + item + '</li>');
	});
	} else {
	console.error('Invalid response');
	 }
     Array.from(todolist.getElementsByTagName('li')).forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('drop', handleDrop);
     });
});
const get_list = $(async function(){
	const response = await fetch('/webservice', {
	method: 'GET',
	headers: {
	    'Content-Type': 'application/json'
	}
    });
	if (response.status === 401)
    {
        console.log("B");
        window.location.href = '/index.html';
        return;
    }
	const list = await response.json();
	update_list(list)
});
get_list();

const post_list = $(async function(items){
	const response = await fetch('/webservice', {
	    method: 'POST',
		headers: {
	   'Content-Type': 'application/json'
	    },
		body: JSON.stringify({ items })
	});
    if (response.status === 401)
    {
        window.location.href = '/index.html';
        return;
    }
	const list = await response.json();
	update_list(list)
});

add.addEventListener('click', async () => {
  	const newitem = itemtext.value;
  	const items = Array.from(todolist.getElementsByTagName('li')).map(li => li.textContent);
	items.push(newitem);
	post_list(items);
});


delete_.addEventListener('click', async () => {
	const items = Array.from(todolist.getElementsByTagName('li')).map(li => li.textContent);
	items.shift();
	post_list(items);
});






// Internet Programming 2, 2023
// drag and drop exmaple

// global containing the element being dragged
let draggedElement;

// all drggable items

// assigns functions
const items = todolist.getElementsByTagName('li').map(li => li.textContent);
items.forEach(function (item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('drop', handleDrop);
});

// makes the object movable and stores its data in the dataTransfer temp object
function handleDragStart(e) {
    e.currentTarget.style.opacity = '0.4';

    // stores the element to be dragged in a global variable  
    draggedElement = e.currentTarget;
    // makes the element movable
    e.dataTransfer.effectAllowed = 'move';
    // stores the source data in a temp object - THIS IS WHERE THE MAGIC HAPPENS  
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
}

// swaps the data between the source element and the destination element using the 
// data in the temp dataTransfer object 
function handleDrop(e) {
    e.stopPropagation(); // stops browswer redirect
    if (draggedElement !== e.currentTarget) {
        // currentTarget contains the element that is being dropped into 
        draggedElement.innerHTML = e.currentTarget.innerHTML;
        // replaces the data
        e.currentTarget.innerHTML = e.dataTransfer.getData('text/html');
    }

    return false;
}

async function handleDragEnd(e) {
    e.currentTarget.style.opacity = '1';
  	const items = Array.from(todolist.getElementsByTagName('li')).map(li => li.textContent);
  	post_list(items);
}

function handleDragOver(e) {
    e.preventDefault();
    return false;
}


// less important functions
function handleDragEnter(e) {
    e.currentTarget.classList.add('over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('over');

}

