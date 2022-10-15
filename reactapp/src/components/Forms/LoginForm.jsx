import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import useFormField from "../../hooks/useFormField";
import Form from "./Form";
import {emailFieldValidator, minLength8} from "../../utils/Validators";
import {useHistory, useLocation} from "react-router-dom";


const LoginForm = ({afterFields}) => {

    const {auth} = useContext(Context);
    const router = useHistory();
    const location = useLocation();
    const [initFormStatus, setInitFormStatus] = useState([])

    const fields = {
        'email': {id:1, name: 'email', state: {...useFormField('')}, type: 'text', ph: 'Email', validators: [emailFieldValidator, ], autocomplete: 'username'},
        'password': {id:2, name: 'password', state: {...useFormField('')}, type: 'password', ph: 'Пароль', validators: [minLength8, ], autocomplete: 'current-password'},
    }

    async function confirmForm() {
        const [status] = await auth.login(
                fields['email'].state.value.toLowerCase(),
                fields['password'].state.value,
            );
        if (status === 200) {
            return {}
        } else if (status === 401) {
            return {commonResponse: 'Не удаётся войти. Пожалуйста, проверьте правильность написания логина и пароля.'}
        } else {
            return {commonResponse: 'Не удалось авторизоваться (ошибка сервера).'}
        }
    }

    useEffect(() => {
        let modal = location.state.loginModal
        if (modal.form === 'login') {
            setInitFormStatus(modal.initFormStatus)
        }
    }, [])

    return (
        <Form
            fields={fields}
            confirmFormAction={confirmForm}
            formClassName='login-form'
            onSuccess={() => {if (auth.isAuth) {router.push('/profile/'); router.location.reload()}}}
            afterFields={afterFields}
            initFormStatus={initFormStatus}
        />
    );
};

export default LoginForm;