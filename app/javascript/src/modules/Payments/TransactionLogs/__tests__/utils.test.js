import authState from "../../../../__mocks__/authstate";
import flutterwaveConfig, { closeFlutterwaveModal } from "../utils";

describe('Transaction Logs Helpers', () => { 
    it('should return an object of config and community currency', () => {
      const translate = jest.fn(() => 'Translated')
      const value = {
        amount: 90,
        description: 'Some values here'
      }
      const configurations = flutterwaveConfig(authState, value, translate)
      expect(configurations).toBeInstanceOf(Object)
      expect(configurations.communityCurrency).toBe('NGN')
      expect(configurations.config.amount).toBe(90);
      expect(configurations.config.customizations.description).toBe('Some values here');
    });
    it('should close the modal', () => {
      expect(closeFlutterwaveModal).toBeInstanceOf(Function)
    })
 })