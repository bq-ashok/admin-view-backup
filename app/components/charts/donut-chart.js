import Ember from 'ember';
import d3 from 'd3';


/**
 * Donut  chart
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

  classNames: ['donut-chart'],

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
   * Data of donut chart
   * @return {Array}
   */
  data: Ember.A(),


  /**
   * Inner Radius of donut chart
   * @return {Number}
   */
  innerRadius: 60,

  /**
   *  radius of donut chart
   * @return {Number}
   */
  radius: 80,


  // -------------------------------------------------------------------------
  // Methods

  drawchart: function() {
    let component = this;
    let width = component.get('width');
    let height = component.get('height');
    let data = component.get('data');
    let radius = component.get('radius');
    let innerRadius = component.get('innerRadius');
    let svg = d3.select(component.element)
      .append('svg')
      .attr('class', 'pie')
      .attr('width', width)
      .attr('height', height);

    let g = svg.append('g')
      .attr('transform', `translate(${  width / 2  },${  height / 2  })`);

    let arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    let pie = d3.pie()
      .value(function(d) {
        return d.value;
      })
      .sort(null);
    pie.padAngle(0.05);

    let arcs = g.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d) => {
        return d.data.colorCode;
      });
  }

});
