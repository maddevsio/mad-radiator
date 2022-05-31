export const fakeResponse = {
  data: {
    "dimensionHeaders": [
      { "name": "country" },
      { "name": "dateRange" },
      { "name": 'pagePath' },
    ],
    "metricHeaders": [
      { "name": "totalUsers", "type": "TYPE_INTEGER" },
      { "name": 'sessions', "type": 'TYPE_INTEGER' },
      { "name": 'bounceRate', "type": 'TYPE_FLOAT' },
      { "name": 'averageSessionDuration', "type": 'TYPE_SECONDS' },
      { "name": 'screenPageViews', "type": 'TYPE_INTEGER' }
    ],
    "rows": [{
      "dimensionValues": [{
        "value": "Saudi Arabia"
      }, {
        "value": "date_range_0"
      }],
      "metricValues": [{
        "value": "0"
      }]
    }, {
      "dimensionValues": [{
        "value": "Seychelles"
      }, {
        "value": "date_range_0"
      }],
      "metricValues": [{
        "value": "0"
      }]
    }, {
      "dimensionValues": [{
        "value": "Slovakia"
      }, {
        "value": "date_range_1"
      }],
      "metricValues": [{
        "value": "0"
      }]
    }, {
      "dimensionValues": [{
        "value": "Trinidad & Tobago"
      }, {
        "value": "date_range_1"
      }],
      "metricValues": [{
        "value": "0"
      }]
    }, {
      "dimensionValues": [{
        "value": "Tunisia"
      }, {
        "value": "date_range_1"
      }],
      "metricValues": [{
        "value": "0"
      }]
    }],
    "totals": [{
      "dimensionValues": [{
        "value": "RESERVED_TOTAL"
      }, {
        "value": "date_range_0"
      }],
      "metricValues": [{
        "value": "344"
      }]
    }, {
      "dimensionValues": [{
        "value": "RESERVED_TOTAL"
      }, {
        "value": "date_range_1"
      }],
      "metricValues": [{
        "value": "523"
      }]
    }],
    "maximums": [{
      "dimensionValues": [{
        "value": "RESERVED_MAX"
      }, {
        "value": "date_range_0"
      }],
      "metricValues": [{
        "value": "54"
      }]
    }, {
      "dimensionValues": [{
        "value": "RESERVED_MAX"
      }, {
        "value": "date_range_1"
      }],
      "metricValues": [{
        "value": "71"
      }]
    }],
    "minimums": [{
      "dimensionValues": [{
        "value": "RESERVED_MIN"
      }, {
        "value": "date_range_0"
      }],
      "metricValues": [{
        "value": "1"
      }]
    }, {
      "dimensionValues": [{
        "value": "RESERVED_MIN"
      }, {
        "value": "date_range_1"
      }],
      "metricValues": [{
        "value": "1"
      }]
    }],
  }
}

