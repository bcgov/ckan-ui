# Change Log
This page is continually updated as changes are made to the BC Data Catalogue and its supporting technologies. 

|**AUDIENCE**|**DESCRIPTION**|
|:---|:---|
| *BCDC Consumers* |Persons who use the published data in accordance to the dataset licence|
| *BCDC Data Providers* | Persons who prepare and published data in the BC Data Catalogue|
| *BCDC Administrators* | Persons who assist with the publishing/retiring of data in the BC Data Catalogue|

## Table of Contents
+ [**RESOURCES**](https://github.com/bcgov/ckan-ui/blob/pages/pages/changelog.md#resources)
+ [**RELEASE DETAILS AND DATES**](https://github.com/bcgov/ckan-ui/blob/pages/pages/changelog.md#release-details-and-dates)
   * [**Fixed Issues**](https://github.com/bcgov/ckan-ui/blob/pages/pages/changelog.md#fixed-issues)
+ [**CURRENT KNOWN ISSUES**](https://github.com/bcgov/ckan-ui/blob/pages/pages/changelog.md#current-known-issues)
+ [**WHAT'S NEW**](#whats-new)
   * [**Application User Interface (UI)**](https://github.com/bcgov/ckan-ui/blob/pages/pages/changelog.md#application-user-interface)
      + [**Landing Page**](https://github.com/bcgov/ckan-ui/blob/pages/pages/changelog.md#landing-page)
      + [**Record Level**](https://github.com/bcgov/ckan-ui/blob/pages/pages/changelog.md#record-level)
      + [**Resource Level**](https://github.com/bcgov/ckan-ui/blob/pages/pages/changelog.md#resource-level)
      + [**Organizations**](https://github.com/bcgov/ckan-ui/blob/pages/pages/changelog.md#organizations)
      + [**Groups**](https://github.com/bcgov/ckan-ui/blob/pages/pages/changelog.md#groups) 
   * [**Application Programming Interface (API)**](https://github.com/bcgov/ckan-ui/blob/pages/pages/changelog.md#application-programming-interface)
   * [**Field, Label and Value Changes**](https://github.com/bcgov/ckan-ui/blob/pages/pages/changelog.md#field-label-and-value-changes)
+ [**USER MANAGEMENT**](https://github.com/bcgov/ckan-ui/blob/pages/pages/changelog.md#user-management)
+ [**SPECS**](https://github.com/bcgov/ckan-ui/blob/pages/pages/changelog.md#specs)

-----------------------

## RESOURCES
+ BC Data Catalogue: https://data.gov.bc.ca/
+ User Documentation: https://bcgov.github.io/data-publication/pages/dps_bcdc.html
   + Beta: https://bcgov.github.io/data-publication/pages/dps_bcdc_w_2.html 
+ Open Data: https://bcgov.github.io/data-publication/pages/open_data.html
+ Keycloak Management: https://github.com/bcgov/ckanext-sso/blob/docs/pages/keycloak_user_mgmt.md
+ Beta Schema: https://cat.data.gov.bc.ca/api/3/action/scheming_dataset_schema_show?type=bcdc_dataset

[RETURN TO TOP][1]

## RELEASE DETAILS AND DATES

|**Deployment No.**|**Description**|**Beta**|**Production**|
|:---:|:---|:---:|:---:|
|7|Beta updates deployed based on user feedbak and backlog prioritization (see [Fixed Issues](https://github.com/bcgov/ckan-ui/blob/pages/pages/changelog.md#fixed-issues))|05-Oct-21|TBD|
|6|Beta updates deployed based on user feedback and backlog prioritization (see [Fixed Issues](https://github.com/bcgov/ckan-ui/blob/pages/pages/changelog.md#fixed-issues))|21-Sep-21|TBD|
|5|All API keys were regenerated in Beta and will propogate to Production at cutover. **IMPACT**: Your current API keys will not work once we have deployed the new BC Data Catalogue.|08-Sep-21|TBD|
|4|Beta updates deployed based on user feedback and backlog prioritization (see [Fixed Issues](https://github.com/bcgov/ckan-ui/blob/pages/pages/changelog.md#fixed-issues))|02-Sep-21|TBD|
|3|Beta released to Editors (data providers)|08-Aug-21|TBD|
|2|Beta released to Admin and internal staff|31-Mar-21|TBD|
|1|Beta migrated from Test|27-Jan-21|TBD|

[RETURN TO TOP][1]

### Fixed Issues

|**Issue**|**Release**|
|:---|:---:|
|Search sort is now by Relevance and not Newest.|4|
|All fields and their values have now been directed to the correct destination. Field updates have been reflected in the Field, Label and Value Changes section below.|4|
|Records for Webservice/API and Application originally now have the date the metadata was created added as a default for the Resource History Lifecycle. Editors may change this to a date they wish.|4|
|Record and Resource deletion now prompts the user to confirm deletion is desired before deleting item.|4|
|Resources that are not previewable, the Preview button is greyed out.|4|
|Resources have been changed to "Access/Download" as was in production Cat Classic.|4|
|Resource file size limit set to be the same as production Cat Classic.|4|
|Resource URL for BCGW Custom Download is no longer visible, removing confusion, as it is not accessible.|4| 
|Page Titles for SEO ([#551](https://github.com/bcgov/ckan-ui/issues/551))|6|
|Fix logging out to end the session to prompt login ([#542](https://github.com/bcgov/ckan-ui/issues/542))|6|
|Modifications to Delete popup messaging ([#518](https://github.com/bcgov/ckan-ui/issues/518))|6|
|New Documentation option under Menu ([#535](https://github.com/bcgov/ckan-ui/issues/535))|6|
|Remove the follow button from the UI ([#566](https://github.com/bcgov/ckan-ui/issues/566))|7|
|Remove admin key from UI config ([#553](https://github.com/bcgov/ckan-ui/issues/553))|7|
|MVP - Update to About Page Text ([#534](https://github.com/bcgov/ckan-ui/issues/534))|7|
|Delete functionality on Record (aka Dataset/Metadata) and associated Resources ([#519](https://github.com/bcgov/ckan-ui/issues/519))|7|
|OFI Configuration - unable to configure secure datasets([#501](https://github.com/bcgov/ckan-ui/issues/501))|7|
|Release 2.0.0-beta.3 Developer Checklist ([#574](https://github.com/bcgov/ckan-ui/issues/574))|7|

[RETURN TO TOP][1]

## CURRENT KNOWN ISSUES
Not all items have been flagged in this list, some are actively being worked on and others are to be prioritized after production release.

1. Secure BCGW Custom Download to be configured (Named user and IDIR only datasets)
1. BCGW Details listed on resources that are not Geographic are still to be reviewed.
    + Some Resources like BCGW WMS and KML having the details information is useful and correct, thus more engagement is needed to determine how to ideally proceed.
1. All Editors can see all record in all states of all organizations.  
1. Group editors and members management to be configured. 
    + All Group management can only be done by users with Admin access at this time. 
3. The OpenAPI Console preview function is not available.
4. The Data Usage page is not available.
5. Resource Update Date is not visible in the UI but via the API. Reviewing best terms to describle what dates this field has.
6. Domain value lists are inconsistent in letter case. Reviewing to make consistent.

[RETURN TO TOP][1]

## WHAT'S NEW

### Application User Interface

#### Landing Page
+ Landing page of https://data.gov.bc.ca has been simplified.
    - Future user engagement intended to determine what would provide additional value on this page.  
+ Landing page toolbar has moved to the top right "pancake": Datasets, Organization, Groups, About, Account Settings, Subscribe to New Data, etc.
+ Quick reference video on the new UI can be found at https://catalogue.data.gov.bc.ca/dataset/42f7ca99-e7f3-40f7-93d7-f2500cccc315/resource/dffc8154-32c7-4671-bd42-3279dede8657/download/data_catalogue_quick_tutorial.mp4

[RETURN TO TOP][1]

#### Record Level
This is also referred to as the package.

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

[RETURN TO TOP][1]

#### Resource Level
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

[RETURN TO TOP][1]

#### Organizations
_Under Construction_

[RETURN TO TOP][1]

#### Groups
_Under Construction_

[RETURN TO TOP][1]

### Application Programming Interface
+ Decoupling backend (CKAN database and API) and frontend (Javascript).
+ Values returned from the API are consistently using the field value and not the field label.
+ JSON Schema now available: https://cat.data.gov.bc.ca/api/3/action/scheming_dataset_schema_show?type=bcdc_dataset
+ See Field, Label and Value Changes [section](https://github.com/bcgov/ckan-ui/blob/pages/pages/changelog.md#field-label-and-value-changes) for changes, including `object_name` having been moved from packages to resources.

**Common queries**:
1. `object_name`
    - `object_name` has moved to the resource level, the API query is slightly different as `object_name` is in the resource extras table.
         + Production: https://catalogue.data.gov.bc.ca/api/3/action/package_search?q=object_name:WHSE_WILDLIFE_MANAGEMENT.WAA_TRAPLINE_AREAS_SP
         + Beta: https://beta-catalogue.data.gov.bc.ca/api/3/action/package_search?q=res_extras_object_name:WHSE_WILDLIFE_MANAGEMENT.WAA_TRAPLINE_AREAS_SP
1. `bcdc_type` (`geographic`, `dataset`, `webservice`, `application`)
    - `bcdc_type` is now the field that contains the resource type, this was previously `type` at the package level.
         + Production: https://catalogue.data.gov.bc.ca/api/3/action/package_search?q=type:Geographic
         + Beta: https://beta-catalogue.data.gov.bc.ca/api/3/action/package_search?q=res_extras_bcdc_type:geographic


[RETURN TO TOP][1]

## FIELD, LABEL AND VALUE CHANGES
This section has moved to a new page, found [here](https://github.com/bcgov/ckan-ui/blob/pages/pages/beta_schema_changes.md#field-label-and-value-changes), and will continue to evolve as changes occur in future releases.
    
## USER MANAGEMENT
+ Management of Admin, Editors and Members of Organization and Groups has moved to being managed in Keycloak.

## SPECS
* **CKAN**: _2.7.5_
* **SOLR**: _7.2.1_

[RETURN TO TOP][1]

[1]: #change-log
