import Ember from 'ember';
import { CENTURY_SKILLS_GROUPS } from 'admin-dataview/config/config';

/**
 * Serializer for Lookup endpoints
 *
 * @typedef {Object} LookupSerializer
 */
export default Ember.Object.extend({

  normalizeReadAudiences: function(payload) {
    let normalizedAudiences = Ember.A();
    if (Ember.isArray(payload.audience)) {
      payload.audience.map(audience => {
        let audienceData = {
          label: audience.label,
          sequence_id: audience.sequence_id,
          id: audience.id
        };
        normalizedAudiences.push(audienceData);
      });
    }
    return normalizedAudiences;
  },

  normalizeReadLicenses: function(payload) {
    let normalizedLicenses = Ember.A();
    let licenses = payload.license;
    if (Ember.isArray(licenses)) {
      licenses.map(license => {
        let licenseData = {
          label: license.label,
          sequence_id: license.sequence_id,
          id: license.id,
          code: license.info ? license.info.license.code || '' : ''
        };
        normalizedLicenses.push(licenseData);
      });
    }
    return normalizedLicenses;
  },

  normalizeReadDepthOfKnowledgeItems: function(payload) {
    let normalizedDok = Ember.A();
    let dokItems = payload.depth_of_knowledge;
    if (Ember.isArray(dokItems)) {
      dokItems.map(dok => {
        let dokData = {
          label: dok.label,
          sequence_id: dok.sequence_id,
          id: dok.id
        };
        normalizedDok.push(dokData);
      });
    }
    return normalizedDok;
  },

  /**
   * Normalize the century skills endpoint response
   * @param payload The endpoint response in JSON format
   * @returns {CenturySkill[]} a list of century skill model objects
   */
  normalizeCenturySkills: function(payload) {
    const serializer = this;
    let centurySkills = payload['21_century_skills'];
    let cognitiveSkillsGroup =
      centurySkills[CENTURY_SKILLS_GROUPS.KEY_COGNITIVE_SKILLS_AND_STRATEGIES];
    let contentSkillsGroup =
      centurySkills[CENTURY_SKILLS_GROUPS.KEY_CONTENT_KNOWLEDGE];
    let learningSkillsGroup =
      centurySkills[CENTURY_SKILLS_GROUPS.KEY_LEARNING_SKILLS_AND_TECHNIQUES];
    let normalizedCenturySkills = [];

    cognitiveSkillsGroup.forEach(function(cognitiveSkill) {
      normalizedCenturySkills.push(
        serializer.normalizeReadCenturySkillInfo(
          cognitiveSkill,
          CENTURY_SKILLS_GROUPS.KEY_COGNITIVE_SKILLS_AND_STRATEGIES
        )
      );
    });

    contentSkillsGroup.forEach(function(contentSkill) {
      normalizedCenturySkills.push(
        serializer.normalizeReadCenturySkillInfo(
          contentSkill,
          CENTURY_SKILLS_GROUPS.KEY_CONTENT_KNOWLEDGE
        )
      );
    });

    learningSkillsGroup.forEach(function(learningSkill) {
      normalizedCenturySkills.push(
        serializer.normalizeReadCenturySkillInfo(
          learningSkill,
          CENTURY_SKILLS_GROUPS.KEY_LEARNING_SKILLS_AND_TECHNIQUES
        )
      );
    });

    return normalizedCenturySkills;
  },

  /**
   * Normalize the Read Century Skill info endpoint response
   *
   * @param payload is the endpoint response in JSON format
   * @param {String} group of century skill
   * @returns {CenturySkillModel} a centurySkill model object
   */
  normalizeReadCenturySkillInfo: function(payload, group = null) {
    return {
      id: payload.id,
      label: payload.label,
      hewlettDeepLearningModel: payload.hewlett_deep_learning_model,
      conleyFourKeysModel: payload.conley_four_keys_model,
      p21FrameworkModel: payload.p21_framework_model,
      nationalResearchCenterModel: payload.national_research_center_model,
      group: group
    };
  }
});
