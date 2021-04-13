// borrowed and modified

export function getDaySuffix(num){
    const array = (`${  num}`).split("").reverse(); 
    if (array[1] !== "1") {
        switch (array[0]) {
            case "1": return "st";
            case "2": return "nd";
            case "3": return "rd";
            default:
        }
    }
    return "th";
}

export function suffixedNumber(number){
    return `${number}${getDaySuffix(number)}`
}