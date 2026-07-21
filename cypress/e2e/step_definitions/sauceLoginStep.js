import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import sauceLoginPage from "../pages/sauceLogin";

Given("que ingreso a la página de login de SauceDemo", () => {
  sauceLoginPage.visitarPaginaLogin();
});

Given("que ingreso a la página de login de SauceDemo", () => {
  sauceLoginPage.visitarPaginaLogin();
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