import { checkUserInformation, checkInfo } from '../utils'

describe('helper methods', () => {
  describe('checkUserInformation', () => {
    it('return true', () => {
      const req = {
        name: 'some name'
      }
      expect(checkUserInformation(req)).toBe(true);
    });
    it('return false', () => {
      const invReq = {
        invalid: "invalid"
      }
      expect(checkUserInformation(invReq)).toBe(false);
    });
  });

  describe('checkInfo', () => {
    it('return true', () => {
      const req = {
        name: 'some name'
      }
      expect(checkInfo(req)).toBe(true);
    });
    it('return false', () => {
      const invReq = {
        invalid: "invalid"
      }
      expect(checkInfo(invReq)).toBe(false);
    });
  });
})