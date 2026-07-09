/// <reference types="cypress" />
import flightSearch from '../pageobjects/flights-search'
import data from '../fixtures/flight.json'

describe('Flights search test suite', () => {
  beforeEach(() => cy.visit('/'))

  it('Test default selected tab', () => {
    flightSearch.lstMenu().filter('.active').should('contain.text', 'Flights')
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
    // select one way
    flightSearch.rbtnOneWay().check({ force: true }).should('be.checked').and('be.enabled')
    flightSearch.tfReturnDate().should('not.be.visible').and('be.enabled')
    flightSearch.tfReturnFromCity().should('have.css', 'display', 'none').and('be.enabled')
    flightSearch.tfReturnToCity().should('have.css', 'display', 'none').and('be.enabled')
    // select round trip
    flightSearch.rbtnRoundTrip().check({ force: true }).should('be.checked').and('be.enabled')
    flightSearch.tfReturnDate().should('have.css', 'opacity', '0').and('be.enabled')
    flightSearch.tfReturnFromCity().invoke('removeAttr', 'type').should('be.visible').and('be.enabled')
    flightSearch.tfReturnToCity().invoke('removeAttr', 'type').should('be.visible').and('be.enabled')
  })
  it('Test unaccompanied minor', () => {
    flightSearch.ddlTraveler().click()
    flightSearch.txtInfo().should('not.be.visible')
    flightSearch.lnkInfo().should('be.visible').click()
    flightSearch.txtInfo().should('exist').and('contain', data.info).find('.close-btn').click()
    flightSearch.txtInfo().should('not.be.visible')
  })
  it('Test select passengers', () => {
    cy.selectPerson(data.person)
  })
  it('Test origin field', () => {
    flightSearch
      .tfFromCity()
      .invoke('attr', 'placeholder', 'From City')
      .should('have.attr', 'placeholder', 'From City')
      .type(data.origin)
    flightSearch
      .menuAutoSuggest()
      .each(e => expect(e.text()).to.contain(data.origin))
      .first()
      .as('firstRow')
      .click()
    flightSearch
      .tfFromCity()
      .invoke('val')
      .then(v => {
        cy.get('@firstRow').should('contain', v)
      })
  })
  xit('Test select airlines', () => {
    flightSearch.ddlSelectAirline().find('option').invoke('text').as('allOptions')
    flightSearch
      .ddlSelectAirline()
      .select(data.airlines)
      .find('option:selected')
      .invoke('text')
      .then(t => t.trim())
      .should('eq', data.airlines)
    // .then(t => expect(t.trim()).to.eq(data.airlines)) // another way
    flightSearch
      .ddlSelectAirline()
      .children()
      .invoke('text')
      .then(act => {
        cy.get('@allOptions').then(exp => expect(act).to.equal(exp))
      })
  })
  it('Test empty text fields', () => {
    flightSearch.btnSearch().click()
    flightSearch.tfToCity().should('have.css', 'border', '2px solid rgb(255, 0, 0)')
  })
})
