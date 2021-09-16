# FIELD, LABEL AND VALUE CHANGES
This page is continually updated as changes are made to the BC Data Catalogue and its supporting technologies. 

|**AUDIENCE**|**DESCRIPTION**|
|:---|:---|
| *BCDC Consumers* |Persons who use the published data in accordance to the dataset licence|
| *BCDC Data Providers* | Persons who prepare and published data in the BC Data Catalogue|
| *BCDC Administrators* | Persons who assist with the publishing/retiring of data in the BC Data Catalogue|

## Table of Contents
+ [**Field, Label and Value Changes**](#field-label-and-value-changes)


-----------------------

## FIELD, LABEL AND VALUE CHANGES
+ **Field Labels** are what is visible in the user interface (UI).
   + No fields were removed from the databse, but some have been removed from the UI. 
+ **Field Names** are what is returned from the API.

### Record Level Changes
A Record or main metadata page is defined in CKAN as a Dataset or Package.


|UI Field Label|Database Field Name|Changes Flag|Database Field Renamed from|Moved from|Deleted|Values|Repeating or Composite|Comment|
|:---|:---|:---|:---|:---|:---|:---|:---|:---|
|Title|title|N|
|URL|name|N|
|Published by|full_title|Y| | | | | |Ministry level removed|
|Description|notes|N|
|Licence|license_id|N|
||
|Contacts:|Y| | | | |Y| |
|Name|name|N|
|Email|email|N |
|Organization| |Y| | | Y| | |
|Organization|org|Y| branch| | | | | |
|Role|role|Y| | | | [Y](https://bcgov.github.io/data-publication/pages/dps_bcdc_record.html)| | |
|Displayed|displayed|Y|private | | | | |
|Name|name|N|
||
|Purpose|purpose|N|
|Data Quality|data_quality|N|
|Lineage|lineage_statement|N|
|Name|name|N|
||
|More Info:| |Y| | | | |Y| |
|Description|description|Y| | | | | |__NEW*__ |
|URL|url|Y|link|
||
|Security Classification|security_class|Y| | | | [Y](https://bcgov.github.io/data-publication/pages/dps_bcdc_record.html)| | |
|Who can view this data?|view_audience|N|
|Who can dowbload this data?|download_audience|N|
|Who can view this record?|metadata_visibility|N|
|Keywords|tag_string|Y| | | | |Y| |
|State|publish_state|Y| | | | [Y](https://bcgov.github.io/data-publication/pages/dps_bcdc_record.html)| | |
|Resource Status|resource_status|N|
||
|Record Lifecycle History:|
|Type|type|N|
|Date|date|N|
||
|Replacement Record|replacement record|
|Retention Expiry Date|retention_expiry_date|
|Source Data Path|source_data_path|Y| | | | | |No longer a mandatory or URL conditional field |


### Document/Tabular Data Resource Level Changes
A Record or main metadata page is defined in CKAN as a Dataset or Package.

|UI Field Label|Database Field Name|Changes Flag|Database Field Renamed from|Moved from|Deleted|Values|Repeating or Composite|Comment|
|:---|:---|:---|:---|:---|:---|:---|:---|:---|
|Name|name|N|
|URL|Resource|
|Type|bcdc_type|Y| | |Record Level | [Y](https://bcgov.github.io/data-publication/pages/dps_bcdc_w_geographic_dataset_2.html)| | |
|Resource Description|description|
|Supplemental Information|supplemental_info|
|Resource Update Cycle|resource_update_cycle|Y| | | | [Y](https://bcgov.github.io/data-publication/pages/dps_bcdc_w_geographic_dataset_2.html)| | |
||
|Temporal Extent|temporal_extent|Y| | | | |Y| |
|Beginning Date|beginning_date|
|End Date|end_date
||
|Resource Storage Format|format|Y| | | Record Level| [Y](https://bcgov.github.io/data-publication/pages/dps_bcdc_w_geographic_dataset_2.html)| | |
|Resource Storage Location|Resource Storage Location|Y| | | | [Y](https://bcgov.github.io/data-publication/pages/dps_bcdc_w_geographic_dataset_2.html)| | |
|Spatial Datatype|spatial_datatype|Y| | | Record Level| [Y](https://bcgov.github.io/data-publication/pages/dps_bcdc_w_geographic_dataset_2.html)| |Reviewing if this is applicable |
|Object Short Name|object_short_name|Y| | | Record Level| | |Reviewing if this is applicable |
|Object Table Comments|object_table_comments|Y| | | Record Level| | |Reviewing if this is applicable |
||
|Details|details |Y| | | Record Level| | | Reviewing if this is applicable|
|Column Name|column_name|Y| | | Record Level| | | |
|Short Name|short_name|Y| | | Record Level| | | |
|Data Type|data_type|Y| | | Record Level| | | |
|Data Precision|data_precision|Y| | | Record Level| | | |
|Column Comments|column_comments|Y| | | Record Level| | | |
||


### Geographic Data Resource Level Changes
A Record or main metadata page is defined in CKAN as a Dataset or Package.

|UI Field Label|Database Field Name|Changes Flag|Database Field Renamed from|Moved from|Deleted|Values|Repeating or Composite|Comment|
|:---|:---|:---|:---|:---|:---|:---|:---|:---|
|Name|name|N|
|URL|Resource|
|Type|bcdc_type|Y| | |Record Level | [Y](https://bcgov.github.io/data-publication/pages/dps_bcdc_w_geographic_dataset_2.html)| | |
|Resource Description|description|
|Supplemental Information|supplemental_info|
|Resource Update Cycle|resource_update_cycle|Y| | | | [Y](https://bcgov.github.io/data-publication/pages/dps_bcdc_w_geographic_dataset_2.html)| | |
||
|Temporal Extent|temporal_extent|Y| | | | |Y| |
|Beginning Date|beginning_date|
|End Date|end_date
||
|Resource Storage Format|format|Y| | | Record Level| [Y](https://bcgov.github.io/data-publication/pages/dps_bcdc_w_geographic_dataset_2.html)| | |
|Resource Storage Location|Resource Storage Location|Y| | | | [Y](https://bcgov.github.io/data-publication/pages/dps_bcdc_w_geographic_dataset_2.html)| | |
|Spatial Datatype|spatial_datatype|Y| | | Record Level| [Y](https://bcgov.github.io/data-publication/pages/dps_bcdc_w_geographic_dataset_2.html)| | |
|Object Short Name|object_short_name|Y| | | Record Level| | | |
|Object Table Comments|object_table_comments|Y| | | Record Level| | | |
||
|Details|details |Y| | | Record Level| | | |
|Column Name|column_name|Y| | | Record Level| | | |
|Short Name|short_name|Y| | | Record Level| | | |
|Data Type|data_type|Y| | | Record Level| | | |
|Data Precision|data_precision|Y| | | Record Level| | | |
|Column Comments|column_comments|Y| | | Record Level| | | |
||
|Projection Name|projection_name|Y|
|JSON Table Schema|json_table_schema|Y| | | | | |__NEW*__ |
|ISO Topic Category|iso_topic_category|Y|iso_topic_string | | Record Level| | | |
|Resource Type|resource_type|Y|
|Resource Access Method|resource_access_method|Y|resource_access_storage_method| | | [Y](https://bcgov.github.io/data-publication/pages/dps_bcdc_w_geographic_dataset_2.html)| | |
||
|Preview Information:|preview_info|Y| | |Record Level| | | |
|Layer Name|layer_name|Y| | |Record Level| | | |
|Preview Latitude|preview_latitude|Y| | |Record Level| | | |

### Webservice/APIResource Level Changes
A Record or main metadata page is defined in CKAN as a Dataset or Package.

|UI Field Label|Database Field Name|Changes Flag|Database Field Renamed from|Moved from|Deleted|Values|Repeating or Composite|Comment|
|:---|:---|:---|:---|:---|:---|:---|:---|:---|
|Name|name|N|
|URL|Resource|
|Type|bcdc_type|Y| | |Record Level | [Y](https://bcgov.github.io/data-publication/pages/dps_bcdc_w_webservice_api_2.html)| | |

### Application Resource Level Changes
A Record or main metadata page is defined in CKAN as a Dataset or Package.

|UI Field Label|Database Field Name|Changes Flag|Database Field Renamed from|Moved from|Deleted|Values|Repeating or Composite|Comment|
|:---|:---|:---|:---|:---|:---|:---|:---|:---|
|Name|name|N|
|URL|Resource|
|Type|bcdc_type|Y| | |Record Level | [Y](https://bcgov.github.io/data-publication/pages/dps_bcdc_w_application_2.html)| | |

----


|Object|Action|Field Label|Field Names|Rational|Other Actions|
|:---|:---|:---|:---|:---|:---|
|Record|Added|JSON Table Schema|json_table_schema| | |
|Record|Added|More Info Description|description| |Moved to composite repeating field|
|Record|Deleted|Sector|sector|No longer used by Government| |
|Record|Deleted|Contact Organiztion|organization| | |

_Under Review below_
+ **Fields renamed**:

    |UI FieldLabel|New Database Field Name |Old Database Field Name|Other Actions|
    |:---|:---|:---|:---|
    |Type|bcdc_type|type|Copied from package to resource|
    |State| publish_state | edc_state|
    |URL |url|link| Made into a composite field|
    |Contacts Branch|org|branch|
    |Beginning Date |beginning_date|data_collection_start_date  | 
    |End Date |end_date|data_collection_end_date|
    |Resource Access Method|resource_access_method|resource_storage_access_method|Moved from package to resource|
    |Resource Type |resource_type|edc_resource_type|  Moved from package to resource|
    |ISO Topic Category|iso_topic_category|iso_topic_string  | Made into a composite field|

+ **Fields use change**:

    |UI Field Label|Database Field Name|New Use |Old Use|
    |:---|:---|:---|:---|
    |Published by | owner_org|  Suborg |Organization and suborg concatentated|  

+ **Fields moved from Package to Resource**:
    
    |UI FieldLabel|Database Field Name |Other Actions|
    |:---|:---|:---|
    |Type| bcdc_tyoe |Copied to new field as package.type is a core field|
    |Object Name| object_name |
    |Short Name|object_short_name|
    |Object Table Name| object_table_comments |
    |Spatial Datatype|spatial_datatype|
    |Layer Name| layer_name  |Results visible in Preview button|
    |Preview latitude|preview_latitude |Results visible in Preview button|
    |Preview longitude| preview_longitude  |Results visible in Preview button|
    |Preview map service URL|preview_map_service_url |Results visible in Preview button|
    |Preview zoom level|preview_zoom_level |Results visible in Preview button|
    |Image URL| image_url |Results visible in Preview button|
    |Link to iMap|link_to_imap|Moved to button within Preview button in UI|
    |North|north_bound_latitude|Moved to composite field|
    |South|south_bound_latitude|Moved to composite field|
    |East| east_bound_latitude |Moved to composite field|
    |West|west_bound_latitude|Moved to composite field|
    |ISO Topic Category|iso_topic_category| Renamed from iso_topic_string and made into a composite field|
    |Resource Type|resource_type| Renamed from edc_resource_type|
    
+ **Fields moved to Composite or Composite Repeating Fields**:
    - For those that use the catalogue API, these changes may impact scripting.
    
    |Database Field Name|Database Field within|Other Actions|
    |:---|:---|:---|
    |beginning_date ; end_date| temporal_extent | NA|
    |resource_type; resource_storage_location  |extras|Moved from package to resource|
    |short_name; column_name; data_type; column_comments |details|Moved from package to resource|
    | preview_latitude; preview_longitude ; preview_map_service_url; preview_zoom_level ; preview_image_url; link_to_imap; layer_name; image_url|preview_info| Movedfrom package to resource|
    |name, email, org, role, displayed|Contacts|NA|
    |iso_topic_category| iso_topic_category |Moved from package to resource|
    |url|more_info| NA|
    |north_bound_latitude; south_bound_latitude; east_bound_latitude; west_bound_latitude  |geographic_extent|Moved from package to resource|
       
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
    |:---|:---|:---|
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
