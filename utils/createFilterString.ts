
export const createFilterString = (filter: string, items: string | string[], array: boolean = false) => {
    if (typeof items === 'object' && array) {
        const options = items.reduce((acc, item, i) => {
            if (i > 0) {
                return `${acc},${item}`
            }
            return `${item}`
        }, '')
        return options ? `${filter}:=[${options}]` : ''
    } else if (typeof items === 'object') {
         const option = items.reduce((acc, item, i) => {
            if (i > 0) {
                return `${acc} && ${filter}:=${item}`
            }
            return `${filter}:=${item}`
        }, '')
        return option
    } else {
        return items ? `${filter}:=${items}` : ''
    }
}