import axios from "axios";
import env from "../misc/env";

export type Forecast = {
    timestamp: number;
    temperature: number;
    humidity: number;
}

export class WeatherProvider {
    constructor(
        private readonly apiKey: string,
    ) {}

    public async getForecast(zipcode: string): Promise<Forecast[]> {
        const coordinates = await this.getCoordinates(zipcode);

        if (!coordinates) {
            return [];
        }
       return await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`)
        .then((response) =>
            response.data.list.map((item: any) => ({
                timestamp: item["dt"] * 1000,
                temperature: (item["main"]["temp"] - 273.15).toFixed(2),
                humidity: item["main"]["humidity"],
            }))
        )
        .catch((error) => {
            console.log(error);
            return [];
        });
    }

    private async getCoordinates(zipcode: string): Promise<{ lat: string; lon: string } | void> {
        try {
            let response = await axios.get(`http://api.openweathermap.org/geo/1.0/zip?zip=${zipcode}&appid=${this.apiKey}`);
            const {data} = response;
            const {lat, lon} = data;
            return {lat, lon};
        } catch (error) {
            console.log(error);
        }
    }
}

let weatherProvider: WeatherProvider;

export const getWeather = async (zipcode: string) =>
{
    if (!weatherProvider) {
        weatherProvider = new WeatherProvider(env.openWeatherApiKey);
    }

    return await weatherProvider.getForecast(zipcode);
}
