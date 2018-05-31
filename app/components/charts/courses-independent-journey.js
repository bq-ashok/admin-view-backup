import Ember from 'ember';
import d3 from 'd3';


/**
 * Courses and independent journeys donut chart
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

  classNames: ['courses-independent-journeys-chart'],

  // -------------------------------------------------------------------------
  // Events

  didInsertElement: function() {
    const $component = this.$();

    // Get the component dimensions from the css
    this.setProperties({
      height: parseInt($component.height()),
      width: parseInt($component.width())
    });
    this.drawDonutChart();

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
   * Thickness of the piechart
   * @type {Number}
   */
  thickness: 120,

  /**
   * Data of courses and independent journeys count
   * @return {Array}
   */
  data: null,

  // -------------------------------------------------------------------------
  // Methods

  drawDonutChart: function() {
    let component = this;
    let width = component.get('width');
    let height = component.get('height');
    let thickness = component.get('thickness');
    let data = component.get('data');
    let radius = Math.min(width, height) / 2;
    let color = d3.scaleOrdinal()
      .range(['#1C9EEE', '#2662BE']);

    let svg = d3.select(component.element)
      .append('svg')
      .attr('class', 'pie')
      .attr('width', width)
      .attr('height', height);

    let g = svg.append('g')
      .attr('transform', `translate(${  width / 2  },${  height / 2  })`);

    let arc = d3.arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius);

    let pie = d3.pie()
      .value(function(d) {
        return d.value;
      })
      .sort(null);
    pie.padAngle(.06);

    let arcs = g.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i))
      .on('mouseover', function() {
        d3.select(this)
          .style('cursor', 'pointer');
      })
      .on('mouseout', function() {
        d3.select(this)
          .style('cursor', 'none');
      })
      .each(function(d, i) {
        this._current = i;
      });

    arcs.append('svg:foreignObject')
      .attr('transform', function(d) {
        return `translate(${  arc.centroid(d)  })rotate(45)`;
      })
      .attr('width', 125).attr('height', 50)
      .attr('y', -20)
      .attr('x', function(d) {
        return -(d.data.name.length * 2);
      })
      .append('xhtml:div')
      .attr('class', 'title')
      .text(function(d) {
        let label = component.get('i18n').t(`learner.${  d.data.name}`).string;
        return `${d.data.value  }   ${label}`;
      });

  }

});
