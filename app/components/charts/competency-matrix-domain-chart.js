/**
 * Competency matrix domain chart
 *
 * @module
 * @augments ember/Component
 */
import Ember from 'ember';
import d3 from 'd3';

export default Ember.Component.extend({
  //------------------------------------------------------------------------
  //Dependencies

  i18n: Ember.inject.service(),

  /**
   * competency service dependency injection
   * @type {Object}
   */
  competencyService: Ember.inject.service('api-sdk/competency'),

  /**
   * taxonomy service dependency injection
   * @type {Object}
   */
  taxonomyService: Ember.inject.service('taxonomy'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['competency-matrix-domain-chart'],

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Number} width
   */
  width: 780,

  /**
   * @property {Number} height
   */
  height: 900,

  /**
   * User id of competency matrix to plot
   * @type {String}
   */
  userId: null,

  /**
   * Different color range based on status
   * @type {Object}
   */
  colorsBasedOnStatus: Ember.Object.create({
    '0': '#e7e8e9',
    '1': '#1aa9eb',
    '2': '#006eb5',
    '3': '#006eb5',
    '4': '#006eb5',
    '5': '#006eb5'
  }),

  /**
   * Width of the cell
   * @type {Number}
   */
  cellWidth: 35,

  /**
   * height of the cell
   * @type {Number}
   */
  cellHeight: 15,

  /**
   * It will have selected taxonomy subject courses
   * @type {Object}
   */
  taxonomyDomains: Ember.A(),

  /**
   * It will have  taxonomy subjects
   * @type {Object}
   */
  taxonomySubjects: null,

  /**
   * It  will have default subject category
   * @type {String}
   */
  selectedSubjectCategory: 'k_12',

  isLoading: false,

  /**
   * It  will have chart value width scroll width handling
   * @type {String}
   */
  isTaxonomyDomains: Ember.computed('taxonomyDomains', function() {
    let component = this;
    let length = component.get('taxonomyDomains').length;
    return length > 0;
  }),

  /**
   * subjectId  change will call the function
   */
  onChange: Ember.observer('subjectId', function() {
    let component = this;
    if (component.get('subjectId')) {
      component.loadDataBySubject(component.get('subjectId'));
    }
    return null;
  }),

  /**
   * Maintains the pull out state.
   * @type {Boolean}
   */
  showPullOut: false,

  /**
   * Trigger whenever pull out state got changed.
   */
  onChangeShowPullOut: Ember.observer('showPullOut', function() {
    let component = this;
    let showPullOut = component.get('showPullOut');
    if (!showPullOut) {
      component.$('.block-container').remove();
    }
  }),

  /**
   * Trigger whenever skyline toggle state got changed.
   */
  onChangeSkylineToggle: Ember.observer('isSkylineEnabled', function() {
    let component = this;
    let isSkylineEnabled = component.get('isSkylineEnabled');
    let skylineElements = component.$('.skyline');
    if (isSkylineEnabled) {
      skylineElements.each(function(index, element) {
        component.$(element).attr('class', 'skyline');
      });
    } else {
      skylineElements.each(function(index, element) {
        component.$(element).attr('class', 'skyline disable-skyline');
      });
    }
  }),

  /**
   * Trigger whenever reset chart view mode toggle state got changed.
   */
  onChangeResetToggle: Ember.observer('isExpandChartEnabled', function() {
    let component = this;
    let isExpandChartEnabled = component.get('isExpandChartEnabled');
    if (isExpandChartEnabled) {
      component.expandChartColumnHeight();
    } else {
      component.reduceChartHeight();
    }
  }),

  /**
   * It maintains the number of cells in each column
   * @type {Number}
   */
  numberOfCellsInEachColumn: 0,

  /**
   * It decide  the max number of cells in each column
   * @type {Number}
   */
  maxNumberOfCellsInEachColumn: 20,

  /**
   * This should be the height of cells when maximum number of cell size
   * got exceeds for each column.
   * @type {Number}
   */
  reducedHeightOfCells: 5,

  /**
   * Default height of the chart
   * @type {Number}
   */
  defaultHeightOfChart: 450,

  /**
   * Maximum number of reduce cell below
   * @type {Number}
   */
  maxNumberOfReduceCellBelow: 5,

  /**
   * skyline container
   * @type {Object}
   */
  skylineContainer: null,

  // -------------------------------------------------------------------------
  // Events

  didInsertElement() {
    let component = this;
    if (component.get('subjectId')) {
      component.loadDataBySubject(component.get('subjectId'));
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  drawChart(data) {
    let component = this;
    let cellSizeInRow = component.get('taxonomyDomains');
    let numberOfCellsInEachColumn = cellSizeInRow.length;
    component.set('numberOfCellsInEachColumn', numberOfCellsInEachColumn);
    const colorsBasedOnStatus = component.get('colorsBasedOnStatus');
    const cellWidth = component.get('cellWidth');
    const cellHeight = component.get('cellHeight');
    const width = Math.round(numberOfCellsInEachColumn * cellWidth);
    component.set('width', width);
    const height = component.get('defaultHeightOfChart');
    component.$('#competency-matrix-domain-chart').empty();
    const svg = d3
      .select('#competency-matrix-domain-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    let cellContainer = svg.append('g').attr('id', 'cell-container');
    let skylineContainer = svg.append('g').attr('id', 'skyline-container');
    component.set('skylineContainer', skylineContainer);
    const cards = cellContainer.selectAll('.competency').data(data);
    cards
      .enter()
      .append('rect')
      .attr('x', d => (d.xAxisSeq - 1) * cellWidth)
      .attr('y', d => (d.yAxisSeq - 1) * cellHeight)
      .attr('copy-yaxis', d => (d.yAxisSeq - 1) * cellHeight)
      .attr('class', d => {
        let skylineClassName = d.skyline ? 'skyline-competency' : '';
        return `competency ${skylineClassName} competency-${
          d.xAxisSeq
        } competency-${d.xAxisSeq}-${d.yAxisSeq}`;
      })
      .attr('copy-class-name', d => {
        let skylineClassName = d.skyline ? 'skyline-competency' : '';
        return `competency ${skylineClassName} competency-${
          d.xAxisSeq
        } competency-${d.xAxisSeq}-${d.yAxisSeq}`;
      })
      .attr('width', cellWidth)
      .attr('height', cellHeight)
      .attr('yaxis-seq', d => d.yAxisSeq)
      .on('click', function(d) {
        let competencyNode = component.$(
          `.competency-${d.xAxisSeq}-${d.yAxisSeq}`
        );
        let className = competencyNode.attr('class');
        if (className.indexOf('competency-more-cells') < 0) {
          component.blockChartContainer(d);
          component.sendAction('onCompetencyPullOut', d);
        }
      })
      .merge(cards)
      .style('fill', '#EAEAEA')
      .transition()
      .duration(1000)
      .style('fill', d => {
        return colorsBasedOnStatus.get(d.status.toString());
      });
    cards.exit().remove();
    component.reduceChartHeight();
  },

  loadDataBySubject(subjectId) {
    let component = this;
    let userId = component.get('userId');
    component.set('isLoading', true);
    return Ember.RSVP.hash({
      competencyMatrixs: component
        .get('competencyService')
        .getCompetencyMatrixDomain(userId, subjectId),
      competencyMatrixCoordinates: component
        .get('competencyService')
        .getCompetencyMatrixCoordinates(subjectId)
    }).then(({ competencyMatrixs, competencyMatrixCoordinates }) => {
      component.set('isLoading', false);
      let resultSet = component.parseCompetencyData(
        competencyMatrixs,
        competencyMatrixCoordinates
      );
      component.drawChart(resultSet);
    });
  },

  parseCompetencyData(competencyMatrixs, competencyMatrixCoordinates) {
    let component = this;
    const cellHeight = component.get('cellHeight');
    let taxonomyDomain = Ember.A();
    let domains = competencyMatrixCoordinates.get('domains');
    let currentXaxis = 1;
    let resultSet = Ember.A();
    let numberOfCellsInEachColumn = Ember.A();
    domains.forEach(domainData => {
      let domainCode = domainData.get('domainCode');
      let domainName = domainData.get('domainName');
      let domainSeq = domainData.get('domainSeq');
      let competencyMatrix = competencyMatrixs.findBy('domainCode', domainCode);
      let competencyMatrixByCompetency = competencyMatrix
        ? competencyMatrix.get('competencies')
        : [];
      if (competencyMatrix && competencyMatrixByCompetency.length > 0) {
        taxonomyDomain.pushObject(domainData);
        let mergeDomainData = Ember.A();
        competencyMatrixByCompetency.forEach(competency => {
          let competencyCode = competency.get('competencyCode');
          let competencyName = competency.get('competencyName');
          let competencySeq = competency.get('competencySeq');
          let status = competency.get('status');
          let data = Ember.Object.create({
            domainName: domainName,
            domainCode: domainCode,
            domainSeq: domainSeq,
            competencyCode: competencyCode,
            competencyName: competencyName,
            competencySeq: competencySeq,
            status: status
          });
          if (status === 2 || status === 3 || status === 4 || status === 5) {
            mergeDomainData.forEach(data => {
              data.set('status', status);
              data.set('isMastery', true);
            });
            data.set('isMastery', true);
          }
          mergeDomainData.pushObject(data);
        });
        let masteredCompetencies = mergeDomainData.filterBy('isMastery', true);
        if (masteredCompetencies && masteredCompetencies.length === 0) {
          mergeDomainData.objectAt(0).set('skyline', true);
        } else {
          let numberOfMasteredCompetency = masteredCompetencies.length - 1;
          mergeDomainData
            .objectAt(numberOfMasteredCompetency)
            .set('skyline', true);
          mergeDomainData
            .objectAt(numberOfMasteredCompetency)
            .set('mastered', true);
        }

        let cellIndex = 1;
        numberOfCellsInEachColumn.push(mergeDomainData.length);
        mergeDomainData.forEach(data => {
          data.set('xAxisSeq', currentXaxis);
          data.set('yAxisSeq', cellIndex);
          resultSet.pushObject(data);
          cellIndex++;
        });
        currentXaxis = currentXaxis + 1;
      }
    });
    let height = cellHeight * Math.max(...numberOfCellsInEachColumn);
    component.set('height', height);
    component.set('taxonomyDomains', taxonomyDomain);
    return resultSet;
  },

  blockChartContainer(selectedCompetency) {
    let component = this;
    const cellWidth = component.get('cellWidth');
    const cellHeight = component.get('cellHeight');
    const width = component.get('width');
    let selectedElement = component.$(
      `.competency-${selectedCompetency.xAxisSeq}-${
        selectedCompetency.yAxisSeq
      }`
    );
    let xAxisSeq = selectedElement.attr('x');
    let yAxisSeq = selectedElement.attr('y');
    const colorsBasedOnStatus = component.get('colorsBasedOnStatus');
    let color = colorsBasedOnStatus.get(selectedCompetency.status.toString());
    component.$('.block-container').remove();
    let container = `<div class="block-container" style="width:${width}px">`;
    container += `<div class="selected-competency"  style="width:${cellWidth}px; height:${cellHeight}px; background-color:${color};top:${yAxisSeq}px; left:${xAxisSeq}px"></div>`;
    container += '</div>';
    component.$('#competency-matrix-domain-chart').prepend(container);
  },

  reduceChartBelowCells() {
    let component = this;
    let skylines = component.$('.skyline-competency');
    let maxNumberOfCellsInEachColumn = component.get(
      'maxNumberOfCellsInEachColumn'
    );
    let reducedHeightOfCells = component.get('reducedHeightOfCells');
    let cellHeight = component.get('cellHeight');
    let maxNumberOfReduceCellBelow = component.get(
      'maxNumberOfReduceCellBelow'
    );
    for (let index = 0; index < skylines.length; index++) {
      let skyline = component.$(skylines[index]);
      let skylineYAxisSeq = +skyline.attr('yaxis-seq');
      if (skylineYAxisSeq > maxNumberOfCellsInEachColumn) {
        let aboveMaxCells = skylineYAxisSeq - maxNumberOfCellsInEachColumn;
        let domainColumnIndex = index + 1;
        let competencyCells = component.$(`.competency-${domainColumnIndex}`);
        let belowReduceCount = 1;
        let yAxis = 0;
        for (
          let cellIndex = 0;
          cellIndex < competencyCells.length;
          cellIndex++
        ) {
          let element = component.$(competencyCells[cellIndex]);
          let height = cellHeight;
          if (belowReduceCount < aboveMaxCells) {
            height = reducedHeightOfCells;
          }
          if (cellIndex > 0) {
            if (belowReduceCount <= aboveMaxCells) {
              if (belowReduceCount > maxNumberOfReduceCellBelow) {
                yAxis = yAxis + 0;
              } else {
                yAxis = yAxis + reducedHeightOfCells;
              }
              let className = element.attr('class');
              element.attr(
                'class',
                `${className} competency-more-cells-${domainColumnIndex} competency-more-cells`
              );
              belowReduceCount++;
            } else {
              yAxis = yAxis + cellHeight;
            }
          }
          element.attr('y', yAxis);
          element.attr('height', height);
        }
      }
    }
  },

  reduceChartAboveCells() {
    let component = this;
    let numberOfDomainColumn = component.get('taxonomyDomains').length;
    let maxNumberOfCellsInEachColumn = component.get(
      'maxNumberOfCellsInEachColumn'
    );
    let reducedHeightOfCells = component.get('reducedHeightOfCells');
    for (let index = 1; index <= numberOfDomainColumn; index++) {
      let elements = component.$(`.competency-${index}`);
      let totalCompetencyInDomain = elements.length;
      let belowReducedCellElements = component.$(
        `.competency-more-cells-${index}`
      );
      let numberOfBelowReducedCells = belowReducedCellElements.length;
      let totalCellsWithoutReduce =
        totalCompetencyInDomain - numberOfBelowReducedCells;
      if (totalCellsWithoutReduce > maxNumberOfCellsInEachColumn) {
        let aboveReduceCellIndex =
          numberOfBelowReducedCells > 0
            ? numberOfBelowReducedCells + maxNumberOfCellsInEachColumn
            : maxNumberOfCellsInEachColumn;
        let startIndex = aboveReduceCellIndex + 1;
        let startElement = component.$(`.competency-${index}-${startIndex}`);
        let newYAxis = +startElement.attr('y');
        for (
          let cellIndex = aboveReduceCellIndex;
          cellIndex < elements.length;
          cellIndex++
        ) {
          let element = component.$(elements[cellIndex]);
          element.attr('height', reducedHeightOfCells);
          if (cellIndex > aboveReduceCellIndex) {
            newYAxis = newYAxis + reducedHeightOfCells;
            element.attr('y', newYAxis);
          }
          let className = element.attr('class');
          element.attr(
            'class',
            `${className} competency-more-cells-${index} competency-more-cells`
          );
        }
      }
    }
  },

  reduceChartHeight() {
    let component = this;
    component.reduceChartBelowCells();
    component.reduceChartAboveCells();
    component.drawSkyline();
    let height = component.get('isTaxonomyDomains')
      ? component.get('defaultHeightOfChart')
      : 50;
    component.$('#competency-matrix-domain-chart').height(height);
    component.$('#competency-matrix-domain-chart svg').attr('height', height);
  },

  expandChartColumnHeight() {
    let component = this;
    let elements = component.$('.competency');
    for (let index = 0; index < elements.length; index++) {
      let element = component.$(elements[index]);
      let cellHeight = component.get('cellHeight');
      let yAxis = element.attr('copy-yaxis');
      let className = element.attr('copy-class-name');
      element.attr('height', cellHeight);
      element.attr('class', className);
      element.attr('y', yAxis);
    }
    component.drawSkyline();
    let height = component.get('height');
    component.$('#competency-matrix-domain-chart').height(height);
    component.$('#competency-matrix-domain-chart svg').attr('height', height);
  },

  drawSkyline() {
    let component = this;
    let isSkylineEnabled = component.get('isSkylineEnabled');
    let skylineElements = component.$('.skyline-competency');
    let indexSize = component.$(skylineElements).length;
    let cellWidth = component.get('cellWidth');
    let cellHeight = component.get('cellHeight');
    component.$('circle').remove();
    component.$('line').remove();
    let svg = component.get('skylineContainer');
    let className = isSkylineEnabled ? '' : 'disable-skyline';
    skylineElements.each(function(index) {
      let x1 =
        parseInt(component.$(skylineElements[index]).attr('x')) + cellWidth / 2;
      let y1 = parseInt(component.$(skylineElements[index]).attr('y'));
      y1 = y1 === 0 ? y1 + 3 : y1 + cellHeight / 2;
      if (index < indexSize - 1) {
        let x2 =
          parseInt(component.$(skylineElements[index + 1]).attr('x')) +
          cellWidth / 2;
        let y2 = parseInt(component.$(skylineElements[index + 1]).attr('y'));
        y2 = y2 === 0 ? y2 + 3 : y2 + cellHeight / 2;
        svg
          .append('line')
          .attr('x1', x1)
          .attr('y1', y1)
          .attr('x2', x2)
          .attr('y2', y2)
          .attr('class', `skyline ${className}`);
      }
      svg
        .append('circle')
        .attr('cx', x1)
        .attr('cy', y1)
        .attr('r', 3)
        .attr('fill', '#fff')
        .attr('class', `skyline ${className}`);
    });
  }
});
