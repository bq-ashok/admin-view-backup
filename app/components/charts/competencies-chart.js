import Ember from 'ember';
import d3 from 'd3';


/**
 * Competencies chart
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({

  //------------------------------------------------------------------------
  //Dependencies

  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['competencies-chart'],

  // -------------------------------------------------------------------------
  // Events

  didInsertElement: function() {
    const $component = this.$();

    // Get the component dimensions from the css
    this.setProperties({
      height: parseInt($component.height()),
      width: parseInt($component.width())
    });
    this.drawChart();

  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Number} width
   */
  width: null,

  /**
   * @property {Number} height
   */
  height: null,

  /**
   * Data of competencies count
   * @return {Array}
   */
  data: null,

  /**
   * mastered count
   * @return {Number}
   */
  masteredCount: Ember.computed('data', function() {
    let count = this.get('data').objectAt(1);
    return count.value;
  }),

  /**
   * inprogress count
   * @return {Number}
   */
  inProgressCount: Ember.computed('data', function() {
    let count = this.get('data').objectAt(0);
    return count.value;
  }),

  /**
   * Total count
   * @return {Number}
   */
  totalCount: Ember.computed('masteredCount','inProgressCount' , function() {
    let inProgressCount = this.get('inProgressCount');
    let masteredCount = this.get('masteredCount');
    let totalCount = inProgressCount + masteredCount;
    return totalCount;
  }),

  // -------------------------------------------------------------------------
  // Methods

  drawChart: function() {
    let component = this;
    let width = component.get('width');
    let height = component.get('height');
    let radius = Math.min(width, height) / 2;

    let color = d3.scaleOrdinal()
      .range(['#1C9EEE', '#2662BE']);

    let data = component.get('data');

    let g = d3.select('#competencies-chart')
      .append('svg')
      .data([data])
      .attr('width', width)
      .attr('height', height)
      .append('svg:g')
      .attr('transform', `translate(${  width / 2  },${  height / 2  })`);

    let arc = d3.arc()
      .innerRadius(115)
      .outerRadius(radius);

    let pie = d3.pie()
      .startAngle(-90 * (Math.PI / 180))
      .endAngle(90 * (Math.PI / 180))
      .padAngle(.02)
      .sort(null)
      .value(function(d) {
        return d.value;
      });

    let arcs = g.selectAll('g.slice')
      .data(pie)
      .enter()
      .append('svg:g')
      .attr('class', 'slice');

    arcs.append('svg:path')
      .attr('fill', function(d, i) {
        return color(i);
      }).attr('d', arc);

    let text = g.append('svg:foreignObject')
      .attr('width', 150).attr('height', 200)
      .attr('x', -75)
      .attr('y', -115);
    text.append('xhtml:div')
      .attr('class', 'count').text(component.get('totalCount'));
    text.append('xhtml:div')
      .attr('class', 'title').text(component.get('i18n').t('learner.competencies-studied').string);
  }

});
