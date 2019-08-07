import { OperationNotSupportedException } from '@monument/core';
import { Errors } from '../..';

describe('Errors', function() {
  let errors: Errors;

  beforeEach(() => {
    errors = new Errors();
  });

  describe('complete()', function() {
    it('should throw OperationNotSupportedException', function() {
      expect(() => errors.complete()).toThrow(OperationNotSupportedException);
    });
  });

  describe('error()', function() {
    it('should throw OperationNotSupportedException', function() {
      expect(() => errors.error({})).toThrow(OperationNotSupportedException);
    });
  });
});
