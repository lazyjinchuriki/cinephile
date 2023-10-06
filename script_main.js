//All the url used to fetch movies and tvshows from TMDB api.
const API_key = 'api_key=4b153b123319df27bb67fcbfe219537d';
const BASE_url = 'https://api.themoviedb.org/3';
const API_url = BASE_url + '/discover/movie?sort_by=popularity.desc&' + API_key;
const IMG_url = 'https://image.tmdb.org/t/p/w500'
const SEARCH_url = 'https://api.themoviedb.org/3/search/movie?api_key=4b153b123319df27bb67fcbfe219537d&query='
const TV_url = BASE_url + '/tv/popular?' + API_key + '&vote_count.gte=100';
const TV_Search_url = 'https://api.themoviedb.org/3/search/tv?' + API_key + '&query='



//Array of all the genres of movies.
const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
]

// run after loading page
window.addEventListener("DOMContentLoaded", (ev)=>{
    console.log("page loaded");
    let main = document.querySelector('#main');

    // set the genre categories
    setGenres();
    
    //  set arrow movement for categories
    const rightArrow = document.querySelector(".scrollable-tabs-container .right-arrow svg");
    const leftArrow = document.querySelector(".scrollable-tabs-container .left-arrow svg");
    const tagsEl = document.getElementById('tags');

    rightArrow.addEventListener("click", ()=>{
        tagsEl.scrollLeft += 500;
        manageIcons();
    });
    leftArrow.addEventListener("click", ()=>{
        tagsEl.scrollLeft -= 500;
        manageIcons();
    });


    let onPage=null;
    let whichPage = localStorage.getItem('page');
    if(whichPage == null){
        localStorage.setItem("page", "movie");
        onPage = "movie";
    }
    else{
        onPage = whichPage;
    }
    

    // change page variable from localstorage
    let pgChange = document.querySelector('.pageChange');
    pgChange.addEventListener('click', ()=>{
        let whichPage = localStorage.getItem('page');
        if(whichPage == 'movie'){
            localStorage.setItem('page', 'tv');
            LoadDataAndDisplay();
        }
        else if (whichPage == 'tv'){
            localStorage.setItem('page', 'movie');
            LoadDataAndDisplay();
        }
    })

    // Load data and display function wrapper which fetches data asynchronously and displays it
    LoadDataAndDisplay();


    const prev = document.getElementById("prev")
    const current = document.getElementById("current")
    const next = document.getElementById("next")
    
    prev.addEventListener('click', () =>{
        if(prevPage > 0){
          pageCall(prevPage);
          main.scrollIntoView({behavior : 'smooth'});
        }
    })

    next.addEventListener('click', () =>{
    if(nextPage <= totalPages){
        pageCall(nextPage);
        main.scrollIntoView({behavior : 'smooth'});
    }
    })

    
    let searchBar = document.querySelector('.search');
    searchBar.addEventListener('input', searchStart);
})



// set all genres on the page
let selectedGenre=[]
function setGenres(){
    let tags_el = document.querySelector('#tags');
    // console.log(tags_el);

    genres.forEach(genre =>{
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                selectedGenre.forEach((id, idx) =>{
                    if(id == genre.id){
                    selectedGenre.splice(idx, 1);
                    }
                })
                }else{
                selectedGenre.push(genre.id);
                }
            } 
            //   console.log(selectedGenre)
            
            let newurl = API_url + '&with_genres=' + encodeURI(selectedGenre.join(','));
            let whichPage = localStorage.getItem('page');
            LoadMovieOrTv(whichPage, newurl)
            highlightSelection();

        })
    
        tags_el.append(t);
      })
}

// manange the left and right arrows for genre categories
const manageIcons = ()=>{
    const tagsEl = document.getElementById('tags');
    const leftArrowContainer = document.querySelector(".scrollable-tabs-container .left-arrow")
    const rightArrowContainer = document.querySelector(".scrollable-tabs-container .right-arrow")

    if(tagsEl.scrollLeft >= 20){
        leftArrowContainer.classList.add("active")
    }else{
        leftArrowContainer.classList.remove("active")
    }
    let maxScrollValue = tagsEl.scrollWidth - tagsEl.clientWidth - 20;
    // console.log(tagsEl.scrollWidth);
    // console.log(tagsEl.clientWidth);

    if(tagsEl.scrollLeft >= maxScrollValue){
        rightArrowContainer.classList.remove("active")

    }else{
        rightArrowContainer.classList.add("active");
    }
}

//highlighting the selected genre.
function highlightSelection(){
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag =>{
      tag.classList.remove('active')
    })
    //calling clearBtn function which shows a button to clear all the selected genre when clicking.
    // clearBtn()
    if(selectedGenre.length != 0){
      selectedGenre.forEach(id =>{
          const highlightedTag = document.getElementById(id);
          highlightedTag.classList.add('active');
      })
    }
}


var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;
// change page number
function pageCall(page){

    let urlSplit = lastUrl.split('?');
    let queryParameter = urlSplit[1].split('&');
    let key = queryParameter[queryParameter.length - 1].split('=');
    if(key[0] != 'page'){
        let url = lastUrl + '&page=' + page;
        let whichPage = localStorage.getItem('page');
        LoadMovieOrTv(whichPage, url);
    }
    else{
        key[1] = page.toString();
        let a = key.join('=');
        queryParameter[queryParameter.length - 1] = a;
        let b = queryParameter.join('&');
        let url = urlSplit[0] + '?' + b
        let whichPage = localStorage.getItem('page');
        LoadMovieOrTv(whichPage, url);
    }

}

