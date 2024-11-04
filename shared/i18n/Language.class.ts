import {default as es} from './es.json';
import {default as en} from './en.json';

const messages: any = {
    es: es,
    en: en
};

export class Language {

    /**
     * Get current browser language
     */
    static getLocale(): string {
        const browserLanguage = navigator.language;
        const currentLanguage = browserLanguage.replace('-', '');

        if (messages.hasOwnProperty(currentLanguage)) {
            return browserLanguage;
        }

        const alternative = browserLanguage.split('-');
        if (messages.hasOwnProperty(alternative[0])) {
            return alternative[0];
        }

        return 'en';
    }

    /**
     * Messages from language
     */
    static messages() {
        return messages[this.getLocale()]
    }
}
