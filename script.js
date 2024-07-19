const filmDetails = document.querySelector('.film-details');
const filmsList = document.getElementById('films');
const filmPoster = document.getElementById("film-poster");
const filmTitle = document.getElementById("film-title");
const filmRuntime = document.getElementById("film-runtime");
const filmShowtime = document.getElementById("film-showtime");
const availableTickets = document.getElementById("film-tickets");
const buyTicketBtn = document.getElementById("buy-ticket");

const filmsUrl = 'http://localhost:3000/films';

fetchFirstMovie();
fetchAllFilms();

//function to fetch placeholder film
function fetchFirstMovie() {
    fetch(`${filmsUrl}/1`)
        .then(response => response.json())
        .then(film => {
            if (!film.tickets_sold) {
                film.tickets_sold = 0;
            }
            displayFilmDetails(film);
            buyTicketBtn.onclick = () => buyTicketHandler(film);
        })
        .catch(error => console.error('Error fetching the first movie:', error));
}
//function to fetch all films
function fetchAllFilms() {
    fetch(filmsUrl)
        .then(response => response.json())
        .then(films => {
            filmsList.textContent = ""; 
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
        })
        .catch(error => console.error('Error fetching all films:', error));
}

function displayFilmDetails(film) {
    filmPoster.src = film.poster;
    filmTitle.textContent = film.title;
    filmRuntime.textContent = `Runtime: ${film.runtime} minutes`;
    filmShowtime.textContent = `Showtime: ${film.showtime}`;
    availableTickets.textContent = `Available Tickets: ${film.capacity - film.tickets_sold}`;
    buyTicketBtn.textContent = "Buy Ticket";
    buyTicketBtn.disabled = film.tickets_sold >= film.capacity;
}

//function to adress event handling
function buyTicketHandler(film) {
    if (film.tickets_sold < film.capacity) {
        film.tickets_sold++;
        updateTicketsDisplay(film);
        if (film.tickets_sold > film.capacity) {
            isSoldOut();
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
    fetch(`${filmsUrl}/${film.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ tickets_sold: film.tickets_sold })
    })
    .catch(error => console.error('Error updating tickets sold:', error));
}