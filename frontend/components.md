# Components and Structure
This document will attempt to describe the general structure and the components (and their purpose) in the frontend

## Structure
public/fonts
public/js
These directories hold things that are available without any pre rendering and are fonts or javascript respectively. In the public you'll also find the index file, the icon and the placeholder org image.

src/assets/fonts
src/assets/images
These are fonts and images that need a little bit of pre processing

src/components
This is where most of the view components live

src/i18n
This is where the internationalization files live translations for english (en.js) and french (fr.js)

src/router
This is for all the routes of the application

src/services
This is for the interfaces to the backend bridge IE apis

src/store
This is for the vuex store, anything that is persisted between sessions for a user should be stored in the store

src/lib
This is for shared utility functions and helper libraries that can exist independently of Vue.

In the root src file you'll also find the vue boostrapping files and config.


## Components

Footer
This is the footer component rendered on the foot of every page.

Header
This is the header component rendered at the top of every page.

badges/
These are a relic from the old UI and were used to show the formats present on a dataset and the sector of the dataset on the list page

breadcrumb/Breadcrumb
This shows the breadcrumbs present on some pages like at the top of datasets, to allow you to navigate back up through the hierarchy

common/acitivityItem
This is used to render an activity refromatting it to make it more readable and showing a time since it happened, it is used in the activityList (see common/activityList)

common/activityList
This is used to render a list of activity items, it is currently only used on the user page which has not yet been redesigned back into the new UI and is a relic from when this UI more closely matched with the old UI

dataset/AboutCard
Deprecated from original closer implenentation to old ui

dataset/AccessSecurityCard
Deprecated from original closer implenentation to old ui

dataset/AdditionalInfoCard
Deprecated from original closer implenentation to old ui

dataset/ContactInfoCard
Deprecated from original closer implenentation to old ui

dataset/FacetFilter
Renders a facet filter including the title, and all the potential filters for that field

dataset/FacetFilters
Renders all of the Facet filters using the above component. Used everywhere we need facet filters displayed, normally in conjunction with a dataset list

dataset/ListCard
Renders a dataset card for use in the list view

dataset/ListPage
Renders the dataset list page, used wherever a dataset list is displayed

dataset/MetadataInformation
Deprecated from original closer implenentation to old ui

dataset/ResourceCard
Used to show information about resources in a list

dataset/ResourceList
Used to render a list of resources, uses the ResourceCard to show the list

form/DynamicForm
This is the base information that renders all forms, it is dynamic so that anytime the configuration is changed in CKAN (scheming, scheming repeating and composite) it automatically propogates to the frontend, Some tweaks may still be required depending on how it is desired to be displayed but most things should work out of the box. It uses all the components in the components sub folder. It supports different rendering based on being in edit mode or not.

form/components/AutoComplete
This is used to render autocomplete fields

form/components/Checkbox
This is used to render checkbox fields

form/components/Composite
This is used to render composite fields, 

form/components/CompositeRepeating
This is used to render compsosite repeating fields (including adding the plus and minus to add more fields)

form/components/ImageUrl
This is used to render image url fields mostly used on groups/organizations and it defaults to the placeholder image

form/components/Json
This is used to render json fields

form/components/License
This is used to render the license fields

form/components/Markdown
This is used to render large descriptive fields that support markdown

form/components/Select
This is used to render select (drop down) fields

form/components/Slug
This is used to render the url slug fields

form/components/Tags
This is used to render tags (mutli select) fields

form/components/TextInput
This is used to render text fields, and is a fallback if the system doens't know what you want

form/components/Title
This is used to render Title fields

form/components/Upload
This is used to render file upload fields which support a radio for upload or providing a url

groups/edit
This is the group edit/view page

groups/GroupCard
This is like the Dataset card for Groups it decides how to render groups when in a list

groups/MemberList
This shows the members (users) list for a group

groups/profile
This is from when the ui was trying to more closely match the old ui

organizations/edit
The view/edit organization page

organizations/OrgTree
the organization tree shows organizations hierarchy, used on the list page

organizations/profile
This is from when the ui was trying to more closely match the old ui

pages/404
The 404 page if the user navigates to a page that does not exist

pages/about
The about page

pages/dataset_view
the dataset view/edit page

pages/datasets
The dataset list page

pages/group
The group view, shows group information and added datasets

pages/groups
the group list page

pages/home
the home splash page

pages/organization_view
the organization view, shows org info and org datasets

pages/organizations
the organization list page

pages/resource
the resource view/edit page

pages/user
This is the page showing user information, it hasn't been added to the newest version of the ui yet but is still accessible via routes

pow/powButton
The pow button to initiate the pow workflow on a dataset

pow/powModal
The pow modal to perform actions in the pow.

resources/jsontable
View the Json table information about a resource

resource/preview
Preview the resource in the ui if we know how to render it

user/profile
the user profile information

user/user
Deprecated, used to render the drop down with the user name and a profile sign out option if signed in or sign in otherwise