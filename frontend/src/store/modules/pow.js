import { powApi } from '../../services/powApi'

import Vue from 'vue'

const state = {
    past_orders_nbr: 0,
    custom_aoi_url: null,
    ofi_path: null,
    ofi_secure_path: null,
    pow_path: "",
    pow_secure_path: "",
    pow_ui_path: "",
    order_details: {}

};

const actions = {

};

const mutations = {
    setPastOrders(state, {orderNumber}) {
        state.past_orders_nbr = orderNumber
    },
    setCustomAOI(state, {aoi_url}) {
        state.custom_aoi_url = aoi_url
    },
    setProtocol(state, {protocol}) {
        state.protocol = protocol
    },
    setOrderPath(state, {path}) {
        state.order_path = path
    },
    setOrderSecurePath(state, {secure_path}) {
        state.order_secure_path = secure_path
    },
    setPowConfig(state, {pow_config}) {
        console.log(pow_config.pow)
        state.custom_aoi_url = pow_config.pow.custom_aoi_url
        state.past_orders_nbr = pow_config.pow.past_orders_nbr
        state.pow_secure_path = pow_config.pow.secure_url
        state.pow_path = pow_config.pow.public_url
        state.pow_ui_path = pow_config.pow.ui_path
        state.order_source = pow_config.order_source
        state.order_details = Object.assign({}, pow_config.pow.order_details);
    
    },
    setOfiConfig(state, {ofi_config}) {
        state.ofi_path = ofi_config.ofi.api.public_url
        state.ofi_secure_path = ofi_config.ofi.api.secure_url
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};

