import { getDaySuffix, suffixedNumber } from "../helpers"


describe('helper functions', () => {
    it('should return the correct suffix for the provided number', () =>{
        expect(getDaySuffix(1)).toBe('st')
        expect(getDaySuffix(2)).toBe('nd')
        expect(getDaySuffix(3)).toBe('rd')
        expect(getDaySuffix(11)).toBe('th')
    })

    it('should suffix the number', () => {
        expect(suffixedNumber(1)).toBe('1st')
        expect(suffixedNumber(2)).toBe('2nd')
        expect(suffixedNumber(3)).toBe('3rd')
        expect(suffixedNumber(11)).toBe('11th')
    })
})