# Change Log
This page is continually updated as changes are made to the BC Data Catalogue and its supporting technologies. 

|**AUDIENCE**|**DESCRIPTION**|
|:---|:---|
| *BCDC Consumers* |Persons who use the published data in accordance to the dataset licence|
| *BCDC Data Providers* | Persons who prepare and published data in the BC Data Catalogue|
| *BCDC Administrators* | Persons who assist with the publishing/retiring of data in the BC Data Catalogue|

## Table of Contents
+ [**RESOURCES**](changelog.md#resources)
+ [**RELEASE DETAILS AND DATES**](changelog.md#release-details-and-dates)
   + [**Fixed Issues**](changelog.md#fixed-issues)
+ [**CURRENT KNOWN ISSUES**](changelog.md#current-known-issues)
+ [**WHAT'S NEW**](#whats-new)
   + [**Application User Interface (UI)**](changelog.md#application-user-interface)
      + [**Landing Page**](changelog.md#landing-page)
      + [**Record Level**](changelog.md#record-level)
      + [**Resource Level**](changelog.md#resource-level)
      + [**Organizations**](changelog.md#organizations)
      + [**Groups**](https://github.com/bcgov/ckan-ui/blob/pages/pages/changelog.md#groups) 
   + [**Application Programming Interface (API)**](changelog.md#application-programming-interface)
+ [**USER MANAGEMENT**](changelog.md#user-management)
+ [**TECHNOLOGY SPECIFICATIONS**](changelog.md#technology-specifications)

-----------------------

## RESOURCES
+ BC Data Catalogue: https://data.gov.bc.ca/
+ User Documentation: https://bcgov.github.io/data-publication/pages/dps_bcdc.html
   + All pages are flipped to be for this release, for classic see https://bcgov.github.io/data-publication/pages/dps_bcdc_classic_w.html 
+ Open Data: https://bcgov.github.io/data-publication/pages/open_data.html
+ Keycloak Management: https://github.com/bcgov/ckanext-sso/blob/docs/pages/keycloak_user_mgmt.md
+ Beta Schema: https://cat.data.gov.bc.ca/api/3/action/scheming_dataset_schema_show?type=bcdc_dataset

[RETURN TO TOP][1]

## RELEASE DETAILS AND DATES

|**Deployment No.**|**Description**|**Test**|**Production**|
|:---:|:---|:---:|:---:|
|22|Keyword fixes, render URLs as links, update Resources title (see [Fixed Issues](https://github.com/bcgov/ckan-ui/blob/master/pages/changelog.md#fixed-issues))|24-Feb-23||
|21|Implement Google Analytics, add self-serve admin panel, refactor auth for SSO migration (see [Fixed Issues](https://github.com/bcgov/ckan-ui/blob/master/pages/changelog.md#fixed-issues))|12-July-22|19-July-22|
|20|UI and permissions improvements (see [Fixed Issues](https://github.com/bcgov/ckan-ui/blob/master/pages/changelog.md#fixed-issues))|18-May-22|16-June-22|
|19|UI improvements, sitemap caching (see [Fixed Issues](https://github.com/bcgov/ckan-ui/blob/master/pages/changelog.md#fixed-issues))|09-May-22|12-May-22|
|18|UI improvements (see [Fixed Issues](https://github.com/bcgov/ckan-ui/blob/master/pages/changelog.md#fixed-issues))|23-March-22|19-April-22|
|17|Remove survey banner, fix contact and lifecycle date deletions (see [Fixed Issues](https://github.com/bcgov/ckan-ui/blob/master/pages/changelog.md#fixed-issues))|14-March-22|17-March-22|
|16|Fix record history lifecycle, update search order, remove gravitar (see [Fixed Issues](https://github.com/bcgov/ckan-ui/blob/master/pages/changelog.md#fixed-issues))|23-Feb-22|10-March-22|
|15|Fix loading of groups page, added configurable information banner, updated about page (see [Fixed Issues](https://github.com/bcgov/ckan-ui/blob/master/pages/changelog.md#fixed-issues))|26-Jan-22|14-Feb-22|
|14|Enable snowplow analytics to be captured (see [Fixed Issues](https://github.com/bcgov/ckan-ui/blob/master/pages/changelog.md#fixed-issues))|07-Jan-22|26-Jan-22|
|13|Update to enable exclamation marks and commas in URLs (see [Fixed Issues](https://github.com/bcgov/ckan-ui/blob/master/pages/changelog.md#fixed-issues))|08-Dec-21|12-Jan-22|
|12|Updates deployed based on user feedback and backlog prioritization (see [Fixed Issues](https://github.com/bcgov/ckan-ui/blob/master/pages/changelog.md#fixed-issues))|23-Nov-21|30-Nov-21|
|11|Beta updates deployed based on user feedback and backlog prioritization (see [Fixed Issues](https://github.com/bcgov/ckan-ui/blob/master/pages/changelog.md#fixed-issues))|29-Oct-21|5-Nov-21|
|10|Update to improve catalogue stability (see [Fixed Issues](https://github.com/bcgov/ckan-ui/blob/master/pages/changelog.md#fixed-issues))|28-Oct-21|28-Oct-21|
|9|Beta updates deployed based on user feedback and backlog prioritization (see [Fixed Issues](https://github.com/bcgov/ckan-ui/blob/master/pages/changelog.md#fixed-issues))|21-Oct-21|27-Oct-21|
|8|Beta updates deployed based on user feedback and backlog prioritization (see [Fixed Issues](https://github.com/bcgov/ckan-ui/blob/master/pages/changelog.md#fixed-issues))|20-Oct-21|27-Oct-21|
|7|Beta updates deployed based on user feedback and backlog prioritization (see [Fixed Issues](https://github.com/bcgov/ckan-ui/blob/master/pages/changelog.md#fixed-issues))|05-Oct-21|27-Oct-21|
|6|Beta updates deployed based on user feedback and backlog prioritization (see [Fixed Issues](https://github.com/bcgov/ckan-ui/blob/master/pages/changelog.md#fixed-issues))|21-Sep-21|27-Oct-21|
|5|All API keys were regenerated in Beta and will propogate to Production at cutover. **IMPACT**: Your current API keys will not work once we have deployed the new BC Data Catalogue.|08-Sep-21|27-Oct-21|
|4|Beta updates deployed based on user feedback and backlog prioritization (see [Fixed Issues](https://github.com/bcgov/ckan-ui/blob/master/pages/changelog.md#fixed-issues))|02-Sep-21|27-Oct-21|
|3|Beta released to Editors (data providers)|08-Aug-21|27-Oct-21|
|2|Beta released to Admin and internal staff|31-Mar-21|27-Oct-21|
|1|Beta migrated from Test|27-Jan-21|27-Oct-21|

[RETURN TO TOP][1]

### Fixed Issues

|**Deployment No.**|**Issue**|**Tix No.**|
|:---:|:---|:---:|
|22|Update Resources title | ([#885](https://github.com/bcgov/ckan-ui/pull/885))
|22|Render URLs as clickable links from text | ([#883](https://github.com/bcgov/ckan-ui/pull/883))
|22|Fix issue with removing keywords | ([#881](https://github.com/bcgov/ckan-ui/pull/881))
|22|Fix JSON preview when resource missing | ([#853](https://github.com/bcgov/ckan-ui/pull/853))
|22|Fix disappearing keywords | ([#852](https://github.com/bcgov/ckan-ui/pull/852))
|21|Display system dates | ([#837](https://github.com/bcgov/ckan-ui/pull/837))
|21|Auth refactor | ([#828](https://github.com/bcgov/ckan-ui/pull/828))
|21|Admin panel for groups | ([#827](https://github.com/bcgov/ckan-ui/pull/827))
|21|Initial admin panel for orgs | ([#825](https://github.com/bcgov/ckan-ui/pull/825))
|21|Refactor GA events | ([#824](https://github.com/bcgov/ckan-ui/pull/824))
|21|Add events for Google analytics | ([#761](https://github.com/bcgov/ckan-ui/pull/761))
|21|Switch to vue-gtag for Google analytics | ([#752](https://github.com/bcgov/ckan-ui/pull/752))
|20|Add validation check for dates | ([#817](https://github.com/bcgov/ckan-ui/pull/817))
|20|Set docker node image version | ([#813](https://github.com/bcgov/ckan-ui/pull/813))
|20|Refactor permission handling | ([#809](https://github.com/bcgov/ckan-ui/pull/809))
|20|Updated autocomplete template to remove dense setting to match other formating | ([#805](https://github.com/bcgov/ckan-ui/pull/805))
|20|Fix background to cover smaller pages | ([#803](https://github.com/bcgov/ckan-ui/pull/803))
|19|Removed hover text from composite repeating values | ([#790](https://github.com/bcgov/ckan-ui/pull/790))
|19|Removed French toggle while fixing French setting | ([#785](https://github.com/bcgov/ckan-ui/pull/785))
|19|Added state to title component and removed state field | ([#784](https://github.com/bcgov/ckan-ui/pull/784))
|19|Add sitemap to redis cache | ([#782](https://github.com/bcgov/ckan-ui/pull/782))
|19|Remove final 'Not Provided' handling | ([#780](https://github.com/bcgov/ckan-ui/pull/780))
|19|Fixed composite field | ([#779](https://github.com/bcgov/ckan-ui/pull/779))
|18|Updated text display to handle timestamps | ([#767](https://github.com/bcgov/ckan-ui/pull/767))
|18|Updated orgName to orgId in dynamic form | ([#765](https://github.com/bcgov/ckan-ui/pull/765))
|18|Sorted org list for contacts | ([#763](https://github.com/bcgov/ckan-ui/pull/763))
|18|Fixed instantiation that was creating [Object object] | ([#762](https://github.com/bcgov/ckan-ui/pull/762))
|18|Added max length counter to title field | ([#751](https://github.com/bcgov/ckan-ui/pull/751))
|18|Hid empty fields unless in edit mode | ([#750](https://github.com/bcgov/ckan-ui/pull/750))
|18|Added last_modified to text_fields to display properly | ([#745](https://github.com/bcgov/ckan-ui/pull/745))
|18|Added `+` icon to CTA button for adding contacts, dates, etc. | ([#744](https://github.com/bcgov/ckan-ui/pull/744))
|18|Update tooltips hit text, fixed inconsistent state machine styling | ([#743](https://github.com/bcgov/ckan-ui/pull/743))
|18|Update form fields to have white backgrounds | ([#742](https://github.com/bcgov/ckan-ui/pull/742))
|18|Remove dense tag to allow better row spacing | ([#741](https://github.com/bcgov/ckan-ui/pull/741))
|18|Fixed saving of cleared dates | ([#739](https://github.com/bcgov/ckan-ui/pull/739))
|18|Allow date fields to be cleared | ([#738](https://github.com/bcgov/ckan-ui/pull/738))
|17|Remove survey banner | ([#728](https://github.com/bcgov/ckan-ui/pull/728))
|17|Fix contact and lifecycle date deletion | ([#727](https://github.com/bcgov/ckan-ui/pull/727))
|16|Remove gravitar and replace with initials | ([#715](https://github.com/bcgov/ckan-ui/pull/715))
|16|Change newest to use record_publish_date | ([#717](https://github.com/bcgov/ckan-ui/pull/717))
|16|Fix resource lifecycle history to prevent overwrites | ([#716](https://github.com/bcgov/ckan-ui/pull/716))
|15|Updated about page | ([#711](https://github.com/bcgov/ckan-ui/pull/711))
|15|Added Configurable Information Banner | ([#705](https://github.com/bcgov/ckan-ui/pull/705))
|15|Removed API calls from groups page | ([#702](https://github.com/bcgov/ckan-ui/pull/702))
|15|Update GroupCards | ([#688](https://github.com/bcgov/ckan-ui/pull/688))
|15|Loop group API calls| ([#670](https://github.com/bcgov/ckan-ui/pull/670))
|14|Enable link click tracking| ([#662](https://github.com/bcgov/ckan-ui/pull/662), [#664](https://github.com/bcgov/ckan-ui/pull/664))
|14|Add snowplow frontend script| ([#641](https://github.com/bcgov/ckan-ui/pull/641))
|13|Allow commas (,) in URL regex| ([#651](https://github.com/bcgov/ckan-ui/pull/651))
|13|Allow exclamation marks (!) in URL regex| ([#643](https://github.com/bcgov/ckan-ui/pull/643))
|12|Improved performance and stability of organizations list| ([#634](https://github.com/bcgov/ckan-ui/pull/634))
|12|Improved user profile page for new editors| ([#635](https://github.com/bcgov/ckan-ui/pull/635))
|11|Stability improvements for logged in users| ([#617](https://github.com/bcgov/ckan-ui/pull/617))
|11|Improvements to search relevance and availability of advanced search features| ([#615](https://github.com/bcgov/ckan-ui/pull/615))
|11|Improvements to search relevance for mixed case words| ([#614](https://github.com/bcgov/ckan-ui/pull/614))
|11|Fixed bug where file sizes were represented incorrectly| ([#613](https://github.com/bcgov/ckan-ui/pull/613))
|10|Update to improve catalogue stability| ([#611](https://github.com/bcgov/ckan-ui/pull/611))
|9|Removed link to classic catalogue| ([#609](https://github.com/bcgov/ckan-ui/pull/609))
|9|Fixed overflow of expandable organization headers on organization listing page| ([#603](https://github.com/bcgov/ckan-ui/pull/603))
|9|Alphabetized organizations on our organization listing page| ([#600](https://github.com/bcgov/ckan-ui/pull/600))
|8|Dataset Published State - Security Issues and datasets found number oddities| ([#468](https://github.com/bcgov/ckan-ui/issues/486))
|8|Ministry/Parent Org - abilities Inherited to Suborg/Branch| ([#488](https://github.com/bcgov/ckan-ui/issues/488))
|8|Secure Groups - Remove visibility from API and UI when logged out| ([#447](https://github.com/bcgov/ckan-ui/issues/447))
|8|MVP - Filter Search Results Group Facet should not display Private Groups when not logged in| ([#589](https://github.com/bcgov/ckan-ui/issues/589))
|8|MVP - Update the About text to remove BETA specific instruction under For Technical Support |([#507](https://github.com/bcgov/ckan-ui/issues/507))
|8|Filter Titles inconsistent with Field Names - Change Filter Titles| ([#546](https://github.com/bcgov/ckan-ui/issues/546))
|8|Geographic Resources - Resource Type populating with Projection Name| ([#575](https://github.com/bcgov/ckan-ui/issues/575))
|8|Geospatial Attributes Config Fields to set to Not Visible in View mode| ([#313](https://github.com/bcgov/ckan-ui/issues/313))
|7|Remove the follow button from the UI| ([#566](https://github.com/bcgov/ckan-ui/issues/566))
|7|Remove admin key from UI config |([#553](https://github.com/bcgov/ckan-ui/issues/553))
|7|MVP - Update to About Page Text| ([#534](https://github.com/bcgov/ckan-ui/issues/534))
|7|Delete functionality on Record (aka Dataset/Metadata) and associated Resources| ([#519](https://github.com/bcgov/ckan-ui/issues/519))
|7|OFI Configuration - unable to configure secure datasets|([#501](https://github.com/bcgov/ckan-ui/issues/501))
|7|Release 2.0.0-beta.3 Developer Checklist| ([#574](https://github.com/bcgov/ckan-ui/issues/574))
|6|Page Titles for SEO| ([#551](https://github.com/bcgov/ckan-ui/issues/551))
|6|Fix logging out to end the session to prompt login |([#542](https://github.com/bcgov/ckan-ui/issues/542))
|6|Modifications to Delete popup messaging| ([#518](https://github.com/bcgov/ckan-ui/issues/518))
|6|New Documentation option under Menu| ([#535](https://github.com/bcgov/ckan-ui/issues/535))
|4|Search sort is now by Relevance and not Newest.
|4|All fields and their values have now been directed to the correct destination. Field updates have been reflected in the Field, Label and Value Changes section below.
|4|Records for Webservice/API and Application originally now have the date the metadata was created added as a default for the Resource History Lifecycle. Editors may change this to a date they wish.
|4|Record and Resource deletion now prompts the user to confirm deletion is desired before deleting item.
|4|Resources that are not previewable, the Preview button is greyed out.
|4|Resources have been changed to "Access/Download" as was in production Cat Classic.
|4|Resource file size limit set to be the same as production Cat Classic.
|4|Resource URL for BCGW Custom Download is no longer visible, removing confusion, as it is not accessible.

[RETURN TO TOP][1]

## CURRENT KNOWN ISSUES
Not all items have been flagged in this list, some are actively being worked on and others are to be prioritized after production release.

1. All Editors can see all record in all states of all organizations.  
1. Group editors and members management to be configured. 
    + All Group management can only be done by users with Admin access at this time. 
1. Viewing Groups on the groups page can result in 0 datasets under the group name.  Clicking on the group name, or using the Group filter when searching from the datasets page will return a list of datasets for the selected group. 
1. The OpenAPI Console preview function is not available.
1. The Data Usage page is not yet available.
1. Domain value lists are inconsistent across the schema in their letter case. We will be implimenting snake_case in the future.

[RETURN TO TOP][1]

## WHAT'S NEW

### Application User Interface

#### Landing Page
+ Landing page of https://data.gov.bc.ca has been simplified.
    - Future user engagement intended to determine what would provide additional value on this page.  
+ Landing page toolbar has moved to the top right "pancake": Account Settings (when logged in), Explore Datasets, Explore by Organization, Explore by Groups, Subscribe to New Data, Documentation, About, etc.
+ Quick reference video on the new UI can be found at https://catalogue.data.gov.bc.ca/dataset/42f7ca99-e7f3-40f7-93d7-f2500cccc315/resource/dffc8154-32c7-4671-bd42-3279dede8657/download/data_catalogue_quick_tutorial.mp4

[RETURN TO TOP][1]

#### Record Level
This is also referred to as the package.

+ Menu Bar: Actions have been consolidated.
    - __NEW__: _Back to Datasets list_ allows the user to navigate back to the list of datasets (not using the browser back button). 
    - __NEW__: _Scroll to Bottom_ allows the user to jump to the bottom of the page.
    - _Groups_ no functionality change, but interface has changed.
    - __NEW__: _Contact Data Expert_ button added, this allows a user to contact the first contact on a record with pre-canned details of what record and what details they should include in the email.
    - _Share this Record_ and _Show the Permalink_ merged into _Share_. This copies the permalink URL to a clipboard.
    - _Edit Dataset_ replaces the 'wrench' with no functionality change.
    - _Copy Dataset_ is now available for all records.
    - __NEW__: _Add Resource_ added so that this function is no longer through editing the record itself or from the _Explore_ button.
    - _Activity Stream_ removed as it did not provide value as is. Activity Stream is still available from the API.
    - __NEW__: _Delete Dataset_ allows a user with the appropriate access (Editor or Admin of the dataset's Organizaiton) to delete a record and its resources in _Draft_ state.
+ Resources are now listed as resource cards to the right and their actions are their own buttons.
    - _Access/Download_, _View_, _Edit_ (pencil) availale in the _Explore_ button and drop down are now buttons on their own.
    - __NEW__: Deletion (trash can image) of a resource is now available without having to be in edit mode.
        - Only available to Editors and Admins when records is in Draft state.
+ Field layout order has been change to provide consumers quick visual access to the key fields.
    - See [Field, Label and Value Changes](beta_schema_changes.md#field-label-and-value-changes) for specific changes including fields that moved from the Record to the Resource, e.g., Object Name.
+ _Map Preview_ has moved to the Resource Level specific to the BC Geographic Warehouse resourse.
+ _View in iMapBC_ button has moved to the Resource Level for the BC Geographic Warehouse resourse.

[RETURN TO TOP][1]

#### Resource Level
+ Menu Bar: Actions have been consolidated to replace the _Manage_ button and other actions.
    - __NEW__: _Back to Dataset_ button added, this allows a user to navigate back to the dataset (not using the browser back button).
    - __NEW__: _Scroll to Bottom_ allows the user to jump to the bottom of the page.
    - __NEW__: _Contact Data Expert_ button added, this allows a user to contact the first contact on a record with pre-canned details of what record and what details they should include in the email.
    - __NEW__: _Share_ was not an option from the Resource level in the previous ittereation of this button. This copiest the permalink URL to a clipboard.
    - __NEW__: _Preview_ button is to replace:
        -  The map insert on the Resource level for BC Geographic Warehouse public datasets.
        -  For a resource with a map preview the _Link to iMapBC_ button is available on the module.
        -  The Data Explorer for tabular datasets that are uploaded to the catalogue.
        -  The OpenAPI Console for APIs registered with the API Gateway.
    - _Access/Download_ is consistent with the other menu buttons.
    - _Add Resource_ is consistent with the _Add new resource button_ without requiring editing of a resource.
    - _Edit Resource_ is consistent with the Manage function on the resource. 
    - _Delete Resource_ is consistent with the Delete button on the resource, without requiring editing of a resource.
    - _Data API_ button has been removed.
+ Field layout order has been change to provide consumers quick visual access to the key fields.
    - See [Field, Label and Value Changes](beta_schema_changes.md#field-label-and-value-changes) for specific changes including fields that been included from the Record level, e.g., Object Name.
+ Resource types have moved from the Record level to allow a record to have any of the different resource types:
    - Document/Tabular Data, Geographic Data, Webservice/API, Application.
+ BC Geographic Warehouse (BCGW) specific items have moved to the Resource level including:
    - **Data definitions**, e.g., Object name,  field names, types, lengths and descriptions have moved to the resources called **Custom BCGW Download**. 
        - For those not downloadable from the Distribution Services, in production resources have been added to ensure the BCGW data from the record to the resource is retained. 
    - **Map Preview** inset has moved to the resource toolbar ![image](https://user-images.githubusercontent.com/32690119/117981892-526e8c00-b2ea-11eb-8211-35499fc24fd8.png) button.
    - **Link to iMapBC** specific public presentations has moved to the resource Preview ![image](https://user-images.githubusercontent.com/32690119/117982127-8a75cf00-b2ea-11eb-9377-c3b5f73908f9.png).

[RETURN TO TOP][1]

#### Organizations
+ Organizations are no longer found on the menu bar, but the user can Explore Datasets by Organizations under the **Pancake**.
+ Selecting the Parent Organization (Ministry) or any associated Organization (Branch) will display the Organization record's details.
    - __NEW__: _Back to Organization list_ button added, this allows a user to navigate back to the Organization list (not using the browser back button).
    - __NEW__: _Share_ was not an option from the Organization level in the previous ittereation of this button. This copiest the permalink URL to a clipboard.
    - __NEW__: _Learn more about this organization_: presents the user with the description and image associated to the Organization, if provided.
    - _Edit Organization_ provides the **SysAdmin User** with the ability to edit the record, as the Manage function did.
    - _Delete Organization_ provides the **SysAdmin User** with the ability to delete Organization the record, as the Delete button did, without having to be in edit mode.

[RETURN TO TOP][1]

#### Groups
+ Groups are no longer found on the menu bar, but the user can Explore Datasets by Groups under the **Pancake**.
+ Selecting the Group will display the Group record's details.
    - __NEW__: _Back to Group list_ button added, this allows a user to navigate back to the Group list (not using the browser back button).
    - __NEW__: _Share_ was not an option from the Group level in the previous ittereation of this button. This copiest the permalink URL to a clipboard.
    - __NEW__: _Learn more about this group: presents the user with the description and image associated to the group, if provided.
    - _Edit Group_ provides the **SysAdmin User** with the ability to edit the record, as the Manage function did.
    - _Delete Group_ provides the **SysAdmin User** with the ability to delete the Group record, as the Delete button did, without having to be in edit mode.

[RETURN TO TOP][1]

### Application Programming Interface
+ Decoupling backend (CKAN database and API) and frontend (Javascript).
+ Values returned from the API are consistently using the field value and not the field label.
+ JSON Schema now available: https://cat.data.gov.bc.ca/api/3/action/scheming_dataset_schema_show?type=bcdc_dataset
+ See [Field, Label and Value Changes](beta_schema_changes.md#field-label-and-value-changes) for changes, including `object_name` having been moved from packages to resources.
+ See [How to use the API](https://bcgov.github.io/data-publication/pages/dps_bcdc_api_w_how_to_use.html) for common calls and resource and record update examples.


[RETURN TO TOP][1]
  
## USER MANAGEMENT
+ Management of Admins, Editors and Members of Organization and Groups are no longer being managed in the catalogue itself, and has moved to Keycloak.

## TECHNOLOGY SPECIFICATIONS
* **CKAN**: _2.7.5_
* **SOLR**: _7.2.1_

[RETURN TO TOP][1]

[1]: #change-log
