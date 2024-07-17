const filmDetails = document.querySelector('.film-details');  
const filmsList = document.getElementById('films');  
const filmPoster = document.getElementById("film-poster");
const filmTitle = document.getElementById("film-title");
const filmRuntime = document.getElementById("film-runtime");
const filmShowtime = document.getElementById("film-showtime");
const availableTickets = document.getElementById("film-tickets");
const buyTicketBtn = document.getElementById("buy-ticket");

const filmsurl = 'http://localhost:3001/films';

//Function adding event listener
document.addEventListener('DOMContentLoaded', () => {
    fetchFirstMovie();
    fetchAllFilms();
});
 //Function to get placeholder film
function fetchFirstMovie() {
    fetch("http://localhost:3001/films/1")
        .then(response => response.json())
        .then(film => {
            displayFilmDetails(film);
            buyTicketBtn.onclick = () => buyTicketHandler(film);
        });
}

//Function to fetch all films and configure listing
function fetchAllFilms() {
    fetch(filmsurl)
        .then(response => response.json())
        .then(films => {
            filmsList.innerHTML = "";
            films.forEach(film => {
                const filmsListItem = document.createElement('li');
                filmsListItem.textContent = film.title;
                filmsListItem.className = 'film-item';
                filmsListItem.addEventListener('click', () => {
                    displayFilmDetails(film);
                    buyTicketBtn.onclick = () => buyTicketHandler(film);
                });
                filmsList.appendChild(filmsListItem);
            });
        });
}
//
function displayFilmDetails(film) {
    filmPoster.src = film.poster;
    filmTitle.textContent = film.title;
    filmRuntime.textContent = `Runtime: ${film.runtime} minutes`;
    filmShowtime.textContent = `Showtime: ${film.showtime}`;
    availableTickets.textContent = `Available Tickets: ${film.capacity - film.tickets_sold}`;
    buyTicketBtn.textContent = "Buy Ticket";
    buyTicketBtn.disabled = film.tickets_sold >= film.capacity;
}

function buyTicketHandler(film) {
    if (film.tickets_sold < film.capacity) {
        film.tickets_sold++;
        updateTicketsDisplay(film);
        if (film.tickets_sold === film.capacity) {
            setSoldOutState();
        }
        updateTicketsSold(film);
    }
}

function updateTicketsDisplay(film) {
    availableTickets.textContent = `Available Tickets: ${film.capacity - film.tickets_sold}`;
}

function isSoldOut() {
    buyTicketBtn.textContent = "Sold Out";
    buyTicketBtn.disabled = true;
}

function updateTicketsSold(film) {
    fetch(`http://localhost:3001/films/${film.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ tickets_sold: film.tickets_sold })
    });
}



  