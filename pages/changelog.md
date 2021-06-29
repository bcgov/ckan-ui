# Change Log

|**AUDIENCE**|
|:---:|
| *BCDC Consumers* |
| *BCDC Data Providers* | 
| *BCDC Administrators* | 

## Table of Contents
+ [**WHAT'S NEW**](#whats-new)
+ [**May 2021 Beta**](#may-2021-beta)
   - [**User Interface (UI)**](#user-interface-ui)
   - [**Field and Value Changes**](#field-and-value-changes)
   - [**API**](#api)
   - [**User Management**](#user-management)
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
**Known Issues List**
1. Secure BCGW Custom Download to be configured (Named user and IDIR only datasets)
1. Geographic datasets Download vs Request Access
1. BCGW Details listed on resources that are not Geographic are still to be removed.
1. All Editors can see all record in all states of all organizations.  
1. Group editors and members management to be configured.  
1. Webservice/API and Application records now have Record Lifecycle date fields added that are mandatory. These will cause editing of their resources to error.
1. Some column mapping between production and beta did not tranlate correctly for resources with new fields, these will be scripted and updated.
1. 

**Landing Page**
+ The main page of https://data.gov.bc.ca has been simplified.
+ Front page toolbar has moved to the top right pancake: Organization, Groups, About, Account Settings, Subscribe to New Data, Usage Stats, etc.
+ Quick reference video on the new UI can be found at https://catalogue.data.gov.bc.ca/dataset/42f7ca99-e7f3-40f7-93d7-f2500cccc315/resource/dffc8154-32c7-4671-bd42-3279dede8657/download/data_catalogue_quick_tutorial.mp4

**Record Level**
+ Ministry or parent organization no longer listed on records.
+ Contact Data Expert button added, this allows a user to contact the first contact on a record with pre-canned details of what record and what details they should include in the email.
+ Resources are now in a list of resource cards to the right.
+ Access a resource is now two buttons vs a drop down on the resource card.
+ For Editors, editing can be done with the pencil on the resource card.

**Resource Level**
+ Resource types moved to resource level, instead of at dataset or "record" level to allow a dataset to have any of the different resource types: Application, Dataset/Document, Geospatial Dataset, Webservice/API.
+ BC Geographic Warehouse (BCGW) items have moved:
    - **Data definitions**, e.g., field names, types, lengths and descriptions have moved to the resources called **Custom BCGW Download**. 
        - For those not downloadable from the Distribution Services, these will be managed as one offs.
    - **Map Preview** inset has moved to the resource toolbar ![image](https://user-images.githubusercontent.com/32690119/117981892-526e8c00-b2ea-11eb-8211-35499fc24fd8.png) button.
    - **Link to iMapBC** specific presentations has moved to the resource Preview ![image](https://user-images.githubusercontent.com/32690119/117982127-8a75cf00-b2ea-11eb-9377-c3b5f73908f9.png).


### FIELD AND VALUE CHANGES
**Field Labels** are what is visible in the user interface.
**Field Names** are what is returned from the API.

+ **Fields added**:

    |Field Label |Field Name|
    |:---|:---|
    |JSON Table Schema | json_table_schema|
    |More Info Description|description|
 
+ **Fields removed**:
   
    |Field Label |Field Name|Rational|
    |:---|:---|:---|
    |Sector | sector|No longer used in Government|
    | |metastar_uid |Old Discovery Service unique ID|
    | |odsi_uid|Old Open Data Catalogue unique ID|
    | |ofi| |

+ **Fields renamed**:

    |Field Label|New Field Name |Old Field Name|
    |:---|:---|:---|
    |State| publish_state | edc_state|
    |Type|bcdc_type|type|
    |Resource Access Method|resource_access_method|resource_storage_access_method|
    |Resourage Storage Format|resource_storage_format|format|
    | |beginning_date|data_collection_start_date  | 
    | |end_date|data_collection_end_date|
    | |resource_type|edc_resource_type|
    | |resource_description |description|    
    | |suplemental_information|supplemental_info  | 
    |More Info URL |url|link|
    |Contacts Branch|org|branch|

     
    
+ **Fields moved to Composet or Composent Repeating Fields**:
    - For those that use the catalogue API, these changes may impact scripting.
    
    |Field Name|Field within|Move to|
    |:---|:---|
    |beginning_date ; end_date| temporal_extent |
    |edc_resource_type; resource_storage_location  |extras|from package to resource|
    |short_name; column_name; data_type; column_comments |details|from package to resource|
    | preview_latitude; preview_longitude ; preview_map_service_url; preview_zoom_level ; preview_image_url; link_to_imap; layer_name; image_url|preview_info|from package to resource|
    |name, email, org, role, displayed|Contacts|
    
    
+ **Fields available to other resources types**:
    - Additional resource fields that existed for Tabular or Geographic data have now also been made available for Applications and Webservices/APIs.
    
    |Label|Field Name |Resource Types Added To|
    |:---|:---|:---|
    |Record Lifecylce History: Type and Date|type; date |Record level for all types|
    |Resource Descrition|resource_description|Web Service/API ; Application|
    |Supplimental Information|supplemental_information|Web Service/API ; Application|
    |Temporal Extent: Beginning Date; End Date|temporal_extent:beginning_date ; end_date|Web Service/API ; Application|
    |Resource Storage Location|resource_storage_location|Web Service/API ; Application|
    |Resource Type|resource_type|Web Service/API ; Application|
    |Resource Access Method|Resource Access Method|Web Service/API ; Application|

+ **Drop down values added**:

    |Field Label |Value Added|
    |:---|:---|
    |Contact Role| Data Manager; Custodian; Data Steward|
    |Resource Update Cycle|Nightly|
    |Resource Storage Format|gpkg (geopackage); multiple|
    
+ **Drop down values renamed**:
    - The Security Classification updated to match [OCIO Information Security Classification Guidelines](https://intranet.gov.bc.ca/intranet/content?id=2041BD1842AA4696BC76691FB9A0CE92)
    
    |Field Label |Value Added|Old Value|
    |:---|:---|:---|
    |Security Classification |PUBLIC | LOW-PUBLIC|PROTECTED A | LOW-SENSITIVITY|
    | |PROTECTED B | MEDIUM-SENSITIVITY, MEDIUM-PERSONAL|
    | |PROTECTED C | HIGH-CONFIDENTIAL, HIGH-SENSITIVITY|
    |Resource Type| document|dataset|
    |Projection Name| short name| full title|
    
+ **Drop down values removed**:

    |Field Label |Value Removed|Rational|
    |:---|:---|:---|
    |Resource Status |Rejected | Records are now set back to Draft whey they do not meet the requirements of be published|
        
### API
+ Decoupling backend (CKAN database and API) and frontend (Javascript).
+ Values returned from the API are consistently using the field value and not the field label.
+ JSON Schema now available: https://github.com/bcgov/ckanext-bcgov-schema/blob/master/ckanext/bcgov_schema/bcdc_dataset.json
+ See field section for changes to field names and fields being nested in ?

### USER MANAGEMENT
+ Management of Admin, Editors and Members of Organization and Groups has moved to being managed in Keycloak.

### SPECS
* CKAN: 2.7.5
* SOLR: 7.2.1

## 2020 Pre-Beta Specs

[RETURN TO TOP][1]

[1]: #change-log
