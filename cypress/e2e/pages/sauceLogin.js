class LoginPage {
  elements = {
    usernameInput: () => cy.get('[data-test="username"]'),
    passwordInput: () => cy.get('[data-test="password"]'),
    loginButton: () => cy.get('[data-test="login-button"]'),
    errorMessage: () => cy.get('[data-test="error"]'),
    productsTitle: () => cy.get('[data-test="title"]'),
  };

  visitarPaginaLogin() {
    cy.visit("/");
  }

  ingresarUsuario(usuario) {
    this.elements.usernameInput().clear().type(usuario);
  }

  ingresarPassword(password) {
    this.elements.passwordInput().clear().type(password);
  }

  hacerClickEnLogin() {
    this.elements.loginButton().click();
  }

  iniciarSesion(usuario, password) {
    this.ingresarUsuario(usuario);
    this.ingresarPassword(password);
    this.hacerClickEnLogin();
  }

  validarPaginaProductos() {
    cy.url().should("include", "/inventory.html");
    this.elements.productsTitle().should("be.visible").and("contain.text", "Products");
  }

  validarMensajeError(mensaje) {
    this.elements.errorMessage().should("be.visible").and("contain.text", mensaje);
  }
}

export default new LoginPage();