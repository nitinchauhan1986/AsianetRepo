import React from 'react';
// import clonedeep from 'lodash.clonedeep';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
// import Highcharts from 'highcharts';
import HighchartsRounded from 'highcharts-rounded-corners';
// import stackedBarConfig from './config';
class RenderChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isClientSide: false,
      chartConfig: {
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
            states: {
              hover: {
                enabled: false,
              },
              inactive: {
                opacity: 1,
              },
            },
          },
          bar: {
            borderWidth: 0,
          },
        },
        tooltip: {
          enabled: false,
        },
        series: props.series,
      },
    };

    this.ref = React.createRef();
  }

  componentDidMount() {
    HighchartsRounded(Highcharts);
    this.setState({ isClientSide: true });

    window.addEventListener('GUTTER_AD_TYPE_HANDLING', () => {
      this.resizeChart();
    });
    window.addEventListener('GUTTER_CLOSE_AD_TYPE_HANDLING', () => {
      this.resizeChart();
    });
  }

  resizeChart = () => {
    const self = this;
    setTimeout(() => {
      if (
        document.querySelectorAll('[data-highcharts-chart="1"]') &&
        document.querySelectorAll('[data-highcharts-chart="1"]').length > 0 &&
        self.ref.current &&
        self.ref.current.chart
      ) {
        self.ref.current.chart.setSize(
          document.querySelectorAll('[data-highcharts-chart="1"]')[0]
            .offsetWidth,
        );
      }
    }, 1500);
  };

  componentDidUpdate(prevProps) {
    const { series } = this.props;
    const prevSeries = prevProps.series;
    if (prevSeries && prevSeries.length > 0) {
      for (let counter = 0; counter < series.length; counter += 1) {
        if (prevSeries[counter].data[0] !== series[counter].data[0]) {
          this.state.chartConfig.series = series;
          // this.setState({ chartConfig: this.state.chartConfig });
          this.ref.current.chart.update(this.state.chartConfig);
          break;
        }
      }
    }
  }
  render() {
    // const { series } = this.props;
    // this.chartConfig.series = [...series];
    if (!this.state.isClientSide) {
      return null;
    }
    return (
      <HighchartsReact
        ref={this.ref}
        highcharts={Highcharts}
        options={this.state.chartConfig}
      />
    );
  }
}

export default RenderChart;
