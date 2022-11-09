/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    getBySel(dataTestAttribute: string, args?: any): Chainable<any>;
    getBySelLike(dataTestPrefixAttribute: string, args?: any): Chainable<any>;
  }
}
