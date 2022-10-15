import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import { CustomProvider } from 'rsuite';
import ruRU from 'rsuite/locales/ru_RU';
import App from './App';
import AuthStore from "./store/AuthStore";
import {BrowserRouter} from "react-router-dom";

const auth = new AuthStore();

export const Context = createContext({
    auth,
})

ReactDOM.render(
    <CustomProvider locale={ruRU}>
        <Context.Provider value={{auth}}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Context.Provider>
    </CustomProvider>,
    document.getElementById('root')
);

