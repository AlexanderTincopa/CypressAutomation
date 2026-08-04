Feature: Inventario de SauceDemo

  Background:
    Given que inicié sesión como usuario "standard"

  @smoke @regression
  Scenario: Visualizar el inventario disponible
    Then debería visualizar 6 productos en el inventario

  @regression
  Scenario: Ordenar productos por precio ascendente
    When ordeno los productos por "Price (low to high)"
    Then los productos deberían mostrarse por precio ascendente

  @regression
  Scenario: Consultar el detalle de un producto
    When abro el detalle del producto configurado "backpack"
    Then debería visualizar los datos configurados del producto "backpack"
