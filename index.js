//model
const state = {
    movies : [],
    totalPage : [],
}

let page = 1
let totalpages = 100
let popupFlag = false

const likedMoives = {
    movies : [], //store id
    totalPage : []
}


//Controller

//API key: 39ea09974d23848ccf20df47541db0cf
//Read access token: eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOWVhMDk5NzRkMjM4NDhjY2YyMGRmNDc1NDFkYjBjZiIsInN1YiI6IjY0NzRmMTVmN2NhYTQ3MDBhNzAzMGQ4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1wNP2_R70CHBjW-oD3vxWyNrWyOnu8o5t8lqV3-LG6g
//https://image.tmdb.org/t/p/w500
function loadMoviesData(option,page = 1) {
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOWVhMDk5NzRkMjM4NDhjY2YyMGRmNDc1NDFkYjBjZiIsInN1YiI6IjY0NzRmMTVmN2NhYTQ3MDBhNzAzMGQ4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1wNP2_R70CHBjW-oD3vxWyNrWyOnu8o5t8lqV3-LG6g'
        }
      };
      
    //now_playing
    //popular
    //top_rated
    //upcoming
    const choice = option
      fetch('https://api.themoviedb.org/3/movie/'+choice+'?language=en-US&page='+page, options)
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            //console.log(data.results);
            state.movies = data.results;
            totalpages = data.total_pages;
            //console.log(state.movies);
            renderView();
            
        }
            
        )
        .catch(err => console.error(err));
  }

function loadLikesMoviesData() {
    
    state.movies = [];
    renderView('liked');
    likedMoives.movies.forEach((id) => {
        getMovieDetailsInLike(id);
        //state.movies.push(getMovieDetails(id));
        //console.log(state.movies);
    });
    //console.log(state.movies);//no data before async func
    //renderView();
  }


function getMovieDetailsInLike(id){
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOWVhMDk5NzRkMjM4NDhjY2YyMGRmNDc1NDFkYjBjZiIsInN1YiI6IjY0NzRmMTVmN2NhYTQ3MDBhNzAzMGQ4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1wNP2_R70CHBjW-oD3vxWyNrWyOnu8o5t8lqV3-LG6g'
    }
  };
  let movie_id = id;
  fetch('https://api.themoviedb.org/3/movie/'+movie_id+'?language=en-US', options)
    .then(response => response.json())
    .then(
        (response) => {
            //console.log(response);
            state.movies.push(response);
            //console.log(state.movies);
            renderView('liked');
            return response;
        })
    .catch(err => console.error(err));
}



//view
function createMovieNode(movie) {
    const div = document.createElement('div');
    div.className = 'movie';
    div.id = movie.id;

// <img class="movie_poster" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" />
    const poster = document.createElement('img')
    poster.className = "movie_poster"
    poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    
    div.append(poster)
    const info = document.createElement('div')
    info.innerHTML = `
      <div class="movie_data">
        <h3 class="movie_name">${movie.title}</h3>
        <p class="movie_row"><span>rate:</span>${movie.vote_average}</p>
        <p class="liked" id = ${movie.id}><span><i class="ion-star ion_star1"></i></span></p>
      </div>
    `;
    div.append(info)



    poster.addEventListener('click', function() {
        showPopup(movie.id);
        })
    return div;
  }

function renderView(f = "home") {    
    
    let flag = f
    const MoviesContainer = document.querySelector('.movies');
    MoviesContainer.innerHTML = '';
    state.movies.forEach((movie) => {
        const li = createMovieNode(movie);
        
        // if (likedMoives.includes(elementToCheck)) {
        //     countriesTitle.className = 'countries-title show';
        //   } else {
        //     countriesTitle.className = 'countires-title';
        //   }
        MoviesContainer.append(li);

        //console.log(MoviesContainer);
});

    const pages = document.querySelector('.pages');
    pages.innerHTML = `${page}/${totalpages}`;

    const stars = document.querySelectorAll('.liked');
    //console.log(stars)
    for (let i = 0; i < stars.length; i++) {
        let id = stars[i].id;
        //console.log(id)
        const starElement = stars[i]
        //console.log(starElement)
        if(likedMoives.movies.includes(id)){
            starElement.className = 'liked yes'
        }else{
            starElement.className = 'liked'
        }

        stars[i].addEventListener('click', () => {
            
            if(likedMoives.movies.includes(id)){
                let index = likedMoives.movies.indexOf(id);
                if (index !== -1) {
                likedMoives.movies.splice(index, 1);
                };
            }else{
                likedMoives.movies.push(stars[i].id);
            }
            
            if (flag === 'liked'){
                loadLikesMoviesData();
            } else{
                renderView();
            }
            

            });

    }
}



