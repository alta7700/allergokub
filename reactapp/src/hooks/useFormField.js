import {useState} from "react";

export default function useFormField(initial) {
    const [value, setValue] = useState(initial)
    const [dirty, setDirty] = useState(false)
    const [errors, setErrors] = useState([])
    const [isValid, setIsValid] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    return {
        value: value, setValue: setValue,
        dirty: dirty, setDirty: setDirty,
        errors: errors, setErrors: setErrors,
        isValid: isValid, setIsValid: setIsValid,
        isFocused: isFocused, setIsFocused: setIsFocused,

    }
}