// load and display wrapper
function LoadDataAndDisplay(){
    let whichPage = localStorage.getItem('page');
    let main = document.querySelector('#main');
    main.innerHTML=' ';

    if(whichPage == 'movie'){
        LoadMovieOrTv(whichPage, API_url)
    }
    else if (whichPage == 'tv'){
        LoadMovieOrTv(whichPage, TV_url)
    }
}

// Asynchronous function which loads data from API 
async function LoadMovieOrTv(whichPage, url){
    lastUrl = url;
    let main = document.querySelector('#main');
    let res = await fetch(url);
    let data = await res.json();

    if(data.results.length !== 0){
        if(whichPage == 'movie'){
            showMovies(data.results);
        }
        else if (whichPage == 'tv'){
            showTvShows(data.results);
        }
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;
        current.innerText = currentPage;

        if(currentPage <= 1){
            prev.classList.add('disabled')
            next.classList.remove('disabled')
        }
        else if(currentPage >= totalPages){
            prev.classList.remove('disabled')
            next.classList.add('disabled')
        }
        else{
            prev.classList.remove('disabled')
            next.classList.remove('disabled')
        }
        
    }
    else{
        main.innerHTML = `
        <h1 style = "color: white;"> WOW! SUCH EMPTY 🙂 </h1>
        `
    }
}


//dynamically loading the movie data in form of Cards consisting of [Title, Poster, Rating, Overview and Release Date].
function showMovies(data){
    let main = document.querySelector('#main');

    main.innerHTML=' ';

    data.forEach( movie => {
      const {title, poster_path, vote_average, overview, release_date, id} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML =  `
        <div>
        <span class="releaseDate"> ${release_date} </span>
        <img src="${ poster_path? IMG_url + poster_path: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfpnrrw7q4mQEeICRY-v-Nx_hfzEwDLrUtog&usqp=CAU' }" alt="${title}">
        
        </div>
        <div class="movie-info">
        <h3>${title}</h3>
      <span class="${getColor(vote_average)}">${vote_average}</span>
        </div>
        <div class="overview">
        <span>
      <h3>${title}</h3>
      <span class="overview-content">
      ${overview}
      </span>
      <br>
      <button class="knowmore" id="${id}">Know More</button>
      </span>
    </div>
    `
    main.appendChild(movieEl)

    document.getElementById(id).addEventListener('click', ()=>{
        console.log(id);
        // openNav(movie);
    })
    })
}
// display  Tv shows
function showTvShows(data){
    let main = document.querySelector('#main');
    main.innerHTML=' ';
  
    data.forEach(tvshow => {
      const {name,overview,poster_path,vote_average,first_air_date,id} = tvshow;
      const tvEl = document.createElement('div');
      tvEl.classList.add('tvshow');
  
      tvEl.innerHTML = `
      <div>
      <span class="releaseDate"> ${first_air_date} </span>
      <img src="${ poster_path? IMG_url + poster_path : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfpnrrw7q4mQEeICRY-v-Nx_hfzEwDLrUtog&usqp=CAU' }" alt="${name}">
      
      </div>
      <div class="movie-info">
      <h3>${name}</h3>
    <span class="${getColor(vote_average)}">${vote_average}</span>
      </div>
      <div class="overview">
    <h3>${name}</h3>
    <span class="overview-content">
    ${overview}
    </span>
    <br>
    <button class="knowmore" id="${id}">Know More</button>
    </span>
   </div>
    `
    main.appendChild(tvEl)
  
    document.getElementById(id).addEventListener('click', ()=>{
      console.log(id);
    //   openNav(tvshow);
    })
})
}
//change the class of vote_average based on the rating to show different colors for different ratings.
function getColor(vote){
    if(vote >= 7){
      return 'green'  
    }
    else if(vote >= 5){
      return 'orange'
    }
    else{
      return 'red'
    }
}
  
// search functionality for searching the results
function searchResultsAndDisplayWrapper(ev){
    let whichPage = localStorage.getItem('page');

    if(ev.target.value == ''){
        // when the search field is empty for TV or Movie 
        if(whichPage == 'movie'){
            LoadMovieOrTv(whichPage, API_url);
        }
        else if (whichPage == 'tv'){
            LoadMovieOrTv(whichPage, TV_url);

        }
    }
    else{
        // when the search field is NOT empty for TV or Movie 
        if(whichPage == 'movie'){
            let url_search = SEARCH_url + ev.target.value;
            LoadMovieOrTv(whichPage, url_search);
        }
        else if (whichPage == 'tv'){
            let url_search = TV_Search_url + ev.target.value;
            LoadMovieOrTv(whichPage, url_search);
        }

    }
}


function searchAndDisplay(func, delay){
    let timer;

    return function (){
        let context = this,
            arg = arguments;

        clearTimeout(timer);

        timer = setTimeout(()=>{
            func.apply(context, arguments);

        }, delay)
    }
}
const searchStart = searchAndDisplay(searchResultsAndDisplayWrapper, 900); 