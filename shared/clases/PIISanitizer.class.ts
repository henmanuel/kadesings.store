import { CompositeRedactorOptions, SyncRedactor } from 'redact-pii';
import { SyncCustomRedactorConfig } from 'redact-pii/lib/types';
import { Airports } from './Airports.class';
import {emailAddress} from "redact-pii/src/built-ins/simple-regexp-patterns";

interface IPIISanitizer {
    redact(text: string): string;
    restore(text: string): string;
}

interface PIIData {
    value: string;
    type: 'name' | 'number' | 'other';
}

export class PIISanitizer implements IPIISanitizer {
    private redactor: SyncRedactor;
    private piiMap: Map<string, PIIData>;
    private airports: Airports;

    constructor() {
        const options: CompositeRedactorOptions<SyncCustomRedactorConfig> = {
            globalReplaceWith: 'PII',
            builtInRedactors: {
                emailAddress: { enabled: false }
            },
            customRedactors: {
                before: [
                    {
                        regexpPattern: /\b[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\b/g,
                        replaceWith: 'PII_NAMES'
                    },
                    {
                        regexpPattern: /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,
                        replaceWith: 'PII_DATES'
                    },
                    {
                        regexpPattern: /\b\d+\b/g,
                        replaceWith: 'PII_NUMBERS'
                    }
                ]
            }
        };

        this.redactor = new SyncRedactor(options);
        this.piiMap = new Map();
        this.airports = new Airports();
    }

    private generateUniqueId(value: string, type: string): string {
        return `${type}_${this.piiMap.size + 1}`;
    }

    private replaceUnderscores(text: string): string {
        const regex = /__([^_]+)__/g;
        return text.replace(regex, '$1');
    }

    private getIdForValue(value: string, type: 'name' | 'number' | 'other'): string {
        if (!this.piiMap.has(value)) {
            const id = this.generateUniqueId(value, type);
            this.piiMap.set(id, { value, type });
            return id;
        }
        return Array.from(this.piiMap.entries()).find(([, data]) => data.value === value)?.[0] || '';
    }

    public escapeCities(text: string): string {
        let updatedText = text;
        const lowerCaseText = text.toLowerCase().normalize('NFD');
        for (const city of this.airports.getCities()) {
            if (city.trim() === '') {
                continue;
            }
            const escapedCityName = city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').normalize('NFD');
            const regex = new RegExp(`\\b${escapedCityName}\\b`, 'i');
            if (regex.test(lowerCaseText)) {
                updatedText = updatedText.replace(regex, city);
            }
        }
        return updatedText;
    }

    public redact(text: string): string {
        const escapedCitiesText: string = this.escapeCities(text);
        let redactedEscapedText: string = this.redactor.redact(escapedCitiesText);
        redactedEscapedText = this.updatePiiMap(redactedEscapedText, escapedCitiesText);
        return this.replaceUnderscores(redactedEscapedText);
    }

    private updatePiiMap(redactedText: string, originalText: string): string {
        const types = ['PII_NAMES', 'PII_NUMBERS'];
        let updatedText = redactedText;

        types.forEach((type) => {
            const regex = new RegExp(type, 'g');
            let match;
            while ((match = regex.exec(redactedText)) !== null) {
                const start = match.index;
                const originalSubstring = originalText.substring(start, regex.lastIndex);
                const id = this.getIdForValue(originalSubstring, this.getTypeFromRedacted(type));
                updatedText = updatedText.replace(match[0], id);
            }
        });

        return updatedText;
    }

    private getTypeFromRedacted(redactedType: string): 'name' | 'number' | 'other' {
        switch (redactedType) {
            case 'PII_NAMES':
                return 'name';
            case 'PII_NUMBERS':
                return 'number';
            default:
                return 'other';
        }
    }

    public restore(text: string): string {
        let restoredText: string = text;
        for (const [id, data] of this.piiMap.entries()) {
            restoredText = restoredText.replace(new RegExp(id, 'g'), data.value);
        }
        this.clearMap();
        return restoredText;
    }

    private clearMap(): void {
        this.piiMap.clear();
    }
}
