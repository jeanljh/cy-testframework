/// <reference types="cypress" />
import flightSearch from '../pageobjects/flights-search'
import data from '../fixtures/flight.json'

describe('Flights search test suite', () => {
    beforeEach(() => cy.visit('/'))

    it('Test default selected tab', () => {
        flightSearch.lstMenu().filter('.active').should('have.text', 'Flights')
        // another way
        // flightSearch.tabFlight().invoke('attr', 'class').should('include', 'active')
        // another way
        // cy.get('.list-one').children().each(e => {
        //     if (e.hasClass('cff-list-tab active')) {
        //         expect(e.text()).to.contain('Flights')
        //     }
        // })
    })
    it('Test round trip and oneway options', () => {
        flightSearch.rbtnRoundTrip().should('be.checked')
        flightSearch.rbtnOneWay().should('not.be.checked')
        flightSearch.lnkAdvSearch().click({ force: true })
        // select one way
        flightSearch.rbtnOneWay().check({ force: true }).should('be.checked').and('be.enabled')
        flightSearch.tfReturnDate().should('not.be.visible').and('not.be.enabled')
        flightSearch.tfReturnFromCity().should('not.be.visible').and('be.enabled')
        flightSearch.tfReturnToCity().should('not.be.visible').and('be.enabled')
        // select round trip
        flightSearch.rbtnRoundTrip().check({ force: true }).should('be.checked').and('be.enabled')
        flightSearch.tfReturnDate().should('be.visible').and('be.enabled')
        flightSearch.tfReturnFromCity().invoke('removeAttr', 'type').should('be.visible').and('be.enabled')
        flightSearch.tfReturnToCity().invoke('removeAttr', 'type').should('be.visible').and('be.enabled')
    })
    it('Test unaccompanied minor', () => {
        flightSearch.txtInfo().should('not.exist')
        flightSearch.lnkInfo().should('be.visible').click({ force: true })
        flightSearch.txtInfo()
            .should('exist')
            .and('contain', data.info)
            .find('button')
            .click()
        flightSearch.txtInfo().should('not.exist')
    })
    it('Test select passengers', () => {
        cy.selectPerson(data.person)
    })
    it('Test origin field', () => {
        flightSearch.tfFromCity()
            .invoke('attr', 'placeholder', 'From City')
            .should('have.attr', 'placeholder', 'From City')
            .type(data.origin)
        flightSearch.menuAutoSuggest()
            .each(e => expect(e.text()).to.contain(data.origin))
            .first()
            .as('firstRow')
            .type('{enter}')
        flightSearch.tfFromCity().invoke('val').then(v => {
            cy.get('@firstRow').should('contain', v)
        })
    })
    it('Test select airlines', () => {
        flightSearch.lnkAdvSearch().click({ force: true })
        flightSearch.ddlSelectAirline().find('option').invoke('text').as('allOptions')
        flightSearch.ddlSelectAirline().select(data.airlines)
            .find('option:selected')
            .invoke('text')
            .then(t => t.trim())
            .should('eq', data.airlines)
        // .then(t => expect(t.trim()).to.eq(data.airlines)) // another way
        flightSearch.ddlSelectAirline().children().invoke('text').then(act => {
            cy.get('@allOptions').then(exp => expect(act).to.equal(exp))
        })
    })
    it('Test empty text fields', () => {
        flightSearch.btnSearch().click()
        flightSearch.tfFromCity().should('have.css', 'border', '2px solid rgb(255, 0, 0)')
        flightSearch.tfToCity().should('have.css', 'border', '2px solid rgb(255, 0, 0)')
    })
})