import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import sauceLoginPage from "../pages/sauceLogin";

Given("que ingreso a la página de login de SauceDemo", () => {
  sauceLoginPage.visitarPaginaLogin();
});

Given("que inicié sesión como usuario {string}", (tipoUsuario) => {
  cy.fixture("users").then((users) => {
    const usuario = users[tipoUsuario];

    expect(usuario, `fixture users.${tipoUsuario}`).to.exist;
    sauceLoginPage.visitarPaginaLogin();
    sauceLoginPage.iniciarSesion(usuario.username, usuario.password);
    sauceLoginPage.validarPaginaProductos();
  });
});

When("inicio sesión con usuario {string} y password {string}", (usuario, password) => {
  sauceLoginPage.iniciarSesion(usuario, password);
});

Then("debería visualizar la página de productos", () => {
  sauceLoginPage.validarPaginaProductos();
});

Then("debería visualizar el mensaje de error {string}", (mensaje) => {
  sauceLoginPage.validarMensajeError(mensaje);
});
