describe("Local Storage", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("saves photo to localStorage", () => {
    // https://on.cypress.io/clearlocalstorage
    cy.get(".save-to-storage")
      .click()
      .should(() => {
        expect(localStorage.getItem("POTD")).to.not.be.null;
      });

    // clearLocalStorage() yields the localStorage object
    cy.clearLocalStorage().should((ls) => {
      expect(ls.getItem("POTD")).to.be.null;
    });
  });
});
