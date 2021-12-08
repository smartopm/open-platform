import { checkUserInformation, checkInfo, validateAllSteps, checkStepStatus } from '../utils';

describe('helper methods', () => {
  describe('checkUserInformation', () => {
    it('return true', () => {
      const req = {
        name: 'some name'
      };
      expect(checkUserInformation(req)).toBe(true);
    });
    it('return false', () => {
      const invReq = {
        invalid: 'invalid'
      };
      expect(checkUserInformation(invReq)).toBe(false);
    });
  });

  describe('checkInfo', () => {
    it('return true', () => {
      const req = {
        name: 'some name'
      };
      expect(checkInfo(req)).toBe(true);
    });
    it('return false', () => {
      const invReq = {
        invalid: 'invalid'
      };
      expect(checkInfo(invReq)).toBe(false);
    });
  });

  describe('validation steps', () => {
    const completeRequest = {
      imageUrls: ['someimages', 'soma dnasdome'],
      videoUrl: 'http://video.com',
      name: 'Joesda',
      phoneNumber: '02380921112',
      email: 'some@email.com'
    };
    const incompleteRequest = {
      imageUrls: null,
      videoUrl: 'http://video.com',
      name: 'Joesda',
      phoneNumber: null,
      email: 'some@email.com'
    };

    const anotherIncompleteRequest = {
      imageUrls: ['one_imeage'],
      videoUrl: null,
      name: 'Joesda',
      phoneNumber: '9283921839',
      email: 'some@email.com'
    };
    it('validates all steps', () => {
      expect(validateAllSteps(completeRequest)).toBe(true);
      expect(validateAllSteps(incompleteRequest)).toBe(false);
      expect(validateAllSteps(anotherIncompleteRequest)).toBe(false);
    });

    it('should validate a step of a request', () => {
      expect(checkStepStatus(completeRequest).basicInfo).toBe(true);
      expect(checkStepStatus(completeRequest).idCapture).toBe(true);
      expect(checkStepStatus(completeRequest).videoRecording).toBe(true);
      expect(checkStepStatus(incompleteRequest).basicInfo).toBe(true);
      expect(checkStepStatus(incompleteRequest).idCapture).toBe(false);
      expect(checkStepStatus(incompleteRequest).videoRecording).toBe(true);
      expect(checkStepStatus(anotherIncompleteRequest).basicInfo).toBe(true);
      expect(checkStepStatus(anotherIncompleteRequest).idCapture).toBe(false);
      expect(checkStepStatus(anotherIncompleteRequest).videoRecording).toBe(false);
    });
  });
});
