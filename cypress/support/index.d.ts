declare namespace Cypress {
  interface Chainable<Subject> {
    selectPerson(data: object): Chainable<void>
    setGuest(id: number, room: number, adult: number[], child: number[]): Chainable<void>
  }
}
