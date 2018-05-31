import Ember from 'ember';
import d3 from 'd3';
import {
  formatTime as formatMilliseconds
} from 'admin-dataview/utils/utils';


/**
 * time Spent activities chart
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

  classNames: ['time-spent-courses-chart'],

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
   * Data of courses and independent journeys count
   * @return {Array}
   */
  data: null,

  /**
   * Total count of time spent
   * @return {Number}
   */
  totalDuration: Ember.computed('data.[]', function() {
    let dataSet = this.get('data');
    let count = 0;
    dataSet.forEach(data => {
      count = count + data.value;
    });
    return count;
  }),

  /**
   * userId
   * @type {String}
   */
  userId: null,

  // -------------------------------------------------------------------------
  // Methods

  drawchart: function() {
    let component = this;
    let width = component.get('width');
    let height = component.get('height');
    let data = component.get('data');
    let radius = 135;
    let color = d3.scaleOrdinal()
      .range(['#96D7CE', '#61C3B7', '#1CAE9F', '#009A87', '#CBECE7', '#12bca8', '#3de5d1', '#10b7a4', '#0da896', '#0ba896']);

    let svg = d3.select(component.element)
      .append('svg')
      .attr('class', 'pie')
      .attr('width', width)
      .attr('height', height);

    let g = svg.append('g')
      .attr('transform', `translate(${  width / 2  },${  height / 2  })`);

    let arc = d3.arc()
      .innerRadius(115)
      .outerRadius(radius);

    let arc1 = d3.arc()
      .innerRadius(100)
      .outerRadius(90);

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
      .attr('fill', (d, i) => color(i))
      .on('mouseover', function(d, i) {
        d3.select(this)
          .style('cursor', 'pointer');
        let selectedElement = component.$(`#path-arc${  d.index}`);
        selectedElement.attr('fill', color(i));
        d3.select(this).transition()
          .duration(500)
          .ease(d3.easeBounce)
          .attr('d', arc.innerRadius(110).outerRadius(radius));
        component.$('.title').html(d.data.courseTitle);
        component.$('.duration-label').html(formatMilliseconds(d.data.value));
      })
      .on('mouseout', function() {
        d3.select(this)
          .style('cursor', 'none');
        component.$('.arc1 path').attr('fill', '#fff');
        d3.select(this).transition()
          .duration(500)
          .ease(d3.easeBounce)
          .attr('d', arc.innerRadius(115).outerRadius(radius));
        component.$('.title').html('');
        component.$('.duration-label').html(formatMilliseconds(component.get('totalDuration')));
      }).on('click', function(d) {
        let courseId = d.data.courseId;
        let queryParams = {
          classId: d.data.classId,
          courseTitle: d.data.courseTitle
        };
        component.get('router').transitionTo('learner.courses', courseId, {
          queryParams
        });
      }).each(function(d, i) {
        this._current = i;
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
      .attr('fill', '#fff')
      .each(function(d, i) {
        this._current = i;
      });
    let text = g.append('svg:foreignObject')
      .attr('width', 230).attr('height', 100)
      .attr('x', -95)
      .attr('y', -30);
    text.append('xhtml:div')
      .attr('class', 'duration-label').text(formatMilliseconds(component.get('totalDuration')));
    text.append('xhtml:div')
      .attr('class', 'title').text();


  }

});
