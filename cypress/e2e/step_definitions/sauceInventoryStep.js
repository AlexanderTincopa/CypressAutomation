import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import sauceInventoryPage from "../pages/sauceInventory";

Then("debería visualizar {int} productos en el inventario", (cantidad) => {
  sauceInventoryPage.validarCantidadProductos(cantidad);
});

When("ordeno los productos por {string}", (criterio) => {
  sauceInventoryPage.ordenarProductos(criterio);
});

Then("los productos deberían mostrarse por precio ascendente", () => {
  sauceInventoryPage.validarPreciosAscendentes();
});

When("abro el detalle del producto configurado {string}", (claveProducto) => {
  cy.fixture("products").then((products) => {
    const producto = products[claveProducto];

    expect(producto, `fixture products.${claveProducto}`).to.exist;
    sauceInventoryPage.abrirDetalleProducto(producto.name);
  });
});

Then("debería visualizar los datos configurados del producto {string}", (claveProducto) => {
  cy.fixture("products").then((products) => {
    const producto = products[claveProducto];

    expect(producto, `fixture products.${claveProducto}`).to.exist;
    sauceInventoryPage.validarDetalleProducto(producto);
  });
});
