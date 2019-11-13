<template>
    <div class="pow-container">
        <v-btn text block color="secondary" @click="startOrder()">
            Access&nbsp;
            <v-icon>mail</v-icon>
        </v-btn>
    </div>
</template>

<script>

import {PowApi} from '../../services/powApi';
import { mapState } from 'vuex';
const powServ = new PowApi();
var pow_initialized = false
var powOrder

export default {
    props: ['resource'],
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
            download_audience:state => state.dataset.dataset.download_audience
        })
    },
    
    methods: {
        startOrder: function() {
            var public_url = this.get_ofi_url('/public/')
            var secure_url = this.get_ofi_url('/secure/')
            var run_pow = (pow_initialized) ? this.runOrder : this.init_pow;

            dwdspowapi.initialize(public_url, secure_url, this.custom_aoi_url, this.past_orders_nbr, false, false, run_pow)
        },
        init_pow: function(pow_ready) {
            console.log('initializing pow')
            pow_initialized = pow_ready
        
            dwdspowapi.orderData = {
                emailAddress: '',
                aoiType: this.order_details.aoi_type,
                aoi: this.order_details.aoi,
                clippingMethodType: this.order_details.clipping_method_type_id,
                orderingApplication: this.order_details.ordering_application,
                formatType: this.order_details.format_type,
                csrType: this.order_details.csr_type,
                //the code below wilil be loaded for specific packages
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

            powOrder = new dwdspowapi.Order(dwdspowapi.orderData, this.pow_ui_path)
            this.runOrder(pow_ready)
        },

        runOrder:function(pow_ready) {
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
            console.log(qs)
            var params = Object.keys(qs).map(function(key){
                return encodeURIComponent(key) + '=' + encodeURIComponent(qs[key])
            }).join('&')
            var url = this.get_pow_url(this.pow_ui_path, (this.download_audience != 'Public')) + params;
            window.open(url, "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=10, left=10");
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
            console.log('got pow config!')
            console.log(response)
            this.$store.commit('pow/setPowConfig', {pow_config: response})

            var ele = document.createElement('script')
            ele.type = 'text/javascript'
            ele.src = 'https://code.jquery.com/jquery-3.4.1.min.js'
            document.body.appendChild(ele);

            var scripts = [
                '/script/lib/xdLocalStorage.min.js',
                '/script/pow/dwds-POW-api.js'
            ];
            var that = this;
            scripts.map(function(script) {
                var el = document.createElement('script');
                el.type = 'text/javascript';
                el.src = that.get_pow_url(script, false);
                document.body.appendChild(el);
                return script;
            });         
        },

        async get_ofi_config() {
            const response = await powServ.getOfiConfig()
            console.log('got ofi config!')
            console.log(response)
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
        console.log('Intitializing edc_pow')
        this.get_pow_config()
        this.get_ofi_config()    
    }
}
</script>

<style scoped>
    
</style>