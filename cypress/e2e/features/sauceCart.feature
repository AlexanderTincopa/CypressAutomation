Feature: Carrito de compras de SauceDemo

  Background:
    Given que inicié sesión como usuario "standard"

  @smoke @regression
  Scenario: Agregar un producto al carrito
    When agrego el producto configurado "backpack" al carrito
    Then el indicador del carrito debería mostrar 1 producto
    When abro el carrito de compras
    Then debería visualizar el producto configurado "backpack" en el carrito

  @regression
  Scenario: Eliminar un producto desde el carrito
    When agrego el producto configurado "bikeLight" al carrito
    And abro el carrito de compras
    When elimino el producto configurado "bikeLight" del carrito
    Then el carrito debería estar vacío

  @regression
  Scenario: Eliminar un producto desde el inventario
    When agrego el producto configurado "backpack" al carrito
    And elimino el producto configurado "backpack" desde el inventario
    Then el indicador del carrito debería mostrar 0 productos
