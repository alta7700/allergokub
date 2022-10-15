import React, {useState} from 'react';
import useFormField from "../../hooks/useFormField";
import {min1digit, min1lowercase, min1Uppercase, minLength8} from "../../utils/Validators";
import Form from "../Forms/Form";
import {User} from "../../API/DjangoAPI";

const PasswordChangeForm = ({currentEmail}) => {

    const [passwordChanged, setPasswordChanged] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const fields = {
        'email': {id: 1, name: 'email', state: {...useFormField(currentEmail)}, type: 'text', hidden: true, validators: [], autocomplete: 'username'},
        'current_password': {id: 2, name: 'current_password', state: {...useFormField('')}, type: 'password', ph: 'Старый пароль', validators: [minLength8, ], autocomplete: 'current-password'},
        'new_password': {id: 3, name: 'new_password', state: {...useFormField('')}, type: 'password', ph: 'Новый пароль', validators: [minLength8, min1lowercase, min1Uppercase, min1digit, password1EqualValidator], autocomplete: 'new-password', showErrorsList: true},
        're_new_password': {id: 4, name: 're_new_password', state: {...useFormField('')}, type: 'password', ph: 'Повторите новый пароль', validators: [password2EqualValidator, ], autocomplete: 'new-password'},
    }

    function password1EqualValidator(value) {
        let re_new_pw = fields['re_new_password'].state
        if (value !== re_new_pw.value) {
            if (!('Пароли не совпадают' in re_new_pw.errors))
                re_new_pw.setErrors(['Пароли не совпадают'])
        } else {
            re_new_pw.setErrors([])
        }
        return ''
    }

    function password2EqualValidator(value) {
        if (fields['new_password'].state.value !== value) {
            return 'Пароли не совпадают'
        }
        return ''
    }

    async function confirmForm() {
        const [status, data] = await User.changePassword(
            fields['current_password'].state.value,
            fields['new_password'].state.value,
            fields['re_new_password'].state.value,
        );
        if (status === 204) {
            setPasswordChanged(true)
            return {success: true, commonResponse: 'Пароль успешно изменен'}
        } else {
            if (data.non_field_error) {
                return {commonResponse: data.non_field_error}
            } else {
                return data
            }
        }
    }


    return (
        <div className='password-change'>
            {isSuccess
                ? <h3 className='success'>Пароль успешно изменен</h3>
                : <>
                    <h3>Изменить пароль</h3>
                    <Form
                        fields={fields}
                        confirmFormAction={confirmForm}
                        formClassName='password-change-form'
                        onSuccess={() => {if (passwordChanged) {setIsSuccess(true)}}}
                    />
                </>
            }
        </div>
    );
};

export default PasswordChangeForm;