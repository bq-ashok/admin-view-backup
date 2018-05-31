/**
 * Collapsible Tree
 *
 * Component responsible for showing the collapsible tree view for given data.
 *
 * @module
 * @augments ember/Component
 */
import Ember from 'ember';
import d3 from 'd3';
import { DEFAULT_IMAGES } from 'admin-dataview/config/config';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['taxonomy-tree-view'],

  // -------------------------------------------------------------------------
  // Events

  didInsertElement() {
    const $component = this.$();

    // Get the component dimensions from the css
    this.setProperties({
      height: parseInt($component.height()),
      width: parseInt($component.width())
    });
    // Render the tree view
    this.renderTreeView();
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
   * @property {Object} margin
   * @return {Object}
   */
  margin: Ember.computed(function() {
    let margin = Ember.Object.create({
      top: 20,
      right: 120,
      bottom: 20,
      left: 120
    });
    return margin;
  }),

  /**
   * Root node of the tree
   * @type {[type]}
   */
  root: null,

  /**
   * Index value of each nodes
   * @type {Number}
   */
  index: 0,

  /**
   * Tree node links animation duration.
   * @type {Number}
   */
  duration: 0,

  /**
   * switch button enabled
   * @type {boolean}
   */
  isZoomEnabled: false,

  /**
   * default Zooming view scale size
   * @type {float}
   */
  zoomScale: 0.9,

  /**
   * dynamic Zooming  position maintain
   * @type {Number}
   */
  svgPostion: 0,

  /**
   * default  taxonomy call height as equal to svg
   * @type {Number}
   */
  taxonomyHeight: 450,

  /**
   * Trigger whenever skyline toggle state got changed.
   */
  onChangeZoomToggle: Ember.observer('isZoomEnabled', function() {
    let component = this;
    let isZoomEnabled = component.get('isZoomEnabled');
    let treeElement = $('.taxonomy-tree-view').position();
    let svgElement = $('.taxonomy-tree-view  svg').position();
    let svgHeight = $('.taxonomy-tree-view  svg').height() / 2;
    let positionSvg = Math.abs(svgElement.top - treeElement.top);
    let svg = d3.select(component.element).select('svg');
    component.set('zoomScale', component.getScaleLevel(svgHeight));
    if (isZoomEnabled) {
      let scale = component.get('zoomScale');
      svg
        .attr('transform', `scale(${scale},${scale})`)
        .attr('transform-origin', `300 ${Math.round(positionSvg)}`);
    } else {
      component.set('zoomScale', 0.9);
      let scale = component.get('zoomScale');
      svg.attr('transform', `scale(${scale},${scale})`);
    }
  }),

  // -------------------------------------------------------------------------
  // Methods

  renderTreeView() {
    let component = this;
    let height = component.get('height');
    let treeData = this.get('data');
    let root = d3.hierarchy(treeData, function(d) {
      return d.children;
    });
    root.x0 = height / 2;
    root.y0 = 0;
    /**
     * collapse the tree node
     */
    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }
    root.children.forEach(collapse);
    component.set('root', root);
    this.update(root, 0);
    let children = root.children[0];
    let node = root.children[0];
    component.sendAction('onClickNode', node, component);
    if (!node.children) {
      component.appendLoader(children.data.id);
    }
  },

  update(source, depth) {
    let component = this;
    let duration = component.get('duration');
    let width = component.get('width');
    let margin = component.get('margin');
    let root = component.get('root');

    // compute the new height
    let levelWidth = [1];
    let childCount = function(level, n) {
      if (n.children && n.children.length > 0) {
        if (levelWidth.length <= level + 1) {
          levelWidth.push(0);
        }
        levelWidth[level + 1] += n.children.length;
        n.children.forEach(function(d) {
          childCount(level + 1, d);
        });
      }
    };
    childCount(0, root);

    let newHeight =
      d3.max(levelWidth) * component.normalizeHeightBasedOnDepth(depth);

    let treemap = d3.tree().size([newHeight, width]);

    let treeData = treemap(component.get('root'));
    let nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

    d3.select('svg').remove();
    let svg = d3.select(component.element).append('svg');
    let positionSvg = 0;
    let scale = component.get('zoomScale');
    let rootNode = svg
      .attr('width', width + margin.right + margin.left)
      .attr('height', newHeight + margin.top + margin.bottom)
      .attr('transform', `scale(${scale},${scale})`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    if (component.get('isZoomEnabled')) {
      let svgElement = $('.taxonomy-tree-view  svg').position();
      let treeElement = $('.taxonomy-tree-view').position();
      positionSvg = Math.abs(treeElement.top - svgElement.top);
      let svgHeight = $('.taxonomy-tree-view svg').height() / 2;
      svgHeight = Math.round(svgHeight);
      positionSvg = positionSvg <= 70 ? positionSvg : 70;
      component.set('zoomScale', component.getScaleLevel(svgHeight));
      let scale = component.get('zoomScale');
      scale = scale ? scale : '0.1';
      svg.attr('transform-origin', `300 ${positionSvg}`);
      svg.attr('transform', `scale(${scale},${scale})`);
    }

    nodes.forEach(function(d) {
      d.y = d.depth * component.normalizeYPositionBasedOnDepth(d.depth);
    });

    let node = rootNode.selectAll('g.node').data(nodes, function(d) {
      let index = component.get('index');
      component.set('index', ++index);
      return d.id || (d.id = component.get('index'));
    });

    /**
     * Click handling on when each node get choosed
     */
    function click(d) {
      if (d.depth > 1 && d.data.hasChild) {
        component.appendLoader(d.data.id);
        if (d.children) {
          d._children = d.children;
          d.children = null;
          component.update(d, d.depth);
        } else {
          component.sendAction('onClickNode', d, component);
        }
      } else if (d.depth === 1 && d.data.hasChild && !d.children) {
        let root = component.get('root');
        let children = root.children;
        for (let index = 0; index < children.length; index++) {
          let node = children[index];
          if (node.children) {
            node._children = node.children;
            node.children = null;
          }
          children[index] = node;
        }
        component.appendLoader(d.data.id);
        if (d.children) {
          d._children = d.children;
          d.children = null;
          component.update(d, d.depth);
        } else {
          component.sendAction('onClickNode', d, component);
        }
      }
    }

    /**
     * Event get triggered when more info button got clicked
     * @param  {Node} d selected node
     */
    function onMoreInfoClick(d) {
      component.updateMoreInfoActiveNodes(d.data.id);
      component.sendAction('onClickNodeMoreInfo', d);
      d3.event.stopPropagation();
    }

    let nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'node')
      .on('click', click);

    let nodeText = nodeEnter
      .append('svg:foreignObject')
      .attr('text-anchor', function(d) {
        return d.children || d._children ? 'end' : 'start';
      })
      .style('fill-opacity', 1e-6)
      .attr('width', 250)
      .attr('height', 38)
      .append('xhtml:div')
      .attr('class', function(d) {
        let hasChildClass = d.data.hasChild ? '' : ' node-no-child';
        let id = ` node-label-${d.data.id.replace(/\./g, 's')}`;
        return `${'node-label node-'}${d.depth}${hasChildClass}${id}`;
      });

    //Node label
    nodeText
      .append('xhtml:div')
      .attr('class', 'node-text')
      .text(function(d) {
        return component.truncateString(d.data.name);
      });

    nodeText
      .append('xhtml:div')
      .attr('class', 'node-more-info')
      .append('i')
      .attr('class', 'ic_info_outline material-icons')
      .text('ic_info_outline')
      .on('click', onMoreInfoClick);

    let nodeUpdate = nodeEnter.merge(node);

    nodeUpdate
      .transition()
      .duration(duration)
      .attr('transform', function(d) {
        let sourceY =
          d.y + component.normalizeYPositionBasedOnDepth(d.depth - 1);
        let sourceX = d.x - 20;
        return `translate(${sourceY},${sourceX})`;
      });

    node
      .exit()
      .transition()
      .duration(duration)
      .attr('transform', function(d) {
        let sourceY =
          source.y + component.normalizeYPositionBasedOnDepth(d.depth);
        let sourceX = d.x - 20;
        return `translate(${sourceY},${sourceX})`;
      })
      .remove();

    let link = rootNode.selectAll('path.link').data(links, function(d) {
      return d.id;
    });
    /**
     * Generates the diagonal path
     */
    function diagonal(s, d) {
      let sourceX = s.x;
      let sourceY = s.y + component.normalizeYPositionBasedOnDepth(d.depth);
      let selectedNodeX = d.x;
      let selectedNodeY =
        d.y +
        component.normalizeYPositionBasedOnDepth(d.depth) +
        component.normalizePathPositionBasedOnDepth(d.depth);
      let path = `M ${sourceY} ${sourceX}
              C ${(sourceY + selectedNodeY) / 2} ${sourceX},
                ${(sourceY + selectedNodeY) / 2} ${selectedNodeX},
                ${selectedNodeY} ${selectedNodeX}`;

      return path;
    }

    let linkEnter = link
      .enter()
      .insert('path', 'g')
      .attr('class', function(d) {
        let id = d.data.id.replace(/\./g, 's');
        return `${'link link-'}${id}${' link-'}${d.depth}`;
      })
      .attr('copyclass', function(d) {
        let id = d.data.id.replace(/\./g, 's');
        return `${'link link-'}${id}${' link-'}${d.depth}`;
      })
      .attr('d', function() {
        var o = {
          x: source.x0,
          y: source.y0
        };
        return diagonal(o, o);
      });

    let linkUpdate = linkEnter.merge(link);

    linkUpdate
      .transition()
      .duration(duration)
      .attr('d', function(d) {
        return diagonal(d, d.parent);
      });

    link
      .exit()
      .transition()
      .duration(duration)
      .attr('d', function() {
        var o = {
          x: source.x,
          y: source.y
        };
        return diagonal(o, o);
      })
      .remove();

    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
    if (depth === 1) {
      component.$('.node-1').removeClass('disable-events');
      component.$(`.node-label-${source.data.id}`).addClass('disable-events');
    }
    let newLevelWidth =
      component.getWidthByTreeDepth() + margin.right + margin.left;
    svg.attr('width', newLevelWidth);
  },

  data: null,

  updateData(selectedNode, newNodes) {
    let component = this;

    if (!selectedNode.children) {
      var childArray = [];
    }

    selectedNode.height = selectedNode.height + 1;

    newNodes.forEach(function(d) {
      var obj = d3.hierarchy(d);
      obj.data.parent = selectedNode.name;
      obj.depth = selectedNode.depth + 1;
      obj.parent = selectedNode;
      obj.name = d.name;
      childArray.push(obj);
    });
    selectedNode.children = childArray;

    component.update(selectedNode, selectedNode.depth);
  },

  normalizeHeightBasedOnDepth(depth) {
    if (depth === 0 || depth === 1) {
      return 45;
    } else if (depth === 2) {
      return 60;
    } else if (depth === 3 || depth === 4) {
      return 65;
    } else if (depth === 5) {
      return 72;
    } else if (depth === 6) {
      return 75;
    }
  },

  normalizeYPositionBasedOnDepth(depth) {
    if (depth >= 0) {
      if (depth === 1) {
        return 110;
      } else if (depth === 2) {
        return 130;
      } else if (depth === 3) {
        return 160;
      } else if (depth === 4) {
        return 175;
      } else if (depth === 5) {
        return 200;
      } else if (depth === 6) {
        return 210;
      }
    }
    return 0;
  },

  normalizePathPositionBasedOnDepth(depth) {
    if (depth >= 0) {
      if (depth === 0) {
        return 0;
      } else if (depth === 1) {
        return 65;
      } else if (depth === 2) {
        return 155;
      } else if (depth === 3) {
        return 145;
      } else if (depth === 4) {
        return 230;
      } else if (depth === 5) {
        return 220;
      }
    }
    return 0;
  },

  updateMoreInfoActiveNodes(id) {
    let component = this;
    id = id.replace(/\./g, 's');
    component.$('svg g path.link').each(function(index, element) {
      let replaceClass = component.$(element).attr('copyclass');
      component.$(element).attr('class', replaceClass);
    });
    component.$('.node-label').removeClass('selected');
    component.$(`.node-label-${id}`).addClass('selected');
    let ids = id.split('-');
    for (let index = 0; index < ids.length; index++) {
      let newId = '';
      for (let nextIndex = 0; nextIndex <= index; nextIndex++) {
        if (nextIndex > 0) {
          newId = `${newId}-${ids[nextIndex]}`;
        } else {
          newId = newId + ids[nextIndex];
        }
      }
      component
        .$(`svg g path.link-${newId}`)
        .attr('class', `selected link link-${newId}`);
    }
  },

  truncateString(text) {
    if (text.length > 74) {
      return `${text.substring(0, 70)}...`;
    }
    return text;
  },

  appendLoader(id) {
    let component = this;
    id = id.replace(/\./g, 's');
    component.$(`.node-label-${id} .node-more-info`).hide();
    component
      .$(`.node-label-${id}`)
      .append(`<div class="loader"><img src="${DEFAULT_IMAGES.LOADER}"></div>`);
  },

  getWidthByTreeDepth() {
    let component = this;
    let width = 800;
    let nodeLabel = component.$('.node-label');
    if (nodeLabel) {
      if (nodeLabel.hasClass('node-6')) {
        width = 1600;
      } else if (nodeLabel.hasClass('node-5')) {
        width = 1350;
      } else if (nodeLabel.hasClass('node-4')) {
        width = 1200;
      }
    }
    return width;
  },

  getScaleLevel(svgHeight) {
    if (svgHeight < 500) {
      return 0.5;
    } else if (svgHeight < 1000) {
      return 0.2;
    } else if (svgHeight > 1000) {
      return 0.1;
    }
  }
});
