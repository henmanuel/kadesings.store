import axios, {AxiosResponse} from 'axios';
import {HttpRequest} from './HttpRequest.class';
import {SabreAPII} from '../interfaces/SabreAPI.interface';
import {AirlineInfoResponse, GroupedItineraryResponse} from '../../GDS/application/search/Sabre.interface';

export class SabreAPI {
    private readonly request: HttpRequest;
    private token: string | null = null;

    constructor() {
        this.request = new HttpRequest('https://api.cert.platform.sabre.com');
    }

    async authenticate(): Promise<void> {
        const credentials = 'VmpFNk0zQjZNekp6T0RsMlozVndibXg0WlRwRVJWWkRSVTVVUlZJNlJWaFU6UjNZNFZuSTNUM2c9';
        const data = 'grant_type=client_credentials';

        try {
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${credentials}`
            };

            const response = await this.request.post(data, 'v2/auth/token', headers);
            this.token = response.data.access_token;
        } catch (error) {
            console.error('Error al autenticar:', error);
            throw new Error('Error de autenticación');
        }
    }

    async searchLowFareOffers(searchData: SabreAPII): Promise<GroupedItineraryResponse> {
        if (!this.token) {
            throw new Error('Authentication error');
        }

        const travelPreferences: any = {};

        // Conditionally add CabinPref if provided
        if (searchData.CabinPref) {
            travelPreferences.CabinPref = [{
                Cabin: searchData.CabinPref.Cabin,
                PreferLevel: searchData.CabinPref.PreferLevel
            }];
        }

        // Conditionally add baggageInfo if provided
        if (searchData.baggageInfo) {
            travelPreferences.MaxStopsQuantity = searchData.baggageInfo.MaxStopsQuantity;
            travelPreferences.Baggage = {
                "RequestType": searchData.baggageInfo.Baggage.RequestType,
                "Description": searchData.baggageInfo.Baggage.Description
            };
        }

        const requestBody: any = {
            "OTA_AirLowFareSearchRQ": {
                "Version": "5",
                "POS": {
                    "Source": [
                        {
                            "PseudoCityCode": "NE82",
                            "RequestorID": {
                                "Type": "1",
                                "ID": "1",
                                "CompanyName": {
                                    "Code": "TN"
                                }
                            }
                        }
                    ]
                },
                "OriginDestinationInformation": [
                    {
                        "DepartureDateTime": searchData.departureDateTime,
                        "OriginLocation": {
                            "LocationCode": searchData.originLocation.IATA,
                        },
                        "DestinationLocation": {
                            "LocationCode": searchData.destinationLocation.IATA,
                        }
                    },
                    {
                        "DepartureDateTime": searchData.returnDateTime,
                        "OriginLocation": {
                            "LocationCode": searchData.destinationLocation.IATA
                        },
                        "DestinationLocation": {
                            "LocationCode": searchData.originLocation.IATA
                        }
                    }
                ],
                "TravelPreferences": travelPreferences,
                "TravelerInfoSummary": {
                    "AirTravelerAvail": [
                        {
                            "PassengerTypeQuantity": [
                                {
                                    "Code": searchData.passengerType,
                                    "Quantity": searchData.passengerCount
                                }
                            ]
                        }
                    ]
                },
                "TPA_Extensions": {
                    "IntelliSellTransaction": {
                        "RequestType": {
                            "Name": "50ITINS"
                        }
                    }
                }
            }
        };

        console.log('request ', requestBody)

        try {
            const headers = {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            };

            const response = await this.request.post(JSON.stringify(requestBody), 'v5/offers/shop', headers);
            return response.data.groupedItineraryResponse;
        } catch (error) {
            console.error('Error al buscar tarifas bajas:', error);
            throw new Error('Error al buscar tarifas bajas');
        }
    }

    async searchAirlineLookup(airlineCode: string): Promise<AirlineInfoResponse> {
        if (!this.token) {
            throw new Error('No estás autenticado. Llama al método authenticate() primero.');
        }

        if (!airlineCode || typeof airlineCode !== 'string') {
            throw new Error('El código de aerolínea no es válido.');
        }

        const url = `https://api.cert.platform.sabre.com/v1/lists/utilities/airlines?airlinecode=${encodeURIComponent(airlineCode)}`;
        try {
            const headers = {
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json'
            };

            const response: AxiosResponse = await axios.get(url, {headers});
            if (response.status !== 200) {
                console.error(`Error en la búsqueda de aerolínea: ${response.statusText}`);
                throw new Error(`Error en la búsqueda de aerolínea: ${response.statusText}`);
            }

            return response.data.AirlineInfo[0];
        } catch (error: any) {
            if (error.response) {
                console.error('Error en la respuesta de la API:', error.response.data);
                console.error('Código de estado:', error.response.status);
            } else {
                console.error('Error en la solicitud:', error.message);
            }

            throw new Error('Error al buscar información de la aerolínea');
        }
    }
}
