<template>
    <v-card text style="margin-bottom:.5rem;">
        <h3>Access and Security</h3>
        <v-container style="padding-top:10px;border-left:thin solid lightgrey;">
            <v-row justify-start flex>
                <h5>Who can view this dataset?</h5>
                <p>{{dataset.view_audience}}</p>
                <h5>Who can download this dataset?</h5>
                <p>{{dataset.download_audience}}</p>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
import { mapState } from "vuex";
export default {
    props: {
        info: Object
    },
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
</style>
