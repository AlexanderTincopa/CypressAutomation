Feature: Login SauceDemo

  Scenario: Verificar login exitoso con credenciales válidas
    Given que ingreso a la página de login de SauceDemo
    When inicio sesión con usuario "standard_user" y password "secret_sauce"
    Then debería visualizar la página de productos

  Scenario: Verificar mensaje de error con usuario bloqueado
    Given que ingreso a la página de login de SauceDemo
    When inicio sesión con usuario "locked_out_user" y password "secret_sauce"
    Then debería visualizar el mensaje de error "Epic sadface: Sorry, this user has been locked out."

  Scenario: Verificar mensaje de error con credenciales inválidas
    Given que ingreso a la página de login de SauceDemo
    When inicio sesión con usuario "standard_user" y password "claveIncorrecta"
    Then debería visualizar el mensaje de error "Epic sadface: Username and password do not match any user in this service"