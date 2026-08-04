class InventoryPage {
  elements = {
    inventoryItems: () => cy.get('[data-test="inventory-item"]'),
    itemNames: () => cy.get('[data-test="inventory-item-name"]'),
    itemPrices: () => cy.get('[data-test="inventory-item-price"]'),
    sortSelect: () => cy.get('[data-test="product-sort-container"]'),
    detailName: () => cy.get('[data-test="inventory-item-name"]'),
    detailDescription: () => cy.get('[data-test="inventory-item-desc"]'),
    detailPrice: () => cy.get('[data-test="inventory-item-price"]'),
    cartLink: () => cy.get('[data-test="shopping-cart-link"]'),
    cartBadge: () => cy.get('[data-test="shopping-cart-badge"]'),
  };

  obtenerProducto(nombreProducto) {
    return this.elements
      .inventoryItems()
      .filter(`:contains("${nombreProducto}")`)
      .first();
  }

  validarCantidadProductos(cantidad) {
    this.elements.inventoryItems().should("have.length", cantidad);
  }

  ordenarProductos(criterio) {
    this.elements.sortSelect().select(criterio);
  }

  validarPreciosAscendentes() {
    this.elements.itemPrices().then(($precios) => {
      const precios = [...$precios].map((precio) =>
        Number(precio.innerText.replace("$", ""))
      );
      const preciosOrdenados = [...precios].sort((a, b) => a - b);

      expect(precios).to.deep.equal(preciosOrdenados);
    });
  }

  abrirDetalleProducto(nombreProducto) {
    this.elements.itemNames().contains(nombreProducto).click();
  }

  validarDetalleProducto(producto) {
    this.elements.detailName().should("have.text", producto.name);
    this.elements.detailDescription().should("contain.text", producto.description);
    this.elements.detailPrice().should("have.text", producto.price);
  }

  agregarProductoAlCarrito(nombreProducto) {
    this.obtenerProducto(nombreProducto)
      .find("button")
      .contains("Add to cart")
      .click();
  }

  eliminarProductoDelInventario(nombreProducto) {
    this.obtenerProducto(nombreProducto)
      .find("button")
      .contains("Remove")
      .click();
  }

  validarCantidadCarrito(cantidad) {
    if (cantidad === 0) {
      this.elements.cartBadge().should("not.exist");
      return;
    }

    this.elements.cartBadge().should("have.text", String(cantidad));
  }

  abrirCarrito() {
    this.elements.cartLink().click();
  }
}

export default new InventoryPage();
