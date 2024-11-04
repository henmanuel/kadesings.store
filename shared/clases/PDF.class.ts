import {HttpRequest} from './HttpRequest.class';
import {PDFInterface} from '../interfaces/PDF.interface';

export class PDF implements PDFInterface {

    /**
     * Get PDF from html template
     * @param urlToPdf
     */
    async getPdf(urlToPdf: string): Promise<any> {
        const httpRequest = new HttpRequest('http://3.126.83.34:8000');
        try {
            const response = await httpRequest.post({ url: urlToPdf }, 'convert-url-to-pdf');
            return response.data.pdf_base64;
        } catch (error) {
            console.error('Error PDF Generator', error);
        }
    }
}
