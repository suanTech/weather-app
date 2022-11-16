// Primary function
function checkError(res) {
    if (!res.ok) {
        throw Error (res.statusText)
    }
    return res;
}

function fetchData(url) {
    return fetch(url)
            .then(checkError)
            .then((res) => res.json())
            .catch((err) => console.log(err))
}

// Use current location for fetching data when loading
const api = 'ad0a44efe4f2661d802c38929e4e7f13';
const cardContainer = document.querySelector('.card-container');
const loadingOverlay = document.querySelector('#loading-overlay');

window.addEventListener('load', () => {
    let long;
    let lat;
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            const call = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api}&units=metric`;
            fetchData(call)
                .then(displayWeather)
        })
    }
})
// Display weather function
function displayWeather(data) {
    loadingOverlay.style.display = 'none';
    const { temp, humidity } = data.main;
    const place = data.name;
    const { description, icon } = data.weather[0];
    const { country } = data.sys;
    const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    cardContainer.innerHTML = `
        <div class="card">
            <p class="city">${place}<span class="country">${country}</span></p>
            <h1 class="temperature">${temp.toFixed(1)}<span class="degree">°C</span></h1>
            <div class="weather">
                <img src="${iconUrl}">
                <p class="current">${description}</p>
                <p class="humidity">Humidity: ${humidity}%</p>
            </div>
        </div>`
}
function changeBG() { 
    const card = document.querySelector('.card');
    const bgColors = ['#DEECB6','#ECB6DE','#DFB6EC','#B7B6EC','#F7E2A4']
    const randomNum = Math.floor(Math.random() * bgColors.length);
    const randomColor = bgColors[randomNum];
    card.style.background = randomColor;
}

// Fetch API with city name search
const searchInput = document.querySelector('.search');
const submitBtn = document.querySelector('.submitBtn');

searchInput.addEventListener('keypress', searchCity);
function searchCity (e) {
    if(e.key === 'Enter') {
        e.preventDefault();
        let input = searchInput.value;
        input = input.toUpperCase();
        const city = input;
        const call = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}&units=metric`;
        fetchData(call)
            .then(displayWeather)
            .then(changeBG)
            .catch((err) => {
                alert('ERROR: Please enter valid city/town !')
                err = 'invalid city/town'
            });
        submitBtn.click();
    }
}
