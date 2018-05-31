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

  classNames: ['double-layer-donut-chart'],

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
  innerRadius: 65,

  /**
   *  radius of donut chart
   * @return {Number}
   */
  radius: 85,


  /**
   * Inner Radius of arc two
   * @return {Number}
   */
  innerRadius1: 65,

  /**
   *  radius of arc two
   * @return {Number}
   */
  radius1: 85,

  /**
   * default label  for the dounut chart
   * @type {String}
   */
  defaultI18nLabel: null,


  /**
   * Total count
   * @return {Number}
   */
  totalCount: Ember.computed('data.[]', function() {
    let count = 0;
    let dataSet = this.get('data');
    dataSet.forEach(data => {
      count += data.value;
    });
    return count;
  }),


  // -------------------------------------------------------------------------
  // Methods

  drawchart: function() {
    let component = this;
    let width = component.get('width');
    let height = component.get('height');
    let data = component.get('data');
    let radius = component.get('radius');
    let innerRadius = component.get('innerRadius');
    let radius1 = component.get('radius1');
    let innerRadius1 = component.get('innerRadius1');
    let defaultI18nLabel = component.get('defaultI18nLabel');
    let defaultLabel = component.get('defaultLabel') || '';
    let totalCount = component.get('totalCount');
    let label =  defaultI18nLabel ? component.get('i18n').t(defaultI18nLabel).string : defaultLabel;
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

    let arc1 = d3.arc()
      .innerRadius(innerRadius1)
      .outerRadius(radius1);

    let pie1 = d3.pie()
      .value(function(d) {
        return d.value;
      })
      .sort(null);
    pie1.padAngle(0.05);


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
      })
      .on('mouseover', function(d) {
        d3.select(this).style('cursor', 'pointer');
        let selectedElement = component.$(`#path-arc${  d.index}`);
        selectedElement.attr('fill', d.data.colorCode);
        d3.select(this).transition()
          .duration(500)
          .ease(d3.easeBounce)
          .attr('d', arc.innerRadius((innerRadius - 5)).outerRadius(radius));
        component.$('.header-title').text(d.data.name);
        component.$('.header-count').text(d.data.value.toLocaleString('en-US'));
      })
      .on('mouseout', function() {
        d3.select(this)
          .style('cursor', 'none');
        component.$('.arc1 path').attr('fill', '#FFF');
        d3.select(this).transition()
          .duration(500)
          .ease(d3.easeBounce)
          .attr('d', arc.innerRadius(innerRadius).outerRadius(radius));
        component.$('.header-title').text(label);
        component.$('.header-count').text(totalCount.toLocaleString('en-US'));
      });

    let arcs1 = g.selectAll('arc1')
      .data(pie1(data))
      .enter()
      .append('g')
      .attr('class', 'arc1');
    arcs1.append('path')
      .attr('d', arc1)
      .attr('id', function(d) {
        return `path-arc${  d.index}`;
      })
      .attr('fill', '#FFF');

    let text = g.append('svg:foreignObject')
      .attr('width', (width / 2)).attr('height', radius)
      .attr('x', -(width / 4))
      .attr('y', -(radius / 4));
    text.append('xhtml:div')
      .attr('class', 'header-count').text(totalCount.toLocaleString('en-US'));
    text.append('xhtml:div')
      .attr('class', 'header-title').text(label);


    /*let arc = d3.arc()
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
      }).on('mouseover', (d) => {
        d3.select(this)
          .style('cursor', 'pointer');
        component.$('.header-count').text(d.value.toLocaleString('en-US'));
        component.$('.header-title').text(d.data.name);
        d3.select(this).transition()
          .duration(500)
          .ease(d3.easeBounce)
          .attr('d', arc.innerRadius((innerRadius - 5)).outerRadius(radius));
      }).on('mouseout', () => {
        d3.select(this).transition()
          .duration(500)
          .ease(d3.easeBounce)
          .attr('d', arc.innerRadius(innerRadius).outerRadius(radius));
        d3.select(this)
          .style('cursor', 'none');
        component.$('.header-count').text(totalCount.toLocaleString('en-US'));
        component.$('.header-title').text(label);
      });

    let text = g.append('svg:foreignObject')
      .attr('width', (width / 2)).attr('height', radius)
      .attr('x', -(width / 4))
      .attr('y', -(radius / 4));
    text.append('xhtml:div')
      .attr('class', 'header-count').text(totalCount.toLocaleString('en-US'));
    text.append('xhtml:div')
      .attr('class', 'header-title').text(label);
      */
  }

});
