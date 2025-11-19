document.addEventListener('DOMContentLoaded', async() => {

  const moviesURL = 'https://japceibal.github.io/japflix_api/movies-data.json';

  const searchButton = document.getElementById('btnBuscar');
  const searchInput = document.getElementById('inputBuscar');
  const moviesContainer = document.getElementById('lista');

  // fetch a los datos de las películas
  let movies = [];
  
  try {
    const response = await fetch(moviesURL);
    movies = await response.json();
  }
  catch (error) {
    console.error('Error fetching movies data:', error);
  };

  // funcionalidad del buscador
  searchButton.addEventListener('click', () => {
    const searchValue = searchInput.value.trim().toLowerCase();

    if (searchInput && searchValue !== '') {
      const searchResults = movies.filter(movie => 
        movie.title.toLowerCase().includes(searchValue) ||
        movie.genres.map(genre => genre.name).join(', ').toLowerCase().includes(searchValue) ||
        movie.overview.toLowerCase().includes(searchValue) ||
        movie.tagline.toLowerCase().includes(searchValue)
      );

      if (searchResults.length > 0) {
        console.log('Search results:', searchResults);

        showSearchResults(searchResults);
      }
    }
  });

  // función para mostrar los resultados de la búsqueda
  function showSearchResults(results) {
    moviesContainer.innerHTML = '';

    results.forEach(movie => {
      const movieItemAdd = document.createElement('li');
      movieItemAdd.classList.add('list-group-item', 'bg-dark', 'text-light', 'mb-3');
      movieItemAdd.style.cursor = 'pointer';

      movieItemAdd.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <p class="fs-5 fw-bold mb-1"> ${movie.title} </p>
            <p class="mb-1"> ${movie.tagline }</p>
          </div>
          <div class="text-end">
            ${ratingStars(movie.vote_average)}
          </div>
        </div>
      `;

      moviesContainer.appendChild(movieItemAdd);

      movieItemAdd.addEventListener('click', () => {
        openOffcanvas();
        showMovieDescription(movie);
      });
    });
  };

  // función para abrir el offcanvas
  function openOffcanvas() {
    const offcanvasElement = document.getElementById('offcanvas-movie');
    const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
    offcanvas.show();
  }

  // función para mostrar la descripción de la película
  function showMovieDescription(movie) {
    const offcanvasTitle = document.getElementById('offcanvas-movie-title');
    const offcanvasBody = document.getElementById('offcanvas-movie-description');
    const offcanvasGenres = document.getElementById('offcanvas-movie-genres');
    
    const dropdownElements = {
      year: document.getElementById('dropdown-year'),
      runtime: document.getElementById('dropdown-runtime'),
      budget: document.getElementById('dropdown-budget'),
      revenue: document.getElementById('dropdown-revenue')
    }

    offcanvasTitle.textContent = movie.title;
    offcanvasBody.textContent = movie.overview;
    offcanvasGenres.textContent = movie.genres.map(genre => genre.name).join(', ') + '.';
    
    dropdownElements.year.textContent = `Year: ${movie.release_date.substring(0, 4)}`;
    dropdownElements.runtime.textContent = `Runtime: ${movie.runtime} mins`;
    dropdownElements.budget.textContent = `Budget: $${movie.budget.toLocaleString('es-UY')}`;
    dropdownElements.revenue.textContent = `Revenue: $${movie.revenue.toLocaleString('es-UY')}`;

  };

  // función para generar las estrellas
  function ratingStars(voteAverage) {
    const rating = Math.round(voteAverage / 2);
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars += '<span class="fa fa-star checked"></span>';
      } else {
        stars += '<span class="fa fa-star"></span>';
      }
    }
    
    return stars;
  }
});
