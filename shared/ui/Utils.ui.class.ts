import {UIEvent} from 'react';
import {notification} from 'antd';
import pdfMake from 'pdfmake/build/pdfmake';
import {TDocumentDefinitions} from 'pdfmake/interfaces';

type NotificationIconType = 'success' | 'info' | 'warning' | 'error' | 'open';

export class UtilsUi {
    /**
     * Display a notification message
     * @param type
     * @param title
     * @param message
     */
    static showNotificationMessage = (type: NotificationIconType, title: string, message: string) => {
        notification[type]({
            message: `${title}`,
            description: `${message}`,
        });
    };

    /**
     * Get all pages of a web page.
     *
     * @param headerInfo
     * @param pdfName
     * @param document
     */
    static savePages = (headerInfo: string, pdfName: string, document: any) => {
        const tableHeaderText = [...document.querySelectorAll('thead tr th')].map(thElement => ({
            text: thElement.textContent,
            style: 'tableHeader'
        }));
        const tableRowCells = [...document.querySelectorAll('tbody tr td')].map((tdElement: any) => ({
            text: tdElement.textContent,
            style: 'tableData'
        }));
        const tableDataAsRows = tableRowCells.reduce((rows: any[], cellData, index) => {
            if (index % 5 === 0) {
                rows.push([]);
            }

            rows[rows.length - 1].push(cellData);
            return rows;
        }, []);

        const docDefinition: TDocumentDefinitions = {
            header: {text: headerInfo, alignment: 'center'},
            footer: function (currentPage, pageCount) {
                return ({text: `Page ${currentPage} of ${pageCount}`, alignment: 'center'});
            },
            content: [
                {
                    style: 'tableExample',
                    table: {
                        headerRows: 1,
                        body: [
                            tableHeaderText,
                            ...tableDataAsRows,
                        ]
                    },
                    layout: {
                        fillColor: function (rowIndex) {
                            if (rowIndex === 0) {
                                return '#0f4871';
                            }
                            return (rowIndex % 2 === 0) ? '#f2f2f2' : null;
                        }
                    },
                },
            ],
            styles: {
                tableExample: {
                    margin: [0, 20, 0, 80],
                },
                tableHeader: {
                    margin: 12,
                    color: 'white',
                },
                tableData: {
                    margin: 12,
                },
            }
        };

        pdfMake.createPdf(docDefinition).download(pdfName);
    }

    /**
     * Handle ui Event Scroll
     * @param event
     * @return Boolean
     */
    static handleUIEventScroll = (event: UIEvent<HTMLDivElement>) => {
        const {scrollTop, scrollHeight, clientHeight}: any = event.currentTarget;
        if (scrollTop + clientHeight === scrollHeight) {
            return true;
        } else if (scrollTop === 0) {
            return false;
        }
    }

    /**
     * Move to scroll
     * @param scrolling
     */
    static moveToScroll = (scrolling: Boolean) => {
        const pageScroll: any = document.querySelector(!scrolling ? '#page-bottom' : '#page-top');
        const scrollTo: any = document.querySelector(!scrolling ? '#scroll-to-bottom' : '#scroll-to-top');
        if (scrollTo) {
            scrollTo.addEventListener('click', () => pageScroll.scrollIntoView());
        }
    }

    /**
     * Open link in new tab
     * @param url
     */
    static openNewTab(url: string) {
        if (url) {
            const check = window.open(url, '_blank');
            if (check) {
                check.focus()
            }
        }
    }
}
