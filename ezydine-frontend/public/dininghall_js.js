app.filter('menuByLocation', function () {
  return function (items, filters) {
    var filtered = [];
    var seen = [];
    for (var i in items) {
      var item = items[i];
      // filter for activeLocation
      if (item.locations.includes(filters.nid)) {
        if (seen[item.nid]) {
          continue;
        }
        seen[item.nid] = true;
        filtered.push(item);

      }
    }
    return filtered;
  };
});
app.filter('menuFilter', function () {
  return function (items, filters, stations) {
    var filtered = [];
    // set date range based on activeDay
    var activeDay = moment().add(filters.value, 'days');
    // temporary range created by adding a second
    var oneSecond = moment().range(activeDay,activeDay.add(1,'seconds'));
    // expand range to entire day
    var activeRange = oneSecond.snapTo('day');
    // set active menu based on time
    var activeMenu;
    //
    for (var i in items) {
      var item = items[i];
      var nid = item.nid;
      // filter by Date
      for (var j = item.date_range_fields.length - 1; j >= 0; j--) {
        var date_range_fields = item.date_range_fields[j];
        date_range_fields.nid = nid;
        //
        var date_from = moment(date_range_fields.date_from).add(timezoneOffset,'seconds');
        var date_to = moment(date_range_fields.date_to).add(timezoneOffset,'seconds');
        var range = moment().range(date_from, date_to);
        //
        if (activeRange.overlaps(range)) {
          // station names
          for (var i = date_range_fields.stations.length - 1; i >= 0; i--) {
            var station = date_range_fields.stations[i];
            var stationName = stations[station.station[0]];
            date_range_fields.stations[i].name = stationName.name;
          }
          //
          filtered.push(date_range_fields);
          //
          // get active menuType
          if (range.contains(moment())) {
            activeMenu = date_range_fields.menu_type[0];
          }
        }

      }
    }
    // console.log(filtered)
    return [filtered.reverse(), activeMenu];
  };
});
app.filter('menuTypeOptions', function () {
  return function (items, filters) {
    var filtered = [];
    for (var i in items) {
      var item = items[i];
      filtered = filtered.concat(item.menu_type);
    }

    return filtered;
  };
});
app.filter('stationOptions', function () {
  return function (items, filters, stations) {
    var filtered = [0]; // default to all
    for (var i in items) {
      var item = items[i];
      for (var j = item.stations.length - 1; j >= 0; j--) {
        filtered = filtered.concat(item.stations[j].station);
      }
    }
    // station names
    var filtered2 = [];
    var seen = [];
    for (var i = 0; i < filtered.length; i++) {
      var tid = filtered[i];
      if (seen[tid]) {
        continue;
      }
      seen[tid] = true;
      filtered2.push(stations[tid]);
    }
    return filtered2;
  };
});

