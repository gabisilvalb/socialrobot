document.addEventListener('DOMContentLoaded', speechToEmotion, false)
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('btn-recipe-close');
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
const startBtn = document.querySelector("#start-btn")
//Iniciar o speech

const utter = new SpeechSynthesisUtterance()
var voices = window.speechSynthesis.getVoices();
const synth = window.speechSynthesis


const recognition = new SpeechRecognition()
recognition.lang = 'en-US'
recognition.continuous = true
recognition.interimResults = false
recognition.maxAlternatives = 1
utter.voice = voices[50]; // Note: some voices don't support altering params
utter.voiceURI = 'native';
utter.volume = 1
utter.rate = 1
utter.pitch = 1
utter.lang = 'en-US'

utter.text = "Hello"
synth.speak(utter)


mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

startBtn.addEventListener("click", () => { 
  recognition.start() 
})


function speechToEmotion() {

  recognition.onresult = function(event) {
    const results = event.results
    const speech = results[results.length-1][0].transcript
    $(".emoji").html("<img class='search'>")
    
    if(speech == 'hello' || speech == "hi" ){
      utter.text = "Hi"
      synth.speak(utter)
    }
    if(speech.includes('joke') || speech.includes('tell me a joke')){
      getJokes()
    }
    if(speech.includes('what is the weather in') || speech.includes('what is the temperature in')){
      getTheWeather(speech)
    }
    if (speech.includes('meals with') || speech.includes('recipes with') ){
      getMealList(speech)
    }
    if(speech.includes('what is the weather for tomorrow in') || speech.includes('what is the temperature for tomorrow in') ){
      getTheWeatherTomorrow(speech)
    }
    if(speech.includes('moon phases for the month') || speech.includes('moon phases this month')){
      utter.text = "These are the moon phases for the month"
      synth.speak(utter)
      load_moon_phases(configMoon,moonMonth)
    }
    if(speech.includes('moon phases next month') || speech.includes('moon phases for the next month')){
      utter.text = "Here are the moon phases for the next month"
      synth.speak(utter)
      load_moon_phases(configMoonNextMonth,moonMonth)
    }
    if(speech.includes('moon phase today') || speech.includes('moon phase for today')){
      load_moon_phases(configMoon,moonToday)
    }
    if(speech.includes('news about') ){
      getNews(speech);
    }
    if(speech.includes('covid statistics in') || speech.includes('covid stats in') ){
      getCovidStats(speech);
    }
    if(speech.includes('goodbye') || speech.includes('see you soon')){
      utter.text ="Bye, until the next time"
      synth.speak(utter)
      recognition.abort()
    }

    if(speech.includes('movies of')){
      getMovies(speech)
    }

    var randomInt = Math.floor(Math.random() * 4) + 1;

    fetch(`/emotion?text=${speech}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.score > 0) {
          console.log(randomInt)
          if (randomInt == 1){
            utter.text ="I'm really happy for you"
            synth.speak(utter)
          }if (randomInt == 2) {
            utter.text ="Great to hear that"
            synth.speak(utter)
          }if (randomInt == 3){
            utter.text ="If you are felling good, I am too"
            synth.speak(utter)
          }if (randomInt == 4) {
            utter.text ="Amazing, I hope i can keep you with that feeling"
            synth.speak(utter)
          }
          $(".emoji").html("<img class='positive'>")
        } else if (result.score < 0) {
          console.log(randomInt)
          if (randomInt == 1) {
            utter.text ="That is terrible , let me tell you a joke"
            synth.speak(utter)
            getJokes()
          }if (randomInt == 2) {
            utter.text ="It's really sad to hear that"
            synth.speak(utter)
          }if (randomInt == 3) {
            utter.text ="I hate that"
            synth.speak(utter)
          }if (randomInt == 4) {
            utter.text ="Stay positive tommorrow will be different"
            synth.speak(utter)
          }
          $(".emoji").html("<img class='negative'>")
        } else {
          if(speech.includes('what is the time') || speech.includes('what time is it') || speech.includes('can you tell me the time') ){
            getTime()
          }
          else if(speech == 'what is the date' || speech.includes('can you tell me de date') || speech.includes('what day is today') ){
            getDate()
          }
          else if(speech.includes('what day is tomorrow') || speech =='what is the date for tomorrow'){
            getDateTommorow()
          }
          else{
            $(".emoji").html("<img class='neutral'>")
          }
        }
        console.log('result ->', result)
      })
      .catch((e) => {
        console.error('Request error -> ', e)
        $(".emoji").html("<img class='error'>")
        recognition.abort()
      })
  }

  recognition.onerror = function(event) {
    console.error('Recognition error -> ', event.error)
    setEmoji('error')
  }

  recognition.onstart = function() {
    $(".emoji").html("<img class='listening'>")  }

  recognition.onend = function(){
    $(".emoji").html("<img class='idle'>")
    console.log('Speech recognition service disconnected')
    var x = document.getElementById("cards");
    x.style.display = "none";
    var x = document.getElementById("meal");
    x.style.display = "none";
    setTimeout(function() {
      utter.text = "Is everything ok?"
      synth.speak(utter)
    }, 100000); 
  }
}
  const speak = (action) => {
    const utterThis = new SpeechSynthesisUtterance(action())
    synth.speak(utterThis)
  };

  
  const getTime = () => {
    var x = document.getElementById("cards");
    x.style.display = "none";
    var x = document.getElementById("meal");
    x.style.display = "none";
    var x = document.getElementById("movies");
    x.style.display = "none";
    var time = new Date();
    var hour = time.getHours();
    var min = "0" + time.getMinutes();
    var totalTime = hour + ':' + min.substr(-2);
    utterThis = new SpeechSynthesisUtterance(`the time is ${totalTime}`);
    synth.speak(utterThis)
    console.log(hour)
    output = `<div id="clock">${totalTime}</div>`
    $(".emoji").html(output)
  };

  const getDate = () => {
    var x = document.getElementById("cards");
    x.style.display = "none";
    var x = document.getElementById("meal");
    x.style.display = "none";
    var x = document.getElementById("movies");
    x.style.display = "none";
    const time = new Date(Date.now());
    var today = new Date()
    var date = today.getDate() + '/' + (today.getMonth()+1)+'/'+today.getFullYear();
    var dateTime = date
    utterThis = new SpeechSynthesisUtterance(`today is ${time.toLocaleDateString('en-US',{day:'numeric', month: 'numeric', year:'numeric'})}`);
    synth.speak(utterThis)
    output = `<div id="date">${dateTime}</div>`
    $(".emoji").html(output)
  };

  const getDateTommorow = () => {
    var x = document.getElementById("cards");
    x.style.display = "none";
    var x = document.getElementById("meal");
    x.style.display = "none";
    var x = document.getElementById("movies");
    x.style.display = "none";
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1);
    var date = today.getDate()+1 + '/' + (today.getMonth()+1)+'/'+ today.getFullYear();
    var dateTime = date
    utterThis = new SpeechSynthesisUtterance(`tommorow is ${tomorrow.toLocaleDateString()}`);
    synth.speak(utterThis)
    output = `<div id="date">${dateTime}</div>`
    $(".emoji").html(output)
  }

  const getTheWeatherTomorrow = (speech) => {
    var x = document.getElementById("cards");
    x.style.display = "none";
    var x = document.getElementById("meal");
    x.style.display = "none";
    var x = document.getElementById("movies");
    x.style.display = "none";
    var trim = speech.trim()
    fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?q=${trim.split(' ')[7]}&units=metric&appid=08dbab0eeefe53317d2e0ad7c2a2e060`)
    .then(function(response){
      return response.json();
    }).then(function(weather){
      if (weather.cod === '404'){
        utterThis = new SpeechSynthesisUtterance(`I cannot find the weather for ${trim.split(' ')[7]}`);
        synth.speak(utterThis)
        return;
      }
      console.log(weather)
      var dateSunRise = new Date(1000*weather.list[1].sunrise);
      var dateSunSet = new Date(1000*weather.list[1].sunset);

      var hoursSunRise = dateSunRise.getHours();
      var hoursSunSet = dateSunSet.getHours();
      // Minutes part from the timestamp
      var minutesSunRise = "0" + dateSunRise.getMinutes();
      var minutesSunSet = "0" + dateSunSet.getMinutes();
      // Will display time in 10:30 format

      var formattedTimeSunRise = hoursSunRise + ':' + minutesSunRise.substr(-2);
      var formattedTimeSunset = hoursSunSet + ':' + minutesSunSet.substr(-2);

       utterThis = new SpeechSynthesisUtterance(`the weather condition in ${weather.city.name} for tomorrow is mostly full of
       ${weather.list[1].weather[0].description} with a temperature of ${Math.round(weather.list[1].temp.day)} degrees Celcius. The sunrise is at ${formattedTimeSunRise} and the sunset is at ${formattedTimeSunset}`);
       synth.speak(utterThis)
      output = `
      <br>
      <br>
      <div class="card text-white mx-auto w-50 p-3 bg-primary mb-3 text-center" style="max-width: 20rem;">
          <div class="card-header">
            <h2 class="city-name" data-name="${weather.city.name},${weather.city.country}">
              <span>${weather.city.name}</span>
              <sup class="badge bg-warning" style="font-size: 0.4em;">${weather.city.country}</sup>
            </h2>
          </div>
          <div class="card-body">
            <div class="city-temp" style="font-size:200%;">${Math.round(weather.list[1].temp.day)}<sup>°C</sup></div>
              <figure>
                <h5 class="weather-${weather.list[1].weather[0].icon}"></h5>
                <p style="font-size:150%; text-transform: uppercase"><strong>${weather.list[1].weather[0].description}</strong></p>
                <p><strong>The sunrise is at </strong>${formattedTimeSunRise}</p>
                <p><strong>The sunset is at </strong>${formattedTimeSunset}</p>
              </figure>
            </div>
          </div>
        </div>`;
      $(".emoji").html(output)
    })
  }
 


  const getTheWeather = (speech) => {
    var x = document.getElementById("cards");
    x.style.display = "none";
    var x = document.getElementById("meal");
    x.style.display = "none";
    var x = document.getElementById("movies");
    x.style.display = "none";
    var trim = speech.trim()
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${trim.split(' ')[5]}&units=metric&appid=7b4019f1b4eee1b323e6e6e61027976c`)
    .then(function(response){
      return response.json();
    }).then(function(weather){
      if (weather.cod === '404'){
        utterThis = new SpeechSynthesisUtterance(`I cannot find the weather for ${trim.split(' ')[5]}`);
        synth.speak(utterThis)
        return;
      }
      
      console.log(weather)
      var dateSunRise = new Date(1000*weather.sys.sunrise);
      var dateSunSet = new Date(1000*weather.sys.sunset);

      var hoursSunRise = dateSunRise.getHours();
      var hoursSunSet = dateSunSet.getHours();
      // Minutes part from the timestamp
      var minutesSunRise = "0" + dateSunRise.getMinutes();
      var minutesSunSet = "0" + dateSunSet.getMinutes();
      // Will display time in 10:30:23 format
      var formattedTimeSunRise = hoursSunRise + ':' + minutesSunRise.substr(-2);
      var formattedTimeSunset = hoursSunSet + ':' + minutesSunSet.substr(-2) ;
      utterThis = new SpeechSynthesisUtterance(`the weather condition in ${weather.name} is mostly full of
      ${weather.weather[0].description} at a temperature of ${Math.round(weather.main.temp)} degrees Celcius. The sunrise is at ${formattedTimeSunRise} and the sunset is at ${formattedTimeSunset}`);
      synth.speak(utterThis)
      output = `
      <br>
      <br>
      <div class="card text-white mx-auto w-50 p-3 bg-primary mb-3 text-center" style="max-width: 20rem;">
          <div class="card-header">
            <h2 class="city-name" data-name="${weather.name},${weather.sys.country}">
              <span>${weather.name}</span>
              <sup class="badge bg-warning" style="font-size: 0.4em;">${weather.sys.country}</sup>
            </h2>
          </div>
          <div class="card-body">
            <div class="city-temp" style="font-size:200%;">${Math.round(weather.main.temp)}<sup>°C</sup></div>
              <figure>
                <h5 class="weather-${weather.weather[0].icon}"></h5>
                <p style="font-size:150%; text-transform: uppercase"><strong>${weather.weather[0]["description"]}</strong></p>
                <p><strong>The sunrise is at </strong>${formattedTimeSunRise}</p>
                <p><strong>The sunset is at </strong>${formattedTimeSunset}</p>
              </figure>
            </div>
          </div>
        </div>`;
      $(".emoji").html(output)
    })
  }

  function getJokes(){
    var x = document.getElementById("cards");
    x.style.display = "none";
    var x = document.getElementById("movies");
    x.style.display = "none";
    var x = document.getElementById("meal");
    x.style.display = "none";  
    fetch('https://official-joke-api.appspot.com/jokes/general/random')
      .then(res => res.json())
      .then(data => {
          const jokes = data[0];
          getJoke(jokes);
      })
  }

  function getJoke(jokes){
    const setup = jokes.setup;
    const punchline = jokes.punchline;
    const joke = setup + punchline;
    console.log(joke);
    setTexTMessage(joke)
    speechSynthesis.speak(utter);
  }

  //Set text para piada
  function setTexTMessage(text){
    utter.text = text
    console.log(text)
  }

  function getMovies(speech){
    var x = document.getElementById("cards");
    x.style.display = "none";
    var x = document.getElementById("meal");
    x.style.display = "none";
    var trim = speech.trim()
    var trim = speech.trim()
      axios.get('http://www.omdbapi.com/?apikey=9d90d9a2&s='+ trim.split(' ')[2])
      .then ((response) => {
        console.log(response)
        let movies = response.data.Search;
        let output = '';
        $.each(movies, (index,movie) =>{
          output += `
              <div class="col-md-3">
                <div class="well text-center">
                  <img src="${movie.Poster}">
                  <h5> ${movie.Title}</h5>   
                  <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
                </div>
              </div>     
          `
        })
        utterThis = new SpeechSynthesisUtterance(`here are some movies of ${trim.split(' ')[2]} that i found`);
        synth.speak(utterThis)
        $(".emoji").html("<img class='popcorn'>")
        $('#movies').html(output)
      })
      .catch((err) => {
        console.log(err)
      })
  }

    function movieSelected(id){
      sessionStorage.setItem('movieId', id)
      window.location = 'movie.html'
      return false;
    }

    function getMovie(){
      let movieId = sessionStorage.getItem('movieId')
      axios.get('http://www.omdbapi.com/?apikey=9d90d9a2&i='+movieId)
      .then ((response) => {
        console.log(response)
        let movie = response.data
        let output = `
            <div class="row">
              <div class="col-md-4">
                <img src="${movie.Poster}" class="thumbnail" style="border: 8px solid #2c3e50;">
              </div>
              <div class="col-md-8">
                <h2> ${movie.Title}</h2>
                <ul class="list-group">
                  <li class="list-group-item list-group-item-action active"><strong>Genre:</strong> ${movie.Genre}</li>
                  <li class="list-group-item list-group-item-action active"><strong>Released:</strong> ${movie.Released}</li>
                  <li class="list-group-item list-group-item-action active"><strong>Rated:</strong> ${movie.Rated}</li>
                  <li class="list-group-item list-group-item-action active"><strong>IMDB Rating:</strong> ${movie.ImdbRating}</li>
                  <li class="list-group-item list-group-item-action active"><strong>Director:</strong> ${movie.Director}</li>
                  <li class="list-group-item list-group-item-action active"><strong>Writer:</strong> ${movie.Writer}</li>
                  <li class="list-group-item list-group-item-action active"><strong>Actors:</strong> ${movie.Actors}</li>
                </ul>
                <div class="row">
                  <div class="well">
                    <br>
                    <h3><strong>Plot</strong></h3>
                    ${movie.Plot}
                      <hr>
                      <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View Imdb</a>
                      <a href="index.html" class="btn btn-danger"> Go back to Social App</a>
                  </div>
                </div>
              </div> 
            </div>
        `;
        $('#movie').html(output);
      })
      .catch((err) => {
        console.log(err)
      })
    }



  function load_moon_phases(obj,callback){
      var gets=[]
      for (var i in obj){
          gets.push(i + "=" +encodeURIComponent(obj[i]))
      }
      gets.push("LDZ=" + new Date(obj.year,obj.month-1,1) / 1000)
      var xmlhttp = new XMLHttpRequest()
      var url = "https://www.icalendar37.net/lunar/api/?" + gets.join("&")
      xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
              callback(JSON.parse(xmlhttp.responseText))
          }
      }
      xmlhttp.open("GET",url, true)
      xmlhttp.send()
  }
  
  function moonMonth(moon){ 
    var x = document.getElementById("cards");
    x.style.display = "none";
    var x = document.getElementById("movies");
    x.style.display = "none";
    var x = document.getElementById("meal");
    x.style.display = "none";      
    var phMax = []
    console.log(moon)
    for (var nDay in moon.phase){
      if (moon.phase[nDay].isPhaseLimit){
        phMax.push(
        '<div>' +
        '<span>' + nDay + '</span>' +
        moon.phase[nDay].svg  +
        '<div>' + moon.phase[nDay].phaseName  + '</div>' +
        '</div>' 
        )}
      }
      var width = 100 / phMax.length
      var html = "<b>" + moon.monthName + " "+ moon.year + "</b>"
      phMax.forEach(function(element){
          html += '<div style="width:'+width+'%">' + element + '</div>' 
      })
      
      document.getElementById("ex2").innerHTML = html
  } 

    function moonToday(moon){
      var x = document.getElementById("cards");
      x.style.display = "none";
      var x = document.getElementById("movies");
      x.style.display = "none";
      var x = document.getElementById("meal");
      x.style.display = "none";    
      var day = new Date().getDate()
      console.log(moon)
      var dayWeek=moon.phase[day].dayWeek
      var html = "<div>" +
      "<b>" + moon.nameDay[dayWeek]+ "</b>" +
      "<div>" + day + " <a>" + moon.monthName + "</a> " +
      moon.year + "</div>" +
      "<div shadow>" + moon.phase[day].svg + "</div>" +
      "<div>" + moon.phase[day].phaseName + " " +
      "" + ((moon.phase[day].isPhaseLimit )? ""  :   Math.round(moon.phase[day].lighting) + "%") +
      "</div>" +
      "</div>"
      utterThis = new SpeechSynthesisUtterance(`The moon today is ${moon.phase[day].phaseName}`);
      synth.speak(utterThis)
      document.getElementById("ex2").innerHTML = html
  }
  
  var configMoon = {
      lang  		:'en', 
      month 		:new Date().getMonth() + 1,
      year  		:new Date().getFullYear(),
      size		:"50%", 
      lightColor	:"white", 
      shadeColor	:"black", 
      texturize	:true, 
  }
  var configMoonNextMonth = {
    lang  		:'en', 
    month 		:new Date().getMonth() + 2,
    year  		:new Date().getFullYear(),
    size		:"50%", 
    lightColor	:"white", 
    shadeColor	:"black", 
    texturize	:true, 
}
  
// get meal list that matches with the ingredients
function getMealList(speech){
  var x = document.getElementById("cards");
  x.style.display = "none";
  var x = document.getElementById("movies");
  x.style.display = "none";
  var x = document.getElementById("meal");
  x.style.display = "grid";
  var trim = speech.trim();
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${trim.split(' ')[2]}`)
  .then(response => response.json())
  .then(data => {
    console.log(data)
      let html = "";
      if(data.meals){
          data.meals.forEach(meal => {
              html += `
                <div class = "meal-item" data-id = "${meal.idMeal}">
                    <div class = "meal-img">
                      <img src = "${meal.strMealThumb}" alt = "food">
                    </div>
                    <div class = "meal-name">
                      <h3>${meal.strMeal}</h3>
                      <a href = "#" class = "btn btn-recipe">Get Recipe</a>
                    </div>
                </div>
              `;
          });
          mealList.classList.remove('notFound');
      } else{
          html = "Sorry, we didn't find any meal!";
          mealList.classList.add('notFound');
      }
      utterThis = new SpeechSynthesisUtterance(`here are some recipes with ${trim.split(' ')[2]}`);
      synth.speak(utterThis)
      mealList.innerHTML = html;
  });
}

