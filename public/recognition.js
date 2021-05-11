
document.addEventListener('DOMContentLoaded', speechToEmotion, false)
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

//teste1232
//sdcjbwjcs

startBtn.addEventListener("click", () => { 
  recognition.start()
  
})

function speechToEmotion() {

  recognition.onresult = function(event) {
    const results = event.results
    const speech = results[results.length-1][0].transcript
    setEmoji('searching')

    if(speech.includes('hello') || speech.includes('hi') ){
            utter.text = "Hi"
            synth.speak(utter)
    }
    if(speech.includes('great thank you')){
        utter.text ="Glad to hear that"
        synth.speak(utter)
    }
    if(speech.includes('sad') || speech.includes('bad day')){
      utter.text ="That is terrible , let me tell you a joke"
      synth.speak(utter)
      getJokes()
    }
    if(speech.includes('happy') || speech.includes('amazing') || speech.includes('good day')){
      utter.text ="I'm really happy for you"
      synth.speak(utter)
    }
    if(speech.includes('joke') || speech.includes('tell me a joke')){
      getJokes()
    }

    if(speech.includes('what is the time')){
     speak(getTime);
    }

    if(speech.includes('what is the date')){
      speak(getDate);
    }
    if(speech.includes('what day is tomorrow'))
      {
        speak(getDateTommorow)
      }
    if(speech.includes('what is the weather in')){
      getTheWeather(speech)
    }

    if(speech.includes('goodbye') || speech.includes('see you soon')){
      utter.text ="Bye, until the next time"
      synth.speak(utter)
      recognition.abort()
    }

    if(speech.includes('movies of ')){
      getMovies(speech)
    }

    fetch(`/emotion?text=${speech}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.score > 0) {
          setEmoji('positive')


        } else if (result.score < 0) {
          setEmoji('negative')


        } else {
          setEmoji('neutral')

        }
        console.log('result ->', result)
      })
      .catch((e) => {
        console.error('Request error -> ', e)
        setEmoji('error')
        recognition.abort()
      })
  }

 /* recognition.onerror = function(event) {
    console.error('Recognition error -> ', event.error)
    setEmoji('error')
  }*/

  recognition.onstart = function() {
    setEmoji('listening')
  }

  recognition.onend = function(){
    setEmoji('idle')
    console.log('Speech recognition service disconnected')
    
    setTimeout(function() {
      utter.text = "Is everything ok?"
      synth.speak(utter)
    }, 100000);
    
  }

  /*recognition.onend = function() {
    setEmoji('idle')
    console.log('Speech recognition service disconnected')
  }*/

  function setEmoji(type) {
    const emojiElem = document.querySelector('.emoji img')
    emojiElem.classList = type
  }
}

  const speak = (action) => {
    const utterThis = new SpeechSynthesisUtterance(action())
    synth.speak(utterThis)
  };

  const getTime = () => {
    const time = new Date(Date.now());
    return `the time is ${time.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true })}`
  };

  const getDate = () => {
    const time = new Date(Date.now());
    return `today is ${time.toLocaleDateString()}`;
  };

  const getDateTommorow = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1);
    return `tommorow is ${tomorrow.toLocaleDateString()}`
  }

  const getTheWeather = (speech) => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${speech.split(' ')[5]}&units=metric&appid=7b4019f1b4eee1b323e6e6e61027976c`)
    .then(function(response){
      return response.json();
    }).then(function(weather){
      if (weather.cod === '404'){
        utterThis = new SpeechSynthesisUtterance(`I cannot find the weather for ${speech.split(' ')[5]}`);
        synth.speak(utterThis)
        return;
      }
      utterThis = new SpeechSynthesisUtterance(`the weather condition in ${weather.name} is mostly full of
      ${weather.weather[0].description} at a temperature of ${weather.main.temp} degrees Celcius`);
      synth.speak(utterThis)
    })
  }

  function getJokes(){
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
  axios.get('http://www.omdbapi.com/?apikey=9d90d9a2&s='+ speech.split(' ')[2])
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
                <img src="${movie.Poster}" class="thumbnail">
              </div>
              <div class="col-md-8">
                <h2> ${movie.Title}</h2>
                <ul class="list-group">
                  <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
                  <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
                  <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
                  <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.ImdbRating}</li>
                  <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
                  <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
                  <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
                </ul>
              </div> 
            </div>
            <div class="row">
              <div class="well">
                <h3>Plot</h3>
                  ${movie.Plot}
                  <hr>
                  <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View Imdb</a>
                  <a href="index.html" class="btn btn-default"> Go back to Social App</a>
              </div>
            </div>

        `;
        $('#movie').html(output);
      })
      .catch((err) => {
        console.log(err)
      })
    }

  




  

