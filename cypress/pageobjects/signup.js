module.exports = {
    menuSignin: () => cy.get('.loginBar'),
    tfUid: () => cy.get('#user_uid'),
    tfPin: () => cy.get('#user_pin'),
    btnSignup: () => cy.get('#signInReq button')
}