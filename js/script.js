'use strict';

/*
 * Получаем элементы со страницы
 */

const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
    dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
    inputCitiesTo = formSearch.querySelector('.input__cities-to'),
    dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
    inputDateDepart = formSearch.querySelector('.input__date-depart'),
    buttonSearch = formSearch.querySelector('.button button__search'),
    cheapestTicket = document.getElementById('cheapest-ticket'),
    otherCheapTickets = document.getElementById('other-cheap-tickets');

/*
 * Данные
 */

const citiesAPI = '../json/cities.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = '8e75fdafe7057afa975f5c3b823f3124',
    calendarAPI = 'http://min-prices.aviasales.ru/calendar_preload',
    MAX_COUNT = 10;

let city = [];


/* 
 * Функции
 */

const showCity = (input, list) => {

    list.textContent = '';

    if (input.value !== '') {
        const cityFilter = city.filter((elem) => {

            const fixElem = elem.name.toLowerCase();
            return fixElem.startsWith(input.value.toLowerCase());

        });

        cityFilter.forEach((elem) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = elem.name;
            list.append(li);
        });
    }
};

const getData = (url, callback, reject = console.error) => {
    const request = new XMLHttpRequest();

    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;

        if (request.status === 200) {
            callback(request.response);
        } else {
            reject(request.status);
        }
    });

    request.open('GET', url);
    request.send();
};

const selectCity = (event, input, list) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent;
        list.textContent = '';
    }
};

const getNameCity = (code) => {
    const objCity = city.find((item) => item.code == code);
    return objCity.name;
};

const getDate = (date) => {
    return new Date(date).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const gateChanges = (num) => {
    if (num) {
        return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
    } else {
        return 'Без пересадок';
    }
};

const getLinkAviasales = (data) => {
    let link = 'https://www.aviasales.ru/search/';

    link = link + data.origin;

    const date = new Date(data.depart_date);

    const day = date.getDate();
    link += day < 10 ? '0' + day : day;

    const month =  date.getMonth()+1;
    link += month < 10 ? '0' + month : month;

    link += data.destination;

    link += '1'; // 1 взрослый

    return link ;
};

const createCard = (data) => {
    const card = document.createElement('article');
    card.classList.add('ticket');

    let deep = '';

    if (data) {
        deep = `
        <h3 class="agent">${data.gate}</h3>
        <div class="ticket__wrapper">
            <div class="left-side">
                <a href="${getLinkAviasales(data)}" target='_blank' class="button button__buy">Купить
                    за ${data.value}₽</a>
            </div>
            <div class="right-side">
                <div class="block-left">
                    <div class="city__from">Вылет из города
                        <span class="city__name">${getNameCity(data.origin)}</span>
                    </div>
                    <div class="date">${getDate(data.depart_date)}</div>
                </div>

                <div class="block-right">
                    <div class="changes">${gateChanges(data.number_of_changes)}</div>
                    <div class="city__to">Город назначения:
                        <span class="city__name">${getNameCity(data.destination)}</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    } else {
        deep = '<h3>К сожалению на текущую дату билетов не нашлось</h3>';
    }

    card.insertAdjacentHTML('afterbegin', deep);

    return card;
};

const renderCheap = (data, date) => {
    const cheapTicketAll = JSON.parse(data).best_prices;

    const cheapTicketDay = cheapTicketAll.filter((item) => {
        return item.depart_date === date;
    });

    renderCheapAll(cheapTicketAll);
    renderCheapDay(cheapTicketDay);
};

const renderCheapAll = (cheapTickets) => {
    otherCheapTickets.style.display = 'block';

    otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';

    cheapTickets.sort((a, b) => a.value - b.value);

    for (let i = 0;i < cheapTickets.length && i < MAX_COUNT;i++) {
        const tickets = createCard(cheapTickets[i]);
        otherCheapTickets.append(tickets);
    }
};

const renderCheapDay = (cheapTicket) => {
    cheapestTicket.style.display = 'block';

    cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';

    const ticket = createCard(cheapTicket[0]);
    cheapestTicket.append(ticket);
};



/* 
 * Обработчики событий
 */

inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', (event) => {
    selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', (event) => {
    selectCity(event, inputCitiesTo, dropdownCitiesTo);
});

formSearch.addEventListener('submit', (event) => {
    event.preventDefault();

    const cityFrom = city.find((item) => {
        return inputCitiesFrom.value === item.name;
    });

    const cityTo = city.find((item) => {
        return inputCitiesTo.value === item.name;
    });

    const formData = {
        from: cityFrom,
        to: cityTo,
        when: inputDateDepart.value,
    };

    if (formData.from && formData.to) {
        const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true&token=${API_KEY}`;

        getData(proxy + calendarAPI + requestData, (response) => {
            renderCheap(response, formData.when);
        }, (error) => {
            alert('По этому направлению нет рейсов!');
            console.error('Ошибка:', error);
        });
    } else {
        alert('Введите коректное название города!');
    }

});



/* 
 * Вызовы функций
 */

getData(citiesAPI, (data) => {
    city = JSON.parse(data).filter((item) => {
        return item.name;
    });

    city.sort((a, b) => {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    });
});





// getData(calendarAPI + '?depart_date=2020-05-28&origin=SVX&destination=KGD&one_way=true&token=' + API_KEY, (data) => {
//     const cheapTicket = JSON.parse(data).best_prices.filter((item) => item.depart_date === '2020-05-28');
//     console.log(cheapTicket);
// });