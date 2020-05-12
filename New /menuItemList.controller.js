
app.controller('menuItemListCtrl', ['$scope', '$ionicPopup', '$timeout', '$ionicPopover', '$rootScope', '$ionicHistory', '$state', '$ionicLoading', 'APIService', '$location', 'Storage', function ($scope, $ionicPopup, $timeout, $ionicPopover, $rootScope, $ionicHistory, $state, $ionicLoading, APIService, $location, Storage) {

  $scope.$on("$ionicView.beforeEnter", function (event, viewData) {
    viewData.enableBack = false;
    User = Storage.get(SESS_USER, true);
    if (!User.islogged) {
      $state.go('home');
    } else {
      $scope.toggle = false;
      getKYCDocs();
      if (KYC_POPUP != true) {
        if (User.user) {
          if (User.user.kyc_completed != false) {
            KYC_POPUP = false;
          }
          getKYCStatus();
        } else {
          getKYCStatus();
        }
      }
      $scope.categoryList = [];
      getProductCategoryList();
    }
  });

  // To get product categories list
  var getProductCategoryList = function () {
    $rootScope.showLoading(true);
    APIService.getProductCategoriesList()
    .then(function (dt) {
      if (dt.length > 0) {
        dt.forEach(element => {
          $scope.categoryList.push(element);         
        });
      }
      var categoryId = localStorage.getItem("categoryId");      
      var selectedCategoryIndex = $scope.categoryList.findIndex((item)=> item.id == categoryId);
      $scope.selectedCat = $scope.categoryList[selectedCategoryIndex];
   getProductList();
      $rootScope.showLoading(false);
    }, function (error) {
      console.log(error);
      $rootScope.showLoading(false);
    });
  }

  // To get categorywise product list
  var getProductList = function () {
    $scope.productData = [];
    APIService.getProductsList().then(function (dt) {
      if (dt.product_categories.length > 0) {        
        $scope.productImgBaseUrl = dt.productImgBaseUrl;
        $scope.productData = dt.product_categories;
        $scope.currencyData = dt.currency_details;
        $scope.categoryChange($scope.categoryList[0]);

      }
    }, function (error) {
      console.log(error);
      $rootScope.showLoading(false);
    });
  }
  getProductList();

  // To check KYC is pending or not
  var getKYCDocs = function () {
    $rootScope.showLoading(true);
    APIService.getKYCDocs().then(function (dt) {
      $scope.kycData = dt.data;
      if ($scope.kycData.restauant_data.profile_image != null) {
        $scope.profileUploaded = true;
      }
      if ($scope.kycData.resident_proof != null) {
        $scope.proofUploaded = true;
      }
      if ($scope.kycData.kitchen_images.length > 0) {
        $scope.kitchenImgUploaded = true;
      }
      $rootScope.showLoading(false);

    }, function (err) {
      $rootScope.showLoading(false);
    });
  }

  var getKYCStatus = function () {
    $rootScope.showLoading(true);
    APIService.getKYCStatus().then(function (result) {
      if (!result.data.kyc_completed) {
        if ($scope.profileUploaded && $scope.proofUploaded && $scope.kitchenImgUploaded) {
          var alertPopup = $ionicPopup.alert({
            template: '<p style="text-align:center;font-size:16px">KYC Under Process.</p>'
          });
          alertPopup.then(function (res) {
            KYC_POPUP = true;
          });
        }
        else {
          var confirmPopup = $ionicPopup.confirm({
            title: 'Complete KYC',
            cancelText: 'Later',
            template: `<div>
                      <p style="font-size: 16px;text-align:center" ><i style="font-size: 20px"class="icon ion-android-warning"></i>
                       Please complete your KYC</p>
                    </div>`
          });
          confirmPopup.then(function (res) {
            if (res) {
              KYC_POPUP = false;
              $rootScope.navtoCompleteKYC();

            } else {
              KYC_POPUP = true;
            }
          });
        }
      }
    }, function (err) {
      $rootScope.showLoading(false);
      console.log(err);
    });
  };

  // Function on change of tab changes of category
  $scope.changeTab = function (cat) {
    $scope.categoryChange(cat);
  }

  // function to open action box
  $scope.openAction = function ($event, item) {
    $scope.menuItemList.map(ele => ele.toggle = false);
    item.toggle = true;
  };

  // Function when click outside of action box .
  $scope.closeOutsideClick = function ($event) {
    if (!$event.target.classList.contains('action_dots')) {
      $scope.menuItemList.map(ele => ele.toggle = false);
    }
  };

  $scope.categoryChange = function (category) {   
    $scope.menuItemList = [];
    $scope.selectedCat = category;
    var data = $scope.productData.find(function (element) {      
      return $scope.selectedCat.id == element.id;
    });
    data.products.map(ele => ele.toggle = false);
    $scope.menuItemList = data.products;
  };

  // add product to special category
  $scope.addToSpecial = function (item) {
    if (item.is_chief_favourite != undefined) {
      item.is_chief_favourite = !item.is_chief_favourite;
    }
    $rootScope.showLoading(true);
    APIService.updateProduct(item).then(function (result) {
      getProductList();
      $rootScope.showLoading(false);
    }, function (err) {
      $rootScope.showLoading(false);
      console.log(err)
    });
  }

  // Function for add to available for consumer
  $scope.addToAvailable = function (item) {
    if (item.available != undefined) {
      item.available = !item.available;
    }
    $rootScope.showLoading(true);
    APIService.updateProduct(item).then(function (result) {
      getProductList();
      $rootScope.showLoading(false);
    }, function (err) {
      $rootScope.showLoading(false);
      console.log(err)
    });
  }

  // Edit product details
  $scope.editItem = function (item) {
    $state.go('setupMenuItemDetails', { 'product_id': item.id });
  }

  // To delete product 
  $scope.deleteItem = function (item) {
    $rootScope.showLoading(true);
    APIService.deleteProduct({ productId: item.id }).then(function (result) {
      $rootScope.showLoading(false);
      getProductList();
      $scope.selectedCat = $scope.categoryList[0];
      $scope.categoryChange($scope.selectedCat)
    }, function (err) {
      $rootScope.showLoading(false);
      console.log(err)
    });
  }

  // To add new product
  $scope.addMenuItem = function () {
    $state.go('setupMenuItemDetails');
  };

}]);
