import * as fs from 'fs';// @ts-ignore
import airportsDataUrl from './airports.dat';

interface Airport {
    id: number;
    name: string;
    city: string;
    country: string;
    code: string;
    iata: string;
    latitude: number;
    longitude: number;
    altitude: number;
    timezone: string;
    continent: string;
    region: string;
    timezoneName: string;
    type: string;
}

export class Airports {
    private airports: Airport[];

    constructor() {
        this.airports = this.loadAirports(airportsDataUrl);
    }

    private loadAirports(filePath: string): Airport[] {
        const data = fs.readFileSync(filePath, 'utf-8');
        const lines = data.trim().split('\n');

        return lines.map(line => {
            const fields = line.split(',');

            return {
                id: parseInt(fields[0], 10),
                name: fields[1].replace(/^"|"$/g, ''),
                city: fields[2].replace(/^"|"$/g, ''),
                country: fields[3].replace(/^"|"$/g, ''),
                code: fields[4].replace(/^"|"$/g, ''),
                iata: fields[5].replace(/^"|"$/g, ''),
                latitude: parseFloat(fields[6]),
                longitude: parseFloat(fields[7]),
                altitude: parseInt(fields[8], 10),
                timezone: fields[9].replace(/^"|"$/g, ''),
                continent: fields[10].replace(/^"|"$/g, ''),
                region: fields[11].replace(/^"|"$/g, ''),
                timezoneName: fields[12].replace(/^"|"$/g, ''),
                type: fields[13].replace(/^"|"$/g, '')
            };
        });
    }

    public getAirports(): Airport[] {
        return this.airports;
    }

    public getCities(): string[] {
        const cities = this.airports.map(airport => airport.city);
        return [...new Set(cities)];
    }

    public getCityByIata(iata: string): string | null {
        const airport = this.airports.find(airport => airport.code === iata);
        return airport ? airport.city : null;
    }

    public getAirportByIata(iata: string): string | null {
        const airport = this.airports.find(airport => airport.code === iata);
        return airport ? airport.name : null;
    }

    public getCountryByIata(iata: string): string | null {
        const airport = this.airports.find(airport => airport.code === iata);
        return airport ? airport.country : null;
    }


}
