import Ember from 'ember';
import TaxonomyItem from 'admin-dataview/models/taxonomy/taxonomy-item';
import BrowseItem from 'admin-dataview/models/taxonomy/browse-item';
import {
  TAXONOMY_CATEGORIES
} from 'admin-dataview/config/config';

/**
 * Generates a taxonomy tree data structure for testing
 * @param {Number} levels - total number of parent/children levels in the tree
 * @param {TaxonomyItem} parent - parent item for all the items created in the current level
 * @param {Number} inc - number by which the number of items in each level will increase
 * @param {Number} currentLevel - current tree level being built (starts at 1)
 * @return {TaxonomyItem[][] ...} - the list of taxonomy items in the first level
 */
export function generateTaxonomyTestTree(
  levels = 1,
  parent = null,
  inc = 1,
  currentLevel = 1
) {
  var totalItems = currentLevel * inc;
  var items = [];

  if (currentLevel <= levels) {
    for (let i = 0; i < totalItems; i++) {
      let parentId = parent ? parent.get('id') : '0';
      let parentIdNum = parentId.charAt(parentId.length - 1);
      let itemId = currentLevel + parentIdNum + i;

      let taxonomyItem = TaxonomyItem.create({
        id: `${parentId}-${itemId}`,
        code: `Code : ${currentLevel} : ${parentIdNum} : ${i}`,
        title: `Item : ${currentLevel} : ${parentIdNum} : ${i}`,
        level: currentLevel,
        parent: parent
      });

      generateTaxonomyTestTree(levels, taxonomyItem, inc, currentLevel + 1);
      items.push(taxonomyItem);
    }

    if (parent) {
      // Link all items to parent
      parent.set('children', items);
    }

    return items;
  }
}

/**
 * Generates a tree data structure for testing the browse selector (@see gru-browse-selector)
 * @param {Number} levels - total number of parent/children levels in the tree
 * @param {Number} lastLevels - number of sub-levels in the last level of the tree
 * @param {Number} inc - number by which the number of items in each level will increase
 * @return {BrowseItem[][] ...} - the list of browse items in the first level
 */
export function generateBrowseTestTree(levels = 1, lastLevels = 0, inc = 1) {
  const startLevel = 1;
  var browseItems = [];

  var taxonomyItems = generateTaxonomyTestTree(
    levels + lastLevels,
    null,
    inc,
    startLevel
  );

  taxonomyItems.forEach(function(rootTaxonomyItem) {
    var item = BrowseItem.createFromTaxonomyItem(
      rootTaxonomyItem,
      levels + lastLevels
    );
    browseItems.push(item);
  });

  return browseItems;
}

/**
 * Gets a category object from a subjectId
 * @param {String} subjectId - The subject id with the format 'CCSS.K12.Math'
 * @return {Object} - An object with the category information
 */
export function getCategoryFromSubjectId(subjectId) {
  let categoryCode = subjectId.split('.')[0];
  let categories = Ember.A(TAXONOMY_CATEGORIES);
  let category = categories.findBy('apiCode', categoryCode);
  if (!category) {
    categoryCode = subjectId.split('.')[1];
    category = categories.findBy('apiCode', categoryCode);
  }
  return category ? category : null;
}


/**
 * Parse and read category id for given string
 * @param  {String} id
 * @return {String}
 */
export function getCategoryId(id) {
  return id.substring(0, id.indexOf('.'));
}

/**
 * Parse and read subject id for given string
 * @param  {String} id
 * @return {String}
 */
export function getSubjectId(id) {
  return id.substring(0, id.indexOf('-'));
}

/**
 * Parse and read course id for given string
 * @param  {String} id
 * @return {String}
 */
export function getCourseId(id) {
  let ids = id.split('-');
  return `${ids[0]  }-${  ids[1]}`;
}

/**
 * Parse and read domain id for given string
 * @param  {String} id
 * @return {String}
 */
export function getDomainId(id) {
  let ids = id.split('-');
  return `${ids[0]}-${ids[1]}-${ids[2]}`;
}

/**
 * Get selected node information
 * @return {json}
 */
export function getNodeInfo(node) {
  switch (node.depth) {
  case 2:
    return {
      id: node.data.id,
      type: 'subject',
      parent: `${node.parent.data.name  } > ${  node.data.name}`,
      searchValue: node.data.name,
      filters: {
        'flt.subject': node.data.id
      }
    };
  case 3:
    return {
      id: node.data.id,
      type: 'course',
      parent: `${node.parent.parent.data.name  } > ${  node.parent.data.name}`,
      searchValue: node.data.name,
      filters: {
        'flt.subject': node.parent.data.id,
        'flt.course': node.data.id
      }
    };
  case 4:
    return {
      id: node.data.id,
      type: 'domain',
      parent: `${node.parent.parent.parent.data.name} > ${node.parent.parent.data.name} > ${node.parent.data.name}`,
      searchValue: node.data.name,
      filters: {
        'flt.subject': node.parent.parent.data.id,
        'flt.course': node.parent.data.id,
        'flt.domain': node.data.id
      }
    };
  case 5:
    return {
      id: node.data.id,
      type: 'standard',
      parent: `${node.parent.parent.parent.parent.data.name} > ${node.parent.parent.parent.data.name} > ${node.parent.parent.data.name} > ${node.parent.data.name}`,
      title: node.data.title,
      searchValue: node.data.code,
      filters: {
        'flt.subject': node.parent.parent.parent.data.id,
        'flt.course': node.parent.parent.data.id,
        'flt.domain': node.parent.data.id,
        'flt.standardDisplay': node.data.code
      }
    };
  case 6:
    return {
      id: node.data.id,
      type: 'standard',
      parent: `${node.parent.parent.parent.parent.parent.data.name} > ${node.parent.parent.parent.parent.data.name} > ${node.parent.parent.parent.data.name} > ${node.parent.parent.data.name}  > ${node.parent.data.name}`,
      title: node.data.title,
      searchValue: node.data.code,
      filters: {
        'flt.subject': node.parent.parent.parent.parent.data.id,
        'flt.course': node.parent.parent.parent.data.id,
        'flt.domain': node.parent.parent.data.id,
        'flt.standardDisplay': node.data.code
      }
    };
  default:
    return null;
  }
}

/**
 * Get structured content count information
 * @return {json}
 */
export function getStructuredContentData(contentType, contentCount) {
  const usLocale = 'en-US';
  return {
    name: contentType,
    count: contentCount.toLocaleString(usLocale)
  };
}
