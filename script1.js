//All the url used to fetch movies and tvshows from TMDB api.
const API_key = 'api_key=4b153b123319df27bb67fcbfe219537d';
const BASE_url = 'https://api.themoviedb.org/3';
const API_url = BASE_url + '/discover/movie?sort_by=popularity.desc&' + API_key;
const IMG_url = 'https://image.tmdb.org/t/p/w500'
const SEARCH_url = 'https://api.themoviedb.org/3/search/movie?api_key=4b153b123319df27bb67fcbfe219537d&query='
// const TV_url = BASE_url + '/tv/popular?' + API_key
const TV_url = BASE_url + '/tv/top_rated?' + API_key
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


//getting ids from the html file 
const main = document.getElementById('main')
const search = document.getElementById('search')
const form = document.getElementById('form')
// const home = document.getElementById('home')
const tagsEl = document.getElementById('tags')
const prev = document.getElementById("prev")
const current = document.getElementById("current")
const next = document.getElementById("next")


var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;


//calling getMovies function with Api url based on popularity in descending order.
getMovies(API_url);

//fetch data from the TMDB api
function getMovies(url){
  lastUrl = url;

    fetch(url).then(res => res.json()).then(data => {
        console.log(data)
        if(data.results.length !== 0){
          showMovies(data.results);
          currentPage = data.page;
          nextPage = currentPage + 1;
          prevPage = currentPage - 1;
          totalPages = data.total_pages;
          current.innerText = currentPage;
          if(currentPage <= 1){
            prev.classList.add('disabled')
            next.classList.remove('disabled')
          }else if(currentPage >= totalPages){
            prev.classList.remove('disabled')
            next.classList.add('disabled')
          }else{
            prev.classList.remove('disabled')
            next.classList.remove('disabled')
          }
          
        }else{
          main.innerHTML = `
          <h1 style = "color: white;"> WOW! SUCH EMPTY 🙂 </h1>
          `
        }
    })
}


var selectedGenre=[]
setGenres();
function setGenres(){
  tagsEl.innerHTML= '';
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
      console.log(selectedGenre)
      getMovies(API_url + '&with_genres=' + encodeURI(selectedGenre.join(',')))
      highlightSelection();
    })

    tagsEl.append(t);
  })
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

function getCast(id) {
  fetch(BASE_url + `/movie/${id}/credits?${API_key}`)
  .then(res => res.json())
  .then(creditsData => {
    const cast = creditsData.cast.slice(0,3);
    const castNames = cast.map(actor => actor.name).join(', ');
    // console.log(castNames);
    document.getElementById("Cast"+id).innerHTML = `Cast : ${castNames}`;
  })
  .catch(error => {
    console.error('Error fetching cast information:', error);
  });
}

//dynamically loading the movie data in form of Cards consisting of [Title, Poster, Rating, Overview and Release Date].
function showMovies(data){
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
      <p id = Cast${id}>${getCast(id)}</p>
      <br>
      <button class="knowmore" id="${id}">Know More</button>
      </span>
    </div>
    `
    main.appendChild(movieEl)

    document.getElementById(id).addEventListener('click', ()=>{
      console.log(id);
      openNav(movie);
    })
    })
}

const overlayContent = document.getElementById('overlay-content');
/* Open when someone clicks on the span element */
function openNav(movie) {
  let id= movie.id
  fetch(BASE_url+ '/movie/'+ id + '/videos?' + API_key).then(res => res.json()).then(videoData => {
    console.log(videoData)
    if(videoData){
      document.getElementById("myNav").style.width = "100%";
      if(videoData.results.length > 0){
        var embed= [];
        videoData.results.forEach(video => {
          let{name,key,site,type} = video;

          if(site == 'YouTube' && type == 'Trailer'){
          embed.push(`
          <div class="video-container">
          <iframe  width="560" height="315" class="embed hide" frameborder="0" src="https://www.youtube.com/embed/${key}" title="${name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
          `)
          }
        })

        overlayContent.innerHTML = embed.join('');
        activeSlide=0;
        showVideos();
      }else{
        overlayContent.innerHTML = `
        <h1 style = "color: white;"> WOW! SUCH EMPTY 🙂 </h1>`
      }
    }
  })
}

/* Close when someone clicks on the "x" symbol inside the overlay */
// 

function closeNav() {
  const overlay = document.getElementById("myNav");
  overlay.style.width = "0%";
  const embedClass = document.querySelectorAll('.embed');
  embedClass.forEach(embedTag => {
    embedTag.src = '';
    embedTag.parentNode.removeChild(embedTag);
  });
  activeSlide = 0;
}

function showVideos(){
  let embedClass = document.querySelectorAll('.embed');
  embedClass.forEach((embedTag, idx)=>{
    if(activeSlide == idx){
      embedTag.classList.add('show');
      embedTag.classList.remove('hide');
    }else{
      embedTag.classList.add('hide');
      embedTag.classList.remove('show');
    }
  })
}



//to search the selected term with the search url to get realevent movies.
form.addEventListener('submit', (e) => {
  e.preventDefault()

  const searchTerm = search.value
  selectedGenre = [];
  setGenres();

  if(searchTerm && searchTerm !== '') {
      getMovies(SEARCH_url + searchTerm)
      search.value = ''
  } else {
      window.location.reload()
  }
})



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

function pageCall(page){
  let urlSplit = lastUrl.split('?');
  let queryParameter = urlSplit[1].split('&');
  let key = queryParameter[queryParameter.length - 1].split('=');
  if(key[0] != 'page'){
    let url = lastUrl + '&page=' + page;
    getMovies(url);
  }else{
    key[1] = page.toString();
    let a = key.join('=');
    queryParameter[queryParameter.length - 1] = a;
    let b = queryParameter.join('&');
    let url = urlSplit[0] + '?' + b
    getMovies(url);
  }
}



const tabs = document.querySelectorAll(".scrollable-tabs-container .tag");
const rightArrow = document.querySelector(".scrollable-tabs-container .right-arrow svg");
const leftArrow = document.querySelector(".scrollable-tabs-container .left-arrow svg");
const leftArrowContainer = document.querySelector(".scrollable-tabs-container .left-arrow")
const rightArrowContainer = document.querySelector(".scrollable-tabs-container .right-arrow")
const manageIcons = ()=>{
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
rightArrow.addEventListener("click", ()=>{
    tagsEl.scrollLeft += 500;
    manageIcons();
});
leftArrow.addEventListener("click", ()=>{
    tagsEl.scrollLeft -= 500;
    manageIcons();
});
tagsEl.addEventListener("scroll", manageIcons);
let dragging = false;
const drag = (e)=>{
    if(!dragging) return;
    tagsEl.classList.add("dragging")
    tagsEl.scrollLeft -= e.movementX;
}
tagsEl.addEventListener("mousedown", ()=>{
     dragging = true
});
tagsEl.addEventListener("mouseup", ()=>{
    tagsEl.classList.remove("dragging")
    dragging = false;
})
