<template>
    <v-container>
        <Breadcrumb :breadcrumbs="breadcrumbs"></Breadcrumb>
        <v-card>
            <v-card-text>
                <p>
                    The BC Data catalogue helps users to find, understand and explore data. The catalogue also provides
                    contact information so that data users can contact Data Custodians for additional information if
                    required.
                </p>

                <p>
                    DataBC manages the BC Data Catalogue software and infrastructure, and delivers user training and authorization management.
                </p>

                <p>
                    Data, APIs and Applications registered and presented through the BC Data Catalogue are managed and
                    provided by Data Custodians from across the broader public service. Each Data Custodian is typically a
                    Director or Executive Director of an Organizational unit such as a Branch or Division. The Data
                    Custodial Organizations are visible under the <router-link to="organizations">Organizations</router-link> tab.
                </p>

                <p>
                    DataBC helps the Province manage data as an asset. It enables public servants and citizens to share and
                    use data. DataBC delivers on this mandate by providing leadership in : data governance and
                    custodianship; data licensing; literacy and outreach; data cataloging; data provisioning; geographic
                    data integration and management; location based services and web mapping applications.
                </p>

                <p>
                    To learn more about DataBC please visit our <a href="http://www.data.gov.bc.ca/dbc/about/index.page">website</a>
                </p>

                <p>
                    British Columbia's Data Catalogue is powered by <a href="http://ckan.org/">CKAN</a>.
                </p>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
    import Breadcrumb from '../breadcrumb/Breadcrumb'

    export default {
        components: {
            Breadcrumb: Breadcrumb
        },

        data() {
            return {
                breadcrumbs: [
                    {icon: "home", label: 'Home', route: '/'},
                    {label: 'About'}
                ]
            }
        }
    }

</script>