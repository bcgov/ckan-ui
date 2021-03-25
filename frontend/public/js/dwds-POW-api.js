var dwdspowapi = window.dwdspowapi;
(function (dwdspowapi) {
	dwdspowapi.initialize = function(publicUrl, secureUrl, customAoiUrl, pastOrdersNbr, secureSite, persistConfig, powInitCallback) {
		// default to false
		xdLocalStorage.resetInit()
		var persistLocally = typeof persistConfig !== 'undefined' ? persistConfig : false;
		
		// if we didn't get all the parameters check to see if they exist in a cookie
		if (publicUrl != null && secureUrl != null && customAoiUrl !=null && pastOrdersNbr != null && secureSite != null) {
			dwdspowapi.publicUrl = publicUrl;
			dwdspowapi.secureUrl = secureUrl;
			dwdspowapi.customAoiUrl = customAoiUrl + dwdspowapi.ConfigEnum.CUSTOMAOIPATH;
			dwdspowapi.pastOrdersNbr = pastOrdersNbr;
			dwdspowapi.secureSite = secureSite;
			dwdspowapi.powIframeUrl = (secureSite ? secureUrl.replace('secure/', '') + dwdspowapi.ConfigEnum.POWIFRAMEPATH : publicUrl.replace('public/', '') + dwdspowapi.ConfigEnum.POWIFRAMEPATH);
			// we have all the parameters, store them in a cookie for subsequent calls without all the parameters
			// such as from the Past Orders page
			if (persistLocally) {
				var configItems = {"publicUrl": publicUrl, "secureUrl": secureUrl , "customAoiUrl": dwdspowapi.customAoiUrl, "powIframeUrl": dwdspowapi.powIframeUrl, "pastOrdersNbr": pastOrdersNbr , "secureSite": secureSite};
				localStorage.setItem(dwdspowapi.ConfigEnum.CONFIGLOCALKEY, JSON.stringify(configItems));
			}
		} else {
			// read the local storage containing the config
			var powConfig = JSON.parse(localStorage.getItem(dwdspowapi.ConfigEnum.CONFIGLOCALKEY));
			if(Object.entries(powConfig).length === 0 && powConfig.constructor === Object) {
				if (powInitCallback && typeof(powInitCallback) === "function") {
					powInitCallback(false);
				}
			} else {
				dwdspowapi.publicUrl = powConfig.publicUrl;
				dwdspowapi.secureUrl = powConfig.secureUrl;
				dwdspowapi.customAoiUrl = powConfig.customAoiUrl;
				dwdspowapi.pastOrdersNbr = powConfig.pastOrdersNbr;
				dwdspowapi.secureSite = powConfig.secureSite;
				dwdspowapi.powIframeUrl = powConfig.powIframeUrl;
			}
		}
		
		xdLocalStorage.init({
			iframeUrl: dwdspowapi.powIframeUrl,
			initCallback: function () {
				// console.log('local storage init complete');
				if (powInitCallback && typeof(powInitCallback) === "function") {
					powInitCallback(true);
				}
			}
		});
	};

    var Order = (function () {
        function Order(data, persistOrder, orderCallback) {
			
			var persistLocally = typeof persistOrder !== 'undefined' ? persistOrder : true;
			var self = this;
			var newOrder = data;
			if (persistLocally) {
				xdLocalStorage.getItem(dwdspowapi.ConfigEnum.ORDERLOCALKEY, 
					function (retMessage) {
						//console.log(retMessage)
						if (retMessage.value==="undefined" || !retMessage.value) {
							//TODO: Set the current order using xdLocalStorage.setItem
							//console.log('!!!')
							newOrder.formatType = self._getDefaultFileFormat();
							newOrder.crsType = self._getDefaultCoordSystem();
                            newOrder.clippingMethodType = self._getDefaultClipMethod();
							self.data = newOrder
							
						} else {
							var currentOrder = JSON.parse(retMessage.value);
							var mergedOrder = self._merge(currentOrder, newOrder);
							self.data = mergedOrder;
						}
						// persist the order in local storage for the UI
						self.persist(self, orderCallback);
					}
				);
			
				
			} else {
				self.data = newOrder;
				if (orderCallback && typeof(orderCallback) === "function") {
					orderCallback.call(self, true);
				}
			}
        };
		Order.prototype.getJson = function () {
			
            return JSON.stringify(this.data);
        };
		Order.prototype._merge = function (currentOrder, newOrder) {
			
			var mergedNewOrder = newOrder;
			// apply the current order format and crs to the new order
			// to persist it
			mergedNewOrder.formatType = currentOrder.formatType;
			mergedNewOrder.crsType = currentOrder.crsType;
            mergedNewOrder.clippingMethodType = currentOrder.clippingMethodType;
			
			var currentOrderFI = currentOrder.featureItems;
			var mergedNewOrderFI = mergedNewOrder.featureItems;
			
			// check if the ordering application for the current order
			// is not within the new order ordering application
            // also ensure that the total string length is not > 50
            var fullOrderingApp = currentOrder.orderingApplication + ';' + mergedNewOrder.orderingApplication;
			if (currentOrder.orderingApplication.search(mergedNewOrder.orderingApplication) == -1 && fullOrderingApp.length <= 50) {
				// add the current orders orderingApplication to the new order
				mergedNewOrder.orderingApplication = fullOrderingApp;
			}
			// Create an index of feature items on the new order
            var newOrderItems = [];
            for (var i=0, iLen=mergedNewOrderFI.length; i<iLen; i++) {
			  newOrderItems.push(mergedNewOrderFI[i].featureItem);
            }

            // Do check, push missing layers from current order to new order
            for (var j=0, jLen=currentOrderFI.length; j<jLen; j++) {
			  if ( newOrderItems.indexOf( currentOrderFI[j].featureItem) == -1 ) {
				mergedNewOrder.featureItems.push(currentOrderFI[j]);
              } 
            }

            return mergedNewOrder;
        };

		Order.prototype.persist = function (orderObj, orderCallback) {
			//console.log("Setting local storage for order")
			//localStorage.setItem(dwdspowapi.ConfigEnum.ORDERLOCALKEY, JSON.stringify(this.data));
			xdLocalStorage.setItem(dwdspowapi.ConfigEnum.ORDERLOCALKEY, JSON.stringify(this.data), function (data) {
                if (orderCallback && typeof(orderCallback) === "function") {
                    orderCallback.call(orderObj, true);
                }
			});
		};
		Order.prototype.validate = function () {
			
            var result = this._validOrderType(false);
            return result;
        };
		Order.prototype.submitOrder = function(onSuccess, onError) {
			// make sure the submitted order is valid
			//var checkOrder = this.persistOrder(order);
			var validOrder = this.validate();
			var msg = 'An unknown error occurred submitting your Order. Please contact the DWDS administrator.';
			
			if (validOrder) {
				// when are using a site minder secured site we have to post to the public order service
				// which returns a UID that we then use in a get request to the secure service
				// this is because POST is not allowed in the secure site
				if (dwdspowapi.secureSite) {
					this._submitOrderSM( msg, onSuccess, onError);
				// PUBLIC SITE
				} else {
					this._submitOrderPublic( msg, onSuccess, onError);
				}
			} else {
				if (onError && typeof(onError) === "function") {
					msg = "The submitted order's structure is not valid.";
					onError(msg);
				}
			}
		};
		Order.prototype.calcOrderSize = function(onSuccess, onError) {
			var msg = 'An unknown error occurred calculating your Order Size.';
			$.ajax({
					type : "POST",
					headers: { 
						'Accept': 'application/json',
						'Content-Type': 'application/json' 
					},
					url: dwdspowapi.publicUrl + dwdspowapi.ConfigEnum.ORDERSIZESERVICE, 
					data: JSON.stringify(this.data),
					dataType: 'json',
					contentType: 'application/json',
					success : function(data) {
						// only fails come back with a data.Status
						if (typeof data.Status != 'undefined'){
							if (typeof data.Description != 'undefined') {
								msg = data.Description;
							}
							if (onError && typeof(onError) === "function") {
								onError(msg);
							}
						} else {
							if (onSuccess && typeof(onSuccess) === "function") {
								onSuccess(data.featureItems);
							}
						}
					},
					error : function(data) {
						if (typeof data.ERROR_MESSAGE != 'undefined') {
							msg = data.ERROR_MESSAGE;
							
						}
						if (onError && typeof(onError) === "function") {
							onError(msg);
						}
					}
				});
		};
		Order.prototype._submitOrderPublic = function( msg, onSuccess, onError) {
			var self = this;
			$.ajax({
				type : "POST",
				headers: { 
					'Accept': 'application/json',
					'Content-Type': 'application/json' 
				},
				url: dwdspowapi.publicUrl + dwdspowapi.ConfigEnum.CREATEORDERSERVICE,
				data: JSON.stringify(this.data),
				dataType: 'json',
				contentType: 'application/json',
				success : function(data) {
					
					if (data.Status === 'SUCCESS'){
						if (onSuccess && typeof(onSuccess) === "function") {
							self._removeLocalOrder();
							onSuccess(data.Value, data.Warnings);
						}
					} else {
						if (typeof data.Description != 'undefined') {
							msg = data.Description;
						}
						if (onError && typeof(onError) === "function") {
							onError(msg);
						}
					}
				},
				error : function(data) {
					if (typeof data.Description != 'undefined') {
						msg = data.Description;
					}
					if (onError && typeof(onError) === "function") {
					  onError(msg);
					}
				}
			});
		};
		// this post to the public service since post is blocked in the secure sites
		// it receives back a unique id which is passed in the GET request
		Order.prototype._submitOrderSM = function( msg, onSuccess, onError) {
			var self = this;
			$.ajax({
				type : "POST",
				url: dwdspowapi.publicUrl + dwdspowapi.ConfigEnum.CREATEORDERSERVICESM,
				data: JSON.stringify(this.data),
				dataType: 'text',
				contentType: 'application/json',
				success : function(uid) {
					self._submitOrderSecure ( uid, msg, onSuccess, onError);
				},
				error : function(data) {
					if (data.Description != 'undefined') {
						msg = data.Description;
					}
					if (onError && typeof(onError) === "function") {
					  onError(msg);
					}
				}
			});
		};
		Order.prototype._submitOrderSecure = function( uid, msg, onSuccess, onError) {
			var self = this;
			$.getJSON(dwdspowapi.secureUrl + dwdspowapi.ConfigEnum.CREATEORDERSERVICE + uid)
				.done(function( json ) {
					if (json.Status === 'SUCCESS'){
						if (onSuccess && typeof(onSuccess) === "function") {
							self._removeLocalOrder();
							onSuccess(json.Value, json.Warnings);
						}
					} else {
						if (typeof json.Description != 'undefined') {
							msg = json.Description;
						}
						if (onError && typeof(onError) === "function") {
							onError(msg);
						}
					}
				})
				.fail(function( data ) {
					if (typeof data.Description != 'undefined') {
						msg = data.Description;
					}
					if (onError && typeof(onError) === "function") {
					  onError(msg);
					}
				});
			
		};
		Order.prototype._removeLocalOrder = function() {
			xdLocalStorage.removeItem(dwdspowapi.ConfigEnum.ORDERLOCALKEY, function (data) { /* callback */ });
		};
		Order.prototype._getDefaultFileFormat = function() {
			return dwdspowapi.FormatTypeEnum.SHAPE;
		};
		Order.prototype._getDefaultCoordSystem = function() {
			return dwdspowapi.CrsTypeEnum.BCALB_83;
		};
        Order.prototype._getDefaultClipMethod = function() {
			return dwdspowapi.ClippingMethodTypeEnum.NONE;
		};
        Order.prototype._validOrderType = function (order_matters) {
            /**
             * @param {Object} object1
             * @param {Object} object2
             * @param {Boolean} [order_matters] Affects the return value of unordered objects. (ex. {a:1, b:2} and {b:2, a:1}).
             * @returns {Boolean}
            */
			var object1 = this.data;
			var object2 = new dwdspowapi.OrderData(null, null, null, null, null, new dwdspowapi.AreaOfInterest(), null, new dwdspowapi.FeatureItem());
            var keys1 = Object.keys(object1), keys2 = Object.keys(object2);
            // Test 1: Same number of elements
            if (keys1.length != keys2.length) {
                return false;
            }
            // If order doesn't matter isEqual({a:2, b:1}, {b:1, a:2}) should return true.
            // keys1 = Object.keys({a:2, b:1}) = ["a","b"];
            // keys2 = Object.keys({b:1, a:2}) = ["b","a"];
            // This is why we are sorting keys1 and keys2.
            if (!order_matters) {
                keys1.sort();
                keys2.sort();
            }
            // Test 2: Same keys
            for (var i = 0; i < keys1.length; i++) {
                if (keys1[i] != keys2[i]) {
                    return false;
                }
            }

            // ** Test featureItems **
            // get the names in the featureItems for object2 
            var keys2FI = Object.keys(object2.featureItems), obj1FI, keys1FI;
            // if we get here we have to have a featureItems for the passed order
            // otherwise the first check would have failed
            for (var i = 0; i < object1.featureItems.length; i++) {
                obj1FI = object1.featureItems[i];
                keys1FI = Object.keys(obj1FI);
                if (keys1FI.length != keys2FI.length) {
                    return false;
                }
                if (!order_matters) {
                    keys1FI.sort();
                    keys2FI.sort();
                }
                // Test 2: Same keys
                for (var x = 0; x < keys1FI.length; x++) {
                    if (keys1FI[x] != keys2FI[x]) {
                        return false;
                    }
                }
            }
            // all good if we get here
            return true;
        };
        return Order;
    })();
    dwdspowapi.Order = Order;
    dwdspowapi.PastOrders = {
        getPastOrders: function (onSuccess, onError) {

            // call ofi for past orders
            $.getJSON(dwdspowapi.secureUrl + dwdspowapi.ConfigEnum.PASTORDERSERVICE + dwdspowapi.pastOrdersNbr)
                .done(function( json ) {
                    if (onSuccess && typeof(onSuccess) === "function") {
                        onSuccess(json);
                    }
                })
                .fail(function( data ) {
                    if (onError && typeof(onError) === "function") {
                      onError(data);
                    }
                });
            
        }
    };
    //dwdspowapi.getPastOrders = getPastOrders;
    var OrderData = (function () {
        function OrderData(emailAddress, format, orderingApplication, crs, clipMethod, aoi, prePackItems, featureItems) {
            this.emailAddress = emailAddress;
			this.formatType = format;
			this.orderingApplication = orderingApplication;
            this.crsType = crs;
			this.aoiType = aoi.aoiType;
            this.aoi = aoi.geometry;
			this.useAOIBounds = aoi.useAOIBounds;
			this.aoiName = aoi.aoiName;
            this.clippingMethodType = clipMethod;
            this.prepackagedItems = prePackItems;
            this.featureItems = featureItems;
        }
        return OrderData;
    })();
    dwdspowapi.OrderData = OrderData;	
    var FeatureItem = (function () {
        function FeatureItem() {
            this.featureItem = null;
			this.filterValue = null;
            this.layerName = null;
            this.layerMetadataUrl = null;
            this.filterType = null;
            this.pctOfMax = null;
        }
        return FeatureItem;
    })();
    dwdspowapi.FeatureItem = FeatureItem;
    var AreaOfInterest = (function () {
        function AreaOfInterest() {
            this.aoiType = null;
            this.aoiName = null;
            this.useAOIBounds = false;
            this.geometry = null;
        }
        return AreaOfInterest;
    })();
    dwdspowapi.AreaOfInterest = AreaOfInterest;
    var AoiTypeEnum = (function () {
        function AoiTypeEnum() {
            this.srcObj = [
				{ "aoiTypeID": 0, "aoiTypeDescription": "NONE", "aoiPrompt": "None"},
                { "aoiTypeID": 1, "aoiTypeDescription": "CUSTOM_GML", "aoiPrompt": "Draw a Custom AOI" },
                { "aoiTypeID": 2, "aoiTypeDescription": "BOUNDING_BOX", "aoiPrompt": "Map Extent/Bounding Box" },
                { "aoiTypeID": 3, "aoiTypeDescription": "GEOMARK", "aoiPrompt": "Geomark" },
                { "aoiTypeID": 4, "aoiTypeDescription": "MAPSHEET", "aoiPrompt": "Mapsheet" }];
        }
		AoiTypeEnum.NONE = '0';
        AoiTypeEnum.CUSTOM_GML = '1';
        AoiTypeEnum.BOUNDING_BOX = '2';
        AoiTypeEnum.GEOMARK = '3';
        AoiTypeEnum.MAPSHEET = '4';
        return AoiTypeEnum;
    })();
    dwdspowapi.AoiTypeEnum = AoiTypeEnum;
    var ClippingMethodTypeEnum = (function () {
        function ClippingMethodTypeEnum() {
            this.srcObj = [
                { "clippingMethodTypeId": 0, "description": "Clip the data to the selected area of interest.", "metadata_url": "http:\/\/www.example.com\/clipped", "clippingMethodName": "Clip to area of interest" },
                { "clippingMethodTypeId": 1, "description": "description", "metadata_url": "http:\/\/www.example.com", "clippingMethodName": "Not clipped" }];
        }
        ClippingMethodTypeEnum.AOI = 0;
        ClippingMethodTypeEnum.NONE = 1;
        return ClippingMethodTypeEnum;
    })();
    dwdspowapi.ClippingMethodTypeEnum = ClippingMethodTypeEnum;
    var CrsTypeEnum = (function () {
        function CrsTypeEnum() {
            this.srcObj = [
                { "crsTypeId": 0, "crsCode": "BCALB-83", "crsName": "BC Albers (m)", "description": "BC Albers is an Equal Area Conic Projection used within the Provice of BC.", "metadata_url": "http:\/\/www.example.com\/BC_Albers" },
                { "crsTypeId": 1, "crsCode": "EPSG:26907", "crsName": "UTM Zone 7 (m)", "description": "Description", "metadata_url": "http:\/\/www.example.com" },
                { "crsTypeId": 2, "crsCode": "EPSG:26908", "crsName": "UTM Zone 8 (m)", "description": "Description", "metadata_url": "http:\/\/www.example.com" },
                { "crsTypeId": 3, "crsCode": "EPSG:26909", "crsName": "UTM Zone 9 (m)", "description": "Description", "metadata_url": "http:\/\/www.example.com" },
                { "crsTypeId": 4, "crsCode": "EPSG:26910", "crsName": "UTM Zone 10 (m)", "description": "Description", "metadata_url": "http:\/\/www.example.com" },
                { "crsTypeId": 5, "crsCode": "EPSG:26911", "crsName": "UTM Zone 11 (m)", "description": "Description", "metadata_url": "http:\/\/www.example.com" },
                { "crsTypeId": 6, "crsCode": "LL-83", "crsName": "Geographic Long\/Lat (dd)", "description": "Description", "metadata_url": "http:\/\/www.example.com" }];
        }
        CrsTypeEnum.BCALB_83 = 0;
        CrsTypeEnum.EPSG_26907 = 1;
        CrsTypeEnum.EPSG_26908 = 2;
        CrsTypeEnum.EPSG_26909 = 3;
        CrsTypeEnum.EPSG_26910 = 4;
        CrsTypeEnum.EPSG_26911 = 5;
        CrsTypeEnum.LL_83 = 6;
        return CrsTypeEnum;
    })();
    dwdspowapi.CrsTypeEnum = CrsTypeEnum;
    var FilterTypeEnum = (function () {
        function FilterTypeEnum() {
        }
        FilterTypeEnum.SELECTED = "Selected Set";
        FilterTypeEnum.QUERY = "Query Filter";
        FilterTypeEnum.FULL = "No Filter";
        return FilterTypeEnum;
    })();
    dwdspowapi.FilterTypeEnum = FilterTypeEnum;
    var FormatTypeEnum = (function () {
        function FormatTypeEnum() {
            this.srcObj = [
                { "formatname": "ArcView Shape", "formatID": 0 },
                { "formatname": "CSV", "formatID": 2 },
                { "formatname": "ESRI File Geodatabase", "formatID": 3 },
                { "formatname": "ESRI File Geodatabase V10", "formatID": 5 },
				{ "formatname": "GeoJSON", "formatID": 6 }];
        }
        FormatTypeEnum.SHAPE = 0;
        FormatTypeEnum.E00 = 1;
        FormatTypeEnum.CSV = 2;
        FormatTypeEnum.GEODATABASE_FILE_V9 = 3;
        FormatTypeEnum.GEODATABASE_FILE_V10 = 5;
		FormatTypeEnum.GEOJSON = 6;
		
        return FormatTypeEnum;
    })();
    dwdspowapi.FormatTypeEnum = FormatTypeEnum;
    var OrderStatusTypeEnum = (function () {
        function OrderStatusTypeEnum() {
            this.srcObj = [
                { "orderStatusID": 0, "description": "The user has created the order and they are defining the distribution options.", "name": "New" },
                { "orderStatusID": 1, "description": "The user has submitted a created order and the server has accepted the order.", "name": "Submitted" },
                { "orderStatusID": 2, "description": "The fullfilment proces is processing the order.", "name": "Processing" },
                { "orderStatusID": 3, "description": "The items in the order have been created and assembled and are ready for shipment.", "name": "Assembled" },
                { "orderStatusID": 4, "description": "The order has been shipped to the client.", "name": "Shipped" },
                { "orderStatusID": 5, "description": "The order is complete and has been closed.", "name": "Closed" },
                { "orderStatusID": 6, "description": "The system has aborted the order due to an error in processing the order.", "name": "Aborted" },
                { "orderStatusID": 7, "description": "The user failed to download the order in the allowed time period.", "name": "Expired" }];
        }
        OrderStatusTypeEnum.NEW = 0;
        OrderStatusTypeEnum.SUBMITTED = 1;
        OrderStatusTypeEnum.PROCESSING = 2;
        OrderStatusTypeEnum.ASSEMBLED = 3;
        OrderStatusTypeEnum.SHIPPED = 4;
        OrderStatusTypeEnum.CLOSED = 5;
        OrderStatusTypeEnum.ABORTED = 6;
        OrderStatusTypeEnum.EXPIRED = 7;
        return OrderStatusTypeEnum;
    })();
    dwdspowapi.OrderStatusTypeEnum = OrderStatusTypeEnum;
	var ConfigEnum = (function () {
        function ConfigEnum() {
        }
		ConfigEnum.ORDERLOCALKEY = "dwds_pow_order";
		ConfigEnum.CONFIGLOCALKEY = "dwds_pow_config";
		ConfigEnum.CREATEORDERSERVICE = "order/createOrderFiltered/";
		ConfigEnum.CREATEORDERSERVICESM = "order/createOrderFilteredSM";
		ConfigEnum.ORDERSIZESERVICE = "order/OrderSizeValues/";
		
		ConfigEnum.CRSTYPESSERVICE =  "info/crsTypes";
		ConfigEnum.FORMATTYPESSERVICE =  "info/fileFormats";
		ConfigEnum.AOITYPESSERVICE =  "info/aoiTypes";
		ConfigEnum.PASTORDERSERVICE =   "order/PastOrders/";
		// "http://delivery.maps.gov.bc.ca/ess/hm/aoi/?site=imapbc&runWorkflow=AOISelector&aoiCallback=";
		ConfigEnum.CUSTOMAOIPATH =  "?site=imapbc&runWorkflow=AOISelector&aoiCallback=";
		ConfigEnum.POWIFRAMEPATH = "html/dwds_pow_order_iframe.html";
	
        return ConfigEnum;
    })();
    dwdspowapi.ConfigEnum = ConfigEnum;
})(dwdspowapi || (dwdspowapi = {}));