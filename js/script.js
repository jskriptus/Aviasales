'use strict';

const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
    dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
    inputCitiesTo = formSearch.querySelector('.input__cities-to'),
    dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
    inputDateDepart = formSearch.querySelector('.input__date-depart'),
    buttonSearch = formSearch.querySelector('.button button__search');

const city = ['Москва', 'Санкт-Петербург', 'Омск', 'Берлин', 'Сочи', 'Барнаул', 'Новосибирск',
    'Челябинск', 'Кирчи', 'Харьков', 'Киев', 'Барселона'
];


/* 
    * Создаем функцию которая для начала очищает список и исполняя условие выводит список искомых городов в li.
*/

const showCity = (input, list) => {

    list.textContent = '';

    if (input.value !== '') {
        const cityFilter = city.filter((elem) => {
            const fixElem = elem.toLocaleLowerCase();
            return fixElem.includes(input.value.toLowerCase());
        });

        cityFilter.forEach((elem) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = elem;
            list.append(li);
        });
    }
};

/* 
    * При вводе в input, осуществлять вызов функции showCity
*/

inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom);
});

/* 
    * При вводе в input, осуществлять вызов функции showCity
*/

inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo);
});

/* 
    * При клике на элемент выподающего списка ul.dropdown__cities-from - выводить выбранный элемент li в input. 
    * После этого очищая сам список (скрывая его).
*/

dropdownCitiesFrom.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        inputCitiesFrom.value = target.textContent;
        dropdownCitiesFrom.textContent = '';
    }
});

/* 
    * При клике на элемент выподающего списка ul.dropdown__cities-to - выводить выбранный элемент li в input. 
    * После этого очищая сам список (скрывая его).
*/

dropdownCitiesTo.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        inputCitiesTo.value = target.textContent;
        dropdownCitiesTo.textContent = '';
    }
});