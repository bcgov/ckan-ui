<template>
    <v-card flat style="margin-bottom:.5rem;">
        <h3>Metadata Information</h3>
        <v-container style="padding-top:10px;border-left:thin solid lightgrey;">
            <v-layout column justify-start flex>
                <h5>Record Published</h5>
                <p>{{dataset.record_publish_date}}</p>
                <h5>Record Last Modified</h5>
                <p>{{dataset.record_last_modified}}</p>
                <h5>Resource Status</h5>
                <p class="caps">{{dataset.resource_status}}</p>
            </v-layout>
        </v-container>
    </v-card>
</template>

<script>
import { mapState } from "vuex";
export default {
    props: {},
    computed: {
        ...mapState({
            dataset: state => state.dataset.dataset
        })
    }
};
</script>

<style scoped>
@import "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

.container {
    padding-bottom: 15px;
}
.caps {
    text-transform: uppercase;
}
</style>
