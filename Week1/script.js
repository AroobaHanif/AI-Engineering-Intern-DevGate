const form = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const message = document.getElementById('message');
const result = document.getElementById('result');                         // step 1

form.addEventListener('submit', async (event) => {      // arrow function
  event.preventDefault();       // stop page from reloading
  result.classList.add('hidden');                                         // step 2
  message.textContent = 'Loading...';

  const city = cityInput.value;

  try {
    // STEP 1: turn city name into latitude/longitude
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
    const geoData = await geoRes.json();

    if (!geoData.results) {

      message.textContent = `Couldn't find "${city}". Try another city.`; // step 3
      return;
    }

    const { latitude, longitude, name } = geoData.results[0];   //destructing

    // STEP 2: use latitude/longitude to get current weather
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const weatherData = await weatherRes.json();
    const temp = weatherData.current_weather.temperature;
    const wind = weatherData.current_weather.windspeed;

    // Showing the result
    message.textContent = '';
    document.getElementById('cityName').textContent = name;
    document.getElementById('temp').textContent = `${temp}°C`;
    document.getElementById('wind').textContent = `${wind} km/h`;
    result.classList.remove('hidden');

  } catch (error) {
    message.textContent = 'Something went wrong. Try again.';
  }
});
