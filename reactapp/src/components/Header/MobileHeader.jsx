import React, {useEffect, useState} from 'react';
import {CSSTransition} from "react-transition-group";
import {Link, NavLink, useHistory, useLocation} from "react-router-dom";

const MobileHeader = ({menuLinks, userLinks, isNotIndexPage}) => {

    const location = useLocation();
    const router = useHistory();
    const [mobMenuOpened, setMobMenuOpened] = useState(false)


    function scrollToContent() {
        window.scrollTo({
            top: document.getElementById('content').offsetTop - 60,
            behavior: 'smooth'
        })
    }

    useEffect(() => {
        if (mobMenuOpened) {
            setMobMenuOpened(false)
        }
    }, [location])

    return (
        <>
            <div className='mobile-header'>
                <CSSTransition
                    in={isNotIndexPage}
                    timeout={800}
                    classNames={{
                        enterActive: 'header-line to-non-index',
                        enterDone: 'header-line',
                        exitActive: 'header-line to-index',
                        exitDone: 'header-line index',
                    }}
                >
                    <div className="header-line">
                            <div className="back-btn" onClick={() => router.goBack()}/>
                            <div className="logo" onClick={() => {router.push('/');setMobMenuOpened(false)}}>
                                AllergoKub
                            </div>
                        <div className='menu-button-container' onClick={() => {setMobMenuOpened(!mobMenuOpened)}}>
                            <div className={mobMenuOpened ? 'menu-button mob-menu-opened' : 'menu-button'}/>
                        </div>
                    </div>
                </CSSTransition>
                <CSSTransition
                    in={mobMenuOpened}
                    timeout={300}
                    classNames={{
                        enterActive: 'nav-links dropping',
                        enterDone: 'nav-links dropped',
                        exitActive: 'nav-links rising',
                        exitDone: 'nav-links hidden',
                    }}
                >
                    <ul className="nav-links">
                        {([...userLinks, ...menuLinks]).map(item =>
                            <li
                                key={item.id}
                                className="nav-links-item"
                            >
                                {item.navLink
                                    ? <NavLink to={item.navLink}>{item.title}</NavLink>
                                    : <Link to={item.link}>{item.title}</Link>
                                }
                            </li>
                        )}
                    </ul>
                </CSSTransition>
            </div>
            <CSSTransition
                in={!isNotIndexPage}
                timeout={1000}
                classNames={{
                    enterActive: 'header-index-content expand',
                    enterDone: 'header-index-content entered',
                    exitActive: 'header-index-content collapse',
                }}
                mountOnEnter
                unmountOnExit
            >
                <div className="header-index-content">
                    <div className="title">AllergoKub</div>
                    <div className="tagline">
                        <p>Все о пыльце Краснодарского края и даже больше!<br/>Информационный сайт для аллергиков</p>
                    </div>
                    <div className="down-bounce-arrow" onClick={scrollToContent}/>
                </div>
            </CSSTransition>
        </>
    );
};

export default MobileHeader;