(function(){
  'use strict';

  var module = angular.module('myApp', ['onsen', 'ui.map']);

  // module.config(['$httpProvider', function($httpProvider) {
  //     $httpProvider.defaults.useXDomain = true;
  //     delete $httpProvider.defaults.headers.common['X-Requested-With'];
  //   }
  // ]);

  module.run(['$rootScope', function($rootScope, $httpProvider){
    $rootScope.state = {
      placeholders: {
        'carrots': 'img/vegetables/carrots.jpg',
        'broccoli-greens': 'img/vegetables/broccoli-greens.jpg',
        'broccoli-head': 'img/vegetables/broccoli-head.jpg',
        'eggplant-line-up': 'img/vegetables/eggplant-line-up.jpg',
        'poivron': 'img/vegetables/poivron.jpg',
        'potatoes': 'img/vegetables/potatoes.jpg'
      },
      icons: {
        'carrots': 'img/icons/icons-sliced_34.png',
        'broccoli-greens': 'img/icons/icons-sliced_32.png',
        'broccoli-head': 'img/icons/icons-sliced_40.png',
        'eggplant-line-up': 'img/icons/icons-sliced_23.png',
        'poivron': 'img/icons/icons-sliced_25.png',
        'potatoes': 'img/icons/icons-sliced_26.png'
      }
    };
  }]);

  module.controller('MenuController', function($scope, $timeout, $rootScope, $data){
    $scope.spin = false;

    $scope.auth = function(){
      console.log('SPIN');
      $scope.spin = true;
      $timeout(function(){
        $scope.spin = false;
        $rootScope.state.user = {
          id: '003',
          name: 'Alex',
          role: 'seller'
        };
      },1300);
    };

    $scope.goto = function(n){
      $rootScope.state.farmer = $data.farmers[$rootScope.state.user.id];
      $rootScope.state.items = $data.items[$rootScope.state.user.id];
      $scope.menu.setAbovePage('tpl/crop.html', {closeMenu: true})
    };

  })

  module.controller('MapCtrl', function($scope, $data, $timeout, $rootScope, $http) {
    
    var currentLatLng = new google.maps.LatLng(-33.881164, 151.19592);

    $scope.mapOptions = {
      center: currentLatLng,
      zoom: 14,
      disableDefaultUI: true,
      styles: [{
        featureType: "poi",
        stylers: [
          { visibility: "off" }
        ]
    }]};
    
    $timeout(function(){

      angular.forEach($data.farmers, function(farmer){

        var marker = new google.maps.Marker({
          id: farmer.id,
          map: $scope.myMap,
          position: new google.maps.LatLng(farmer.position.lat, farmer.position.lng),
          icon: {
              path: fontawesome.markers.MAP_MARKER,
              scale: 0.7,
              strokeWeight: 0.9,
              strokeColor: 'black',
              strokeOpacity: 1,
              fillColor: '#f8ae5f',
              fillOpacity: 1,
          }
        });

        google.maps.event.addListener(marker, 'click', function(e) {
          var marker = this;
          $scope.$apply(function(){
            $rootScope.state.farmer = $data.farmers[marker.id];
            $rootScope.state.items = $data.items[marker.id];
            $scope.ons.slidingMenu.setMainPage('tpl/producer.html');
          });
        });

      });

    });

    $timeout(function(){
      google.maps.event.trigger($scope.myMap, 'resize');
      $scope.myMap.panTo(currentLatLng);
    }, 300);

    $scope.onMapIdle = function(){
      console.log('onMapIdle');
    };

    // $timeout(function(){
    //   $rootScope.state.farmer = $data.farmers['002'];
    //   $rootScope.state.items = $data.items['002'];
    //   $scope.ons.slidingMenu.setMainPage('tpl/producer.html');
    // }, 1000);

    // $http.get('http://shrouded-lowlands-4710.herokuapp.com/')
    $http.get('https://43e6a5d2.ngrok.com/')
    .success(function(){
      console.log('OK', arguments);
    });

  })

  module.controller('MarketController', function($scope, $rootScope){

    $scope.remove = function(id){
      console.log('@@ remove', id);
    };
  })

  module.controller('ShopController', function($scope, $data, $rootScope) {

    $rootScope.state.needAuth = false;
    $scope.total = 0;

    $scope.select = function(id){
      if(!$rootScope.state.items[id].selected){
        $rootScope.state.items[id].selected = true;
        $scope.total = $scope.total + $rootScope.state.items[id].price;
      }else{
        $rootScope.state.items[id].selected = false;
        $scope.total = $scope.total - $rootScope.state.items[id].price;
      }
    };

    $scope.checkout = function(){
      console.log('checkout');
      $rootScope.state.needAuth = true;
    };

    $scope.cancel = function(){
      $scope.total = 0;
      angular.forEach($rootScope.state.items, function(key, item){
        item.selected = false;
      });
      $scope.ons.slidingMenu.setAbovePage('tpl/map.html');
    }

  })

  module.controller('AuthController', function($scope, $rootScope){

    $scope.signin = function(){
      console.log('@@@@@ signin');
      $rootScope.state.user = {
        name: 'Alex',
        role: 'user',
        id: '003'
      };
      $rootScope.state.needAuth = false;
      //utf8=%E2%9C%93&authenticity_token=wrP8fuZ6QFUff7pJ%2B7vdEx%2BlHhP1ZeGaZ3ranPJXYkU%3D&user%5Busername%5D=alex&user%5Bemail%5D=googirard.alex%40gmail.com&user%5Bpassword%5D=12345&user%5Bpassword_confirmation%5D=12345&commit=Sign+Up
      // FB.getLoginStatus(function(response) {
      //   if (response.status === 'connected') {
      //     $scope.$apply(function(){
      //       console.log('already connected.');
      //     });
      //   }
      //   else {
      //     FB.login(function(res){
      //       $scope.$apply(function(){
      //         console.log('Logged in', res);
      //       });   
      //     }, {scope: "public_profile,email"});
      //   }
      // });
    };

  })

  module.factory('$data', function() {
      var data = {};

      data.farmers = {
        '001': {
          id: '001',
          name: 'Maro X.',
          photo: 'img/producer-01.jpeg',
          desc: 'Lorem ipsum cacatum',
          rating: ['f', 'f', 'f', 'h', 'z'],
          position: {lat: -33.879364, lng: 151.19992}
        },
        '002': {
          id: '002',
          name: 'Scott O.',
          photo: 'img/producer-01.jpeg',
          desc: 'Lorem ipsum cacatum',
          rating: [1,1,1,0.5,0],
          position: {lat: -33.881364, lng: 151.19192}
        },
        '003': {
          id: '003',
          name: 'Alex G.',
          photo: 'img/producer-01.jpeg',
          desc: 'Lorem ipsum cacatum',
          rating: [1,1,1,1,0.5],
          position: {lat: -33.881164, lng: 151.19592}
        },
        '004': {
          id: '004',
          name: 'Linton Y.',
          photo: 'img/producer-01.jpeg',
          desc: 'Lorem ipsum cacatum',
          rating: [1,1,1,0,0],
          position: {lat: -33.876164, lng: 151.18992}
        }
      };

      data.items = {
        '001': {
          '001':{id:'001', sort: 'carrots', price: 2, image: 'img/item.001.jpg'},
          '002':{id:'002', sort: 'broccoli-greens', price: 3, image: 'img/item.002.jpg'},
          '003':{id:'003', sort: 'potatoes', price: 6, image: 'img/item.003.jpg'},
          '004':{id:'004', sort: 'eggplant-line-up', price: 5, image: 'img/item.004.jpg'},
          '005':{id:'005', sort: 'poivron', price: 4, image: 'img/item.005.jpg'}
        },
        '002': {
          '006':{id:'006', sort: 'eggplant-line-up', price: 2, image: 'img/item.006.jpg'},
          '007':{id:'007', sort: 'broccoli-head', price: 5, image: 'img/item.007.jpg'},
          '008':{id:'008', sort: 'poivron', price: 3, image: 'img/item.008.jpg'}
        },
        '003': {
          '009':{id:'009', sort: 'eggplant-line-up', price: 2, image: 'img/item.004.jpg'},
          '010':{id:'010', sort: 'potatoes', price: 7, image: 'img/item.003.jpg'}
        }
      };

      return data;
  });

  // window.gmapReadyCB = function(){
  //   window.isgmapready = true;
  //   //window.bridge.setGmapReady();
  // };
  // $.getScript('https://maps.googleapis.com/maps/api/js?sensor=true&libraries=places&callback=gmapReadyCB&key=AIzaSyD6NEpPLt-hOAbzrNsItLLoTqufaDqj1fY'); //&key='+config.GOOGLE.GMAP



  // setTimeout(function(){
  //   if(! window.isdeviceready){
  //     $.ajaxSetup({ cache: true });
  //     $.getScript('//connect.facebook.net/en_US/all.js', function(){
  //       FB.init({
  //         appId      : '312445838932889',
  //         xfbml      : true,
  //         version    : 'v2.0',
  //         cookie     : true
  //       });
  //     });
  //   }else{
  //     log('device already ready');
  //   }
  // }, 1500);

})();

