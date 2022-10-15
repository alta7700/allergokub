import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import useFormField from "../../hooks/useFormField";
import {
    emailFieldValidator, minLength8, min1lowercase, min1Uppercase, min1digit
} from "../../utils/Validators";
import Form from "./Form";
import {useLocation} from "react-router-dom";

const RegisterForm = () => {

    const {auth} = useContext(Context)
    const [registerSuccess, setRegisterSuccess] = useState(false)
    const location = useLocation();
    const [initFormStatus, setInitFormStatus] = useState([])

    const fields = {
        'email': {id:1, name: 'email', state: {...useFormField('')}, type: 'text', ph: 'Email', validators: [emailFieldValidator, ], autocomplete: 'username'},
        'password': {id:2, name: 'password', state: {...useFormField('')}, type: 'password', ph: 'Пароль', validators: [minLength8, min1lowercase, min1Uppercase, min1digit, password1EqualValidator], autocomplete: 'new-password', showErrorsList: true},
        'password2': {id:3, name: 'password2', state: {...useFormField('')}, type: 'password', ph: 'Подтвердите пароль', validators: [password2EqualValidator, ], autocomplete: 'new-password'},
    }

    function password1EqualValidator(value) {
        let pw2 = fields['password2'].state
        if (value !== pw2.value) {
            if (!('Пароли не совпадают' in pw2.errors))
                pw2.setErrors(['Пароли не совпадают'])
        } else {
            pw2.setErrors([])
        }
        return ''
    }

    function password2EqualValidator(value) {
        if (fields['password'].state.value !== value) {
            return 'Пароли не совпадают'
        }
        return ''
    }

    async function confirmForm() {
        const [status, data] = await auth.register(
            fields['email'].state.value.toLowerCase(),
            fields['password'].state.value,
            fields['password2'].state.value,
        );
        if (status === 201) {
            return {}
        } else {
            fields['password'].state.setValue('')
            fields['password'].state.setDirty(false)
            fields['password2'].state.setValue('')
            fields['password2'].state.setDirty(false)
            if (status === 400) {
                return data
            } else {
                return {commonResponse: 'Не удалось отправить письмо с подтверждением, проверьте введенный email или напишите в поддержку'}
            }
        }
    }

    useEffect(() => {
        let modal = location.state.loginModal
        if (modal.form === 'register') {
            setInitFormStatus(modal.initFormStatus)
        }
    }, [])

    return (
        registerSuccess
            ? <div className='login-form'><h3 className='form-status success'>
                Письмо для активации аккаунта было отправлено на почту {fields['email'].state.value}
                </h3></div>
            : <Form
                fields={fields}
                confirmFormAction={confirmForm}
                formClassName='login-form'
                onSuccess={() => setRegisterSuccess(true)}
                initFormStatus={initFormStatus}
            />
    );
};

export default RegisterForm;