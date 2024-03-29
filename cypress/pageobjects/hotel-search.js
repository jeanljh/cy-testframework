module.exports = {
  tabHotel: () => cy.get('#hotelTab'),
  tfStayCity: () => cy.get('#stayCity'),
  lstCities: () => '#ui-id-5 > li > a',
  tfDepartDate: () => cy.get('#departDate'),
  tfReturnDate: () => cy.get('#returnDate'),
  elStartDate: () => cy.get('.start-date'),
  elEndDate: () => cy.get('.end-date'),
  elBetweenDate: () => cy.get('.between-date'),
  tfGuestForm: () => cy.get('#guestform'),
  btnAddRoom: () => cy.get('#addroom'),
  btnRemoveRoom: () => cy.get('#removeroom'),
  ddlSelectAdults: () => cy.get("[title='Select Adults']"),
  ddlSelectChild: () => cy.get("[title='Select Child']"),
  btnConfirmRoom: () => cy.get('.confirm_room'),
  lnkAdvOption: () => cy.get("[href='#advance']"),
  ddlStarRating: () => cy.get('#star'),
}
