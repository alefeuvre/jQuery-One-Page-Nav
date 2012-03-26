/*
 * jQuery One Page Nav Plugin
 * http://github.com/davist11/jQuery-One-Page-Nav
 * rewritten by Antoine Lefeuvre to remove dependencies to ScrollTo and actions on the click
 * http://github.com/alefeuvre/jQuery-One-Page-Nav
 *
 * Copyright (c) 2010 Trevor Davis (http://trevordavis.net)
 * Dual licensed under the MIT and GPL licenses.
 * Uses the same license as jQuery, see:
 * http://jquery.org/license
 *
 * Example usage:
 * $('#nav').onePageNav({
 *   currentClass: 'current'
 * });
 */
;(function($) {
  $.fn.onePageNav = function(options) {
    var opts = $.extend({}, $.fn.onePageNav.defaults, options),
        onePageNav = {};
    
    onePageNav.sections = {};
    
    onePageNav.adjustNav = function($this, $el, curClass) {
      $this.find('.'+curClass).removeClass(curClass);
      $el.addClass(curClass);
    };
    
    onePageNav.getPositions = function($this, o) {
      var $nav = $this.find('a');
      
      if(o.filter !== '') {
        $nav = $nav.filter(o.filter);
      }
      
      $nav.each(function() {
        var linkHref = $(this).attr('href'),
            divPos = $(linkHref).offset(),
            topPos = divPos.top;
            
        onePageNav.sections[linkHref.substr(1)] = Math.round(topPos) - o.scrollOffset;
      });
    };
    
    onePageNav.getSection = function(windowPos, o) {
      var returnValue = '',
          windowHeight = Math.round($(window).height() * o.scrollThreshold);
      
      for(var section in onePageNav.sections) {
        if((onePageNav.sections[section] - windowHeight) < windowPos) {
          returnValue = section;
        }
      }
      return returnValue;
    };
    
    onePageNav.scrollChange = function($this, o) {
      onePageNav.getPositions($this, o);
      
      var windowTop = $(window).scrollTop(),
          position = onePageNav.getSection(windowTop, o);
          
      if(position !== '') {
        onePageNav.adjustNav($this,$this.find('a[href=#'+position+']').parent(), o.currentClass);
      }
    };
    
    onePageNav.init = function($this, o) {
      var didScroll = false,
          $nav = $this.find('a');
      
      if(o.filter !== '') {
        $nav = $nav.filter(o.filter);
      }
    
      onePageNav.getPositions($this, o);
    
      $(window).bind('scroll.onePageNav', function() {
        didScroll = true;
      });

      setInterval(function() {
        if(didScroll) {
          didScroll = false;
          onePageNav.scrollChange($this, o);
        }
      }, 250);
    };
    
    return this.each(function() {
      var $this = $(this),
          o = $.meta ? $.extend({}, opts, $this.data()) : opts;
      
      onePageNav.init($this, o);
    
    });
  };

  // default options
  $.fn.onePageNav.defaults = {
    currentClass: 'current',
    filter: '',
    scrollOffset: 0,
    scrollThreshold: 0.5,
  };

})(jQuery);