let dropdown = document.getElementById("dropdown_list");
let dropdown_option = dropdown.value;
//console.log(dropdown_option);
loadMoviesData(dropdown_option);


dropdown.addEventListener("change", function() {
  dropdown_option = dropdown.value;   //注意scope的问题，dropdown是个全局变量
  console.log(dropdown_option);
  loadMoviesData(dropdown_option);
  page = 1;
  // Perform additional actions based on the selected value
});

const likedContainer = document.querySelector('.liked_list');
likedContainer.addEventListener('click', () => {
    loadLikesMoviesData();

});


const HomeContainer = document.querySelector('.home');
HomeContainer.addEventListener('click', () => {
    loadMoviesData(dropdown_option);

});


const nextButton = document.querySelector('.next_button');
nextButton.addEventListener('click', () => {
    page = page + 1
    loadMoviesData(dropdown_option,page);

});

const prevButton = document.querySelector('.prev_button');
prevButton.addEventListener('click', () => {
    if (page != 1){
        page = page - 1;
    }
    
    console.log(dropdown_option)
    loadMoviesData(dropdown_option,page);


});

// div.className = 'movie';
// div.id = movie.id;

//点击其他让pop消失
document.addEventListener('click', function(event) {
    if (popupFlag === true){
        let popupContainer = document.querySelector('.popupContainer');
        if (!popupContainer.contains(event.target)) {
            noPopup();
          }
    }
    
  });

function noPopup(){
    let popupContainer = document.querySelector('.popupContainer');
    popupContainer.innerHTML = ' ';
    popupFlag = false;
}

function showPopup(movie_id) {
    let popupContainer = document.querySelector('.popupContainer');
    console.log(popupContainer)
    // Remove previous popup if exists
    popupContainer.innerHTML = ' ';


    let popup = document.createElement('div');
    popup.classList.add('popup');
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOWVhMDk5NzRkMjM4NDhjY2YyMGRmNDc1NDFkYjBjZiIsInN1YiI6IjY0NzRmMTVmN2NhYTQ3MDBhNzAzMGQ4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1wNP2_R70CHBjW-oD3vxWyNrWyOnu8o5t8lqV3-LG6g'
        }
      };
    fetch('https://api.themoviedb.org/3/movie/'+movie_id+'?language=en-US', options)
    .then(response => response.json())
    .then(
        (response) => {
            console.log(response);
            //console.log(state.movies);
            popup.innerHTML = `
            <span id="closeButton">&times;</span>
            <img class="details_movie_poster" src="https://image.tmdb.org/t/p/w500${response.poster_path}" />
            <div class="details_movie_data">
              <h3 class="details_movie_name">${response.title}</h3>
              <p class="details_movie_row"><span>rate:</span>${response.vote_average}</p>
              <p class="details_movie_row"><span>audlt:</span>${response.adult}</p>
              <p class="details_movie_row"><span>popularity:</span>${response.popularity}</p>
              <p class="details_movie_row"><span>release_date:</span>${response.release_date}</p>
            </div>
          `;
            popupContainer.appendChild(popup);
            popupFlag = true;

            let closeButton = document.querySelector("#closeButton");
            closeButton.addEventListener("click", function() {
                //popupContainer.style.display = "none";
                //popupContainer.innerHTML = ' ';
                noPopup()
              });

        })
    .catch(err => console.error(err));

}

// getMovieDetails("603692")