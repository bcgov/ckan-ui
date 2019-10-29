<template>
    <v-container fluid>
        <v-row wrap>
            <v-col cols=12>
                You {{message}} - {{time}} ago
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: "activityItem",
        props: {
            activity: Object
        },
        data() {
            return {
                message: this.activity.activity_type,
                time: this.timeSince(new Date(this.activity.timestamp))
            }
        },
        methods: {
            timeSince: function(date) {
                let seconds = Math.floor((new Date() - date) / 1000);

                let interval = Math.floor(seconds / 31536000);

                if (interval > 1) {
                return interval + " years";
                }
                interval = Math.floor(seconds / 2592000);
                if (interval > 1) {
                return interval + " months";
                }
                interval = Math.floor(seconds / 86400);
                if (interval > 1) {
                return interval + " days";
                }
                interval = Math.floor(seconds / 3600);
                if (interval > 1) {
                return interval + " hours";
                }
                interval = Math.floor(seconds / 60);
                if (interval > 1) {
                return interval + " minutes";
                }
                return Math.floor(seconds) + " seconds";
            }
        },
        mounted(){
            if (this.message === "new user"){
                this.message = "signed up"
            }
        }
    }
</script>

<style scoped>

</style>