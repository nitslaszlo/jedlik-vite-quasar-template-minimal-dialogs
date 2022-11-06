context("Basic", () => {
  beforeEach(() => {
    cy.visit("/account");
  });

  it("basic nav", () => {
    cy.url().should("eq", "http://localhost:8080/account");

    cy.contains("Show").should("exist");
    cy.get("#btnLoginSimple").click();

    cy.get("QInputEmail").type("student000001@jedlik.eu{Enter}");

    // cy.contains("[Default Layout]").should("exist");

    //cy.get("[btn]").click().url().should("eq", "http://localhost:3333/");
  });

  // it("markdown", () => {
  //   cy.get('[title="About"]').click().url().should("eq", "http://localhost:3333/about");

  //   cy.get(".shiki").should("exist");
  // });
});
