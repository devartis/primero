var SummaryPage = Backbone.View.extend({
  el: 'div.summary_section',

  events: {
    'click span.subform_header label.key' : 'open_form'
  },

  initialize: function() {
    $('span.subform_header label.key').css('cursor', 'pointer');
  },

  open_form: function(event) {
    var target = $(event.target);
    var target_subform_id = target.parents('div.subforms').data('shared_subform');
    var target_form_id = $('div#' + target_subform_id).parents('fieldset.tab').attr('id');

    $('div.side-tab ul li a[href="#' + target_form_id + '"]').click();
  }
});

$(document).ready(function() {
  var summary_page = new SummaryPage();
});