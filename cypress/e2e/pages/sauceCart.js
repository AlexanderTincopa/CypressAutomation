class CartPage {
  elements = {
    title: () => cy.get('[data-test="title"]'),
    cartItems: () => cy.get('[data-test="inventory-item"]'),
    cartBadge: () => cy.get('[data-test="shopping-cart-badge"]'),
  };

  obtenerProducto(nombreProducto) {
    return this.elements
      .cartItems()
      .filter(`:contains("${nombreProducto}")`)
      .first();
  }

  validarPaginaCarrito() {
    cy.url().should("include", "/cart.html");
    this.elements.title().should("be.visible").and("have.text", "Your Cart");
  }

  validarProducto(producto) {
    this.obtenerProducto(producto.name).within(() => {
      cy.get('[data-test="inventory-item-name"]').should("have.text", producto.name);
      cy.get('[data-test="inventory-item-price"]').should("have.text", producto.price);
    });
  }

  eliminarProducto(nombreProducto) {
    this.obtenerProducto(nombreProducto)
      .find("button")
      .contains("Remove")
      .click();
  }

  validarCarritoVacio() {
    this.elements.cartItems().should("not.exist");
    this.elements.cartBadge().should("not.exist");
  }
}

export default new CartPage();
