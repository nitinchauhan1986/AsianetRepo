const stackedBarConfig = {
  chart: {
    type: 'bar',
    height: 66,
    margin: 0,
  },
  credits: {
    enabled: false,
  },
  title: {
    text: '',
  },
  xAxis: {
    categories: [''],
    labels: { enabled: false },
    lineWidth: 0,
  },
  yAxis: {
    min: 0,
    title: {
      text: '',
    },
    gridLineWidth: 0,
    gridLineColor: '#000',
    labels: { enabled: false },
  },
  legend: {
    enabled: false,
  },
  plotOptions: {
    series: {
      stacking: 'percent',
    },
    bar: {
      borderWidth: 0,
    },
  },
  series: [
    // {
    //   name: 'BJP',
    //   data: [5],
    //   borderRadiusTopLeft: '20%',
    //   borderRadiusTopRight: '20%',
    // },
    // {
    //   name: 'INC',
    //   data: [2],
    // },
    // {
    //   name: 'Others',
    //   data: [3],
    //   borderRadiusBottomLeft: '20%',
    //   borderRadiusBottomRight: '20%',
    // },
  ],
};

export default stackedBarConfig;
