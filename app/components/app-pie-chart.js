import Ember from 'ember';
import d3 from 'd3';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['pie-chart'],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Default size of the pie-chart
   * width and height use same size
   */
  size: 200,

  /**
   * Chart data of the pie-chart
   */
  chartData: [],

  /**
   * Pie-chart inside Text/Number
   */
  innerText: null,

  /**
   * Add space between arcs
   */
  isArcPadVisible: false,

  /**
   * Color code of the chart
   * Default color #00ace7
   */
  colorCode: '#00ace7',

  // -------------------------------------------------------------------------
  // Events
  didInsertElement() {
    let component = this;
    component._super(...arguments);
    let chartData = component.get('chartData');
    let size = component.get('size');
    let width = size,
      height = size,
      radius = size / 3;
    let innerText = component.get('innerText');
    //TODO need to get the color code dynamically to differentiate each arcs
    let color = component.get('colorCode');
    let arcPadAngle = component.get('isArcPadVisible') ? 0.2 : 0;
    let arc = d3
      .arc()
      .innerRadius(radius)
      .outerRadius(radius + 9);
    let pie = d3.pie().padAngle(arcPadAngle);
    let svg = d3
      .select(component.element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);
    svg
      .selectAll('path')
      .data(pie(chartData))
      .enter()
      .append('path')
      .style('fill', function() {
        return color;
      })
      .attr('d', arc);
    //Pie-chart inner text part
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '15px')
      .attr('y', 20)
      .text(innerText);
  }
});
