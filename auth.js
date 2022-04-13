

console.log(Cookies.get('user'));
// console.log(window.location);

if (Cookies.get('user')) {
	window.location.replace('./');
}


const authForm = document.querySelector('.auth__form');
const inputName = authForm.querySelector('.auth__form-input');

authForm.addEventListener('submit', (e) => {
	e.preventDefault();
	if (inputName.value.trim() !== "") {
		document.cookie = `user=${inputName.value}; secure; samesite = lax;`
		inputName.value = "";
		window.location.replace('./');
	} else {
		alert('Введите данные перед сохранением')
	}
})