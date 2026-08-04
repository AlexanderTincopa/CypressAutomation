import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import sauceInventoryPage from "../pages/sauceInventory";
import sauceCartPage from "../pages/sauceCart";

function obtenerProducto(claveProducto, accion) {
  cy.fixture("products").then((products) => {
    const producto = products[claveProducto];

    expect(producto, `fixture products.${claveProducto}`).to.exist;
    accion(producto);
  });
}

When("agrego el producto configurado {string} al carrito", (claveProducto) => {
  obtenerProducto(claveProducto, (producto) => {
    sauceInventoryPage.agregarProductoAlCarrito(producto.name);
  });
});

When("elimino el producto configurado {string} desde el inventario", (claveProducto) => {
  obtenerProducto(claveProducto, (producto) => {
    sauceInventoryPage.eliminarProductoDelInventario(producto.name);
  });
});

Then("el indicador del carrito debería mostrar {int} producto(s)", (cantidad) => {
  sauceInventoryPage.validarCantidadCarrito(cantidad);
});

When("abro el carrito de compras", () => {
  sauceInventoryPage.abrirCarrito();
  sauceCartPage.validarPaginaCarrito();
});

Then("debería visualizar el producto configurado {string} en el carrito", (claveProducto) => {
  obtenerProducto(claveProducto, (producto) => {
    sauceCartPage.validarProducto(producto);
  });
});

When("elimino el producto configurado {string} del carrito", (claveProducto) => {
  obtenerProducto(claveProducto, (producto) => {
    sauceCartPage.eliminarProducto(producto.name);
  });
});

Then("el carrito debería estar vacío", () => {
  sauceCartPage.validarCarritoVacio();
});
