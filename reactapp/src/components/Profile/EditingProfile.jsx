import React, {useState, useEffect} from 'react';
import useFormField from "../../hooks/useFormField";
import {positiveNumberValidator} from "../../utils/Validators";

const EditingProfile = ({userFields, allFields, updatePrivate, setIsEditing}) => {

    const [changeResult, setChangeResult] = useState({result: '', text: ''})
    const editFields = {
        first_name: {state: {...useFormField('')}, type: 'text', ph: 'Имя', validators: [], blank: true},
        last_name: {state: {...useFormField('')}, type: 'text', ph: 'Фамилия', validators: [], blank: true},
        age: {state: {...useFormField(0)}, type: 'number', ph: 'Возраст', validators:[positiveNumberValidator,], blank: true},
    }

    useEffect(() => {
        Object.entries(userFields).map(([fieldName, value], i) =>
            editFields[fieldName]
                ? editFields[fieldName].state.setValue(value)
                : null
        )
    }, [userFields])

    async function submitForm(e) {
        e.preventDefault()
        let isEqual = true
        for (let fieldName of Object.keys(userFields)) {
            if (editFields[fieldName] && editFields[fieldName].state.value !== userFields[fieldName]) {
                isEqual = false
                break
            }
        }
        if (editFields.age.state.value < 0) {
            setChangeResult({result: 'error', text: 'Возраст не может быть отрицательным'})
            return
        }
        if (!isEqual) {
            const result = await updatePrivate([
                editFields.first_name.state.value.toString(),
                editFields.last_name.state.value.toString(),
                editFields.age.state.value !== 0 ? Number(editFields.age.state.value) : null
            ])
            setChangeResult(result)
            if (result.result === 'success') {
                setIsEditing(false)
            }
        } else {
            setChangeResult({result: 'error', text: 'Ни одно поле не было изменено'})
        }
    }

    return (
        <div className='edit-profile'>
            {changeResult.text && <span className={changeResult.result}>{changeResult.text}</span>}
            <form className="edit-profile-form" onSubmit={submitForm}>
                {Object.entries(userFields).map(([fieldName, value], i) =>
                    <React.Fragment key={fieldName}>
                        {allFields[fieldName]
                            ? <>
                                <p className='field-name'>{allFields[fieldName]}:</p>
                                {editFields[fieldName]
                                    ? <input
                                        name={fieldName}
                                        onChange={e => editFields[fieldName].state.setValue(e.target.value)}
                                        value={editFields[fieldName].state.value ? editFields[fieldName].state.value : ''}
                                        type={editFields[fieldName].type}
                                        className='value-input'
                                    />
                                    : <p className='read-only-value'>{value}</p>
                                }
                            </>
                            : null
                        }
                    </React.Fragment>
                )}
                <input type='submit' className='submit' value='Сохранить'/>
            </form>
        </div>
    );
};

export default EditingProfile;