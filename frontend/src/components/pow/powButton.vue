<template>
    <v-dialog v-model="dialog" width="900">
        <template v-slot:activator="{ on }">
            <v-btn v-if="btn" small depressed text color="primary" v-on="on">
                <!-- @click="startOrder()" -->
                <!-- <v-icon>mdi-folder-information-outline</v-icon>&nbsp; -->{{$tc('Request Access')}}
            </v-btn>
            <v-list-item v-else text block color="label_colour" v-on="on">
                <!-- @click="startOrder()" -->
                Request Access
            </v-list-item>
        </template>
        <!-- change to vue component and move methods to here -->
        <powModal @powMounted="startOrder()"/>
        <!-- <v-card height="90%">

            <iframe :src="full_ui_url" id="powModal"></iframe>

        </v-card> -->
    </v-dialog>
</template>

<script>

import {PowApi} from '../../services/powApi';
import { mapState } from 'vuex';
import powModal from './powModal'
const powServ = new PowApi();

export default {
    props: {
        resource: Object,
        btn: Boolean
    },
    data() {
        return {
            dialog: false,
            button: false,
            scriptTags: [],
        }
    },
    components: {
        powModal: powModal
    },
    computed: {
        ...mapState({
            past_orders_nbr: state => state.pow.past_orders_nbr,
            custom_aoi_url: state => state.pow.custom_aoi_url,
            ofi_path: state => state.pow.ofi_path,
            ofi_secure_path: state => state.pow.ofi_secure_path,
            pow_path: state => state.pow.pow_path,
            pow_secure_path: state => state.pow.pow_secure_path,
            pow_ui_path: state => state.pow.pow_ui_path,
            order_details: state => state.pow.order_details,
            dataset_title: state => state.dataset.dataset.title,
            dataset_name: state => state.dataset.dataset.name,
            download_audience:state => state.dataset.dataset.download_audience,
            full_ui_url: state => state.pow.full_ui_url,
            pow_loading: state=> state.pow.pow_loading
        })
    },

    methods: {
        startOrder: function() {
            var public_url = this.get_ofi_url('/public/')
            var secure_url = this.get_ofi_url('/secure/')
            var run_pow = this.init_pow;
            //(pow_initialized) ? this.runOrder :
            let dwdspowapi = window.dwdspowapi;
            dwdspowapi.initialize(public_url, secure_url, this.custom_aoi_url, this.past_orders_nbr, false, false, run_pow)
        },
        init_pow: function(pow_ready) {
            //pow_initialized = pow_ready
            let dwdspowapi = window.dwdspowapi;
            dwdspowapi.orderData = {
                emailAddress: '',
                aoiType: this.order_details.aoi_type,
                aoi: this.order_details.aoi,
                clippingMethodType: this.order_details.clipping_method_type_id,
                orderingApplication: this.order_details.ordering_application,
                formatType: this.order_details.format_type,
                csrType: this.order_details.csr_type,
                //the code below will be loaded for specific packages
                featureItems: [
                    {
                    featureItem: this.resource.object_name,
                    filterValue: '',
                    layerName: this.dataset_title,
                    filterType: 'No Filter',
                    layerMetadataUrl: this.order_details.metadata_url + this.dataset_name,
                    pctOfMax: null
                    }
                ],
            }

            /*let powOrder = */new dwdspowapi.Order(dwdspowapi.orderData, this.pow_ui_path)
            this.runOrder(pow_ready)
        },

        runOrder:function() {
            this.dwdsPowUi()
        },

        dwdsPowUi: function() {
            var qs = {
                publicUrl: this.get_ofi_url('/public/'),
                secureUrl: this.get_ofi_url('/secure/'),
                customAoiUrl: this.custom_aoi_url,
                pastOrdersNbr: this.past_orders_nbr,
                secureSite: false,
                orderSource: this.order_details.ordering_application
            }

            var params = Object.keys(qs).map(function(key){
                return encodeURIComponent(key) + '=' + encodeURIComponent(qs[key])
            }).join('&')

            var url = this.get_pow_url(this.pow_ui_path, (this.download_audience != 'Public')) + params;
            this.$store.commit('pow/setFullUiPath', {full_ui_path: url})
            this.$store.commit('pow/setPowLoading', {powLoading: false})
            //window.open(url, "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=10, left=10");
        },

        get_ofi_url: function(endpoint, secure) {
            if (typeof(secure) === "undefined"){
                secure = false;
            }

            if (secure) {
                return this.ofi_secure_path + endpoint;
            } else {
                return this.ofi_path + endpoint;
            }
        },

        get_pow_url: function(endpoint, secure) {
            if (secure) {
                return this.pow_secure_path + endpoint;
            } else {
                return this.pow_path + endpoint;
            }
        },

        async get_pow_config() {
            const response = await powServ.getPowConfig()
            this.$store.commit('pow/setPowConfig', {pow_config: response})

            var scripts = [
                '/js/dwds-POW-api.js',
                '/js/xdLocalStorage.js'
            ];

            let self = this;

            scripts.map(function(script) {
                var el = document.createElement('script');
                el.type = 'text/javascript';
                el.src = script;
                self.scriptTags.push(el);
                document.body.appendChild(el);
                return script;
            });
        },

        async get_ofi_config() {
            const response = await powServ.getOfiConfig()
            this.$store.commit('pow/setOfiConfig', {ofi_config: response})
        },

        powOrderSuccess: function(orderID) {
            alert('Order Id: ' + orderID);
        },

        powOrderFail: function(error) {
            alert('Order Error: ' + error);
        }

    },

    mounted () {
        this.get_pow_config()
        this.get_ofi_config()
    },

    destroyed () {
        for (let i=0; i<this.scriptTags.length; i++){
            this.scriptTags[i].remove();
        }
    }
}
</script>

<style scoped>
    #powModal {
        height: 450px;
        width: 100%;
        border: none
    }

    .theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled).label_colour--text{
        color: var(--v-label_colour-base) !important;
    }

    .ctrl-button {
        font-size: 16px;
        font-weight: bold;
        height: 40px !important;
    }
</style>
