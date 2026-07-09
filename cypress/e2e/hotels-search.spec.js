/// <reference types="cypress" />
import signup from '../pageobjects/signup'
import hotelSearch from '../pageobjects/hotel-search'
import data from '../fixtures/hotel.json'

const { _ } = Cypress

describe('Hotels search test suite', () => {
  // set cookies globally
  // Cypress.Cookies.defaults({
  //     preserve: 'JSESSIONID'
  // })

  // before(() => {
  //     // cy.intercept('GET', 'https://cheapflightsfareshelp.zendesk.com/*', req => {
  //     //     req.destroy()
  //     //     req.alias = 'chat'
  //     // })
  //     cy.visit('/')
  //     // cy.wait('@chat')
  //     signup.menuSignin().click()
  //     signup.tfUid().type(data.uid)
  //     signup.tfPin().type(data.pin)
  //     signup.btnSignup().click()
  // })

  beforeEach(() => {
    cy.visit('')
    hotelSearch.tabHotel().click({ force: true })
    hotelSearch.tabHotel().invoke('attr', 'class').should('include', 'active')
  })

  it('Test "Your Destination" auto-suggest', () => {
    hotelSearch.tfStayCity().type(data.city)
    cy.document().then(d => {
      d.querySelectorAll(hotelSearch.lstCities()).forEach(e =>
        expect(e.childNodes.item(1).nodeValue).to.contain(data.city)
      )
    })
  })

  it('Test default calendar values', () => {
    let dt = {
      depart: null,
      return: null,
    }
    hotelSearch
      .tfDepartDate()
      .invoke('val')
      .then(d => (dt.depart = Date.parse(d)))
    hotelSearch
      .tfReturnDate()
      .invoke('val')
      .then(d => (dt.return = Date.parse(d)))
    hotelSearch.tfDepartDate().click()
    hotelSearch.elDefaultDate().then(e => {
      cy.wrap(e)
        .find('a')
        .should('have.css', 'background-color', 'rgb(15, 104, 222)')
        .then(() => Date.parse(`${Number(e.attr('data-month')) + 1}-${e.text()}-${e.attr('data-year')}`))
        .should('eq', dt.depart)
    })
    hotelSearch.tfReturnDate().click()
    hotelSearch.elDefaultDate().then(e => {
      cy.wrap(e)
        .find('a')
        .should('have.css', 'background-color', 'rgb(15, 104, 222)')
        .then(() => Date.parse(`${Number(e.attr('data-month')) + 1}-${e.text()}-${e.attr('data-year')}`))
        .should('eq', dt.return)
    })
    // hotelSearch.elBetweenDate().each(e => {
    //   cy.wrap(e)
    //     .find('a')
    //     .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
    //     .invoke('text')
    //     .then(day => Date.parse(`${e.attr('data-year')}-${Number(e.attr('data-month')) + 1}-${day}`))
    //     .should('be.above', dt.depart)
    //     .and('be.below', dt.return)
    // })
  })

  it('Test add and remove room', () => {
    hotelSearch.textGuestInfo().then(e => e.text().replace(/\s+/g, ' ').trim()).should('eq', '1 Room(s) 2 Adult(s), 0 Child(s)')

    // add room
    _.times(4, () => hotelSearch.btnAddRoom().click({ force: true }))
    cy.valTotalGuest()

    // another method
    // const arrAdults = []
    // const arrChild = []
    // cy.get("[title='Select Adults'] option:selected").each(e => arrAdults.push(Number(e.text())))
    // cy.wrap(arrAdults).then(v => v.reduce((acc, a) => acc + a), 0).as('totalAdults')
    // cy.get("[title='Select Child'] option:selected").each(e => arrChild.push(Number(e.text())))
    // cy.wrap(arrChild).then(v => lodash.sum(v)).as('totalChildren')

    // delete room
    _.times(4, () => hotelSearch.btnRemoveRoom().click({ force: true }))
    cy.valTotalGuest()
  })

  it('Test select guest', () => {
    hotelSearch.textGuestInfo().click()
    cy.setGuest(data.id, data.room, data.adult, data.child)
  })

  xit('Test select star rating', () => {
    hotelSearch.lnkAdvOption().click({ force: true })
    hotelSearch.ddlStarRating().find('option:selected').should('contain.text', 'Star Rating')
    hotelSearch
      .ddlStarRating()
      .select('Five Star')
      .find('option:selected')
      .invoke('text')
      .invoke('trim')
      .should('eq', 'Five Star')
    /** another method */
    // .then(t => expect(t.trim()).to.eq('Five Star'))
  })
})