//filter to remove duplicates and show unique values
app.filter('unique', function () {

  return function (items, filterOn) {

    if (filterOn === false) {
        return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var hashCheck = {}, newItems = [];

      var extractValueToCompare = function (item) {
        if (angular.isObject(item) && angular.isString(filterOn)) {
          return item[filterOn];
        } else {
          return item;
        }
      };

      angular.forEach(items, function (item) {
        var valueToCheck, isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
      items = newItems;
    }
    return items;
  };
});

appControllers.controller('dining', ['$scope', '$http', '$timeout', '$location', '$filter', '$q', function($scope, $http, $timeout, $location, $filter, $q) {
  window['moment-range'].extendMoment(moment);
  //
  // initialize
  $scope.jsonLoaded = false;
  $scope.filteredMenus = [];

  $scope.showPhoto = true;
  $scope.showDescription = true;

  $scope.activeStation = 0;
  $scope.activeDietary = [];

  var queries = [];
  queries.push($http.get('/sites/default/files/cu_dining/cu_dining_nodes.json?' + nodeJsonTime));
  queries.push($http.get('/sites/default/files/cu_dining/cu_dining_terms.json?' + termJsonTime));
  queries.push($http.get('/cu_dining/rest/menus/nested?' + nodeJsonTime));
  queries.push($http.get('/cu_dining/rest/meals?' + nodeJsonTime));

  $q.all(queries).then(function (response) {
    var data = response[0].data;
    var termData = response[1].data;
    var menuData = response[2].data;
    var mealData = response[3].data;
//
    $scope.menuTypes = termData.types;
    $scope.stations = termData.stations;
    $scope.stations['0'] = {tid: 0, name: ' All Stations'} // default option for station names
    $scope.ingredients = termData.ingredients;
    $scope.dietaryPrefs = termData.dietary_prefs;
    //
    $scope.locations = data.locations;
    $scope.positions = [];
    $scope.meals = $scope.formatMeals(mealData);
    $scope.menus = menuData;
    $scope.markers = [];
    $scope.cart = [];
    $scope.cartColumns = [
      {name:'Items', field:'title', suffix:''},
      {name:'Total Fat', field:'total_fat', suffix:'g'},
      {name:'Cholesterol', field:'cholesterol', suffix:'mg'},
      {name:'Sodium', field:'sodium', suffix:'mg'},
      {name:'Carbs', field:'total_carbs', suffix:'g'},
      {name:'Fibers', field:'fiber', suffix:'g'},
      {name:'Sugars', field:'sugar', suffix:'g'},
      {name:'Protein', field:'protein', suffix:'g'},
      {name:'Calories', field:'calories', suffix:' cal'},
    ]
    //
    var nidFromURL = $location.path().replace('/','');
    $scope.locationID = (nidFromURL) ? parseFloat(nidFromURL) : defaultLocation;
    //
    $scope.jsonLoaded = true;

    if (angular.element('#location_map').length) {
      angular.element('#location_map_btn').show();
      var locationMapLoaded = false;
      angular.element('#location_map_btn').click(function(event) {
        event.preventDefault();
        if (!locationMapLoaded) {
          var mapStyles = [{
            featureType: 'poi',
            elementType: 'labels.icon',
            stylers: [{
              visibility: 'off',
            }]
          }];
          $scope.map = new google.maps.Map(document.getElementById('location_map'), {
            center: {lat: 40.807536, lng: -73.962573},
            fullscreenControl: false,
            zoom: 17,
            styles: mapStyles,
          });
          var infoWindow = new google.maps.InfoWindow;
          var infoWindowTimeout;

          // Try HTML5 geolocation.
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };

              var geolocationIcon = {
                url: 'data:image/svg+xml;charset=UTF-8;base64,' + btoa('<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"   viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"><style type="text/css">  .st0{opacity:0.15;fill:#3A6FA2;}  .st1{fill:#3A6FA2;}  .st2{fill:#FFFFFF;}  .st3{opacity:0.25;}</style><g>  <circle class="st0" cx="25" cy="25" r="25"/></g><g>  <circle class="st1" cx="25" cy="25" r="2.8"/>  <path class="st2" d="M25,22.5c1.4,0,2.5,1.1,2.5,2.5s-1.1,2.5-2.5,2.5s-2.5-1.1-2.5-2.5S23.6,22.5,25,22.5 M25,22c-1.7,0-3,1.3-3,3    s1.3,3,3,3s3-1.3,3-3S26.7,22,25,22L25,22z"/>  <g class="st3">    <path class="st1" d="M25,22c1.7,0,3,1.3,3,3s-1.3,3-3,3s-3-1.3-3-3S23.3,22,25,22 M25,20.5c-2.5,0-4.5,2-4.5,4.5s2,4.5,4.5,4.5      s4.5-2,4.5-4.5S27.5,20.5,25,20.5L25,20.5z"/>  </g></g></svg>'),
                size: new google.maps.Size(76, 76),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(38, 38),
                scaledSize: new google.maps.Size(76, 76)
              };

              var geoMarker = new google.maps.Marker({
                position: pos,
                map: $scope.map,
                icon: geolocationIcon
              });

            }, function(error) {
              console.log(error)

              // handleLocationError(true, infoWindow, map.getCenter());
            });
          }

          var diningIcon = {
            url: 'data:image/svg+xml;charset=UTF-8;base64,' + btoa('<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"   viewBox="0 0 40.1 64" style="enable-background:new 0 0 40.1 64;" xml:space="preserve"><style type="text/css"> .blue{fill:#3A6FA2;} .st0{fill:#FFFFFF;}</style><g id="fuL6De_1_">  <g>    <path class="blue" d="M20.7,64c-0.4,0-0.8,0-1.2,0c0-0.2-0.1-0.4-0.1-0.6c-0.6-2.7-1.3-5.3-2.2-7.9c-1.9-5.2-4.5-10.1-7.5-14.8      c-2.4-3.8-4.9-7.5-7-11.4C1.2,26.8,0.2,24,0,21c-0.3-4.7,0.9-9,3.8-12.8C6.3,4.7,9.6,2.3,13.7,1c1.5-0.5,3-0.8,4.6-0.9      c1.2-0.1,2.4-0.1,3.6,0c1,0.1,2,0.3,3,0.5c7,1.8,11.8,6.1,14.3,12.9c0.5,1.4,0.7,2.9,0.9,4.3c0,1.2,0,2.4,0,3.7      c-0.2,1.4-0.4,2.8-0.9,4.1c-1.1,3-2.6,5.7-4.3,8.4c-2.3,3.7-4.8,7.2-6.9,11c-2.6,4.5-4.7,9.2-6.1,14.2      C21.4,60.7,21.1,62.4,20.7,64z"/>  </g></g><circle class="st0" cx="20" cy="19.8" r="16.5"/><g>  <path class="blue" d="M19.5,17.8c0,1-0.7,1.9-1.6,2.3v9.8c0,0.9-0.7,1.6-1.6,1.6h-1.6c-0.9,0-1.6-0.7-1.6-1.6v-9.8c-1-0.3-1.6-1.3-1.6-2.3V9.7    c0-0.4,0.4-0.8,0.8-0.8s0.8,0.4,0.8,0.8V15c0,0.4,0.4,0.8,0.8,0.8s0.8-0.4,0.8-0.8V9.7c0-0.4,0.4-0.8,0.8-0.8s0.8,0.4,0.8,0.8V15    c0,0.4,0.4,0.8,0.8,0.8s0.8-0.4,0.8-0.8V9.7c0-0.4,0.4-0.8,0.8-0.8s0.8,0.4,0.8,0.8V17.8z M29.2,29.9c0,0.9-0.7,1.6-1.6,1.6H26    c-0.9,0-1.6-0.7-1.6-1.6v-6.5h-2.8c-0.2,0-0.4-0.2-0.4-0.4V13c0-2.2,1.8-4,4-4h3.2c0.4,0,0.8,0.4,0.8,0.8V29.9z"/></g></svg>'),
            size: new google.maps.Size(31, 64),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(16, 50),
            scaledSize: new google.maps.Size(31, 50)
          };

          angular.forEach($scope.locations, function (location) {
            if (location.latitude && location.longitude) {
              var latLng = new google.maps.LatLng(location.latitude,location.longitude);
              $scope.positions[location.nid] = latLng;
              var openStatus = $scope.getOpenStatus(location.nid);

              var marker = new google.maps.Marker({
                position: latLng,
                title: location.title,
                icon: diningIcon,
                nid: location.nid,
                infoContent: (location.image) ? `<h5>${location.title} <span class="status ${openStatus.class}">${openStatus.status}</span></h5>` + location.image : `<h5>${location.title} <span class="status ${openStatus.class}">${openStatus.status}</span></h5>`,

              });
              marker.addListener('mouseover', function() {
                infoWindow.setPosition(this.getPosition());
                infoWindow.setContent(this.infoContent);
                infoWindow.open($scope.map, this);

                clearTimeout(infoWindowTimeout);
              })
              marker.addListener('mouseout', function() {
                // infoWindow.close();
                infoWindowTimeout = setTimeout(function(){infoWindow.close()}, 3000);
              })
              marker.addListener('click', function(){
                $scope.setLocation(this.nid);

                $scope.$apply();
              });
              $scope.markers.push(marker);
              marker.setMap($scope.map);
              if ($scope.locationID == location.nid) {
                $scope.map.setCenter(latLng);
              }
            }
          });
          // load map
          locationMapLoaded = true;
        }
        angular.element('#location_map').slideToggle();
      });
    }
    // crowdedness
    $http.get('/cu_dining/rest/crowdedness')
      .success(function(crowdData, crowdStatus){
        $scope.crowdedness = crowdData.data;
      })

  });

  $scope.addToCart = function(nid) {
    angular.element('.meal-calc-content').slideDown();
    // animation alert
    angular.element('.meal-item-' + nid).find('.cart-alert').stop().fadeIn();
    angular.element('.meal-item-' + nid).find('.cart-alert').delay(1000).fadeOut();
    return false;
  }
  $scope.removeFromCart = function(nid) {
    $scope.cart[nid] = false;
    return false;
  }
  $scope.calculateCartTotal = function(key) {
    var total = 0;
    angular.forEach($scope.cart, function(inCart, nid) {
      if (inCart) {
        var value = ($scope.meals[nid][key]) ? $scope.meals[nid][key] : 0;
        total += parseFloat(value);
      }
    });
    total = Math.round(total * 10)/10;
    return total;
  }

  $scope.getCrowdedness = function(cid, max) {
    var client_count = $scope.crowdedness[cid].client_count;
    if (client_count) {
      var crowdedPercent = Math.floor(client_count/max*100) + '%';
      angular.element('.cu-dining-crowdedness').slideDown('slow', function() {
        angular.element('.cu-dining-crowdedness .bar').animate({
          width: crowdedPercent},
          'slow', function() {
          angular.element('.cu-dining-crowdedness .marker').css('left', crowdedPercent).fadeIn();
        });
      });
      return crowdedPercent;
    }
    return false;
  }

  $scope.getDays = function() {
    var days = [
      { label: 'Today', value: 0, },
      { label: 'Tomorrow', value: 1, },
    ];
    for (var i = 2; i < 7; i++) {
      var date = moment().add(i, 'days').format('dddd, MMM D');
      days.push({ label: date, value: i, });
    }
    $scope.days = days;
    $scope.activeDay = days[0];
  }();

  $scope.setDay = function(day) {
    $scope.activeDay = day;
  }

  $scope.getOpenStatus = function(nid) {

    var location;
    var openClass = 'closed';
    var openStatus = 'Closed';
    if ($scope.locations) {
      for (var i = 0; i < $scope.locations.length; i++) {
        if (nid == $scope.locations[i].nid) {
          location = $scope.locations[i];
          break;
        }
      }
      var today = moment().format('dddd').toLowerCase();
      var time = moment().format('HHmm');
      var openTimes = [];
      for (var j = 0; j < location.open_hours.length; j++) {
        var excludedDays = location.open_hours_fields[j]['excluded'];
        if (excludedDays) {
          for (var k = 0; k < excludedDays.length; k++) {
            var excluded = moment(excludedDays[k]).add(timezoneOffset,'seconds');;
            if (moment().isSame(excluded, 'd')) {
              continue;
            }
          }
        }
        var date_from = moment(location.open_hours_fields[j]['date_from']).add(timezoneOffset,'seconds');
        var date_to = moment(location.open_hours_fields[j]['date_to']).add(timezoneOffset,'seconds');
        var range = moment().range(date_from, date_to);
        if (!range.contains(moment())) {
          continue;
        }

        var openDays = location.open_hours_fields[j]['days'];
        for (var k = 0; k < openDays.length; k++) {
          var openToday;
          if (openToday = openDays[k]['days_' + today]) {
            openTimes = openTimes.concat(openToday);
          }
        }
      }
      for (var j = 0; j < openTimes.length; j++) {
        // get status
        var from = parseInt(openTimes[j].hours_from);
        var to = parseInt(openTimes[j].hours_to);
        // invalid range
        if (from >= to) {
          to += 2400;
        }
        //
        if (from <= time && time <= to) {
          openClass = 'open';
          openStatus = 'Open';
          if (time >= to - 100) {
            openClass = 'closing';
            openStatus = 'Closing Soon';
          }
          break;
        }
      }

    }
    //
    return {
      class: openClass,
      status: openStatus,
    }
  }

  $scope.setLocation = function(nid) {
    $location.path('/' + nid);
    // $scope.locationID = nid;
  }

  $scope.setDietary = function() {
    var activeDietary = [];
    angular.forEach($scope.activeDietary, function(value, tid){
      if (value) {
        activeDietary[tid] = value;
      }
    })
    $scope.activeDietary = activeDietary;
  }

  $scope.isInRange = function(from, to, excluded) {
    // excluded days
    if (excluded) {
      for (var i = 0; i < excluded.length; i++) {
        if (moment().isSame(excluded[i], 'd')) {
          return false;
        }
      }
    }
    // continue if not excluded
    var range = moment().range(moment(from).add(timezoneOffset,'seconds'), moment(to).add(timezoneOffset,'seconds'));
    return range.contains(moment());
  }

  $scope.isPreferred = function(tids) {
    if (!tids) return;
    if (tids.length) {
      $scope.availableDietaryPrefs = $scope.availableDietaryPrefs.concat(tids);
    }
    if (!$scope.activeDietary.length) {
      return true;
    }
    //
    for (var i = tids.length - 1; i >= 0; i--) {
      if ($scope.activeDietary[tids[i]]) {
        return true;
      }
    }
    return false;
  }

  $scope.resetDietary = function() {
    $scope.activeDietary = [];
  }

  $scope.getMenuName = function(tid) {
    return $scope.menuTypes[tid].name;
  }

  $scope.setMenu = function(tid) {
    if ($scope.activeMenu == tid) {
      $scope.activeMenu = 0;
    } else {
      $scope.activeMenu = tid;
    }
  }

  $scope.formatMeals = function(meals) {
    var formatted = [];
    for (var i = 0; i < meals.length; i++) {
      formatted[meals[i].nid] = meals[i];
    }
    return formatted;
  }

  $scope.getTagName = function(tid) {
    return $scope.dietaryPrefs[tid].name;
  }

  $scope.getStationName = function(tid) {
    return $scope.stations[tid].name;
  }

  $scope.setStation = function(tid) {
    $scope.activeStation = tid;
  }

  $scope.showNutri = function(tid) {
    $scope.activeMeal = tid;
    // wait 1/10th of a second for template to update then open modal
    setTimeout(function() {
      $scope.$apply(function() {
        var modalTpl = angular.element('#cu-dining-modal-template');
        angular.element('#modal .modal-body').html(modalTpl.find('.modal-body').html())
        angular.element('#modal').modal({
          backdrop: 'static'
        });
      });
    }, 100)

  }

  //

  $scope.resetFilters = function() {
    $scope.filters = "All";
  }();

  $scope.$on('$locationChangeStart', function(ev, nextUrl) {
    var nid = $location.path().replace('/', '');
    $scope.locationID = nid;
    $scope.activeMenu = 0;
    if ($scope.map) {
      if ($scope.positions) {
        if ($scope.positions[nid]) {
          $scope.map.panTo($scope.positions[nid]);
        }
      }
    }
  });

  $scope.$watch('locationID', function() {
    if (!$scope.locations) {
      return false;
    }
    //
    var activeLocationFound = false;
    for (var i = $scope.locations.length - 1; i >= 0; i--) {
      var location = $scope.locations[i];
      if (location.nid == $scope.locationID) {
        $scope.activeLocation = location;
        activeLocationFound = true;
        break;
      }
    }
    // prepare error if not found
    if (!activeLocationFound) {
      $scope.activeLocation = '-1';
    }
  });
  $scope.$watch('activeDietary', function() {
    $scope.availableDietaryPrefs = [];
  });

  $scope.$watch(function() {
    return angular.toJson([$scope.activeLocation, $scope.activeDay, $scope.activeStation, $scope.activeMenu]);
  }, function() {
    if ($scope.jsonLoaded) {
      $scope.locationMenus = $filter('menuByLocation')($scope.menus, $scope.activeLocation);
      var filteredMenus = $filter('menuFilter')($scope.locationMenus, $scope.activeDay, $scope.stations);
      $scope.filteredMenus = filteredMenus[0];
      if (!$scope.activeMenu) {
        $scope.activeMenu = filteredMenus[1];
      }

      $scope.menuTypeOptions = $filter('menuTypeOptions')($scope.filteredMenus, $scope.activeDay);
      $scope.stationOptions = $filter('stationOptions')($scope.filteredMenus, $scope.activeDay, $scope.stations);

    }
  }, true);


}]);

