const URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline"

const getWeatherLocation = async (location) => {
    try {
        const response = await fetch(`${URL}/${location}?key=${process.env.API_KEY}&unitGroup=metric`, { mode: "cors" });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
}


export { getWeatherLocation };