export const fakeResponseForCountries = {
  data: {
    dimensionHeaders: [{ name: 'country' }, { name: 'dateRange' }],
    metricHeaders: [{ name: 'totalUsers', type: 'TYPE_INTEGER' }],
    rows: [{ "dimensionValues": [{ "value": "United States" }, { "value": "date_range_0" }], "metricValues": [{ "value": "81" }] }, { "dimensionValues": [{ "value": "Kyrgyzstan" }, { "value": "date_range_1" }], "metricValues": [{ "value": "71" }] }, { "dimensionValues": [{ "value": "India" }, { "value": "date_range_1" }], "metricValues": [{ "value": "69" }] }, { "dimensionValues": [{ "value": "Vietnam" }, { "value": "date_range_1" }], "metricValues": [{ "value": "13" }] }, { "dimensionValues": [{ "value": "South Korea" }, { "value": "date_range_1" }], "metricValues": [{ "value": "12" }] }, { "dimensionValues": [{ "value": "Turkey" }, { "value": "date_range_1" }], "metricValues": [{ "value": "11" }] }, { "dimensionValues": [{ "value": "Ukraine" }, { "value": "date_range_0" }], "metricValues": [{ "value": "11" }] }, { "dimensionValues": [{ "value": "Ukraine" }, { "value": "date_range_1" }], "metricValues": [{ "value": "11" }] }, { "dimensionValues": [{ "value": "Indonesia" }, { "value": "date_range_0" }], "metricValues": [{ "value": "10" }] }, { "dimensionValues": [{ "value": "Indonesia" }, { "value": "date_range_1" }], "metricValues": [{ "value": "10" }] }, { "dimensionValues": [{ "value": "Singapore" }, { "value": "date_range_1" }], "metricValues": [{ "value": "10" }] }, { "dimensionValues": [{ "value": "France" }, { "value": "date_range_1" }], "metricValues": [{ "value": "9" }] }, { "dimensionValues": [{ "value": "Italy" }, { "value": "date_range_1" }], "metricValues": [{ "value": "9" }] }, { "dimensionValues": [{ "value": "Malaysia" }, { "value": "date_range_0" }], "metricValues": [{ "value": "9" }] }, { "dimensionValues": [{ "value": "Australia" }, { "value": "date_range_1" }], "metricValues": [{ "value": "8" }] }, { "dimensionValues": [{ "value": "South Africa" }, { "value": "date_range_1" }], "metricValues": [{ "value": "8" }] }, { "dimensionValues": [{ "value": "Turkey" }, { "value": "date_range_0" }], "metricValues": [{ "value": "8" }] }, { "dimensionValues": [{ "value": "Austria" }, { "value": "date_range_0" }], "metricValues": [{ "value": "7" }] }, { "dimensionValues": [{ "value": "Hong Kong" }, { "value": "date_range_1" }], "metricValues": [{ "value": "7" }] }, { "dimensionValues": [{ "value": "Japan" }, { "value": "date_range_0" }], "metricValues": [{ "value": "7" }] }, { "dimensionValues": [{ "value": "Pakistan" }, { "value": "date_range_0" }], "metricValues": [{ "value": "7" }] }, { "dimensionValues": [{ "value": "Poland" }, { "value": "date_range_1" }], "metricValues": [{ "value": "7" }] }, { "dimensionValues": [{ "value": "Spain" }, { "value": "date_range_1" }], "metricValues": [{ "value": "7" }] }, { "dimensionValues": [{ "value": "Australia" }, { "value": "date_range_0" }], "metricValues": [{ "value": "6" }] }, { "dimensionValues": [{ "value": "Canada" }, { "value": "date_range_0" }], "metricValues": [{ "value": "6" }] }, { "dimensionValues": [{ "value": "Denmark" }, { "value": "date_range_1" }], "metricValues": [{ "value": "6" }] }, { "dimensionValues": [{ "value": "Netherlands" }, { "value": "date_range_1" }], "metricValues": [{ "value": "6" }] }, { "dimensionValues": [{ "value": "Nigeria" }, { "value": "date_range_1" }], "metricValues": [{ "value": "6" }] }, { "dimensionValues": [{ "value": "South Africa" }, { "value": "date_range_0" }], "metricValues": [{ "value": "6" }] }, { "dimensionValues": [{ "value": "Spain" }, { "value": "date_range_0" }], "metricValues": [{ "value": "6" }] }, { "dimensionValues": [{ "value": "Sweden" }, { "value": "date_range_0" }], "metricValues": [{ "value": "6" }] }, { "dimensionValues": [{ "value": "Vietnam" }, { "value": "date_range_0" }], "metricValues": [{ "value": "6" }] }, { "dimensionValues": [{ "value": "Bangladesh" }, { "value": "date_range_1" }], "metricValues": [{ "value": "5" }] }, { "dimensionValues": [{ "value": "Belgium" }, { "value": "date_range_0" }], "metricValues": [{ "value": "5" }] }, { "dimensionValues": [{ "value": "Finland" }, { "value": "date_range_0" }], "metricValues": [{ "value": "5" }] }, { "dimensionValues": [{ "value": "Israel" }, { "value": "date_range_1" }], "metricValues": [{ "value": "5" }] }, { "dimensionValues": [{ "value": "Italy" }, { "value": "date_range_0" }], "metricValues": [{ "value": "5" }] }, { "dimensionValues": [{ "value": "Kazakhstan" }, { "value": "date_range_1" }], "metricValues": [{ "value": "5" }] }, { "dimensionValues": [{ "value": "Kenya" }, { "value": "date_range_1" }], "metricValues": [{ "value": "5" }] }, { "dimensionValues": [{ "value": "Taiwan" }, { "value": "date_range_1" }], "metricValues": [{ "value": "5" }] }, { "dimensionValues": [{ "value": "Bangladesh" }, { "value": "date_range_0" }], "metricValues": [{ "value": "4" }] }, { "dimensionValues": [{ "value": "Belarus" }, { "value": "date_range_0" }], "metricValues": [{ "value": "4" }] }, { "dimensionValues": [{ "value": "Denmark" }, { "value": "date_range_0" }], "metricValues": [{ "value": "4" }] }, { "dimensionValues": [{ "value": "Kazakhstan" }, { "value": "date_range_0" }], "metricValues": [{ "value": "4" }] }, { "dimensionValues": [{ "value": "Malaysia" }, { "value": "date_range_1" }], "metricValues": [{ "value": "4" }] }, { "dimensionValues": [{ "value": "Nigeria" }, { "value": "date_range_0" }], "metricValues": [{ "value": "4" }] }, { "dimensionValues": [{ "value": "Philippines" }, { "value": "date_range_0" }], "metricValues": [{ "value": "4" }] }, { "dimensionValues": [{ "value": "Romania" }, { "value": "date_range_0" }], "metricValues": [{ "value": "4" }] }, { "dimensionValues": [{ "value": "Singapore" }, { "value": "date_range_0" }], "metricValues": [{ "value": "4" }] }, { "dimensionValues": [{ "value": "South Korea" }, { "value": "date_range_0" }], "metricValues": [{ "value": "4" }] }, { "dimensionValues": [{ "value": "Thailand" }, { "value": "date_range_1" }], "metricValues": [{ "value": "4" }] }, { "dimensionValues": [{ "value": "Algeria" }, { "value": "date_range_0" }], "metricValues": [{ "value": "3" }] }, { "dimensionValues": [{ "value": "Azerbaijan" }, { "value": "date_range_0" }], "metricValues": [{ "value": "3" }] }, { "dimensionValues": [{ "value": "Brazil" }, { "value": "date_range_0" }], "metricValues": [{ "value": "3" }] }, { "dimensionValues": [{ "value": "Brazil" }, { "value": "date_range_1" }], "metricValues": [{ "value": "3" }] }, { "dimensionValues": [{ "value": "China" }, { "value": "date_range_0" }], "metricValues": [{ "value": "3" }] }, { "dimensionValues": [{ "value": "Colombia" }, { "value": "date_range_0" }], "metricValues": [{ "value": "3" }] }, { "dimensionValues": [{ "value": "Czechia" }, { "value": "date_range_1" }], "metricValues": [{ "value": "3" }] }, { "dimensionValues": [{ "value": "Hong Kong" }, { "value": "date_range_0" }], "metricValues": [{ "value": "3" }] }, { "dimensionValues": [{ "value": "Iran" }, { "value": "date_range_1" }], "metricValues": [{ "value": "3" }] }, { "dimensionValues": [{ "value": "Japan" }, { "value": "date_range_1" }], "metricValues": [{ "value": "3" }] }, { "dimensionValues": [{ "value": "New Zealand" }, { "value": "date_range_1" }], "metricValues": [{ "value": "3" }] }, { "dimensionValues": [{ "value": "Pakistan" }, { "value": "date_range_1" }], "metricValues": [{ "value": "3" }] }, { "dimensionValues": [{ "value": "Philippines" }, { "value": "date_range_1" }], "metricValues": [{ "value": "3" }] }, { "dimensionValues": [{ "value": "Romania" }, { "value": "date_range_1" }], "metricValues": [{ "value": "3" }] }, { "dimensionValues": [{ "value": "Saudi Arabia" }, { "value": "date_range_1" }], "metricValues": [{ "value": "3" }] }, { "dimensionValues": [{ "value": "Slovakia" }, { "value": "date_range_0" }], "metricValues": [{ "value": "3" }] }, { "dimensionValues": [{ "value": "Sri Lanka" }, { "value": "date_range_1" }], "metricValues": [{ "value": "3" }] }, { "dimensionValues": [{ "value": "Switzerland" }, { "value": "date_range_1" }], "metricValues": [{ "value": "3" }] }, { "dimensionValues": [{ "value": "Argentina" }, { "value": "date_range_1" }], "metricValues": [{ "value": "2" }] }, { "dimensionValues": [{ "value": "Armenia" }, { "value": "date_range_1" }], "metricValues": [{ "value": "2" }] }, { "dimensionValues": [{ "value": "Austria" }, { "value": "date_range_1" }], "metricValues": [{ "value": "2" }] }, { "dimensionValues": [{ "value": "Cambodia" }, { "value": "date_range_0" }], "metricValues": [{ "value": "2" }] }, { "dimensionValues": [{ "value": "Canada" }, { "value": "date_range_1" }], "metricValues": [{ "value": "2" }] }],
    totals: [{ "dimensionValues": [{ "value": "RESERVED_TOTAL" }, { "value": "date_range_0" }], "metricValues": [{ "value": "538" }] }, { "dimensionValues": [{ "value": "RESERVED_TOTAL" }, { "value": "date_range_1" }], "metricValues": [{ "value": "523" }] }]
  }
}

