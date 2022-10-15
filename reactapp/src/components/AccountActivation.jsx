import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useParams} from "react-router-dom";
import Loader from "./Loader";
import {Context} from "../index";


const AccountActivation = () => {

    const {auth} = useContext(Context)
    const params = useParams();
    const router = useHistory();
    const [accountActivated, setAccountActivated] = useState(false);
    const [error, setError] = useState('')

    useEffect(() => {
        if (auth.isAuth) {
            router.push('/profile/', null)
        }
        else {
            setTimeout(async () => {
                let status = await auth.activateAccount(params.uid, params.token)
                if (status) {
                    if (status === 204) {
                        setAccountActivated(true)
                    } else if (status === 400) {
                        setError('Ссылка недействительна')
                    } else if (status === 403) {
                        setError('Пользователь был активирован или ссылка устарела ')
                    }
                } else {
                    setError('Ошибка сервера, пожалуйста, попробуйте позже')
                }
            }, 2000)
        }
    }, [])

    useEffect(() => {
        if (accountActivated) {
            router.push('/', {loginModal: {form: 'login', initFormStatus: ['success', 'Аккаунт успешно активирован, теперь Вы можете авторизоваться']}})
        }
    }, [accountActivated])

    return (
        <div className='content'>
            <h2>{error ? error : 'Активирую...'}</h2>
            {!accountActivated && !error && <Loader/>
            }
        </div>
    );
};

export default AccountActivation;