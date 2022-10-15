import React, {useEffect}from "react";
import {useLocation} from "react-router-dom";
import {useContext, useState} from "react";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {useMediaQuery} from "react-responsive";
import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";

const SiteHeader = () => {

    const isMobile = useMediaQuery({query: '(max-width: 950px)'});
    const {auth} = useContext(Context);
    const [isNotIndexPage, setIsNotIndexPage] = useState(true);
    const location = useLocation();

    useEffect(() => {
        if (['/', ''].indexOf(location.pathname) === -1) {
            setIsNotIndexPage(true)
        } else {
            setIsNotIndexPage(false)
        }
    }, [location])


    const authUserMenu = [
        {id: 1, title: 'Личный кабинет', navLink: {pathname: '/profile/'}}
    ]
    const unauthUserMenu = [
        {id: 2, title: 'Войти', link: {pathname: location.pathname, state: {loginModal: {form: 'login'}}}}
    ]

    const navbar = [
        {id: 3, title: 'Новости', navLink: {pathname: '/news/'}},
        {id: 4, title: 'Аллергены', navLink: {pathname: '/allergens/'}},
        {id: 5, title: 'Наши проекты', navLink: {pathname: '/projects/'}},
        {id: 6, title: 'Контакты', navLink: {pathname: '/contacts/'}},
    ]

    return (
        <header>
            {isMobile
                ? <MobileHeader
                    menuLinks={navbar}
                    userLinks={auth.isAuth ? authUserMenu : unauthUserMenu}
                    isNotIndexPage={isNotIndexPage}
                />
                : <DesktopHeader
                    navbar={navbar}
                    user_menu={auth.isAuth ? authUserMenu : unauthUserMenu}
                    isNotIndexPage={isNotIndexPage}
                />
            }
        </header>
    );
};

export default observer(SiteHeader);