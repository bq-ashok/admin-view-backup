import Ember from 'ember';
import { CENTURY_SKILLS_GROUPS } from 'admin-dataview/config/config';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['century-skills-content'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * select or not the skill item.
     * @function actions:selectSkillItem
     * @param {CenturySkill} skillItem
     */
    selectSkillItem: function(skillItem, groupType) {
      let component = this;
      let selectedCenturySkills = component.get('tempSelectedCenturySkills');
      let skillItemId = skillItem.id;
      let skillItemIndex = selectedCenturySkills.findIndex(function(centurySkill) {
        return centurySkill.label === skillItem.label;
      });
      if (skillItemIndex > -1) {
        selectedCenturySkills.splice(skillItemIndex, 1);
      } else {
        selectedCenturySkills.push(skillItem);
      }
      component.set('tempSelectedCenturySkills', selectedCenturySkills);
      component.$(`.${groupType}-skills .skills .title.${skillItemId}`).toggleClass('selected');
    },

    saveSelectedSkills() {
      let component = this;
      var selectedCenturySkills = component.get('tempSelectedCenturySkills');
      component.get('onSave')(selectedCenturySkills);
    }
  },

  // -------------------------------------------------------------------------
  // Events

  init() {
    let component = this;
    component._super(...arguments);

    var tempSelectedCenturySkills = component.get('selectedCenturySkills');
    if (tempSelectedCenturySkills) {
      this.set('tempSelectedCenturySkills', tempSelectedCenturySkills);
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    this.set('centurySkills', null);
    this.set('selectedCenturySkills', null);
    this.set('tempSelectedCenturySkills', null);
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * List of Century Skills
   * @prop {CenturySkill[]}
   */
  centurySkills: Ember.A([]),

  /**
   * List of temp selected Century Skills ids
   * @prop {Number[]}
   */
  tempSelectedCenturySkills: Ember.A([]),

  /**
   * List of selected Century Skills
   * @prop {CenturySkill[]}
   */
  selectedCenturySkills: Ember.A([]),

  /**
   * @property {centurySkill[]} cognitive group of century skills
   */
  cognitiveSkillsGroup: Ember.computed(
    'centurySkills.[]',
    'tempSelectedCenturySkills.[]',
    function() {
      let component = this;
      let selectedCenturySkills = component.get('tempSelectedCenturySkills');
      return component.get('centurySkills').filter(function(centurySkill) {
        let skillPosition = selectedCenturySkills.findIndex(function(selectedSkill) {
          return selectedSkill.label === centurySkill.label;
        });
        centurySkill.isSelected = skillPosition > -1;
        return (
          centurySkill.group ===
          CENTURY_SKILLS_GROUPS.KEY_COGNITIVE_SKILLS_AND_STRATEGIES
        );
      });
    }
  ),

  /**
   * @property {centurySkill[]} content group of century skills
   */
  contentSkillsGroup: Ember.computed(
    'centurySkills.[]',
    'tempSelectedCenturySkills.[]',
    function() {
      let component = this;
      return component.get('centurySkills').filter(function(centurySkill) {
        return (
          centurySkill.group ===
          CENTURY_SKILLS_GROUPS.KEY_CONTENT_KNOWLEDGE
        );
      });
    }
  ),

  /**
   * @property {centurySkill[]} learning group of century skills
   */
  learningSkillsGroup: Ember.computed(
    'centurySkills.[]',
    'tempSelectedCenturySkills.[]',
    function() {
      let component = this;
      return component.get('centurySkills').filter(function(centurySkill) {
        return (
          centurySkill.group ===
          CENTURY_SKILLS_GROUPS.KEY_LEARNING_SKILLS_AND_TECHNIQUES
        );
      });
    }
  )
});