function getMealRecipe(e){
  e.preventDefault();
  if(e.target.classList.contains('btn-recipe')){
      let mealItem = e.target.parentElement.parentElement;
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
      .then(response => response.json())
      .then(data =>mealRecipeModal(data.meals));
  }
}

function mealRecipeModal(meal){
  console.log(meal);
  meal = meal[0];
  let html = `
      <h2 class = "recipe-title">${meal.strMeal}</h2>
      <p class = "recipe-category">${meal.strCategory}</p>
      <div class = "recipe-instruct">
          <h3>Instructions:</h3>
          <p>${meal.strInstructions}</p>
      </div>
      <div class = "recipe-meal-img">
          <img src = "${meal.strMealThumb}" alt = "">
      </div>
      <div class = "recipe-link">
          <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
      </div>
  `;
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add('showRecipe');
}

function getNews(speech){
  var x = document.getElementById("cards");
  x.style.display = "none";
  var x = document.getElementById("movies");
  x.style.display = "none";
  var x = document.getElementById("meal");
  x.style.display = "grid";
  var trim = speech.trim()
  fetch(`https://newsapi.org/v2/everything?q=${trim.split(' ')[2]}&sortBy=relevancy&apiKey=016547e657e04e07ac5e3704a733e05c`)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    let html = ""
    data.articles.forEach(article =>{
    html += `
              <div class = "meal-item">
                  <div class = "meal-img">
                    <img src="${article.urlToImage}" alt ="news">
                  </div>
                  <div class = "container">
                  <div class = "meal-name">
                  <a href = "${article.url}" target = "_blank">${article.title}</a>
                  </div>
                  </div>
              </div>
              `;
    });
          utterThis = new SpeechSynthesisUtterance(`here are some of the most relevant news about ${trim.split(' ')[2]} that i found`);
          synth.speak(utterThis)
          document.getElementById("meal").innerHTML = html
          $(".emoji").html("<img class='news'>")
  });
}

