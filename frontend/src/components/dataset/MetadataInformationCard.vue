<template>
    <v-card text style="margin-bottom:.5rem;">
        <h3>Metadata Information</h3>
        <v-container style="padding-top:10px;border-left:thin solid lightgrey;">
            <v-row justify-start flex>
                <h5>Record Published</h5>
                <p>{{dataset.record_publish_date}}</p>
                <h5>Record Last Modified</h5>
                <p>{{dataset.record_last_modified}}</p>
                <h5>Resource Status</h5>
                <p class="caps">{{dataset.resource_status}}</p>
            </v-row>
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

.container {
    padding-bottom: 15px;
}
.caps {
    text-transform: uppercase;
}
</style>
