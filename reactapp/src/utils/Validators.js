export function notEmptyFieldValidator(value) {
    if (!value) {
        return 'Это поле не может быть пустым.'
    } else {
        return ''
    }
}

export function emailFieldValidator(value) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!re.test(String(value).toLowerCase())) {
        return 'Некорректный адрес электронной почты'
    } else {
        return ''
    }
}

export function positiveNumberValidator(value) {
    if (value < 1) {
        return 'Это число должно быть положительным'
    } else {
        return''
    }
}

export function minLength8(value) {
    const re = /.{8,}$/;
    if (!re.test(String(value))) {
        return 'Минимум 8 символов'
    }
    return ''
}

export function min1digit(value) {
    const re = /^(?=.*\d)/
    if (!re.test(String(value))) {
        return 'Минимум 1 цифра'
    }
    return ''
}

export function min1lowercase(value) {
    const re = /^((?=.*[a-z]))/
    if (!re.test(String(value))) {
        return 'Минимум 1 строчная латинская буква'
    }
    return ''
}

export function min1Uppercase(value) {
    const re = /^(?=.*[A-Z])/
    if (!re.test(String(value))) {
        return 'Минимум 1 прописная латинская буква'
    }
    return ''
}