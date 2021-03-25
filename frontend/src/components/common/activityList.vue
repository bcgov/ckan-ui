<template>
    <v-container fluid>
        <v-row wrap v-for="(activityItem, key) in activities" class="pa-0 ma-0" :key="'activity-line'+key">
            <ActivityItem :activity="activityItem" :article="article"></ActivityItem>
        </v-row>
    </v-container>
</template>

<script>
    import ActivityItem from './activityItem';

    export default {
        name: "activityList",
        components: {
            ActivityItem: ActivityItem
        },
        props: {
            activities: Array,
            article: {
                type: String,
                default: "You"
            },
        },
        data() {
            return {
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