export const fakeResponseForCoreData = {
  data: {
    dimensionHeaders: [{ name: 'dateRange' }],
    metricHeaders: [
      { name: 'totalUsers', type: 'TYPE_INTEGER' },
      { name: 'active7DayUsers', type: 'TYPE_INTEGER' },
      { name: 'active28DayUsers', type: 'TYPE_INTEGER' },
      { name: 'sessions', type: 'TYPE_INTEGER' },
      { name: 'bounceRate', type: 'TYPE_FLOAT' },
      { name: 'averageSessionDuration', type: 'TYPE_SECONDS' }
    ],
    rows: [{ "dimensionValues": [{ "value": "date_range_0" }], "metricValues": [{ "value": "538" }, { "value": "2898" }, { "value": "9919" }, { "value": "636" }, { "value": "0.23113207547169812" }, { "value": "186.2663308553459" }] }, { "dimensionValues": [{ "value": "date_range_1" }], "metricValues": [{ "value": "285" }, { "value": "2888" }, { "value": "9750" }, { "value": "319" }, { "value": "0.19749216300940439" }, { "value": "104.15423423197493" }] }]
  }
}

export const fakeResponseForChartData = {
  data: {
    metricHeaders: [{ name: 'totalUsers', type: 'TYPE_INTEGER' }],
    rows: [{ "dimensionValues": [{ "value": "date_range_0" }], "metricValues": [{ "value": "538" }, { "value": "2898" }, { "value": "9919" }, { "value": "636" }, { "value": "0.23113207547169812" }, { "value": "186.2663308553459" }] }, { "dimensionValues": [{ "value": "date_range_1" }], "metricValues": [{ "value": "285" }, { "value": "2888" }, { "value": "9750" }, { "value": "319" }, { "value": "0.19749216300940439" }, { "value": "104.15423423197493" }] }]
  }
}

