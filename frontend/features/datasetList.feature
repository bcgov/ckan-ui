Feature: DatasetList

Scenario: Not Logged In
    Given A public user comes to the catalogue
            When They click the datastes button
            Then They should be on the dataset list page
        And the title is "Datasets - Data Catalogue"
        And their should be some datasets