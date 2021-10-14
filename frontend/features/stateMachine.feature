Feature: State Machine
  As a user who has an account with editor or better permissions I should be able to navigate to valid states

Scenario: Editor Creating
  Given A user has "editor" permissions and is creating a dataset
		When They have selected an org
		Then They should be able to select the "Draft" State
        And They should not be able to select any other state

Scenario: Admin Creating
  Given A user has "admin" permissions and is creating a dataset
		When They have selected an org
		Then They should be able to select the "Draft" State
        And They should not be able to select any other state

Scenario: Sysadmin Creating
  Given A user has "sysAdmin" permissions and is creating a dataset
		When They have selected an org
		Then They should be able to select the "Draft" State
        And They should not be able to select any other state


Scenario: Editor Editing Draft
  Given A user has "editor" permissions and is editing a "draft" dataset
		Then They should be able to select the "Draft" State
        And They should be able to select the "Pending Publish" State
        And They should not be able to select any other state

Scenario: Admin Editing Draft
  Given A user has "admin" permissions and is editing a "draft" dataset
		Then They should be able to select the "Draft" State
        And They should be able to select the "Pending Publish" State
        And They should not be able to select any other state

Scenario: sysAdmin Editing Draft
  Given A user has "sysAdmin" permissions and is editing a "draft" dataset
		Then They should be able to select the "Draft" State
        And They should be able to select the "Pending Publish" State
        And They should not be able to select any other state

Scenario: Editor Editing Pending Published
  Given A user has "editor" permissions and is editing a "pending publish" dataset
		Then They should be able to select the "Draft" State
        And They should be able to select the "Pending Publish" State
        And They should not be able to select any other state

Scenario: Admin Editing Pending Published
  Given A user has "admin" permissions and is editing a "pending publish" dataset
		Then They should be able to select the "Draft" State
        And They should be able to select the "Pending Publish" State
        And They should be able to select the "Published" State
        And They should not be able to select any other state