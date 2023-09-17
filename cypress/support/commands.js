import hotelSearchPO from '../pageobjects/hotel-search'
import flightsSearchPO from '../pageobjects/flights-search'

const { times, map, sum } = Cypress._
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

Cypress.Commands.add('selectPerson', p => {
    cy.wrap(p.adult + p.children + p.infantLap + p.infantSeat).as('totalPerson').should('not.be.gt', 9)
    flightsSearchPO.ddlTraveler().should('not.be.visible')
    flightsSearchPO.tfPerson().click().should('have.prop', 'readonly', true).and('have.prop', 'placeholder', '1 Adult, Economy')
    flightsSearchPO.ddlTraveler().should('be.visible')
    flightsSearchPO.btnDone().should('exist').and('be.visible')
    flightsSearchPO.ddlCabinClass().invoke('val').should('eq', 'Economy')
    flightsSearchPO.tfAdult().invoke('val').should('eq', '1')
    flightsSearchPO.ddlCabinClass().select(p.class, { force:true }).should('have.value', p.class)
    times(p.adult-1, () => flightsSearchPO.tfAdult().next().click({ force:true }))
    flightsSearchPO.tfAdult().should('have.value', p.adult)
    times(p.children, () => flightsSearchPO.tfChild().next().click({ force:true }))
    flightsSearchPO.tfChild().should('have.value', p.children)
    times(p.infantLap, () => flightsSearchPO.tfInfantLap().next().click({ force:true }))
    flightsSearchPO.tfInfantLap().should('have.value', p.infantLap)
    times(p.infantSeat, () => flightsSearchPO.tfInfantSeat().next().click({ force:true }))
    flightsSearchPO.tfInfantSeat().should('have.value', p.infantSeat)
    cy.get('@totalPerson').then(c => {
        const salute = c > 1 ? 'Travelers' : 'Adult'
        flightsSearchPO.tfPerson().should('have.value', `${c} ${salute}, ${p.class}`)
    })
    flightsSearchPO.btnDone().should('exist').and('be.visible').click()
})

Cypress.Commands.add('setGuest', (id, room, adult, child) => {
    if (id > 0) hotelSearchPO.btnAddRoom().click({ force: true })
    hotelSearchPO.ddlSelectAdults().eq(id).select(adult[id] + '', { force: true })
    hotelSearchPO.ddlSelectChild().eq(id).select(child[id] + '', { force: true })
    if (id++ < room) cy.setGuest(id, room, adult, child)

    hotelSearchPO.ddlSelectAdults().find(':selected')
    .then(e => map(e.text(), Number))
    .then(sum)
    .as('totalAdults')
    hotelSearchPO.ddlSelectChild().find(':selected')
    .then(e => map(e.text(), Number))
    .then(sum)
    .as('totalChildren')

    cy.get('@totalAdults').then(ta => {
        cy.get('@totalChildren').then(tc => {
            const text = tc > 1 ? 'Children' : 'Child'
            hotelSearchPO.tfGuestForm().should('have.value', `5 Rooms,${ta} Adults,${tc} ${text}`)
        })
    })
    hotelSearchPO.btnConfirmRoom().click({ force: true })
})
