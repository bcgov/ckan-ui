Feature: Login
  As a user who has an account I should be able to log in

Scenario: Login
  Given A user has login credentials
		When They click the login button
		Then They should login