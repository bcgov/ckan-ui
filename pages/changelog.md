# Change Log

|**AUDIENCE**|
|:---:|
| *BCDC Data Providers* | 
| *BCDC Administrators* | 
| *BCDC Consumers* |

## Table of Contents
+ [**WHAT'S NEW**](#whats-new)
+ [**2021**](#2021)
+ [**2020**](#2020)

-----------------------

## RESOURCES
+ BC Data Catalogue: https://data.gov.bc.ca/
+ User Documentation: https://bcgov.github.io/data-publication/pages/dps_bcdc.html
+ Open Data: https://bcgov.github.io/data-publication/pages/open_data.html
+ Keycloak Management: https://github.com/bcgov/ckanext-sso/blob/docs/pages/keycloak_user_mgmt.md

# WHAT'S NEW
## 2021 Beta
### May 2021
+ Release of Beta!
+ Decoupling back end and from end
+ JSON Schema: https://github.com/bcgov/ckanext-bcgov-schema/blob/master/ckanext/bcgov_schema/bcdc_dataset.json
+ Resource types moved to resource level, instead of at dataset or "record" level to allow a dataset to have any of the different resource types: Application, Dataset/Document, Geospatial Dataset, Webservice/API.
+ BC Geographic Warehouse (BCDC) items moved:
    - Data definitions moved to the resource type.
    - Map Preview using WMS moved to the Preview on resource page.
    - View in iMapBC moved to Preview button on resource page.
+ Fields removed:
    - Sector
+ Fields renamed:

|New |Old|
|:---:|:---|
|Field Name | Field Name|

+ Security Classifications update to match OCIO Information Security Classification Guidelines
    - https://intranet.gov.bc.ca/intranet/content?id=2041BD1842AA4696BC76691FB9A0CE92
    - Mapping:


|New |Old|
|:---:|:---|
|PUBLIC | LOW-PUBLIC|
|PROTECTED A | LOW-SENSITIVITY|
|PROTECTED B | MEDIUM-SENSITIVITY, MEDIUM-PERSONAL|
|PROTECTED C | HIGH-CONFIDENTIAL, HIGH-SENSITIVITY|


[RETURN TO TOP][1]

[1]: #changelog
