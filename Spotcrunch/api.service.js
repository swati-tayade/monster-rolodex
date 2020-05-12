app.factory('APIService', ['$http', 'Storage', function ($http, Storage) {
  var orders = [];

  /**
   * @author Bhupendra
   * @description This api web service is used to check and authenticate user's login credentials.
   * @param (Object) data which contains post parameters.
   * @return (object) response
   */

  var authenticateUser = function (data) {

    /** FOR TESTING PURPOSE
     response={};
     response.islogged = true;
     Storage.save(SESS_USER, response, true);
     callback(true, "Authentication successfull");
     return;*/

    return new Promise(function (resolve, reject) {
      $http.post(LOGIN_URL, data).then(function (response) {
        //successfully executed
        if (response.data) {
          response.data.islogged = true;
          Storage.save(SESS_USER, response.data, true);
          resolve();
        } else {
          reject("Invalid Response");
        }

      }, function (response) {
        //error on request
        if (response.data.error.code == ERR_LOGIN_FAILED) {
          reject("Username/Password is invalid");
        } else {
          reject("Server is not responding");
        }


      });
    });

  }


  var getOrders = function (page) {

    return new Promise(function (resolve, reject) {
      if (!page) {
        page = 1;
      }
      var _orders = [];
      var data = {};
      data.restaurant_id = User.userId;
      data.limit = LIST_LIMIT;
      data.page = page;
      $http.post(ORDERS_URL, data).then(function (response) {
        //successfully executed
        if (response.data) {
          // console.log(response.data);
          if (response.data.length > 0) {
            _orders = response.data;
          }
        }
        resolve(_orders); //returns orders data if available or returns empty

      }, function (response) {
        resolve(_orders); //returns empty data
      });

    });

  }

  var getCompletedOrders = function (page) {

    return new Promise(function (resolve, reject) {
      if (!page) {
        page = 1;
      }
      var _orders = [];
      var data = {};
      data.restaurant_id = User.userId;
      data.limit = LIST_LIMIT;
      data.completed_order = "1";
      data.page = page;
      $http.post(ORDERS_URL, data).then(function (response) {
        //successfully executed
        if (response.data) {
          console.log(response.data);
          if (response.data.length > 0) {
            _orders = response.data;
          }
        }
        resolve(_orders); //returns orders data if available or returns empty

      }, function (response) {
        resolve(_orders); //returns empty data
      });

    });


  }
  var getCountryList = function (page) {
    return new Promise(function (resolve, reject) {
      var _countries = [];
      $http.get(COUNTRIES_URL).then(function (response) {
        //successfully executed
        if (response.data) {
          if (response.data.length > 0) {
            _countries = response.data;
          }
        }
        resolve(_countries); //returns orders data if available or returns empty
      }, function (response) {
        resolve(_countries); //returns empty data
      });

    });
  }
  var getCurrency = function (countryId) {
    return new Promise(function (resolve, reject) {
      var _u = Storage.get(SESS_USER, true);
      $http.get(COUNTRIES_URL + "/" + countryId).then(function (response) {
        //successfully executed
        if (response.data) {
          resolve(response.data);
        }
        //returns orders data if available or returns empty
      }, function (response) {
        if (response.data.error) {
          reject(response.data.error.message);
        } else {
          reject("Server is not responding");
        }
      });

    });
  }

  var getTimeZones = function () {
    return new Promise(function (resolve, reject) {
      var _u = Storage.get(SESS_USER, true);
      var cities = [];
      $http.get(TIME_ZONES_URL + "access_token=" + _u.id).then(function (response) {
        //successfully executed
        if (response.data) {
          if (response.data.length > 0) {
            timezones = response.data;
          }
        }
        resolve(timezones); //returns orders data if available or returns empty
      }, function (response) {
        if (response.data.error) {
          reject(response.data.error.message);
        } else {
          reject("Server is not responding");
        }
      });

    });
  }

  var sendOTPToMobile = function (data) {

    return new Promise(function (resolve, reject) {
      $http.post(SEND_OTP_FOR_MOBILE, data).then(function (response) {
        //successfully executed
        if (response.data) {
          resolve("Please check your mobile number and verify OTP code");
        } else {
          reject("Invalid Response");
        }

      }, function (response) {
        //error on request
        if (response.data.error) {
          reject(response.data.error.message);
        } else {
          reject("Server is not responding");
        }
      });
    });

  }

  var verifyOTPForMobile = function (data) {
    return new Promise(function (resolve, reject) {
      $http.post(VERIFY_OTP_FOR_MOBILE, data).then(function (response) {
        //successfully executed
        if (response.data.status) {

          response.data.data.islogged = false;
          response.data.data.signUpStatus = "Not Completed";
          Storage.save(SESS_USER, response.data.data, true);
          resolve("OTP verified successfully");

        } else {
          reject(response.data.message);
        }

      }, function (response) {
        //error on request
        if (response.data.error) {
          reject(response.data.error.message);
        } else {
          reject("Server is not responding");
        }
      });
    });
  }

  var sendOTP = function (data) {

    return new Promise(function (resolve, reject) {
      $http.post(SEND_RESET_OTP_URL, data).then(function (response) {
        //successfully executed
        if (response.data) {
          resolve("Please check your email and verify OTP code");
        } else {
          reject("Invalid Response");
        }
      }, function (response) {
        //error on request
        if (response.data.error) {
          reject(response.data.error.message);
        } else {
          reject("Server is not responding");
        }
      });
    });

  }

  var verifyOTP = function (data) {
    return new Promise(function (resolve, reject) {
      $http.post(OTP_VERIFY_URL, data).then(function (response) {
        //successfully executed
        if (response.data) {
          response.data.islogged = true;
          Storage.save(SESS_USER, response.data, true);
          resolve("OTP verified successfully");
        } else {
          reject("Invalid Response");
        }

      }, function (response) {
        //error on request
        if (response.data.error) {
          reject(response.data.error.message);
        } else {
          reject("Server is not responding");
        }
      });
    });
  }

  var updateProfile = function (data) {
    return new Promise(function (resolve, reject) {
      var _u = Storage.get(SESS_USER, true);
      $http.put(UPDATE_USER_URL + "/" + _u.userId + "?access_token=" + _u.id, data).then(function (response) {
        //successfully executed
        if (response.data) {
          resolve("Password reset successful");
        } else {
          reject("Invalid Response");
        }

      }, function (response) {
        //error on request
        if (response.data.error) {
          reject(response.data.error.message);
        } else {
          reject("Server is not responding");
        }


      });
    });
  }
  var signUp = function (data) {
    return new Promise(function (resolve, reject) {
      var _u = Storage.get(SESS_USER, true);
      $http.put(UPDATE_USER_URL + "/" + _u.userId + "?access_token=" + _u.id, data).then(function (response) {
        //successfully executed
        if (response.data) {
          resolve("Sign up successful");
        } else {
          reject("Invalid Response");
        }

      }, function (response) {
        //error on request
        if (response.data.error) {
          reject(response.data.error.message);
        } else {
          reject("Server is not responding");
        }


      });
    });
  }
  var verifyAndChangePassword = function (data) {
    return new Promise(function (resolve, reject) {
      var _u = Storage.get(SESS_USER, true);
      $http.post(UPDATE_PASSWORD, data).then(function (response) {
        //successfully executed
        if (response.data) {
          resolve("Password changed successful");
        } else {
          reject("Invalid Response");
        }

      }, function (response) {
        //error on request
        if (response.data.error) {
          reject(response.data.error.message);
        } else {
          reject("Server is not responding");
        }


      });
    });
  }

  var acceptOrder = function (data, min) {

    var _setTime = function (data, cb, err) {
      data.duration = min;
      $http.post(ORDER_SET_TIME, data).then(function (response) {
        //successfully executed
        if (response.data) {
          cb();
        } else {
          err("Order accepted but unable to set time");
        }

      }, function (response) {
        err("Invalid response from server");

      });
    }

    return new Promise(function (resolve, reject) {
      data.makeAutomatic = localStorage.getItem('autoNotification') || '1';

      $http.post(ORDER_STATUS, data).then(function (response) {

        //successfully executed
        if (response.data) {
          _setTime(data, resolve, reject);
        } else {
          reject("Unable to accept order. Please try again later");
        }

      }, function (response) {
        reject("Invalid response from server");

      });

    });
  }
  var cancelOrder = function (data) {
    return new Promise(function (resolve, reject) {
      $http.post(ORDER_STATUS, data).then(function (response) {
        //successfully executed
        if (response.data) {
          if (response.data.data.count == 1) {
            resolve();
          } else {
            reject("#167 Unable to cancel order. Please try again later");
          }

        } else {
          reject("#171 fUnable to cancel order. Please try again later");
        }

      }, function (response) {
        reject("Invalid response from server");

      });

    });
  }

  var setOrderStatus = function (order) {
    return new Promise(function (resolve, reject) {

      var _nextStatus = getNextStatus(order.order_status, order.dine_in);
      // console.log(_nextStatus, "Next Status");
      var data = {};
      data.id = order.id;
      data.status = _nextStatus;

      $http.post(ORDER_STATUS, data).then(function (response) {
        if (response.data) {
          order.order_status = _nextStatus;
          resolve(order);
        } else {
          reject("Unable to set status. Please try again");
        }

      }, function (response) {
        reject(response.data.error.message);

      });

    });
  }
  var searchProducts = function (productName) {

    return new Promise(function (resolve, reject) {

      var _u = Storage.get(SESS_USER, true);
      $http.get(SEARCH_PRODUCT + 'q=' + productName + '&restaurant_id=' + User.userId).then(function (response) {
        if (response) {
          resolve(response.data);
        } else {
          console.log('Error: getProductList');
        }

      }, function (err) {
        console.log('Error: getProductList');
      });

    });

  };

  var getCookingVideos = function () {
    var config = {
      headers: {
        'accessToken': ACCESS_TOKEN
      }
    };

    return new Promise(function (resolve, reject) {
      $http.get(GET_COOKING_VIDEOS + 'page=1' + '&limit=100', config).then(function (response) {
        console.log("response", response)
        if (response.data) {
          resolve(response);
        } else {
          reject("Unable to get videos. Please try again");
        }
      }, function (response) {
        reject(response.data.error.message);
      });
    });
  };
  var getChefVideo = function () {
    return new Promise(function (resolve, reject) {
      var _u = Storage.get(SESS_USER, true);
      $http.get(GET_CHEF_VIDEO + 'restaurant_id=' + User.userId + '&access_token=' + _u.id).then(function (response) {
        console.log("response11", response);

        if (response.data) {
          resolve(response);
        } else {
          reject("Unable to get videos. Please try again");
        }
      }, function (response) {
        reject(response.data.error.message);
      });
    });
  };

  var deleteVideo = function (videoId) {
    return new Promise(function (resolve, reject) {
      $http.delete(DELETE_VIDEOS + videoId).then(function (response) {
        if (response.data) {
          resolve(response);
        } else {
          reject("Unable to delete video. Please try again");
        }
      }, function (response) {
        reject(response.data.error.message);
      });
    });
  }

  var deleteChefVideo = function (chef_video) {
    return new Promise(function (resolve, reject) {
      $http.delete(DELETE_CHEF_VIDEOS + chef_video).then(function (response) {
        if (response.data) {
          resolve(response);
        } else {
          reject("Unable to delete video. Please try again");
        }
      }, function (response) {
        reject(response.data.error.message);
      });
    });
  }

  var autoNotification = function (data) {

    return new Promise(function (resolve, reject) {
      $http.post(GET_AUTO_NOTIFICATION, data).then(function (response) {
        //successfully executed
        if (response) {
          resolve(response);
        } else {
          reject(response);
        }

      }, function (response) {
        //error on request

        // if (response.data.error) {
        //   reject(response.data.error.message);
        // } else {
        //   reject("Server is not responding");
        // }
        console.log(response)

      });
    });

  }

  var getOrderStatus = function (order) {
    return new Promise(function (resolve, reject) {

      var data = {};
      data.appuserorder_id = order.order_item[0].app_user_order_id;

      $http.post(ORDER_GET_STATUS, data).then(function (response) {
        if (response.data) {
          resolve(response);
        } else {
          reject("Unable to set status. Please try again");
        }

      }, function (response) {
        reject(response.data.error.message);

      });

    });
  };

  var getNewOrders = function (orderId) {

    return new Promise(function (resolve, reject) {

      var _u = Storage.get(SESS_USER, true);
      $http.get(GET_NEW_ORDERS + 'restaurant_id=' + User.userId + '&lastOrderId=' + orderId + '&access_token=' + _u.id).then(function (response) {
        if (response) {
          resolve(response.data);
        } else {
          console.log('Error: getNewOrders');
        }

      }, function (err) {
        console.log('Error: getNewOrders');
      });

    });

  };

  var addCustomCategory = function (data) {
    return new Promise(function (resolve, reject) {
      $http.post(ADD_CUSTOM_CATEGORY, data).then(function (response) {
        if (response) {
          resolve(response);
        } else {
          reject(response);
        }
      }, function (error) {
        reject(error);
      });
    });
  }

  var getProductCategoriesList = function () {
    return new Promise(function (resolve, reject) {
      var _u = Storage.get(SESS_USER, true);
      $http.get(GET_PRODUCT_CATEGORIES + 'access_token=' + _u.id).then(function (response) {
        if (response) {
          resolve(response.data);
        } else {
          console.log('Error: getProductCategoryList');
        }

      }, function (err) {
        console.log('Error: getProductCategoryList');
      });

    });
  };

  var getProductsList = function (productName) {
    //console.log("productName", productName)
    return new Promise(function (resolve, reject) {
      var _u = Storage.get(SESS_USER, true);
      console.log("_u ", _u)
      $http.get(GET_PRODUCT_LIST + 'restaurantId=' + User.userId + '&access_token=' + _u.id).then(function (response) {
        console.log("response", response)
        if (response) {
          console.log("SSsssssss")
          resolve(response.data);
        } else {
          console.log('Error: getProductList');
        }
      }, function (err) {
        console.log('Error: getProductList');
      });
    });
  };

  var getProductDetail = function (productId) {
    var _u = Storage.get(SESS_USER, true);
    return new Promise(function (resolve, reject) {
      $http.get(GET_PRODUCT_DETAILS + 'productId=' + productId + '&access_token=' + _u.id).then(function (response) {
        if (response) {
          resolve(response.data);
        } else {
          console.log('Error: getProductList');
        }
      }, function (err) {
        console.log('Error: getProductList');
      });
    });
  }
  var getProductImages = function (productId) {
    var _u = Storage.get(SESS_USER, true);
    return new Promise(function (resolve, reject) {
      $http.get(GET_PRODUCT_IMAGES + 'product_id=' + productId + '&access_token=' + _u.id).then(function (response) {
        if (response) {
          resolve(response.data);
        } else {
          console.log('Error: getProductImageList');
        }
      }, function (err) {
        console.log('Error: getProductImageList');
      });
    });
  }
  var addProduct = function (data) {
    return new Promise(function (resolve, reject) {
      $http.post(ADD_PRODUCT, data).then(function (response) {
        if (response) {
          resolve(response);
        } else {
          reject(response);
        }
      }, function (response) {
        //error on request
        if (response.data.error) {
          reject(response.data.error.message);
        } else {
          reject("Server is not responding");
        }
      });
    });

  }

  var updateProduct = function (data) {
    return new Promise(function (resolve, reject) {
      $http.put(UPDATE_PRODUCT, data).then(function (response) {
        if (response) {
          resolve(response);
        } else {
          reject(response);
        }
      }, function (response) {
        //error on request
        if (response.data.error) {
          reject(response.data.error.message);
        } else {
          reject("Server is not responding");
        }
      });
    });
  }

  var deleteProduct = function (data) {
    return new Promise(function (resolve, reject) {
      $http.post(DELETE_PRODUCT, data).then(function (response) {
        //successfully executed
        if (response.data) {
          resolve("Product deleted successfully");
        } else {
          reject("Invalid Response");
        }
      }, function (response) {
        //error on request
        if (response.data.error) {
          reject(response.data.error.message);
        } else {
          reject("Server is not responding");
        }


      });
    });
  }
  var deleteProductSize = function (data) {
    return new Promise(function (resolve, reject) {
      $http.post(DELETE_PRODUCT_SIZE, data).then(function (response) {
        //successfully executed
        if (response.data) {
          resolve("Product size deleted successfully");
        } else {
          reject("Invalid Response");
        }
      }, function (response) {
        //error on request
        if (response.data.error) {
          reject(response.data.error.message);
        } else {
          reject("Server is not responding");
        }
      });
    });
  }
  var getProductFeatureList = function (pId) {
    return new Promise(function (resolve, reject) {
      var _u = Storage.get(SESS_USER, true);
      $http.get(GET_PRODUCT_FEATURE_LIST + 'product_id=' + pId + '&access_token=' + _u.id).then(function (response) {
        if (response) {
          resolve(response.data);
        } else {
          console.log('Error: getProductFeatureList');
        }

      }, function (err) {
        console.log('Error: getProductFeatureList');
      });

    });
  };


  var updateroductFeature = function (fId, data) {
    return new Promise(function (resolve, reject) {
      $http.put(UPDATE_PRODUCT_FEATURE + fId, data).then(function (response) {
        if (response) {
          resolve(response.data);
        } else {
          reject(response);
        }
      }, function (response) {
        if (response.data.error) {
          reject(response.data.error.message);
        } else {
          reject("Server is not responding");
        }
      });
    });
  }

  var getRestaurantDetails = function () {
    return new Promise(function (resolve, reject) {
      var _u = Storage.get(SESS_USER, true);
      $http.get(RESTAURANT_DETAILS + 'restaurant_id=' + User.userId + '&access_token=' + _u.id).then(function (response) {
        if (response) {
          resolve(response);
        } else {
          console.log('Error: Get restaurant details');
        }
      }, function (err) {
        console.log('Error: Get restaurant details');
      });

    });

  };

  var getKitchenImages = function () {
    return new Promise(function (resolve, reject) {
      $http.get(GET_KITCHEN_PHOTO).then(function (response) {
        if (response.data) {
          resolve(response);
        } else {
          reject("Unable to get kitchen images. Please try again");
        }
      }, function (response) {
        reject(response.data.error.message);
      });
    });
  }

  var deleteKitchenImage = function (imageId) {
    return new Promise(function (resolve, reject) {
      $http.delete(DELETE_KITCHEN_PHOTO + imageId).then(function (response) {
        if (response.data) {
          resolve(response);
        } else {
          reject("Unable to delete kitchen image. Please try again");
        }
      }, function (response) {
        reject(response.data.error.message);
      });
    });
  }

  var saveStatement = function (data) {
    return new Promise(function (resolve, reject) {
      $http.put(UPLOAD_STATEMENT, data).then(function (response) {
        if (response) {
          resolve(response.data);
        } else {
          reject(response);
        }
      }, function (response) {
        if (response.data.error) {
          reject(response.data.error.message);
        } else {
          reject("Server is not responding");
        }
      });
    });
  }
  var getKYCDocs = function () {
    return new Promise(function (resolve, reject) {
      var _u = Storage.get(SESS_USER, true);
      $http.get(GET_KYC_DOCS + User.userId).then(function (response) {
        if (response.data) {
          resolve(response);
        } else {
          reject("Unable to get KYC details");
        }
      }, function (response) {
        reject(response.data.error.message);
      });
    });
  }
  var getKYCStatus = function () {
    return new Promise(function (resolve, reject) {
      var _u = Storage.get(SESS_USER, true);
      $http.get(GET_KYC_STATUS + User.userId).then(function (response) {
        if (response.data) {
          resolve(response);
        } else {
          reject("Unable to get KYC status");
        }
      }, function (response) {
        reject(response.data.error.message);
      });
    });
  }
  return {
    getOrders: getOrders,

    getOrder: function (order_id, callback) {

      angular.forEach(orders.concat(compelted_orders), function (v, k) {
        if (order_id == v.order_id) {
          callback(v);

        }
      });
    },

    getCompletedOrders: getCompletedOrders,
    getTimeZones: getTimeZones,
    getCurrency: getCurrency,
    getCountryList: getCountryList,
    login: authenticateUser,
    sendOTPToMobile: sendOTPToMobile,
    verifyOTPForMobile: verifyOTPForMobile,
    sendOTP: sendOTP,
    verifyOTP: verifyOTP,
    signUp: signUp,
    updateProfile: updateProfile,
    saveStatement: saveStatement,
    verifyAndChangePassword: verifyAndChangePassword,
    acceptOrder: acceptOrder,
    cancelOrder: cancelOrder,
    setOrderStatus: setOrderStatus,
    autoNotification: autoNotification,
    getOrderStatus: getOrderStatus,
    getNewOrders: getNewOrders,
    addCustomCategory: addCustomCategory,
    getProductCategoriesList: getProductCategoriesList,
    searchProducts: searchProducts,
    getProductDetail: getProductDetail,
    getProductsList: getProductsList,
    addProduct: addProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    deleteProductSize: deleteProductSize,
    getProductFeatureList: getProductFeatureList,
    updateroductFeature: updateroductFeature,
    getProductImages: getProductImages,
    getCookingVideos: getCookingVideos,
    getChefVideo: getChefVideo,
    deleteVideo: deleteVideo,
    deleteChefVideo: deleteChefVideo,
    getRestaurantDetails: getRestaurantDetails,
    getKitchenImages: getKitchenImages,
    deleteKitchenImage: deleteKitchenImage,
    getKYCDocs: getKYCDocs,
    getKYCStatus: getKYCStatus
  };

}]);
