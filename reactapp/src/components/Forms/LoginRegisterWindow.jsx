import React, {useEffect, useState} from 'react';
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import PasswordResetForm from "./PasswordResetForm";
import {CSSTransition, SwitchTransition} from "react-transition-group";
import {useHistory, useLocation} from "react-router-dom";

const LoginRegisterWindow = () => {

    const router = useHistory();
    const location = useLocation();

    const [formsPosition, setFormsPosition] = useState({
        center: {form: 'login', fromSide: ''},
        left: {form: 'reset', fromSide: ''},
        right: {form: 'register', fromSide: ''},
    })

    const loginAfterField = (
        <div className="reg-and-reset">
            <p onClick={() => changeFormsPosition('reset')}>Забыли пароль?</p>
            <p onClick={() => changeFormsPosition('register')}>Всё ещё нет аккаунта?</p>
        </div>
    )

    const forms = {
        'login': {
            title: 'Войти',
            form: <LoginForm afterFields={loginAfterField}/>,
            svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><g><path d="M18.495307207107544,13.100002264976501 a1,1 0 0 0 -1.34,0.45 A8,8 0 1 1 9.995307207107544,2.0000022649765015 a7.93,7.93 0 0 1 7.16,4.45 a1,1 0 0 0 1.8,-0.9 a10,10 0 1 0 0,8.9 A1,1 0 0 0 18.495307207107544,13.100002264976501 zM18.995307207107544,9.000002264976501 H9.405307207107544 l2.3,-2.29 a1,1 0 1 0 -1.42,-1.42 l-4,4 a1,1 0 0 0 -0.21000000000000002,0.33000000000000007 a1,1 0 0 0 0,0.7600000000000001 a1,1 0 0 0 0.21000000000000002,0.33000000000000007 l4,4 a1,1 0 0 0 1.42,0 a1,1 0 0 0 0,-1.42 L9.405307207107544,11.000002264976501 H18.995307207107544 a1,1 0 0 0 0,-2 z"/></g></svg>,
        },
        'register': {
            title: 'Регистрация',
            form: <RegisterForm/>,
            svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45.402 45.402"><g><path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141   c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27   c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435   c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"/></g></svg>,
        },
        'reset': {
            title: 'Восстановить',
            form: <PasswordResetForm/>,
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="35px" height="35px" viewBox="-64 0 512 512"><path d="M202.021 0C122.202 0 70.503 32.703 29.914 91.026c-7.363 10.58-5.093 25.086 5.178 32.874l43.138 32.709c10.373 7.865 25.132 6.026 33.253-4.148 25.049-31.381 43.63-49.449 82.757-49.449 30.764 0 68.816 19.799 68.816 49.631 0 22.552-18.617 34.134-48.993 51.164-35.423 19.86-82.299 44.576-82.299 106.405V320c0 13.255 10.745 24 24 24h72.471c13.255 0 24-10.745 24-24v-5.773c0-42.86 125.268-44.645 125.268-160.627C377.504 66.256 286.902 0 202.021 0zM192 373.459c-38.196 0-69.271 31.075-69.271 69.271 0 38.195 31.075 69.27 69.271 69.27s69.271-31.075 69.271-69.271-31.075-69.27-69.271-69.27z"/></svg>,
        },
    }

    function getPositionByName(form) {
        for (let pos of Object.keys(formsPosition)) {
            if (formsPosition[pos].form === form) {
                return pos + (formsPosition[pos].fromSide)
            }
        }
    }

    function changeFormsPosition(form) {
        let central = formsPosition['center'].form
        let newPositions = {}
        if (!(form === central)) {
            if (form === formsPosition['left'].form) {
                newPositions['center'] = {form: formsPosition['left'].form, fromSide: ' from-left'}
                newPositions['left'] = {form: central, fromSide: ''}
                newPositions['right'] = {form: formsPosition['right'].form, fromSide: ''}
            } else {
                newPositions['center'] = {form: formsPosition['right'].form, fromSide: ' from-right'}
                newPositions['right'] = {form: central, fromSide: ''}
                newPositions['left'] = {form: formsPosition['left'].form, fromSide: ''}
            }
            setFormsPosition(newPositions)
        }
    }

    function closeModalWindow(event) {
        if (!event || event.code === 'Escape') {
            router.push(location.pathname, undefined)
        }
    }

    useEffect(() => {
        let initForm = location.state.loginModal
        if (initForm.form !== formsPosition.center.form) {
            changeFormsPosition(initForm.form)
        }
        document.addEventListener('keydown', closeModalWindow)
        return () => {
            document.removeEventListener('keydown', closeModalWindow)
        }
    }, [])

    return (
        <div className='login-register-window'>
            <div className='modal-background' onClick={() => closeModalWindow(null)}/>
            <div className='formset'>
                <div className="form-types">
                    {Object.entries(forms).map(([id, form], i) =>
                        <div
                            key={id}
                            className={`form-types-item ${getPositionByName(id)}`}
                            onClick={() => changeFormsPosition(id)}
                        >
                            <div className="ico">{form.svg}</div>
                            <p>{form.title}</p>
                        </div>
                    )}
                </div>
                <SwitchTransition mode={'out-in'}>
                    <CSSTransition
                        key={formsPosition['center'].form}
                        timeout={400}
                        className={'login-form'}
                    >
                        {forms[formsPosition['center'].form].form}
                    </CSSTransition>
                </SwitchTransition>
            </div>
        </div>
    );
};

export default LoginRegisterWindow;