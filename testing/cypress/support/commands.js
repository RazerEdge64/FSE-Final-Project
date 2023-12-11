// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('loginUser', () => {
    cy.visit('http://localhost:3000');
        // cy.contains('Log In').click();
        cy.get('#username').type('user1');
        cy.get('#password').type('123456');
        cy.get('#loginButton').click();
})

Cypress.Commands.add('loginGuest', () => {
    cy.visit('http://localhost:3000');
    // cy.contains('Log In').click();
    cy.get('.action-button-guest').click();
})


Cypress.Commands.add('loginUserLowRep', () => {
    cy.visit('http://localhost:3000');
    // cy.contains('Log In').click();
    cy.get('#username').type('user3');
    cy.get('#password').type('123456');
    cy.get('#loginButton').click();
})