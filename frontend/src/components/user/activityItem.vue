<template>
    <v-container fluid>
        <v-row wrap class="pa-0 ma-0">
            <v-col cols=12>
                You {{message}} <a :href="link">{{linkName}}</a> - {{time}} ago
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
                time: this.timeSince(new Date(this.activity.timestamp)),
                link: "",
                linkName: "",
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
            switch(this.message){
                case("new user"):
                    this.message = "signed up";
                    break;
                case ("changed package"):
                    this.message = "updated dataset";
                    break;
                case ("new package"):
                    this.message = "created dataset";
                    break;
                case ("changed group"):
                    this.message = "updated group";
                    break;
                case ("new group"):
                    this.message = "created group";
                    break;
            }

            if (this.message.indexOf('group') !== -1){
                this.linkName = this.activity.data.group.title;
                this.link = this.$router.matcher.match({name: 'group_view', params: { groupId: this.activity.data.group.name}}).path;
            }else if (this.message.indexOf('dataset') !== -1){
                this.link = this.$router.matcher.match({name: 'dataset_view', params: { datasetId: this.activity.data.package.name}}).path;
                this.linkName = this.activity.data.package.title;
            }
        }
    }
</script>

<style scoped>

</style>