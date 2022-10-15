export function textSplitter(splittedText, splitter = '\r\n') {
    let pars = [];
    let i= 1;
    for (let par of splittedText.split(splitter)) {
        if (par) {
            pars.push({
                id: i,
                text: par
            })
            i++
        }
    }
    return pars
}

export function addPosition(list) {
    let i = 1;
    for (let dict of list) {
        dict['pos'] = i
        i++
    }
    return list
}

export function capitaliseString(str) {
    return str.trim().toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

export function removeArrayPart(fullArray, part) {
    return fullArray.filter(e => !~part.indexOf(e))
}

export function getRiskLevel(risk, dontShowPercents=true) {
    let level = ''
    if (risk < 20) {
        level = 'низкий'
    } else if (risk < 50) {
        level = `средний`
    } else if (risk < 80) {
        level = `высокий`
    } else {
        level = `очень высокий`
    }

    if (dontShowPercents) {
        return level
    } else {
        return (`${level}(${risk}%)`)
    }
}