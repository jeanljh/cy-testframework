class CarSearchPO {
    tabCar = () => cy.get('#carTab')
    ddlPickTime = () => cy.get('#pickTime')
    ddlDropTime = () => cy.get('#dropTime')
    ddlDriverAge = () => cy.get('#driverAge')
    txtTooltip = () => cy.get('.show_policy > p')
    lnkAdvOption = () => cy.get('.adva-option')
    ddlVendorCode = () => cy.get('#vendorCode')
    ddlVehicleType = () => cy.get('#vehicleType')
}

export default new CarSearchPO()