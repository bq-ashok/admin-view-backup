import Ember from 'ember';

/**
 * RGO pull out components
 *
 * Component responsible for generating the selekton pull out component,
 * which  have header, footer(Optional), title, close button and more info(Optional).
 * @augments ember/Component
 * see the sample usage below
 * {{#app-pull-out showPullOut=showPullOut title=title  description=description  showMore=true  as |section| }}
 * {{#if section.isLessContent}}
 * {{custom-less-info-component}}
 * {{else if section.isMoreContent}}
 * {{custom-more-info-component}}
 * {{/if}}
 * {{/app-pull-out}}
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['app-pull-out'],

  classNameBindings: ['showLess:app-pull-out-more'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Action triggered when the user invoke the pull out.
     */
    onPullOutOpen() {
      this.set('showPullOut', true);
    },

    /**
     * Action triggered when the user click's the more info button.
     */
    showMoreInfo() {
      let component = this;
      component.$().animate(
        {
          right: '0'
        },
        {
          complete: function() {
            component.toggleProperty('showMore');
            component.toggleProperty('showLess');
          }
        }
      );
    },

    /**
     * Action triggered when the user click's the less info button.
     */
    showLessInfo() {
      let component = this;
      const right = 460 - component.$().width();
      component.$().animate(
        {
          right: `${right}px`
        },
        {
          complete: function() {
            component.toggleProperty('showMore');
            component.toggleProperty('showLess');
            component.$().css('right', 'calc(460px - 100%)');
          }
        }
      );
    },

    /**
     * Action triggered when the user close the pull out
     */
    onPullOutClose() {
      this.set('showMore', false);
      this.set('showLess', false);
      this.set('showPullOut', false);
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * It indicates the display  status of show more action button.
   * @type {Boolean}
   */
  showMore: false,

  /**
   * It indicates the display  status of show more action button
   * @type {Boolean}
   */
  showLess: false,

  lessContent: {
    isLessContent: true
  },

  moreContent: {
    isMoreContent: true
  },

  showPullOut: false,

  //--------------------------------------------------------------------------
  // Observer
  //
  onChange: Ember.observer('showPullOut', function() {
    if (this.get('showPullOut')) {
      let component = this;
      const right = 460 - component.$().width();
      component.$().removeClass('app-pull-out-hidden');
      component.$().animate(
        {
          right: `${right}px`
        },
        {
          complete: function() {
            component.$().css('right', 'calc(460px - 100%)');
          }
        }
      );
    } else {
      let component = this;
      component.$().animate(
        {
          right: '-101%'
        },
        {
          complete: function() {
            component.$().addClass('app-pull-out-hidden');
          }
        }
      );
    }
  })
});
