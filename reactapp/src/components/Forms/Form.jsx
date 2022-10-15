import React, {useEffect, useState} from 'react';
import {notEmptyFieldValidator} from "../../utils/Validators";
import Loader from "../Loader";

const Form = ({fields, confirmFormAction, formClassName, afterFields, onSuccess, initFormStatus}) => {

    const [passwordClosed, setPasswordClosed] = useState(true)
    const [formStatus, setFormStatus] = useState([])
    const [isResponseLoading, setIsResponseLoading] = useState(false)

    useEffect(() => {
        if (initFormStatus) {
            setFormStatus(initFormStatus)
        }
    }, [initFormStatus])

    function validateField(value, field) {
        field.state.setValue(value);
        let errorsList = [];
        let errorText = '';
        for (const validator of (field.blank ? field.validators : [notEmptyFieldValidator, ...field.validators])) {
            errorText = validator(value);
            if (errorText) {
                errorsList.push(errorText)
                if (!field.showErrorsList) {
                    break
                }
            }
        }
        field.state.setErrors(errorsList);
        return errorsList
    }

    function blurHandler(value, field) {
        field.state.setIsFocused(false)
        if (!field.state.dirty) {
            field.state.setDirty(true)
        }
        validateField(value, field)
    }

    function formIsValid() {
        let isValid = true
        for (let field of Object.values(fields)) {
            let errorsList = validateField(field.state.value, field)
            if (errorsList.length > 0) {isValid = false}
        }
        return isValid
    }

    async function confirmForm(e) {
        e.preventDefault()
        setIsResponseLoading(true);
        // если что-то и возвращается, то только ошибки
        if (formIsValid()) {
            let fieldsErrors = await confirmFormAction()
            if (Object.keys(fieldsErrors).length > 0) {
                if (fieldsErrors['commonResponse']) {
                    setFormStatus([fieldsErrors.success ? ' success-status' : ' error-status', fieldsErrors['commonResponse']])
                } else {
                    setFormStatus([' error-status', 'Исправьте ошибки в полях'])
                    for (let [fieldName, fieldErrors] of Object.entries(fieldsErrors)) {
                        if (fields[fieldName]) {
                            fields[fieldName].state.setErrors(fieldErrors)
                        }
                    }
                }
            }
        } else {
            for (let field of Object.values(fields)) {
                if (!field.state.dirty) {field.state.setDirty(true)}
            }
        }
        setIsResponseLoading(false)
        onSuccess()
    }

    return (
        <form className={formClassName} onSubmit={e => confirmForm(e)}>
            {formStatus.length > 0 ? <h3 className={`form-status${formStatus[0]}`}>{formStatus[1]}</h3> : null}
            {isResponseLoading && <Loader/>}
            {Object.values(fields).map(field =>
                <div key={field.id} className="field" style={field.hidden && {display: "none"}}>
                    <input
                        disabled={isResponseLoading}
                        style={!field.state.dirty
                            ? {}
                            : field.state.errors.length === 0
                                ? {borderColor: 'green'}
                                : {borderColor: 'red'}
                        }
                        name={field.name}
                        onChange={e => validateField(e.target.value, field)}
                        value={field.state.value}
                        onFocus={() => field.state.setIsFocused(true)}
                        onBlur={e => blurHandler(e.target.value, field)}
                        type={field.type !== 'password'
                            ? field.type
                            : passwordClosed
                                ? 'password'
                                : 'text'
                        }
                        autoComplete={field.autocomplete ? field.autocomplete : "off"}
                        placeholder={field.ph}
                    />
                    {field.type === 'password' &&
                        <div className='password-eye' onClick={() => setPasswordClosed(!passwordClosed)}>
                            <div className={passwordClosed ? 'eye-line painted' : 'eye-line'}/>
                        </div>
                    }
                    {field.state.dirty && field.state.errors.length > 0 && <ul
                        className={`error${field.state.isFocused ? ' dialog': ''}`}
                        id={`${formClassName}-${field.name}-errors`}>
                        {field.state.errors && field.state.errors.map(error =>
                            <li key={error}>❗ <i>{error}</i></li>
                        )}
                    </ul>}
                </div>
            )}
            <input type='submit' className='confirm' value='Подтвердить'/>
            {afterFields && afterFields}
        </form>
    );
};

export default Form;