import { getWeatherLocation } from "./api";
import "./style.css";
import "weather-icons/css/weather-icons.css";

const button = document.querySelector("button");
button.addEventListener("click", async () => {
    const input = document.querySelector("input");

    if (input.value) {
        const response = await getWeatherLocation(input.value);
        if (response)
            draw(response);
        else {
            const cityName = document.querySelector("#city-name");
            cityName.textContent = "No data available";
        }
    }

    setTimeout(() => { }, 500);
});

const draw = (json) => {
    const cityName = document.querySelector("#city-name");
    cityName.textContent = json.resolvedAddress;

    const temperature = document.querySelector("#temperature");
    temperature.textContent = `${json.days[0].temp}°C`;

    const description = document.querySelector("#weather-description");
    description.textContent = json.description;

    const icon = document.querySelector("#weather-icon");
    const iconClass = getIcon(json.days[0].conditions);
    icon.className = `wi ${iconClass}`;
}

const getIcon = (condition) => {
    condition = condition.toLowerCase();

    if (condition.includes("clear")) return "wi-day-sunny";
    if (condition.includes("sun")) return "wi-day-sunny";
    if (condition.includes("cloud")) return "wi-cloudy";
    if (condition.includes("rain")) return "wi-rain";
    if (condition.includes("snow")) return "wi-snow";
    if (condition.includes("thunder")) return "wi-thunderstorm";

    return "wi-na";
}