function getCovidStats(speech){
  var x = document.getElementById("cards");
  x.style.display = "grid";
  var x = document.getElementById("movies");
  x.style.display = "none";
  var x = document.getElementById("meal");
  x.style.display = "none";
  var trim = speech.trim()
  fetch(`https://corona.lmao.ninja/v2/countries/${trim.split(' ')[3]}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    let html = `
      <h1 class="">Covid-19 Cases In <span id="country">${data.country}</span>
      <img src="${data.countryInfo.flag}" style= "width:80px;"></h1>
      <div class="card-deck text-center">
        <div class="card mb-2">
          <div class="card-body bg-primary text-light rounded">
            <h5 class="card-title"><i class="fas fa-tachometer-alt fa-2x"></i></h5>
            <h4 class="card-text">Active Cases</h4>
            <p class="card-text badge badge-outline-light">${data.active}</p>
          </div>
        </div>
        <div class="card mb-2">
          <div class="card-body bg-info text-light rounded">
            <h5 class="card-title"><i class="fas fa-list fa-2x"></i></h5>
            <h4 class="card-text">Total Cases</h4>
            <p class="card-text badge badge-outline-light">${data.cases}</p>
          </div>
        </div>
        <div class="card mb-2">
          <div class="card-body bg-warning text-light rounded">
            <h5 class="card-title"><i class="fas fa-times-circle fa-2x"></i></h5>
            <h4 class="card-text">Critical Cases</h4>
            <p class="card-text badge badge-outline-light">${data.critical}</p>
          </div>
        </div>
        <div class="card mb-2">
          <div class="card-body bg-danger text-light rounded">
            <h5 class="card-title"><i class="fa fa-times fa-2x"></i></h5>
            <h4 class="card-text">Total Death</h4>
            <p class="card-text badge badge-outline-light">${data.deaths}</p>
          </div>
        </div>
        <div class="card mb-2">
          <div class="card-body bg-success text-light rounded">
            <h5 class="card-title"><i class="fas fa-check-square fa-2x"></i></h5>
            <h4 class="card-text">Recovered Cases</h4>
            <p class="card-text badge badge-outline-light">${data.recovered}</p>
          </div>
        </div>
        <div class="card mb-2">
          <div class="card-body bg-secondary text-light rounded">
            <h5 class="card-title"><i class="fas fa-eye fa-2x"></i></h5>
            <h4 class="card-text">Total Test Done</h4>
            <p class="card-text badge badge-outline-light">${data.tests}</p>
          </div>
        </div>
      </div>
    `
    utterThis = new SpeechSynthesisUtterance(`these are the covid statistics in ${trim.split(' ')[3]}`);
    synth.speak(utterThis)
    document.getElementById("cards").innerHTML = html
    $(".emoji").html("<img class='coronavirus'>")
    
  })
  
  .catch(err => {
    console.error(err);
  });
  
}
