/// <reference types="cypress" />
import data from '../fixtures/car.json'
import carSearch from '../pageobjects/car-search'
import { formatCalendarDate } from '../utils/helper'

describe('Car search test suite', () => {
  beforeEach(() => {
    cy.visit('/')
    carSearch.tabCar().click().should('have.class', 'iconcars active')
  })

  it('Test default selected pick up and drop off time', () => {
    carSearch.ddlPickTime().find('option:selected').invoke('val').should('eq', '10:00')
    carSearch.ddlDropTime().find('option:selected').invoke('val').should('eq', '10:00')
  })

  it('Test select pick up and drop off time', () => {
    carSearch.ddlPickTime().select(data.pickUpTime).find(':selected').should('have.text', data.pickUpTime)
    carSearch.ddlDropTime().select(data.dropOffTime).find(':selected').should('have.text', data.dropOffTime)
  })

  it('Test select driver age', () => {
    carSearch.tabCar().click()
    carSearch.ddlDriverAge().as('driverAge').find('option:selected').should('have.text', 'Between 30 - 65?')
    carSearch.ddlDriverAge().select('Below 30').find(':selected').should('have.text', 'Below 30')
    carSearch.ddlDriverAge().select('Above 65').find(':selected').should('have.text', 'Above 65')
    // carSearch
    //   .txtTooltip()
    //   // .as('tooltip')
    //   .should(
    //     'have.text',
    //     'Additional Fee may apply for driver under 30 Yrs or above 65 Yrs old, at the time of rental. Please check term and conditions on payment page.'
    //   )
    //   .and('not.be.visible')
    //   .parent()
    //   .invoke('css', 'display', 'inherit')
    //   // .invoke('attr', 'style', 'display:inherit')
    //   .children('p')
    //   // .get('@tooltip')
    //   .should('be.visible')
  })

  xit('Test get vendor type', () => {
    const objData = {}
    objData['vendorCode'] = []
    carSearch.tabCar().click()
    carSearch.lnkAdvOption().click({ force: true })
    carSearch.ddlVendorCode().find(':selected').should('have.text', 'Car Company')
    carSearch
      .ddlVendorCode()
      .find('option')
      .should('have.length.gt', 0)
      .each(e => objData['vendorCode'].push(e.text()))
    cy.writeFile('data.json', objData)
  })

  xit('Test get vehicle type', () => {
    const objData = {}
    objData['vehicleType'] = []
    carSearch.tabCar().click()
    carSearch.lnkAdvOption().click({ force: true })
    carSearch.ddlVehicleType().find(':selected').should('have.text', 'Car Type')
    carSearch
      .ddlVehicleType()
      .find('option')
      .should('have.length.gt', 0)
      .each(e => objData['vehicleType'].push(e.text()))
    cy.writeFile('data.json', objData)
  })

  xit('Test vendor code options', () => {
    const arrRes = []
    carSearch
      .ddlVendorCode()
      .find('option')
      .each(e => arrRes.push(e.text()))
    cy.wrap(arrRes).should('deep.equal', data.vendorCode)
  })

  xit('Test vehicle type options', () => {
    const arrRes = []
    carSearch
      .ddlVehicleType()
      .find('option')
      .each(e =>
        cy
          .wrap(e)
          .invoke('text')
          .then(t => arrRes.push(t))
      )
    cy.wrap(arrRes).should('deep.equal', data.vehicleType)
  })

  it('Test optional drop off location behavior', () => {
    carSearch.inputDropLocation().should('not.be.visible').and('be.enabled')
    carSearch.lblDropLocation().click()
    carSearch.inputDropLocation().should('be.visible').and('be.enabled')
  })

  it('Test default calendar state', () => {
    cy.getDefaultCalState()
    cy.get('@objValidDates').then(({ validTodayDates, validFutureDates }) => {
      carSearch.inputPickDate().prev().then(e => e.text().replace(/\s+/g, ' ').trim()).should('be.oneOf', validTodayDates)
      carSearch.inputDropDate().prev().then(e => e.text().replace(/\s+/g, ' ').trim()).should('be.oneOf', validFutureDates)
    })
  })

  it('Test select pickup and dropoff date from calendar', () => {
    const todayDate = new Date()
    const pickupDate = new Date(data.pickupDate)
    const dropoffDate = new Date(data.dropoffDate)
    expect(pickupDate).to.gte(todayDate)

    carSearch.inputPickDate().click()
    cy.selectDate(pickupDate)
    carSearch.inputPickDate().prev().then(e => e.text().replace(/\s+/g, ' ').trim()).should('eq', formatCalendarDate(pickupDate))
    cy.selectDate(dropoffDate)
    carSearch.inputDropDate().prev().then(e => e.text().replace(/\s+/g, ' ').trim()).should('eq', formatCalendarDate(dropoffDate))
  })
})