angular.module('app')
  .directive('commaBetween', [function () {
    'use strict';
    return function (scope, element) {
      if(!scope.$last){
        element.after(',&#32;');
      }
    }
  }
]);

(function($){
  $(document).ready(function($) {
    const $dropdowns = $('.cu-dining-dropdown');
    $dropdowns.each(function(index, el) {
      var $this = $(this);
      var activeOption = $(this).find('.active-option a').click(function(event) {
        event.preventDefault();
        $this.find('.content').stop().slideToggle();
      });
    });
    $(document).on('click', '.cu-dining-trigger', function(e) {
      e.preventDefault();
      var target = $(this).data('target');
      if ($(this).hasClass('trans-fade')) {
        $(target).fadeToggle();
      } else {
        $(target).slideToggle();
      }
      return false;
    });
    $(document).mouseup(function(e) {
      $dropdowns.each(function(index, el) {
        var $this = $(this);
        if (!$this.is(e.target) && $this.has(e.target).length === 0) {
          $this.find('.content').stop().slideUp();
        } else if ($this.find('.content a').is(e.target) || $this.find('.content a').has(e.target)) {
          if ($this.find('.content').hasClass('cu-dining-dropdown-checkboxes')) {
            // allow checkboxes to persist
          } else {
            $this.find('.content').stop().slideUp();
          }
        }

      });
      // meal-calculator
      $('.info-popup').each(function(index, el) {
        var $this = $(this);
        if (!$this.is(e.target) && $this.has(e.target).length === 0) {
          $this.find('.info-content').stop().fadeOut();
        }

      });
    });
    // open now
    const $openNow = $('.paragraph--type--cu-dining-open-now');
    if ($openNow.length) {
      $.ajax({
        url: '/sites/default/files/cu_dining/cu_dining_nodes.json?' + nodeJsonTime,
        dataType: 'json',
      })
      .done(function(data) {
        var locationData = data.locations;
        var today = moment().format('dddd').toLowerCase();
        var time = parseInt(moment().format('HHmm'));
        //
        for (var i = locationData.length - 1; i >= 0; i--) {
          var node = locationData[i];
          var location = $openNow.find('.location[data-nid="' + node.nid + '"]');
          var status = {class:'closed', label:'Closed'};
          if (location.length && node.open_hours.length) {
            var openTimes = [];
            loop1: for (var j = 0; j < node.open_hours_fields.length; j++) {
              var excludedDays = node.open_hours_fields[j]['excluded'];
              if (excludedDays) {
                for (var k = 0; k < excludedDays.length; k++) {
                  var excluded = moment(excludedDays[k]).add(timezoneOffset,'seconds');;
                  if (moment().isSame(excluded, 'd')) {
                    continue loop1;
                  }
                }
              }
              var date_from = moment(node.open_hours_fields[j]['date_from']).add(timezoneOffset,'seconds');
              var date_to = moment(node.open_hours_fields[j]['date_to']).add(timezoneOffset,'seconds');
              if (moment().isBefore(date_from) || moment().isAfter(date_to)) {
                continue loop1;
              }

              var openDays = node.open_hours_fields[j]['days'];
              for (var k = 0; k < openDays.length; k++) {
                var openToday;
                if (openToday = openDays[k]['days_' + today]) {
                  openTimes = openTimes.concat(openToday);
                }
              }
            }
            //
            var displayTimes = [];
            for (var j = 0; j < openTimes.length; j++) {
              // format display time
              displayTimes.push(formatTime(openTimes[j].hours_from) + '&nbsp;-&nbsp;' + formatTime(openTimes[j].hours_to));
              // get status
              var from = parseInt(openTimes[j].hours_from);
              var to = parseInt(openTimes[j].hours_to);
              // invalid range
              if (from >= to) {
                to += 2400;
              }
              //
              if (from <= time && time <= to) {
                status = {class:'open', label:'Open'}
                if (time >= to - 100) {
                  status = {class:'closing', label:'Closing Soon'}
                }
              }
            }
            location.find('.status').addClass(status.class).html(status.label);
            location.find('.open-time').html(displayTimes.join(', '));
          }
        }

      });

    }
  });
  function formatTime(str) {
    var output;
    switch(str.length) {
      case 1:
        return '12:00 AM';
        break;

      case 2:
        return '12:' + str + ' AM';
        break;

      case 3:
        return str.slice(0,1) + ':' + str.slice(-2) + ' AM';
        break;

      default:
        var hour = str.slice(0,2);
        if (parseInt(hour) < 12) {
          return hour + ':' + str.slice(-2) + ' AM';
        } else if(parseInt(hour) == 12) {
          return hour + ':' + str.slice(-2) + ' PM';
        } else {
          return (hour-12) + ':' + str.slice(-2) + ' PM';
        }
        break;
    }
    return false;
  }
})(jQuery);
