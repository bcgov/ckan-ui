# Change Log

|**AUDIENCE**|
|:---:|
| *BCDC Data Providers* | 
| *BCDC Administrators* | 
| *BCDC Consumers* |

## Table of Contents
+ [**WHAT'S NEW**](#whats-new)
+ [**May 2021 Beta**](#may-2021-beta)
+ [**2020 Pre Beta Specs**](#2020-pre-beta-specs)

-----------------------

## RESOURCES
+ BC Data Catalogue: https://data.gov.bc.ca/
+ User Documentation: https://bcgov.github.io/data-publication/pages/dps_bcdc.html
+ Open Data: https://bcgov.github.io/data-publication/pages/open_data.html
+ Keycloak Management: https://github.com/bcgov/ckanext-sso/blob/docs/pages/keycloak_user_mgmt.md

# WHAT'S NEW
## May 2021 Beta
+ Release of Beta!

### USER INTERFACE
+ The main page of https://data.gov.bc.ca has been simlified.
+ Front page toolbar has moved to the top right pancake: Organization, Groups, About, Account Settings, Subscribe to New Data, Usage Stats, etc.
+ Resource types moved to resource level, instead of at dataset or "record" level to allow a dataset to have any of the different resource types: Application, Dataset/Document, Geospatial Dataset, Webservice/API.
+ BC Geographic Warehouse (BCGW) items have moved:
    - **Data definitions**, e.g., field names, types, lengths and descriptions have moved to the resources called **Custom BCGW Download**. 
        - For those not downloadable from the Distribution Services, these will be managed as one offs.
    - **Map Preview** inset has moved to the resource toolbar ![image](https://user-images.githubusercontent.com/32690119/117981892-526e8c00-b2ea-11eb-8211-35499fc24fd8.png) button.
    - **Link to iMapBC** specific presentations has moved to the resource Preview ![image](https://user-images.githubusercontent.com/32690119/117982127-8a75cf00-b2ea-11eb-9377-c3b5f73908f9.png).
+ Ministry or parent organization no longer listed on records.
+ Contact Data Expert button added, this allows a user to contact the first contact on a record with pre-canned details of what record and what details they should include in the email.

### FIELDS AND VALUES
**Field Labels** are what is visible in the user interface.
**Field Names** are what is visible from the API.

+ Fields added:

    |Field Label |Field Name|
    |:---|:---|
    |JSON Table Schema | json_table_schema|
    |More Info Description|description|
 
+ Fields removed:
   
    |Field Label |Field Name|Rational|
    |:---|:---|:---|
    |Sector | sector|No longer used in Government|
    | |metastar_uid |Old Discovery Service unique ID|
    | |odsi_uid|Old Open Data Catalogue unique ID|

+ Fields renamed:

    |Field Label|New Field Name |Old Field Name|
    |:---|:---|:---|
    |State| publish_state | edc_state|
    |Type|bcdc_type|type|
    |Resource Access Method|resource_access_method|resource_storage_access_method|
    
+ Fields moved:
    - For those that use the catalogue API, these changes may impact scripting.
    
    |Field Name|Now Nested Within|
    |:---|:---|
    |beginning_date ; end_date| temporal_extent |
    |edc_resource_type; resource_storage_location  |extras|
    |short_name; column_name; data_type; column_comments |details|
    | preview_latitude; preview_longitude ; preview_map_service_url; preview_zoom_level ; preview_image_url; link_to_imap; layer_name; image_url|preview_info|
    
+ Fields available to other resources:
    - Additional resources fields that existed for Tabular data have now also been made available for Applications and Webservices/APIs.
    
    |Field Label|Field Name |Resource Types Added To|
    |:---|:---|:---|
    |Resource Update Cycle|| |
    |Temporal Extent|||
    |Resource Stroage Format|||
    |Resource Storage Location|||
    |Resource Access Method|||

+ Drop down values added or renamed:
    - The Security Classification updated to match [OCIO Information Security Classification Guidelines](https://intranet.gov.bc.ca/intranet/content?id=2041BD1842AA4696BC76691FB9A0CE92)
    
    |Field Label |Value Added|Old Value|
    |:---|:---|:---|
    |Security Classification |PUBLIC | LOW-PUBLIC|PROTECTED A | LOW-SENSITIVITY|
    | |PROTECTED B | MEDIUM-SENSITIVITY, MEDIUM-PERSONAL|
    | |PROTECTED C | HIGH-CONFIDENTIAL, HIGH-SENSITIVITY|
    |Contact Role| Data Manager; Custodian; Data Steward| |
    |Resource Update Cycle|Nightly|
    |Resource Storage Format|gpkg (geopackage); multiple|
    
+ Drop down values removed:

    |Field Label |Value Removed|Rational|
    |:---|:---|:---|
    |Resource Status |Rejected | Records are now set back to Draft whey they do not meet the requirements of be published|
    
    
### API
+ Decoupling backend (CKAN database and API) and frontend (Javascript).
+ Values returned from the API are consistently using the field value and not the field label.
+ JSON Schema now available: https://github.com/bcgov/ckanext-bcgov-schema/blob/master/ckanext/bcgov_schema/bcdc_dataset.json
+ See field section for changes to field names and fields being nested in ?


## 2020 Pre-Beta Specs

[RETURN TO TOP][1]

[1]: #change-log
