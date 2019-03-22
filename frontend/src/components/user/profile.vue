<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card>
                    <v-card-text>
                        <img :src="'https://www.gravatar.com/avatar/'+user.email_hash+'?s=190&d=identicon'" />
                        <p>{{user.name}}</p>
                        <p>Email: {{user.email}}</p>
                        <p>Api Key: {{user.apikey}}</p>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>

    export default {
        name: "activityItem",
        props: {
            user: Object
        },
        data() {
        },
        methods: {
        },
        mounted(){
            // eslint-disable-next-line
            console.log(this.user);
        }
    }
</script>

<style scoped>

</style>