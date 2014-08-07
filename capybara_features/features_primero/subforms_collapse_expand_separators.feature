#JIRA PRIMERO-412

@javascript @primero
Feature: Subforms Collapse Expand separators
  As a User, I want to collapse or expand subforms to reduce the amount of information displayed

  Scenario: As a logged in user and collapse subforms attack on schools, I want to collapse separators fields
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Violations" button
    And I press the "Attack on Schools" button
    And I collapsed the 1st "Attack on Schools Subform Section" subform
    Then I should see collapsed the 1st "Attack on Schools Subform Section" subform

  Scenario: As a logged in user and collapse subforms attack on hospitals, I want to collapse separators fields
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Violations" button
    And I press the "Attack on Hospitals" button
    And I collapsed the 1st "Attack on Hospitals Subform Section" subform
    Then I should see collapsed the 1st "Attack on Hospitals Subform Section" subform

  Scenario: As a logged in user and collapse subforms denial of humanitarian access, I want to collapse separators fields
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Violations" button
    And I press the "Denial of Humanitarian Access" button
    And I add a "Denial Humanitarian Access Section" subform
    And I collapsed the 1st "Denial Humanitarian Access Section" subform
    Then I should see collapsed the 1st "Denial Humanitarian Access Section" subform