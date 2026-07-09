import hotelSearchPO, { inputAdultRoom } from '../pageobjects/hotel-search'
import flightsSearchPO from '../pageobjects/flights-search'
import carSearchPO from '../pageobjects/car-search'
import { formatCalendarDate } from '../utils/helper'

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

Cypress.Commands.add('selectPerson', (p) => {
  cy.wrap(p.adult + p.children + p.infantLap + p.infantSeat)
    .as('totalPerson')
  //   .should('not.be.gt', 9)
  // flightsSearchPO
  //   .tfPerson()
  //   .click()
  //   .should('have.prop', 'readonly', true)
  //   .and('have.prop', 'placeholder', '1 Adult, Economy')
  flightsSearchPO
    .ddlTraveler()
    .then((t) => t.text().replace(/\s+/g, ' ').trim())
    .should('eq', '1 Adult, Economy')
  flightsSearchPO.ddlTraveler().click()
  flightsSearchPO.btnDone().should('exist').and('be.visible')
  flightsSearchPO.ddlCabinClass().get(`[data-value=${p.class}]`).should('not.have.class', 'selected')
  flightsSearchPO.ddlCabinClass().get(`[data-value=${p.class}]`).click().should('have.class', 'selected')
  flightsSearchPO.tfAdult().invoke('val').should('eq', '1')
  times(p.adult - 1, () => flightsSearchPO.tfAdult().next().click({ force: true }))
  flightsSearchPO.tfAdult().should('have.value', p.adult)
  times(p.children, () => flightsSearchPO.tfChild().next().click({ force: true }))
  flightsSearchPO.tfChild().should('have.value', p.children)
  times(p.infantLap, () => flightsSearchPO.tfInfantLap().next().click({ force: true }))
  flightsSearchPO.tfInfantLap().should('have.value', p.infantLap)
  times(p.infantSeat, () => flightsSearchPO.tfInfantSeat().next().click({ force: true }))
  flightsSearchPO.tfInfantSeat().should('have.value', p.infantSeat)
  cy.get('@totalPerson').then((c) => {
    const salute = c > 1 ? 'Travelers' : 'Adult'
    flightsSearchPO
      .ddlTraveler()
      .then((t) => t.text().replace(/\s+/g, ' ').replace(/\s+,/g, ',').trim())
      .should('eq', `${c} ${salute}, ${p.class}`)
  })
  flightsSearchPO.btnDone().should('exist').and('be.visible').click()
})

Cypress.Commands.add('setGuest', (id, room, adult, child) => {
  if (id > 0) hotelSearchPO.btnAddRoom().click({ force: true })
  hotelSearchPO.inputAdultRooms().eq(id).next().click()
  hotelSearchPO.inputChildRooms().eq(id).next().click()
  if (id++ < room) cy.setGuest(id, room, adult, child)

  cy.valTotalGuest()
  hotelSearchPO.btnApplyRoom().click({ force: true })
})

Cypress.Commands.add('valTotalGuest', () => {
  hotelSearchPO
    .inputAdultRooms()
    .then((e) => map(e, (e) => Number(e.value)))
    .then((n) => sum(n))
    .as('totalAdults')
  hotelSearchPO
    .inputChildRooms()
    .then((e) => map(e, (e) => Number(e.value)))
    .then((n) => sum(n))
    .as('totalChildren')

  hotelSearchPO
    .inputAdultRooms()
    .its('length')
    .then((tr) => {
      cy.get('@totalAdults').then((ta) => {
        cy.get('@totalChildren').then((tc) => {
          hotelSearchPO
            .textGuestInfo()
            .invoke('text')
            .invoke('trim')
            .then((t) => t.replace(/\s+/g, ' '))
            .should('eq', `${tr} Room(s) ${ta} Adult(s), ${tc} Child(s)`)
        })
      })
    })
})

Cypress.Commands.add('getDefaultCalState', () => {
  const todayDate = new Date()
  const yesterdayDate = new Date(todayDate)
  yesterdayDate.setDate(todayDate.getDate() - 1)
  const tomorrowDate = new Date(todayDate)
  tomorrowDate.setDate(todayDate.getDate() + 1)

  const nextWeekDate = new Date()
  nextWeekDate.setDate(nextWeekDate.getDate() + 7)
  const minusDate = new Date(nextWeekDate)
  minusDate.setDate(nextWeekDate.getDate() - 1)
  const plusDate = new Date(nextWeekDate)
  plusDate.setDate(nextWeekDate.getDate() + 1)

  const validTodayDates = [
    formatCalendarDate(yesterdayDate),
    formatCalendarDate(todayDate),
    formatCalendarDate(tomorrowDate),
  ]

  const validFutureDates = [
    formatCalendarDate(minusDate),
    formatCalendarDate(nextWeekDate),
    formatCalendarDate(plusDate),
  ]

  cy.wrap({ validTodayDates, validFutureDates }).as('objValidDates')
})

Cypress.Commands.add('getCalDays', () => {
  cy.get('td[data-handler="selectDay"]')
})

Cypress.Commands.add('selectDate', (targetDate) => {
  cy.getCalDays().then((d) => {
    const firstPickerDate = new Date(
      `${d.first().attr('data-year')},${Number(d.first().attr('data-month')) + 1},${d.first().text()}`,
    )
    const lastPickerDate = new Date(
      `${d.last().attr('data-year')},${Number(d.last().attr('data-month')) + 1},${d.last().text()}`,
    )
    if (targetDate < firstPickerDate) {
      cy.get('[data-handler="prev"]').click()
      cy.selectDate(targetDate)
      return
    }
    if (targetDate > lastPickerDate) {
      cy.get('[data-handler="next"]').click()
      cy.selectDate(targetDate)
      return
    }
    cy.getCalDays().each((day) => {
      const dt = new Date(`${day.attr('data-year')},${Number(day.attr('data-month')) + 1},${day.text().trim()}`)
      if (dt.getMonth() === targetDate.getMonth() && dt.getDate() === targetDate.getDate()) {
        cy.wrap(day).click()
      }
    })
  })
})
