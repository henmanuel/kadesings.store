import React from 'react';
import { Routes } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { Store } from '../../store/Store';
import { Language } from 'shared/i18n/Language.class';
import { BrowserRouter as Router } from 'react-router-dom';

export const App = (props: { children: React.ReactNode }) => {
    return (
        <IntlProvider locale={Language.getLocale()} messages={Language.messages()}>
            <Store>
                <Router>
                    <Routes>
                        {props.children}
                    </Routes>
                </Router>
            </Store>
        </IntlProvider>
    );
};
