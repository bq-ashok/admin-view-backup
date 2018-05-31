import Ember from 'ember';
import d3 from 'd3';

export default Ember.Component.extend({

  //------------------------------------------------------------------------
  //Dependencies

  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['time-spent-activities-bar-chart'],

  // -------------------------------------------------------------------------
  // Events

  didInsertElement: function() {
    const $component = this.$();

    // Get the component dimensions from the css
    this.setProperties({
      height: parseInt($component.height()),
      width: parseInt($component.width())
    });
    this.drawchart();

  },

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @function drawchart
   * Draw a bar chart and render into UI
   */
  drawchart: function() {
    let component = this;
    let data = component.get('data');

    let maxTimeValue = component.getMaxTimeValue(data);
    if (maxTimeValue) {
      let color = d3.scaleOrdinal()
        .range(['#95C3E5', '#C9E1F3', '#348ec9', '#3983CB', '#66aad7']);

      let element = component.element;
      let div = d3.select(element).append('div').attr('class', 'toolTip');

      var axisMargin = 20,
        margin = 40,
        width = parseInt(d3.select(element).style('width'), 10),
        height = parseInt(d3.select(element).style('height'), 10),
        barHeight = 22,
        barPadding = 20,
        bar, svg, scale, xAxis, labelWidth = 0;

      svg = d3.select(component.element)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      bar = svg.selectAll('g')
        .data(data)
        .enter()
        .append('g');

      bar.attr('class', 'bar')
        .attr('cx',0)
        .attr('transform', function(d, i) {
          return `translate(${  margin  },${  i * (barHeight + barPadding) + barPadding  })`;
        });

      bar.attr('class', 'bar')
        .attr('fill', (d, i) => color(i));

      let text = bar.append('svg:foreignObject')
        .attr('width', 18)
        .attr('height', 18)
        .attr('x', -40)
        .attr('y', 2);

      text.append('xhtml:i')
        .attr('class', function(d) {
          return d.name;
        });
      scale = d3.scaleLinear()
        .domain([0, 10])
        .range([0, 400]);

      xAxis = d3.axisBottom()
        .scale(scale)
        .tickSize(-width + barHeight);

      bar.append('rect')
        .attr('transform', `translate(${labelWidth}, 0)`)
        .attr('height', barHeight)
        .attr('width', function(d){
          return scale(d.value/maxTimeValue.conversion);
        });

      bar.on('mousemove', function(d){
        div.style('left', `${d3.event.pageX+10}px`);
        div.style('top', `${d3.event.pageY-25}px`);
        div.style('display', 'inline-block');
        div.style('text-transform', 'capitalize');
        div.html(`${d.name} : ${(d.value/maxTimeValue.conversion).toFixed(2)}${maxTimeValue.type}`);
      });
      bar.on('mouseout', function(){
        div.style('display', 'none');
      });

      svg.insert('g',':first-child')
        .attr('class', 'axisHorizontal')
        .attr('transform', `translate(${  margin + labelWidth  },${ height - axisMargin - margin})`)
        .call(xAxis);

      var xAxisLabels = d3.selectAll('.tick text');
      xAxisLabels.attr('class', function(d,i){
        if(i%2 !== 0) {
          d3.select(this).remove();
        }
        d3.select(this).text(i + maxTimeValue.type)
          .attr('y', 20);
      });

      d3.select('.domain')
        .attr('d', 'M5 0 440 0');
    }
    return true;
  },

  /**
   * @function getMaxTimeValue
   * @return maxTimeValue
   */
  getMaxTimeValue: function(data) {
    let maxValue = {};
    let secs;
    let maxTimeInMillis = d3.max(data, function(d) { return d.value; });

    if (maxTimeInMillis) {
      secs = maxTimeInMillis / 1000;
      const hours = secs / 3600;
      secs = secs % 3600;
      const mins = secs / 60;
      secs = secs % 60;

      if (hours >= 1) {
        maxValue = {
          time: Math.floor(hours),
          type: 'h',
          conversion: 60 * ( 60* 1000)
        };
      } else if(mins >= 2) {
        maxValue = {
          time: Math.floor(mins),
          type: 'm',
          conversion: 60 * 1000
        };
      } else {
        maxValue = {
          time: Math.floor(secs),
          type: 's',
          conversion: 1000
        };
      }
    } else {
      return false;
    }

    return maxValue;
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {Array} data
   * store learner activity data
   */
  data: []
});
