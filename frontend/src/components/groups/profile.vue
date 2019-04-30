<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card>
                    <v-card-text>
                        <v-img v-if="group.image_display_url !== ''" :src="group.image_display_url"></v-img>
                        <v-img v-else src="/placeholder-organization.png"></v-img>
                        <p v-if="group.url == ''">{{group.title}}</p>
                        <p v-else><a :href="group.url" target="_blank">{{group.title}}</a></p>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>

    export default {
        name: "profile",
        props: {
            group: Object
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