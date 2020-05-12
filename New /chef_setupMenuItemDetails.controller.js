/**
 * AUTHOR : Prabhudev
 * STATE : setupMenuItemDetails
 * PATH : /setupMenuItemDetails
 * ABOUT CONTROLLER :
 * This controller is for menu item details.
 * */

app.controller('setupMenuItemDetailsCtrl', ['$scope', '$ionicLoading', '$rootScope', '$stateParams', 'Camera', 'APIService', 'Storage', '$ionicPopup', '$location', '$state', '$ionicHistory',
   function ($scope, $ionicLoading, $rootScope, $stateParams, Camera, APIService, Storage, $ionicPopup, $location, $state, $ionicHistory) {
      User = Storage.get(SESS_USER, true);
      $scope.categoryList = [{
         "product_category_name": "Select category"
      }];
      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
         if (!User.islogged) {
            $state.go('home');
         } else {
            if (!User.user) {
               getCurrency(User.country_id);
            }
            else {
               getCurrency(User.user.country_id);
            }
            $scope.itemList = [];
            $scope.picture = $stateParams.imagePath;
            $scope.productId = $stateParams.product_id;
            getProductCategories();

         }

      });
      var alert = function (title,msg) {
         $ionicPopup.alert({
           title: title,
           template: msg,
         });
       }
      // To get currency details
      var getCurrency = function (countryId) {
         APIService.getCurrency(countryId).then(function (dt) {
            $scope.currency_symbol = dt.currency_symbol;
         }, function (error) {
            console.log(error);
         });
      };

      $scope.allowedSizes = ['Small', 'Large'];
      $scope.sizes = [
         { size: 'Regular', price: 10 }
      ];

      $scope.product = {
         product_name: '',
         description: '',
         product_category_id: $scope.categoryList[0].id,
         restaurant_id: User.userId,
         cuisine_id: '',
         spiciness: 0,
         product_sizes: [
            { price: 10, size: 'Regular' }
         ]
      };

      // To get product categories

      var getProductCategories = function () {
         $scope.categoryList = [{
            "product_category_name": "Select category"
         }];
         $rootScope.showLoading(true);
         APIService.getProductCategoriesList().then(function (dt) {
            if (dt.length > 0) {
               dt.forEach(element => {
                  $scope.categoryList.push(element);
                  /*  if (element.product_category_name != "Specials") {
                      $scope.categoryList.push(element);
                   } */
                  $rootScope.showLoading(false);
               });

               if ($scope.productId) {
                  getProductDetails($scope.productId);
               }

            }
         }, function (error) {
            $rootScope.showLoading(false);
            console.log(error);
         });
      }

      // To get product details by id
      var getProductDetails = function (id) {
         $scope.sizes = [];
         $rootScope.showLoading(true);
         APIService.getProductDetail(id).then(function (dt) {
            $scope.product = dt.product_details;
            if ($scope.product.product_sizes.length) {
               $scope.allowedSizes = ['Regular', 'Small', 'Large'];

               for (var i = 0; i < $scope.product.product_sizes.length; i++) {
                  var sizeIndex = $scope.allowedSizes.indexOf($scope.product.product_sizes[i].size)
                  if (sizeIndex >= 0) {
                     var removed = $scope.allowedSizes.splice(sizeIndex, 1)
                  }
                  $scope.sizes.push(
                     {
                        size: $scope.product.product_sizes[i].size,
                        price: $scope.product.product_sizes[i].price
                     }
                  )
               }
            }
            else {
               $scope.allowedSizes = ['Small', 'Large'];
               $scope.sizes = [
                  { size: 'Regular', price: '' }
               ]
            }
            $rootScope.showLoading(false);

         }, function (error) {
            $rootScope.showLoading(false);
            console.log(error);
         });
      }

      // To add custom product category
      $scope.addCustomCategory = function (categoryName) {         
         $rootScope.showLoading(true);
         APIService.addCustomCategory({
            category_name: categoryName
         }).then(function (result) {
            getProductCategories();
            item.categoryName = "";
            $scope.categoryBox = false;
            $rootScope.showLoading(false);
         }, function (error) {
            alert('Error',error.data.error.message);
            $rootScope.showLoading(false);
            console.log(error);
         });
      };

      //hide and show category input box
      $scope.showCategoryInput = function () {
         $scope.categoryBox = true;
      }

      // To add portion size
      $scope.addNewSize = function (index) {
         if ($scope.allowedSizes.length) {
            var size = $scope.allowedSizes.shift();
            $scope.sizes.push({
               price: '', size: size,
            });
         }
         return;
      }

      // To remove portion size
      $scope.removeSize = function (size) {
         if ($scope.productId) {
            var size = $scope.sizes.splice(size, 1)[0];
            var removeIndex = null;
            var existingProductSize = $scope.product.product_sizes.filter(function (obj, index) {
               removeIndex = index;
               return obj.size == size.size
            })

            var remo = $scope.product.product_sizes.splice(removeIndex, 1)

            APIService.deleteProductSize({ id: existingProductSize[0].id }).then(function (result) {
               $rootScope.showLoading(false);

            }, function (err) {
               $rootScope.showLoading(false);
               console.log(err)
            });
         }
         else {
            var size = $scope.sizes.splice(size, 1)[0];
            $scope.allowedSizes.push(size.size)
         }
         return;
      }


      $scope.saveMenuItem = function () {
         if (!$scope.add_item_frm.$valid) {
            return;
         }
         else {
            if (!$scope.productId) {
               addProduct(); // to add new product
            }
            else {
               updateProduct($scope.productId) // to update product of given product id
            }
         }
      }

      var addProduct = function () {
         $rootScope.showLoading(true);
         APIService.addProduct($scope.product).then(function (result) {            
            localStorage.setItem("categoryId",$scope.product.product_category_id)
            $scope.productId = result.data.id;            
            $scope.features = result.data.product_feature;
            $state.go('itemFeature', { 'product_id': $scope.features.id, 'feature': $scope.features });
            $rootScope.showLoading(false);

         }, function (err) {
            $rootScope.showLoading(false);
            console.log(err)
         });
      }

      var updateProduct = function (id) {
         $scope.product.id = id;
         APIService.updateProduct($scope.product).then(function (result) {
            $state.go('itemFeature', { 'product_id': result.data.product_feature.id, 'feature': result.data.product_feature });
            $rootScope.showLoading(false);

         }, function (err) {
            $rootScope.showLoading(false);
            console.log(err)
         });
      }
   }
]);

/**
 * AUTHOR : Prabhudev
 * STATE : itemFeature
 * PATH : /itemFeature
 * ABOUT CONTROLLER :
 * This controller is for setting product feature.
 * */
app.controller('itemFeatureCtrl', ['$scope', '$ionicLoading', '$stateParams', '$rootScope', 'APIService', 'Storage', '$ionicPopup', '$location', '$state', '$ionicHistory',
   function ($scope, $ionicLoading, $stateParams, $rootScope, APIService, Storage, $ionicPopup, $location, $state, $ionicHistory) {
      User = Storage.get(SESS_USER, true);
      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
         if (!User.islogged) {
            $state.go('home');
         } else {
            $scope.product_feature = {};
            console.log($stateParams.product_id)
            $scope.productId = $stateParams.product_id;
            $scope.product_feature = $stateParams.feature;
         }
      });

      // To update product feature 
      $scope.updateProductFeature = function (data) {
         $rootScope.showLoading(true);
         APIService.updateroductFeature($scope.productId, data).then(function (dt) {
            $rootScope.showLoading(false);
            $state.go('uploadProductImage', { 'productId': $scope.product_feature.product_id });
         }, function (error) {
            $rootScope.showLoading(false);
            console.log(error);
         });
      }
   }

]);