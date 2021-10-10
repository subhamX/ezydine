function (items, filters, stations) {
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
