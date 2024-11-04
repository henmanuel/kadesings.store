enum PassengerType {
    ADT = 'ADT', // Adult (over 12 years)
    CNN = 'CNN', // Child (between 2 and 11 years)
    INF = 'INF', // Infant (under 2 years, without occupying a seat)
    SRC = 'SRC', // Senior passenger
    UNN = 'UNN', // Unaccompanied minor
    MIL = 'MIL', // Active service military
    GVT = 'GVT', // Government traveler
    MIS = 'MIS'  // Missionary
}

enum CabinClass {
    P = 'P', // Premium First
    F = 'F', // First
    J = 'J', // Premium Business
    C = 'C', // Business
    S = 'S', // Premium Economy
    Y = 'Y'  // Economy
}

enum PreferLevel {
    Preferred = 'Preferred'
}

enum BaggageProvisionType {
    A = 'A',   // Checked baggage allowance
    C = 'C',   // Day of check-in charges
    B = 'B',   // Carry-on baggage allowance
    CC = 'CC', // Carry-on baggage charges
    E = 'E',   // Baggage embargo
    P = 'P',   // Prepaid checked baggage charges
    EE = 'EE'  // Generic embargo: No excess permitted
}

interface Location {
    IATA: string;
    city: string;
    name: string;
    country: string;
}

interface Baggage {
    RequestType: BaggageProvisionType;
    Description: boolean;
}

interface BaggageInfo {
    MaxStopsQuantity: number;
    Baggage: Baggage;
}

interface CabinPreference {
    Cabin: CabinClass;
    PreferLevel: PreferLevel;
}

export interface SabreAPII {
    originLocation: Location;
    destinationLocation: Location;
    departureDateTime: Date;
    returnDateTime: Date;
    passengerType: PassengerType;
    passengerCount: number;
    CabinPref?: CabinPreference;
    baggageInfo?: BaggageInfo;
}
