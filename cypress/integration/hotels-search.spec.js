/// <reference types="cypress" />
import signup from '../pageobjects/signup'
import hotelSearch from '../pageobjects/hotel-search'
import data from '../fixtures/hotel.json'

describe('Hotels search test suite', () => {
    // set cookies globally
    Cypress.Cookies.defaults({
        preserve: 'JSESSIONID'
    })

    before(() => {
        cy.intercept('GET', 'https://cheapflightsfareshelp.zendesk.com/*', req => {
            req.destroy()
            req.alias = 'chat'
        })
        cy.visit('/')
        cy.wait('@chat')
        signup.menuSignin().click()
        signup.tfUid().type(data.uid)
        signup.tfPin().type(data.pin)
        signup.btnSignup().click()
    })

    beforeEach(() => {
        // set cookies locally
        // Cypress.Cookies.preserveOnce('JSESSIONID')
        hotelSearch.tabHotel().click()
        hotelSearch.tabHotel().invoke('attr', 'class').should('include', 'active')
    })

    it('Test "Your Destination" auto-suggest', () => {
        hotelSearch.tfStayCity().type(data.city)
        cy.document().then(d => {
            d.querySelectorAll(hotelSearch.lstCities())
            .forEach(e => expect(e.childNodes.item(1).nodeValue).to.contain(data.city))
        })
    })

    it('Test default calendar values', () => {
        var dt = {
            depart: null,
            return: null
        }
        hotelSearch.tfDepartDate().invoke('val').then(d => dt.depart = Date.parse(d))
        hotelSearch.tfReturnDate().invoke('val').then(d => dt.return = Date.parse(d))
        hotelSearch.elStartDate().then(e => {
            cy.wrap(e).find('a').should('have.css', 'background-color', 'rgb(0, 93, 186)').invoke('text')
            .then(day => Date.parse(`${e.attr('data-year')}-${Number(e.attr('data-month')) + 1}-${day}`))
            .should('eq', dt.depart)
        })
        hotelSearch.elEndDate().then(e => {
            cy.wrap(e).find('a').should('have.css', 'background-color', 'rgb(0, 93, 186)').invoke('text')
            .then(day => Date.parse(`${e.attr('data-year')}-${Number(e.attr('data-month')) + 1}-${day}`))
            .should('eq', dt.return)
        })
        hotelSearch.elBetweenDate().each(e => {
            cy.wrap(e).find('a').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)').invoke('text')
            .then(day => Date.parse(`${e.attr('data-year')}-${Number(e.attr('data-month')) + 1}-${day}`))
            .should('be.above', dt.depart)
            .and('be.below', dt.return)
        })
    })

    it('Test add and remove room', () => {
        hotelSearch.tfGuestForm().should('have.prop', 'placeholder', '1 Room, 2 Adults, 0 Child').click()

        // add room
        Cypress._.times(4, () => hotelSearch.btnAddRoom().click({ force: true }))

        // method 1
        // const arrAdults = []
        // const arrChild = []
        // cy.get("[title='Select Adults'] option:selected").each(e => arrAdults.push(Number(e.text())))
        // cy.wrap(arrAdults).then(v => v.reduce((acc, a) => acc + a), 0).as('totalAdults')
        // cy.get("[title='Select Child'] option:selected").each(e => arrChild.push(Number(e.text())))
        // cy.wrap(arrChild).then(v => lodash.sum(v)).as('totalChildren')

        // method 2
        hotelSearch.ddlSelectAdults().find(':selected')
            .then(e => Cypress._.map(e.text(), Number))
            .then(n => Cypress._.sum(n))
            .as('totalAdults')
        hotelSearch.ddlSelectChild().find(':selected')
            .then(e => Cypress._.map(e.text(), Number))
            .then(n => Cypress._.sum(n))
            .as('totalChildren')

        cy.get('@totalAdults').then(ta => {
            cy.get('@totalChildren').then(tc => {
                hotelSearch.tfGuestForm().should('have.value', `5 Rooms,${ta} Adults,${tc} Child`)
            })
        })

        // delete room
        Cypress._.times(4, () => hotelSearch.btnRemoveRoom().click({ force: true }))

        hotelSearch.ddlSelectAdults().find(':selected')
            .then(e => Cypress._.map(e.text(), Number))
            .then(n => Cypress._.sum(n))
            .as('totalAdults')
        hotelSearch.ddlSelectChild().find(':selected')
            .then(e => Cypress._.map(e.text(), Number))
            .then(n => Cypress._.sum(n))
            .as('totalChildren')

        cy.get('@totalAdults').then(ta => {
            cy.get('@totalChildren').then(tc => {
                hotelSearch.tfGuestForm().should('have.value', `1 Room,${ta} Adults,${tc} Child`)
            })
        })
    })

    it('Test select guest', () => {
        hotelSearch.tfGuestForm().should('have.prop', 'placeholder', '1 Room, 2 Adults, 0 Child').click()
        cy.setGuest(data.id, data.room, data.adult, data.child)
    })

    it('Test select star rating', () => {
        hotelSearch.lnkAdvOption().click({ force: true })
        hotelSearch.ddlStarRating().find('option:selected').should('contain.text', 'Star Rating')
        hotelSearch.ddlStarRating().select('Five Star')
            .find('option:selected')
            .invoke('text')
            .then(t => expect(t.trim()).to.eq('Five Star'))
    })
})