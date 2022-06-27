<template>
    <v-container fluid>
        <v-row wrap>
            <v-col cols=12>
                <v-card>
                    <v-card-text>
                        <v-avatar color="secondary" size="62" class="mb-5">
                            <span class="white--text text-h5">{{ initials }}</span>
                        </v-avatar>
                        <p>{{user.display_name}}</p>
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
        computed: {
            initials: function(){
                return this.user && this.user.display_name ? 
                    this.user.display_name.split(" ").map((n)=>n[0]).join("").toUpperCase() : "";
            }
        },
        methods: {
        },
        mounted(){
        }
    }
</script>

<style scoped>

</style>