import React from 'react';
import {Link, NavLink, useHistory} from "react-router-dom";
import Logo3D from "../Logo3D";
import {CSSTransition} from "react-transition-group";
import {siteUrl} from "../../API/DjangoAPI";


const DesktopHeader = ({navbar, user_menu, isNotIndexPage}) => {

    const router = useHistory();
    function scrollToContent() {
        window.scrollTo({
            top: document.getElementById('content').offsetTop,
            behavior: 'smooth'
        })
    }

    return (
        <div className="desktop-header">
            <div className='navbar'>
                <CSSTransition
                    in={isNotIndexPage}
                    timeout={1000}
                    classNames={{
                        enterActive: 'nav-line to-non-index',
                        enterDone: 'nav-line non-index',
                        exitActive: 'nav-line to-index',
                        exitDone: 'nav-line index',
                    }}
                >
                    <div className="nav-line">
                        <ul className='nav-links'>
                            {navbar.map(item =>
                                <li key={item.id} className="nav-links-item">
                                    {item.navLink
                                        ? <NavLink to={item.navLink}>{item.title}</NavLink>
                                        : <Link to={item.link}>{item.title}</Link>
                                    }
                                </li>
                            )}
                        </ul>
                        <img
                            src={`${siteUrl}/static/images/cube/ksma-logo.svg`}
                            className='nav-logo'
                            onClick={() => router.push('/')}
                        />
                        <ul className='nav-profile'>
                            {user_menu.map(item =>
                                <li key={item.id} className="item">
                                    {item.navLink
                                        ? <NavLink to={item.navLink}>{item.title}</NavLink>
                                        : <Link to={item.link}>{item.title}</Link>
                                    }
                                </li>
                            )}
                        </ul>
                    </div>
                </CSSTransition>
            </div>
            <CSSTransition
                in={!isNotIndexPage}
                timeout={1000}
                classNames={{
                    enterActive: 'header-content expand',
                    enterDone: 'header-content entered',
                    exitActive: 'header-content collapse',
                }}
                mountOnEnter
                unmountOnExit
            >
                <div className="header-content">
                    <div className="header-content-info">
                        <div className="organization">
                            <Logo3D/>
                            <div className="tagline">
                                <p>Все о пыльце Краснодарского края и даже больше!<br/>Информационный сайт для аллергиков</p>
                            </div>
                        </div>
                        <ul className='user-menu'>
                            {user_menu.map(item =>
                                <li key={item.id} className="menu-item">
                                    {item.navLink
                                        ? <NavLink to={item.navLink}>{item.title}</NavLink>
                                        : <Link to={item.link}>{item.title}</Link>
                                    }
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="down-bounce-arrow" onClick={scrollToContent}/>
                </div>
            </CSSTransition>
        </div>
    );
};

export default DesktopHeader;