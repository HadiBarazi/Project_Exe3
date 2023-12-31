const nameInput = document.getElementById('name');
const passInput = document.getElementById('password');
const submitbutton = document.getElementById('submitbutton');
		
submitbutton.addEventListener('click', async () => {
	const uname = nameInput.value;
	const upass = passInput.value;
			
	const response = await fetch('/login', {
	method: 'POST',
	headers: {
	'Content-Type': 'application/json'
	},
		cookie: document.cookie,
		body: JSON.stringify({ uname, upass })
	});
	
	
	const data = await response.json();
	if (data === 1) {
		// Successful login, redirect to todolist.html
		window.location.href = '/todolist.html';
	} else {
		// Failed login, show an error message
		window.location.href = '/index.html';
		alert("wrong username or password")
		
	}
});