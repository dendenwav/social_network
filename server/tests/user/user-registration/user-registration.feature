Feature: User Registration
    As a potential user
    I want to register to the application
    So that I can be a user of the application

    Scenario: Creating a new account
        Given I am on the registration page
        When I enter the following user details:
            | pseudo  | username | email            | password    |
            | john123 | john     | john@example.com | Pa$$w0rd123 |
        And I submit the registration form
        Then I should be registered
        And I should have the deifned pseudo
        And I should have the defined username
        And I should have the defined email
        And I should have the defined password (hashed)