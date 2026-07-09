class CarSearchPO {
  tabCar = () => cy.get('.iconcars')
  ddlPickTime = () => cy.get('#pickTime')
  ddlDropTime = () => cy.get('#dropTime')
  ddlDriverAge = () => cy.get('#driverAge')
  txtTooltip = () => cy.get('.show_policy > p')
  lnkAdvOption = () => cy.get('.adva-option')
  ddlVendorCode = () => cy.get('#vendorCode')
  ddlVehicleType = () => cy.get('#vehicleType')
  inputDropLocation = () => cy.get('#dropLocation')
  lblDropLocation = () => cy.get('#dropOffDiv')
  inputPickDate = () => cy.get('#pickDate')
  inputDropDate = () => cy.get('#dropDate')
}

export default new CarSearchPO()
