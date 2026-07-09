module.exports = {
  tabHotel: () => cy.get('.iconhotels'),
  tfStayCity: () => cy.get('#stayCity'),
  lstCities: () => '#ui-id-5 > li > a',
  tfDepartDate: () => cy.get('#checkInDate'),
  tfReturnDate: () => cy.get('#checkOutDate'),
  elDefaultDate: () => cy.get('.ui-datepicker-current-day'),
  elBetweenDate: () => cy.get('.between-date'),
  btnAddRoom: () => cy.get('#addroomBtn'),
  btnRemoveRoom: () => cy.get('#remroomBtn'),
  btnApplyRoom: () => cy.get('#applyroomBtn'),
  lnkAdvOption: () => cy.get("[href='#advance']"),
  ddlStarRating: () => cy.get('#star'),
  textGuestInfo: () => cy.get('#guestInfo'),
  inputAdultRooms: () => cy.get('input.room-adult'),
  inputChildRooms: () => cy.get('input.room-child')
}
