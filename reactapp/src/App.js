import React from "react";
import './styles/normalize.css';
import './styles/style.css';
import 'rsuite/dist/rsuite.min.css';
import SiteHeader from "./components/Header/SiteHeader";
import {Switch, Route, Redirect, useLocation} from "react-router-dom";
import Routes from "./routers/Routes";
import {observer} from "mobx-react-lite";
import {useContext, useEffect, useState} from "react";
import {Context} from "./index";
import Loader from "./components/Loader";
import LoginRegisterWindow from "./components/Forms/LoginRegisterWindow";
import {CSSTransition} from "react-transition-group";


function App() {

    const {auth} = useContext(Context)
    const [authChecked, setAuthChecked] = useState(false)
    const location = useLocation();

    useEffect(() => {
        (async () => {
            await auth.checkAuth();
            setAuthChecked(true);
        })()
    }, [])

    return (
        authChecked
            ? <>
                <SiteHeader/>
                <Switch>
                    {Routes.map(route =>
                        <Route key={route.id} path={route.path} exact={route.exact}>
                            <route.component {...route.props}/>
                        </Route>
                    )}
                    <Redirect to='/not-found/' />
                </Switch>
                <CSSTransition
                    in={Boolean(location?.state?.loginModal)}
                    timeout={500}
                    classNames={{
                        enterActive: 'login-register-window entering',
                        enterDone: 'login-register-window enter',
                        exitActive: 'login-register-window exiting',
                        exitDone: 'login-register-window exited',
                    }}
                    mountOnEnter
                    unmountOnExit
                >
                    <LoginRegisterWindow/>
                </CSSTransition>
            </>
            : <Loader/>
    )
}

export default observer(App);
