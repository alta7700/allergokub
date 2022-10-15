import React, {useContext, useEffect, useState} from 'react';
import useFormField from "../../hooks/useFormField";
import {emailFieldValidator} from "../../utils/Validators";
import Form from "./Form";
import {Context} from "../../index";
import {useLocation} from "react-router-dom";

const PasswordResetForm = () => {

    const {auth} = useContext(Context);
    const fields = {
        'email': {id:1, name: 'email', state: {...useFormField('')}, type: 'text', ph: 'Email', validators: [emailFieldValidator, ], autocomplete: 'username'},
    };
    const location = useLocation();
    const [initFormStatus, setInitFormStatus] = useState([])

    async function confirmForm() {
        const [status, data] = await auth.sendEmailResetPassword(
            fields.email.state.value.toLowerCase(),
        )
        if (status === 204) {
            return {
                status: 'success',
                commonResponse: 'Письмо для создания нового пароля было отправлено на указанный Email',
            }
        } else {
            if (data.non_field_error) {
                return {commonResponse: data.non_field_error}
            } else {
                return data
            }
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
            onSuccess={() => null}
            initFormStatus={initFormStatus}
        />
    );
};

export default PasswordResetForm;