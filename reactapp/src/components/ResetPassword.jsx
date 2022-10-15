import React, {useContext, useEffect, useState} from 'react';
import Loader from "./Loader";
import useFormField from "../hooks/useFormField";
import {min1digit, min1lowercase, min1Uppercase, minLength8} from "../utils/Validators";
import {useParams} from "react-router-dom";
import Form from "./Forms/Form";
import {Context} from "../index";

const ResetPassword = () => {

    const params = useParams()
    const {auth} = useContext(Context)

    const fields = {
        'new_password': {id: 2, name: 'new_password', state: {...useFormField('')}, type: 'password', ph: 'Новый пароль', validators: [minLength8, min1lowercase, min1Uppercase, min1digit, newPasswordEqualValidator], autocomplete: 'new-password', showErrorsList: true},
        're_new_password': {id: 3, name: 're_new_password', state: {...useFormField('')}, type: 'password', ph: 'Повторите новый пароль', validators: [reNewPasswordEqualValidator, ], autocomplete: 'new-password'},
    }

    function newPasswordEqualValidator(value) {
        let re_new_pw = fields['re_new_password'].state
        if (value !== re_new_pw.value) {
            if (!('Пароли не совпадают' in re_new_pw.errors))
                re_new_pw.setErrors(['Пароли не совпадают'])
        } else {
            re_new_pw.setErrors([])
        }
        return ''
    }

    function reNewPasswordEqualValidator(value) {
        if (fields['new_password'].state.value !== value) {
            return 'Пароли не совпадают'
        }
        return ''
    }

    async function confirmForm() {
        const [status, data] = await auth.resetPassword(
            params.uid,
            params.token,
            fields['new_password'].state.value,
            fields['re_new_password'].state.value,
        );
        if (status === 204) {
            return {success: true, commonResponse: 'Пароль успешно изменен, теперь Вы можете авторизоваться'}
        } else {
            if (data.non_field_error) {
                return {commonResponse: data.non_field_error}
            } else if (data.token) {
                return {commonResponse: 'Неверная ссылка'}
            } else {
                return data
            }
        }
    }

    return (
        <div className='content'>
            <div className="password-change">
                <Form
                    fields={fields}
                    formClassName='password-change-form'
                    initFormStatus={['', 'Введите новый пароль']}
                    confirmFormAction={confirmForm}
                    onSuccess={() => null}
                />
            </div>
        </div>
    );
};

export default ResetPassword;