export const fakeResponseSecond = {
  data: {
    rows: [
      {
        "dimensionValues": [{ "value": "Kyrgyzstan" }, { "value": "date_range_0" }],
        "metricValues": [{ "value": "71" }]
      },
      {
        "dimensionValues": [{ "value": "India" }, { "value": "date_range_0" }],
        "metricValues": [{ "value": "69" }]
      },
      {
        "dimensionValues": [{ "value": "United States" }, { "value": "date_range_0" }],
        "metricValues": [{ "value": "51" }]
      }
    ],

    totals: [
      {
        "dimensionValues": [{ "value": "Kyrgyzstan" }, { "value": "date_range_0" }],
        "metricValues": [{ "value": "71" }]
      },
      {
        "dimensionValues": [{ "value": "India" }, { "value": "date_range_0" }],
        "metricValues": [{ "value": "69" }]
      }
    ]
  },
}

export const blogFakeResponse = {
  data: {
    rows: [
      {
        "dimensionValues": [{ "value": "/" }, { "value": "date_range_0" }],
        "metricValues": [{ "value": "209" }]
      },
      {
        "dimensionValues": [{ "value": "/blog/main-software-development-metrics-and-kpis/" }, { "value": "date_range_0" }],
        "metricValues": [{ "value": "112" }]
      },
      {
        "dimensionValues": [{ "value": "/" }, { "value": "date_range_1" }],
        "metricValues": [{ "value": "79" }]
      },
      {
        "dimensionValues": [{ "value": "/blog/" }, { "value": "date_range_0" }],
        "metricValues": [{ "value": "59" }]
      }
    ]
  }
}