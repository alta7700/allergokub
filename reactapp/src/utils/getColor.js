const green = {r: 7, g: 220, b: 0}
const yellow = {r: 224, g: 255, b: 26}
const orange = {r: 255, g: 129, b: 0}
const red = {r: 210, g: 0, b: 0}
const vinous = {r: 134, g: 0, b: 0}


function gradientDecorator() {
    let width, height, gradient;
    function wrapper(ctx, chartArea, data, allergen) {
        const chartWidth = chartArea.right - chartArea.left;
        const chartHeight = chartArea.bottom - chartArea.top;
        if (!gradient || width !== chartWidth || height !== chartHeight) {
            width = chartWidth;
            height = chartHeight;
            gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);

            if (data.length === 0) {return}
            let maxValue = data.reduce((prev, cur) => prev.value > cur.value ? prev : cur).value;
            gradient.addColorStop(0, getRGB(green));

            if (maxValue <= allergen.low) {
                gradient.addColorStop(1, getRGB(yellow));
            } else if (maxValue <= allergen.middle) {
                let ratio = (maxValue - allergen.low) / (allergen.middle - allergen.low);
                gradient.addColorStop(allergen.low / maxValue, getRGB(yellow));
                gradient.addColorStop(1, calcColor(yellow, orange, ratio));
            } else if (maxValue <= allergen.high) {
                let ratio = (maxValue - allergen.middle) / (allergen.high - allergen.middle)
                gradient.addColorStop(allergen.low / maxValue, getRGB(yellow));
                gradient.addColorStop(allergen.middle / maxValue, getRGB(orange));
                gradient.addColorStop(1, calcColor(orange, red, ratio));
            } else if (maxValue <= allergen.very_high) {
                let ratio = (maxValue - allergen.high) / (allergen.very_high - allergen.high)
                gradient.addColorStop(allergen.low / maxValue, getRGB(yellow));
                gradient.addColorStop(allergen.middle / maxValue, getRGB(orange));
                gradient.addColorStop(allergen.high / maxValue, getRGB(red));
                gradient.addColorStop(1, calcColor(red, vinous, ratio));
            } else {
                gradient.addColorStop(allergen.low / maxValue, getRGB(yellow));
                gradient.addColorStop(allergen.middle / maxValue, getRGB(orange));
                gradient.addColorStop(allergen.high / maxValue, getRGB(red));
                gradient.addColorStop(allergen.very_high / maxValue, getRGB(vinous));
                gradient.addColorStop(1, getRGB(vinous));
            }
        }
        return gradient;
    }
    return wrapper
}

export const getGradient = gradientDecorator();


export function getPointColor(context, allergen) {
    let concentration = context?.raw?.value
    if (concentration) {
        if (concentration <= allergen.low) {
            return calcColor(green, yellow, concentration / allergen.low)
        } else if (concentration <= allergen.middle) {
            return calcColor(yellow, orange, (concentration - allergen.low) / (allergen.middle - allergen.low))
        } else if (concentration <= allergen.high) {
            return calcColor(orange, red, (concentration - allergen.middle) / (allergen.high - allergen.middle))
        } else if (concentration <= allergen.very_high) {
            return calcColor(red, vinous, (concentration - allergen.high) / (allergen.very_high - allergen.high))
        } else {
            return getRGB(vinous)
        }
    } else if (concentration === 0) {
        return getRGB(green)
    }
}

function calcColor(min, max, ratio) {
    let r = calc(min.r, max.r, ratio)
    let g = calc(min.g, max.g, ratio)
    let b = calc(min.b, max.b, ratio)
    return `rgb(${r}, ${g}, ${b})`
}

function calc(min, max, ratio) {
    return min + (min > max ? max - min : min - max) * ratio
}

function getRGB(color) {
    return `rgb(${color.r}, ${color.g}, ${color.b})`
}