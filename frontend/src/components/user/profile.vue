<template>
    <v-container fluid>
        <v-row wrap>
            <v-col cols=12>
                <v-card>
                    <v-card-text>
                        <img :src="'https://www.gravatar.com/avatar/'+user.email_hash+'?s=190&d=identicon'" />
                        <p>{{user.name}}</p>
                        <p>Email: {{user.email}}</p>
                        <p>Api Key: {{user.apikey}}</p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

    export default {
        name: "profile",
        props: {
            user: Object
        },
        data() {
            return {};
        },
        methods: {
        },
        mounted(){
        }
    }
</script>

<style scoped>

</style>