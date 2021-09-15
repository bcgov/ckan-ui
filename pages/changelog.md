# Change Log

|**AUDIENCE**|
|:---:|
| *BCDC Consumers* |
| *BCDC Data Providers* | 
| *BCDC Administrators* | 

## Table of Contents
+ [**WHAT'S NEW**](#whats-new)
    - [**Some Known Issues**](#some-known-issues)
        - [**Latest Updates**](#september-2-2021)
    - [**User Interface (UI)**](#user-interface)
        - [**Landing Page**](#landing-page)
        - [**Record Level**](#record-level)
        - [**Resource Level**](#resource-level) 
    - [**Field, Label and Value Changes**](#field-label-and-value-changes)
+ [**API**](#api)
+ [**User Management**](#user-management)
+ [**2020 Pre Beta Specs**](#2020-pre-beta-specs)

-----------------------

## RESOURCES
+ BC Data Catalogue: https://data.gov.bc.ca/
+ User Documentation: https://bcgov.github.io/data-publication/pages/dps_bcdc.html
    + Beta: https://bcgov.github.io/data-publication/pages/dps_bcdc_w_2.html 
+ Open Data: https://bcgov.github.io/data-publication/pages/open_data.html
+ Keycloak Management: https://github.com/bcgov/ckanext-sso/blob/docs/pages/keycloak_user_mgmt.md


# WHAT'S NEW
## USER INTERFACE
### Some Known Issues
Not all items have been flagged in this list, some are actively being worked on and others are to be prioritized after production release.

1. Secure BCGW Custom Download to be configured (Named user and IDIR only datasets)
1. BCGW Details listed on resources that are not Geographic are still to be reviewed.
    + Some Resources like BCGW WMS and KML having the details information is useful and correct, thus more engagement is needed to determine how to ideally proceed.
1. All Editors can see all record in all states of all organizations.  
1. Group editors and members management to be configured. 
    + All Group management can only be done by users with Admin access at this time. 
3. The OpenAPI Console preview function is not available.
4. The Data Usage page is not available.

## September 2 2021
Beta updates deployed based on user feedback and backlog prioritization

**Fixed Issues**

1. Search sort is now by Relevance and not Newest.
1. All fields and their values have now been directed to the correct destination.
    + Field updates have been reflected in the Field, Label and Value Changes section below.
1. Records for Webservice/API and Application originally now have the date the metadata was created added as a default for the Resource History Lifecycle. 
    + Editors may change this to a date they wish.
1. Record and Resource deletion now prompts the user to confirm deletion is desired before deleting item.
1. Resources that are not previewable, the Preview button is greyed out
1. Resources have been changed to "Access/Download" as was in production Cat Classic.
1. Resource file size limit set to be the same as production Cat Classic.
1. Resource URL for BCGW Custom Download is no longer visible, removing confusion, as it is not accessible.

### Landing Page
+ Landing page of https://data.gov.bc.ca has been simplified.
    - Future user engagement intended to determine what would provide additional value on this page.  
+ Landing page toolbar has moved to the top right "pancake": Datasets, Organization, Groups, About, Account Settings, Subscribe to New Data, etc.
+ Quick reference video on the new UI can be found at https://catalogue.data.gov.bc.ca/dataset/42f7ca99-e7f3-40f7-93d7-f2500cccc315/resource/dffc8154-32c7-4671-bd42-3279dede8657/download/data_catalogue_quick_tutorial.mp4

### Record Level
+ Menu Bar: Actions have been consolidated.
    - __NEW__: _Contact Data Expert_ button added, this allows a user to contact the first contact on a record with pre-canned details of what record and what details they should include in the email.
    - __NEW__: _Scroll to Bottom_
    - __NEW__: _Add Resource_ added so that this function is no longer through editing the record itself or from the _Explore_ button.
    - _Copy Dataset_ is now available for all records and their resources types.
    - _Share this Record_ and _Show the Permalink_ merged into _Share_. This copies the permalink URL to a clipboard.
    - _Activity Stream_ removed as it did not provide value as is. Activity Stream is still available from the API.
+ Resources are now listed as resource cards to the right and their actions are their own buttons.
    - _Access/Download_, _View_, _Edit_ (pencil) availale in the _Explore_ button and drop down are now buttons on their own.
    - __NEW__: Deletion (trash can image) of a resource is now available without having to be in edit mode.
        - Only available to Editors and Admins when records is in Draft state.
+ Field layout order has been change to provide consumers quick visual access to the key fields.
    - See Field, Label and Value changes for specific changes including fields that moved from the Record to the Resource, e.g., Object Name.
+ _Map Preview_ has moved to the Resource Level specific to the BC Geographic Warehouse resourse.
+ _View in iMapBC_ button has moved to the Resource Level for the BC Geographic Warehouse resourse.

### Resource Level
+ Menu Bar: Actions have been consolidated to replace the _Manage_ button and other actions.
    - __NEW__: _Contact Data Expert_ button added, this allows a user to contact the first contact on a record with pre-canned details of what record and what details they should include in the email.
    - __NEW__: _Scroll to Bottom_
    - __NEW__: _Preview_ button is to replace:
        -  The map insert on the Resource level for BC Geographic Warehouse public datasets.
        -  For a resource with a map preview the _Link to iMapBC_ button is available on the module.
        -  The Data Explorer for tabular datasets that are uploaded to the catalogue.
        -  The OpenAPI Console for APIs registered with the API Gateway.
    - __NEW__: _Share_ was not an option from the Resource level in the previous ittereation of this button. This copiest the permalink URL to a clipboard.
    - _Access/Download_ is consistent with the other menu buttons.
    - _Data API_ button has been removed.
+ Field layout order has been change to provide consumers quick visual access to the key fields.
    - See Field, Label and Value changes for specific changes including fields that been included from the Record level, e.g., Object Name.
+ Resource types]have moved from the Record level to allow a record to have any of the different resource types:
    - Application, Dataset/Document, Geospatial Dataset, Webservice/API.
+ BC Geographic Warehouse (BCGW) specific items have moved to the Resource level including:
    - **Data definitions**, e.g., Object name,  field names, types, lengths and descriptions have moved to the resources called **Custom BCGW Download**. 
        - For those not downloadable from the Distribution Services, in production resources have been added to ensure the BCGW data from the record to the resource is retained. 
    - **Map Preview** inset has moved to the resource toolbar ![image](https://user-images.githubusercontent.com/32690119/117981892-526e8c00-b2ea-11eb-8211-35499fc24fd8.png) button.
    - **Link to iMapBC** specific public presentations has moved to the resource Preview ![image](https://user-images.githubusercontent.com/32690119/117982127-8a75cf00-b2ea-11eb-9377-c3b5f73908f9.png).

# FIELD, LABEL AND VALUE CHANGES
**Field Labels** are what is visible in the user interface.
**Field Names** are what is returned from the API.

+ **Fields added**:

    |UI Field Label |Database Field Name|
    |:---|:---|
    |JSON Table Schema | json_table_schema|
    |More Info Description|description|
 
+ **Fields removed**:
    - No fields have been removed from the database but some have been removed from the UI.
  
    |UI Field Label |Database Field Name|Rational|
    |:---|:---|:---|
    |Sector | sector|No longer used in Government|
    |Contact Organization|organization| |

+ **Fields renamed**:

    |UI FieldLabel|New Database Field Name |Old Database Field Name|
    |:---|:---|:---|
    |State| publish_state | edc_state|
    |Type|bcdc_type|type|
    |Resource Access Method|resource_access_method|resource_storage_access_method|
    | |beginning_date|data_collection_start_date  | 
    | |end_date|data_collection_end_date|
    | |resource_type|edc_resource_type|  
    |Contacts Branch|org|branch|
    |ISO Topic Category|iso_topic_category|iso_topic_string  | 

+ **Fields use change**:

    |UI Field Label|Database Field Name|New Use |Old Use|
    |:---|:---|:---|:---|
    |Published by | owner_org|  Suborg |Organization and suborg concatentated|  
    
+ **Fields moved to Composite or Composite Repeating Fields**:
    - For those that use the catalogue API, these changes may impact scripting.
    
    |Database Field Name|Database Field within|Move to|
    |:---|:---|:---|
    |beginning_date ; end_date| temporal_extent | NA|
    |edc_resource_type; resource_storage_location  |extras|from package to resource|
    |short_name; column_name; data_type; column_comments |details|from package to resource|
    | preview_latitude; preview_longitude ; preview_map_service_url; preview_zoom_level ; preview_image_url; link_to_imap; layer_name; image_url|preview_info|from package to resource|
    |name, email, org, role, displayed|Contacts|NA|
    |iso_topic_category|Resource level  | 
       
+ **Fields available to other resources types**:
    - Additional resource fields that existed for Tabular or Geographic data have now also been made available for Applications and Webservices/APIs.
    
    |UI Field Label|Database Field Name |Resource Types Added To|
    |:---|:---|:---|
    |Record Lifecylce History: Type and Date|type; date |Record level for all types|
    |Resource Descrition|resource_description|Web Service/API ; Application|
    |Supplimental Information|supplemental_information|Web Service/API ; Application|
    |Temporal Extent: Beginning Date; End Date|temporal_extent:beginning_date ; end_date|Web Service/API ; Application|
    |Resource Storage Location|resource_storage_location|Web Service/API ; Application|
    |Resource Type|resource_type|Web Service/API ; Application|
    |Resource Access Method|Resource Access Method|Web Service/API ; Application|

+ **Drop down values added**:

    |UI Field Label |Database Field Name|Value Added|
    |:---|:---|
    |Contact Role| contact_role| Data Manager; Custodian; Data Steward; Access Approver|
    |Resource Update Cycle|resource_update_cycle|Nightly, Unknown|
    |Resource Storage Format|format|gpkg (geopackage); multiple|
    |Resource Storage Location|resource_storage_location| Not Applicatble|
    |Spatial Datatype|spatial_datatype|UNKNOWN, NA|
    
+ **Drop down values renamed**:
    - The Security Classification updated to match [OCIO Information Security Classification Guidelines](https://intranet.gov.bc.ca/intranet/content?id=2041BD1842AA4696BC76691FB9A0CE92)
    
    |UI Field Label |Value Added|Old Value|
    |:---|:---|:---|
    |Security Classification |PUBLIC | LOW-PUBLIC|PROTECTED A | LOW-SENSITIVITY|
    | |PROTECTED B | MEDIUM-SENSITIVITY, MEDIUM-PERSONAL|
    | |PROTECTED C | HIGH-CONFIDENTIAL, HIGH-SENSITIVITY|
    |Resource Type| document|dataset|
    |Projection Name| short name| full title|
     
+ **Drop down values removed**:

    |UI Field Label |Value Removed|Rational|
    |:---|:---|:---|
    |Resource Status |Rejected | Records are now set back to Draft whey they do not meet the requirements of be published|
        
### API
+ Decoupling backend (CKAN database and API) and frontend (Javascript).
+ Values returned from the API are consistently using the field value and not the field label.
+ JSON Schema now available: https://cat.data.gov.bc.ca/api/3/action/scheming_dataset_schema_show?type=bcdc_dataset
+ See field section for changes, including object_name having been moved from packages to resources.


### USER MANAGEMENT
+ Management of Admin, Editors and Members of Organization and Groups has moved to being managed in Keycloak.

### SPECS
* CKAN: 2.7.5
* SOLR: 7.2.1

## August 8 2021
Beta released to Editors (data providers)

## March 31 2021
Beta released to Admin and internal staff

## January 27 2021
Beta migrated from Test

## 2020 Pre-Beta Specs

[RETURN TO TOP][1]

[1]: #change-log
