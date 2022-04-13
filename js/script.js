
if (!Cookies.get('user')) {
	window.location.replace('./auth.html');
}



const rootPopup = document.querySelector('.root-popup');
const popup = document.querySelector('.popup');

const popupCats = document.querySelector('.popup_type_cats-info');
const popupAddCats = document.querySelector('.popup_type_cats-add');
const popupEditCats = document.querySelector('.popup_type_cats-edit');



const formAdd = popupAddCats.querySelector('.popup__form');
const formEdit = popupEditCats.querySelector('.popup__form');


const inputId = formAdd.querySelector('#id');
const inputName = formAdd.querySelector('#name');
const inputImg = formAdd.querySelector('#img_link');
const inputDescr = formAdd.querySelector('#description');

const inputIdEdit = formEdit.querySelector('#id');
const inputNameEdit = formEdit.querySelector('#name');
const inputImgEdit = formEdit.querySelector('#img_link');
const inputDescrEdit = formEdit.querySelector('#description');


const popupCatsImage = popupCats.querySelector('.popup__image');
const popupCatsText = popupCats.querySelector('.popup__text');
const popupCatsName = popupCats.querySelector('.popup__name');
const catImages = document.querySelectorAll('.cat__image');
const closePopupCats = document.querySelector('.popup__close')
const cardTemplate = document.querySelector('#card-template')
const cardListContainer = document.querySelector('.cats-list')

const buttonReloadData = document.querySelector('.reload-data');
const buttonAddCat = document.querySelector('#button-add-cat');



function formSerialize(form) {
	const result = {}
	const inputs = form.querySelectorAll('input');
	const descr = form.querySelector('textarea');

	inputs.forEach(input => {
		result[input.name] = input.value;
	})
	result[descr.name] = descr.value;

	return result;
}



function getLocalStorageData(key) {
	return JSON.parse(localStorage.getItem(key));
}

function setLocalStorageData(key, data) {
	return localStorage.setItem(key, JSON.stringify(data));
}




function openPopup(popup) {
	popup.classList.add('popup_opened');
};

function handleClickCloseBtn(event) {
	if (event.target.classList.contains('popup__close')) {
		closePopup();
	}
}

const handlerOutsidePopupClose = function (e) {
	if (!e.target.closest('.popup__container')) {
		closePopup();
	}
}

const handlerEscClosePopup = function (e) {
	if (e.keyCode == 27) {
		popup.classList.remove('popup_opened');
	};
}

function closePopup(event) {

	const popupActive = document.querySelector('.popup_opened');

	if (popupActive) {
		popupActive.classList.remove('popup_opened')
	}

}



function createCardCat(dataCat) {
	const newCardElement = cardTemplate.content.querySelector('.cats-list__item').cloneNode(true);
	const cardImage = newCardElement.querySelector('.cat__image');
	const cardName = newCardElement.querySelector('.cat__title');
	const cardRate = newCardElement.querySelector('.cat__rate');
	const cardButtonDelete = newCardElement.querySelector('.cat__delete');
	const cardButtonEdit = newCardElement.querySelector('.cat__edit');


	cardImage.src = dataCat.img_link;
	cardImage.dataset.id = dataCat.id;
	cardName.textContent = dataCat.name;

	if (dataCat.rate) {
		cardRate.setAttribute('data-rate', dataCat.rate);
	}

	function handleClickCatImage() {
		popupCatsImage.src = dataCat.img_link;
		popupCatsText.textContent = dataCat.description;
		popupCatsName.textContent = dataCat.name;
		openPopup(popupCats);
	}

	function handleClickCatEdit(e) {
		e.stopPropagation();
		const inputs = formEdit.querySelectorAll('input');
		const descr = formEdit.querySelector('textarea');
		inputs.forEach(input => {
			input.value = dataCat[input.name]
		})
		descr.value = dataCat.description;

		openPopup(popupEditCats);
	}

	function handleClickButtonDelete(e) {
		e.stopPropagation();
		if (confirm('Вы удаляете котика')) {
			fetch(`https://sb-cats.herokuapp.com/api/delete/${dataCat.id}`, {
					method: "DELETE"
				})
				.then((response) => {
					if (response.ok) {
						return response.json();
					}

					return Promise.reject(response)
				})
				.then((data) => {

					if (data.message === 'ok') {
						newCardElement.remove();
						const oldData = getLocalStorageData('cats');
						const newData = oldData.filter(item => item.id !== dataCat.id);
						setLocalStorageData('cats', newData)
					}

				})
		}
	}

	cardButtonEdit.addEventListener('click', handleClickCatEdit);

	cardButtonDelete.addEventListener('click', handleClickButtonDelete)

	newCardElement.addEventListener('click', handleClickCatImage);

	return newCardElement;
}

function cardAddtoContainer(elemNode, container) {
	container.append(elemNode);
}



function getCats() {
	return fetch('https://sb-cats.herokuapp.com/api/show')
		.then((response) => {
			if (response.ok) {
				return response.json();
			}

			return Promise.reject(response)
		})
		.then(({
			data
		}) => {
			localStorage.setItem('cats', JSON.stringify(data)); // добавила локал стореджс с кошками)

			data.forEach((dataCat) => {
				cardAddtoContainer(createCardCat(dataCat), cardListContainer)
			})

			return data;
		})
		.catch(err => {
			console.log(err);
		})
}

function handleClickButtonAdd() {
	openPopup(popupAddCats);
}



formEdit.addEventListener('submit', (event) => {
	const inputId = formEdit.querySelector('#id_edit');
	console.log(inputId.value);
	event.preventDefault();
	const bodyJSON = formSerialize(formEdit);

	fetch(`https://sb-cats.herokuapp.com/api/update/${inputId.value}`, {
			method: "PUT",
			body: JSON.stringify(bodyJSON),
			headers: {
				'Content-type': "application/json"
			}
		})
		.then((response) => {

			if (response.ok) {
				return response.json();
			}

			return Promise.reject(response)
		})
		.then((data) => {
			if (data.message === 'ok') {
				reloadData();
				closePopup();
			}
		})
		.catch(err => {
			console.log(err);
		})

})



formAdd.addEventListener('submit', (event) => {

	event.preventDefault();
	const bodyJSON = formSerialize(formAdd);

	fetch('https://sb-cats.herokuapp.com/api/add', {
			method: "POST",
			body: JSON.stringify(bodyJSON),
			headers: {
				'Content-type': "application/json"
			}
		})
		.then((response) => {

			if (response.ok) {
				return response.json();
			}

			return Promise.reject(response)
		})
		.then((data) => {
			if (data.message === 'ok') {
				reloadData();
				closePopup();
			}
		})
		.catch(err => {
			console.log(err);
		})

})

function reloadData() {
	console.log(localStorage);
	localStorage.clear();
	console.log(localStorage);
	cardListContainer.innerHTML = '';
	getCats();
	console.log(localStorage);
}


buttonAddCat.addEventListener('click', handleClickButtonAdd)

rootPopup.addEventListener('click', handleClickCloseBtn);
popup.addEventListener('click', handlerOutsidePopupClose)
document.addEventListener('keydown', handlerEscClosePopup)

buttonReloadData.addEventListener('click', reloadData)




if (localStorage.getItem('cats')) {
	let catS = JSON.parse(localStorage.getItem('cats'))
	catS.forEach((dataCat) => {
		cardAddtoContainer(createCardCat(dataCat), cardListContainer)
	})
} else {
	getCats();
}