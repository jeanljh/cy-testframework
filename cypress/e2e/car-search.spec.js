/// <reference types="cypress" />
import data from '../fixtures/car.json'
import carSearch from '../pageobjects/car-search'

describe('Car search test suite', () => {
  beforeEach(() => {
    cy.visit('/')
    carSearch.tabCar().click().should('have.class', 'cff-list-tab active')
  })

  it('Test default selected arrival and departure time', () => {
    carSearch.ddlPickTime().find('option:selected').invoke('val').should('eq', '10:00')
    carSearch.ddlDropTime().find('option:selected').invoke('val').should('eq', '10:00')
  })

  it('Test select driver age', () => {
    carSearch.tabCar().click()
    carSearch.ddlDriverAge().as('driverAge').find('option:selected').should('have.text', 'Between 30 - 65?')
    carSearch.ddlDriverAge().select('Below 30').find(':selected').should('have.text', 'Below 30')
    carSearch
      .txtTooltip()
      // .as('tooltip')
      .should(
        'have.text',
        'Additional Fee may apply for driver under 30 Yrs or above 65 Yrs old, at the time of rental. Please check term and conditions on payment page.'
      )
      .and('not.be.visible')
      .parent()
      .invoke('css', 'display', 'inherit')
      // .invoke('attr', 'style', 'display:inherit')
      .children('p')
      // .get('@tooltip')
      .should('be.visible')
  })

  it('Test get vendor type', () => {
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

  it('Test get vehicle type', () => {
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

  it('Test vendor code options', () => {
    const arrRes = []
    carSearch
      .ddlVendorCode()
      .find('option')
      .each(e => arrRes.push(e.text()))
    cy.wrap(arrRes).should('deep.equal', data.vendorCode)
  })

  it('Test vehicle type options', () => {
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
})
