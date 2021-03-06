Primero = Backbone.View.extend({
  el: 'body',

  events: {
    'click .btn_submit': 'submit_form',
    'click .gq_popovers': 'engage_popover',
    'sticky-start .record_controls_container, .index_controls_container': 'start_sticky',
    'sticky-end .record_controls_container, .index_controls_container': 'end_sticky',
    'click .action_btn': 'disable_default_events',
    'change .record_types input:not([type="hidden"])': 'record_type_changed',
    'click a#audio_link, a.document, a.bulk_export_download': '_primero_check_download_status'
  },

  initialize: function() {
    _primero.clean_page_params = this._primero_clean_page_params;
    _primero.get_param = this._primero_get_param;
    _primero.generate_error_message = this._primero_generate_error_message;
    _primero.find_error_messages_container = this._primero_find_error_messages_container;
    _primero.create_or_clean_error_messages_container = this._primero_create_or_clean_error_messages_container;
    _primero.object_to_params = this._primero_object_to_params;
    _primero.filters = this._primero_filters;
    _primero.update_autosum_field = this._primero_update_autosum_field;
    _primero.getInternetExplorerVersion = this._primero_getInternetExplorerVersion;
    _primero.is_under_18 = this._primero_is_under_18;
    _primero.show_add_violation_message = this._primero_show_add_violation_message;
    _primero.loading_screen_indicator = this._primero_loading_screen_indicator;
    _primero.serialize_object = this._primero_serialize_object;
    _primero.check_download_status = this._primero_check_download_status;
    _primero.remove_cookie = this._primero_remove_cookie;
    _primero.read_cookie = this._primero_read_cookie;
    _primero.create_cookie = this._primero_create_cookie;
    _primero.set_content_sidebar_equality = this.set_content_sidebar_equality;
    _primero.scrollTop = this.scrollTop;
    _primero.update_subform_heading = this.update_subform_heading;
    _primero.abide_validator_date = this.abide_validator_date;
    _primero.abide_validator_date_not_future = this.abide_validator_date_not_future;
    _primero.date_not_future = this.date_not_future;
    _primero.valid_datepicker_value = this.valid_datepicker_value;

    this.init_trunc();
    this.init_sticky();
    this.init_popovers();
    this.init_autogrow();
    this.init_action_menu();
    this.init_chosen_or_new();
    this.show_hide_record_type();
    this.init_scrollbar();
    this.populate_case_id_for_gbv_incidents();
    this.init_edit_listeners();
    this.chosen_roles();
    this.init_modal_events();

    // TODO: Temp for form customization. Disabling changing a multi-select if options is populated and disabled.
    var textarea = $('textarea[name*="field[option_strings_text"]');
    if (textarea.attr('disabled') == 'disabled') {
      $('textarea[name*="field[option_strings_text"]').parents('form').find('input[name="field[multi_select]"]').attr('disabled', true);
    }

    window.onbeforeunload = this.load_and_redirect;
  },

  init_modal_events: function() {
    $(document).on('opened.fndtn.reveal', '[data-reveal]', function () {
      var modal = $(this);
      if (!modal.parent('.modal-scroll').length) {
        modal.wrap("<div class='modal-scroll' />");
      }
    });

    $(document).on('close.fndtn.reveal', '[data-reveal]', function () {
      var modal = $(this);
      console.log(modal)
      modal.unwrap("<div class='modal-scroll' />");
    });
  },

  init_edit_listeners: function() {
    if ((_.indexOf(['new', 'edit', 'update'], _primero.current_action) > -1) &&
        (['session','contact_information','system_setting'].indexOf(_primero.model_object) < 0)) {
      $(document).on('click', 'nav a, nav button, header a, .static_links a', function(e) {
        var warn_leaving = confirm(_primero.discard_message);
        if (warn_leaving) {
          if ($(e.target).is(':button')) {
            $(e.target).submit();
          } else {
            window.location = $(e.target).attr('href');
          }
        } else {
          return false;
        }
      });
    }
  },

  chosen_roles: function() {
    _primero.chosen('#chosen_role');
  },

  init_trunc: function() {
    String.prototype.trunc = String.prototype.trunc ||
      function(n){
        return this.length>n ? this.substr(0,n-1)+'...' : this;
      };
  },

  init_scrollbar: function() {
    options = {
      axis:"y",
      scrollInertia: 20,
      scrollButtons:{ enable: true },
      autoHideScrollbar: false,
      theme: 'dark'
    };

    $(".side-nav").mCustomScrollbar(
      _.extend(options, {
        setHeight: 460,
        callbacks:{
            onInit: function() {
              $('.scrolling_indicator.down').css('visibility', 'visible');
            },
            onScroll: function() {
              $('.scrolling_indicator.down').css('visibility', 'visible');
              $('.scrolling_indicator.up').css('visibility', 'visible');
            },
            onTotalScroll: function(){
              $('.scrolling_indicator.down').css('visibility', 'hidden');
              $('.scrolling_indicator.up').css('visibility', 'visible');
            },
            onTotalScrollBack: function() {
              $('.scrolling_indicator.up').css('visibility', 'hidden');
            }
        }
      })
    );

    $("ul.current_flags").mCustomScrollbar(_.extend(options, { setHeight: "auto" }));
    $("ul.current_flags").css("max-height", "250px");

    $("ul.history_flags").mCustomScrollbar(_.extend(options, { setHeight: "auto" }));
    $("ul.history_flags").css("max-height", "175px");

    $(".field-controls-multi, .scrollable").mCustomScrollbar(_.extend(options, { setHeight: 150 }));

    $(".panel_xl ul").mCustomScrollbar(_.extend(options, { setHeight: 578 }));

    $(".panel_content ul").mCustomScrollbar(_.extend(options, { setHeight: 250 }));

    $(".reveal-modal .side-tab-content").mCustomScrollbar(_.extend(options, { setHeight: 400 }));

    $(".panel_main").mCustomScrollbar(_.extend(options, { setHeight: 400 }));

    $(".referral_form_container").mCustomScrollbar(_.extend(options, { setHeight: 530 }));

    $(".modal-content, .profile-header").mCustomScrollbar(_.extend(options, { setHeight: 370 }));

    $(".transfer_form_container").mCustomScrollbar(_.extend(options, { setHeight: 460 }));
  },

  init_chosen_or_new: function() {
    var chosen = $('.chosen-select-or-new').chosen({
      display_selected_options:false,
      width:'100%',
      search_contains: true,
      no_results_text: "Click to add"
    });
    $('body').on('click', 'li.no-results', function(e) {
      var add = $(this).text().match(/Click to add "(.*)"/)[1],
          option = '<option value="' + add + '">'+ add +'</option>',
          select = $(this).parents('.chosen-container').siblings('select');
      select.append(option);
      select.val(add);
      $(chosen).trigger("chosen:updated");
    });
  },

  init_action_menu: function() {
    $('ul.sf-menu').superfish({
      delay: 0,
      speed: 'fast',
      onInit : function() {
        $(this).find('ul').css('display','none');
      }
    });
  },

  init_autogrow: function() {
    $('textarea').autogrow();
  },

  init_popovers: function() {
    var guided_questions = $('.gq_popovers'),
        field = guided_questions.parent().find('input, textarea, select');

    guided_questions.parent().find('input, textarea, select').addClass('has_help');
    guided_questions.popover({
      content: function() {
        return $(this).parent().find('.popover_content').html();
      },
      placement: 'bottom',
      trigger: 'manual'
    });

    field.on('focus', function(evt) {
      guided_questions.popover('hide');

      var field = $(evt.target),
          popover_trigger = $(evt.target).parent().find('a.gq_popovers');

      popover_trigger.popover('show');

      $(evt.target).parent().bind('clickoutside', function(e) {
        popover_trigger.popover('hide');
      });

    });
  },

  engage_popover: function(evt) {
    evt.preventDefault();

    var selected_input = $(evt.target).parent().find('input, textarea, select');

    selected_input.trigger('focus');
  },

  init_sticky: function() {
    var control = $(".record_controls_container, .index_controls_container"),
    stickem = control.sticky({
      topSpacing: control.data('top'),
      bottomSpacing: control.data('bottom')
    });
  },

  start_sticky: function(evt) {
    $(evt.target).addClass('sticking');
  },

  end_sticky: function(evt) {
    $(evt.target).removeClass('sticking');
  },

  record_type_changed: function(evt) {
    this.show_hide_record_type($(evt.target));
  },

  show_hide_record_type: function(input) {
    var inputs = input ? input : $('.record_types input:not([type="hidden"]');

    inputs.each(function(k, v) {
      var selected_input = $(v),
          section_finder_str = '.section' + '.' + selected_input.val(),
          id_section = $('.associated_form_ids').find(section_finder_str);

      selected_input.is(":checked") ? id_section.fadeIn(800) : id_section.fadeOut(800);
    });
  },

  //Adding the case_id from which the GBV incident is being created.
  //GBV Case should hold list of GBV incidents created using this case.
  populate_case_id_for_gbv_incidents: function() {
    case_id = _primero.get_param("case_id");
    if (case_id) {
      $(".new-incident-form").prepend("<input id='incident_case_id' name='incident_case_id' type='hidden' value='" + case_id + "'>");
    }
  },

  submit_form: function(evt) {
    var button = $(evt.target),
        //find out if the submit button is part of the form or not.
        //if not part will need to add the "commit" parameter to let it know
        //the controller what was triggered.
        parent = button.parents("form.default-form");

    if (parent.length > 0) {
      //Just a regular submit in the form.
      parent.submit();
    } else {
      //Because some design thing we need to add the "commit" parameter
      //to the form because the submit triggered is outside of the form.
      var form = $('form.default-form'),
          commit = form.find("input[class='submit-outside-form']");

      if (commit.length === 0) {
        form.append("<input class='submit-outside-form' type='hidden' name='commit' value='" + button.val() + "'/>");
      } else {
        $(commit).val(button.val());
      }

      form.submit();
    }
    _primero.set_content_sidebar_equality();
  },

  disable_default_events: function(evt) {
    evt.preventDefault();
  },

  _primero_clean_page_params: function(q_param) {
    var source = location.href,
      rtn = source.split("?")[0],
      param,
      params_arr = [],
      query = (source.indexOf("?") !== -1) ? source.split("?")[1] : "";
    if (query !== "") {
      params_arr = query.split("&");
      for (var i = params_arr.length - 1; i >= 0; i -= 1) {
        param = params_arr[i].split("=")[0];
        for(var j = 0; j < q_param.length; j++) {
          if (param === q_param[j] || param.indexOf(q_param[j]) === 0) {
            params_arr.splice(i, 1);
          }
        }
      }
      rtn = params_arr.join("&");
    } else {
      rtn = "";
    }
    return rtn;
  },

  _primero_get_param: function(param) {
    var query = window.location.search.substring(1);
    var params = query.split("&");
    for (var i=0; i< params.length; i++) {
      var key_val = params[i].split("=");
      if(key_val[0] == param){
        return key_val[1];
      }
      if(key_val[0].indexOf(param) === 0) {
        return key_val[0] + ':' + key_val[1];
      }
    }
    return false;
  },

  //Create the <li /> item to the corresponding error messages.
  //message: message to show.
  //tab: tab where the element that generate the error exists.
  _primero_generate_error_message: function(message, tab) {
    return "<li data-error-item='" + $(tab).attr("id") + "' class='error-item'>"
           + message
           + "</li>";
  },

  //Find the container errors messages.
  _primero_find_error_messages_container: function(form) {
    return $(form).find("div#errorExplanation ul");
  },

  //create or clean the container errors messages: div#errorExplanation.
  _primero_create_or_clean_error_messages_container: function(form) {
    if ($(form).find("div#errorExplanation").length === 0) {
      $(form).find(".tab div.clearfix").each(function(x, el) {
        //TODO make i18n able.
        $(el).after("<div id='errorExplanation' class='errorExplanation'>"
                    + "<h2>Errors prohibited this record from being saved</h2>"
                    + "<p>There were problems with the following fields:</p>"
                    + "<ul/>"
                    + "</div>");
      });
    } else {
      //TODO If we are going to implement other javascript validation
      //     we must refactor this so don't lost the other errors messages.
      $(form).find("div#errorExplanation ul").text("");
    }
  },

  _primero_object_to_params: function(filters) {
    var url_string = "";
    for (var key in filters) {
      if (url_string !==  "") {
        url_string += "&";
      }
      var filter = filters[key];
      if (_.isArray(filter)) {
        filter = filter.join("||");
      }
      url_string += "scope[" + key + "]" + "=" + filter;
    }
    return url_string;
  },

  _primero_filters: {},

  _primero_update_autosum_field: function(input) {
    var autosum_total = 0;
    var autosum_group = input.attr('autosum_group');
    var fieldset = input.parents('.summary_group');
    var autosum_total_input = fieldset.find('input.autosum_total[type="text"][autosum_group="' + autosum_group + '"]');
    fieldset.find('input.autosum[type="text"][autosum_group="' + autosum_group + '"]').each(function(){
      var value = $(this).val();
      if(!isNaN(value) && value !== ""){
        autosum_total += parseFloat(value);
      }
    });
    autosum_total_input.val(autosum_total);
  },

  // Returns the version of Internet Explorer or a -1
  // (indicating the use of another browser).
  _primero_getInternetExplorerVersion: function() {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer')
    {
      var ua = navigator.userAgent;
      var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) !== null)
        rv = parseFloat( RegExp.$1 );
    }
    return rv;
  },

  _primero_is_under_18: function(date) {
    if (date) {
      var birthday = new Date(date);
      age = ((Date.now() - birthday) / (31557600000));
      return age < 18 ? true : false;
    } else {
      return false;
    }
  },

  _primero_loading_screen_indicator: function(action) {
    var loading_screen = $('.loading-screen'),
        body = $('body, html');

    switch(action) {
      case 'show':
        loading_screen.show();
        body.css('overflow', 'hidden');
        break;
      case 'hide':
        loading_screen.hide();
        body.css('overflow', 'visible');
        break;
    }
  },

  _primero_show_add_violation_message: function() {
    $("fieldset[id$='_violation_wrapper'] .subforms").each(function(k, v) {
      var elm = $(this),
          message = $(v).parent().prev('.add_violations_message');
      if (elm.children().length <= 0 && !message.prev('.empty_violations').is(':visible')) {
        message.show();
      } else {
        message.hide();
      }
    });
  },

  _primero_serialize_object: function(obj, prefix) {
    var str = [];
    for(var p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
        str.push(typeof v == "object" ?
          serialize(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  },

  _primero_check_download_status: function() {
    var download_cookie_name = 'download_status_finished',
        clock = setInterval(check_status, 2000);
    function check_status() {
      if (_primero.read_cookie(download_cookie_name)) {
        _primero.loading_screen_indicator('hide');
        _primero.remove_cookie(download_cookie_name);
        clearInterval(clock);
      }
    }
  },

  _primero_create_cookie: function(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
  },

  _primero_read_cookie: function(name) {
    var name_eq = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(name_eq) === 0) return decodeURIComponent(c.substring(name_eq.length, c.length));
    }
    return null;
  },

  _primero_remove_cookie: function(name) {
    _primero.create_cookie(name, "", -1);
  },

  load_and_redirect: function() {
    if (window.disable_loading_indicator === undefined) {
      _primero.loading_screen_indicator('show');
    }
    window.disable_loading_indicator = undefined;

    if (_primero.getInternetExplorerVersion() > 0) {
      window.onbeforeunload = null;
    }
  },

  set_content_sidebar_equality: function() {
    Foundation.libs.equalizer.reflow();
  },

  scrollTop: function() {
    window.scrollTo(0,0);
  },

  update_subform_heading: function(subformEl) {
    // get subform header for shared summary page
    var subform = $(subformEl).parent();
    var subform_index = $(subformEl).data('subform_index');
    var summary_subform = $('div[data-shared_subform="' + subform.attr('id') + '"] div[data-subform_index="' + subform_index + '"]');
    var display_field = [];
    if (summary_subform.length > 0) {
      display_field = summary_subform.find(".collapse_expand_subform_header div.display_field span");
    }

    //Update the static text with the corresponding input value to shows the changes if any.
    $(subformEl).find(".collapse_expand_subform_header div.display_field span").each(function(x, el){
      //view mode doesn't sent this attributes, there is no need to update the header.
      var data_types_attr = el.getAttribute("data-types"),
          data_fields_attr = el.getAttribute("data-fields"),
          //This is the i18n string for 'Caregiver'.
          data_caregiver_attr = el.getAttribute("data-caregiver");
      if (data_types_attr !== null && data_fields_attr != null) {
        //retrieves the fields to update the header.
        var data_types = data_types_attr.split(","),
            data_fields = data_fields_attr.split(","),
            values = [],
            caregiver = false;
        for (var i=0; (data_fields.length == data_types.length) && (i < data_fields.length); i++) {
          var input_id = data_fields[i],
              input_type = data_types[i],
              value = null;
          if (input_type == "chosen_type") {
            //reflect changes of the chosen.
            var input = $(subformEl).find("select[id='" + input_id + "_'] option:selected");
            if (input.val() !== null) {
              var selected = input.map(function() {
                return $(this).text();
              }).get().join(', ');
              value = selected;
            }
          } else if (input_type == "radio_button_type") {
            //reflect changes of the for radio buttons.
            var input = $(subformEl).find("input[id^='" + input_id + "']:checked");
            if (input.size() > 0) {
              value = input.val();
            }
          } else if (input_type == "check_boxes_type") {
            //reflect changes of the checkboxes.
            var checkboxes_values = [];
            $(subformEl).find("input[id^='" + input_id + "']:checked").each(function(x, el){
              checkboxes_values.push($(el).val());
            });
            if (checkboxes_values.length > 0) {
              value = checkboxes_values.join(", ");
            }
          } else if (input_type == "tick_box_type") {
            var input = $(subformEl).find("#" + input_id + ":checked");
            value = input.size() == 1;
          } else {
            //Probably there is other widget that should be manage differently.
            var input = $(subformEl).find("#" + input_id);
            if (input.val() !== "") {
              value = input.val();
            }
          }

          if (value !== null) {
            //Don't see the way to do this without hardcode the name.
            //Users can change the dbname for this field.
            if (input_id.match(/relation_is_caregiver$/)) {
              //Is the family member the caregiver?
              caregiver = value;
            } else {
              values.push(value);
            }
          }
        }

        var display_text = values.join(" - ");
        if (caregiver) {
          //Add 'Caregiver' string to the end of the header.
          //data_caregiver_attr is supposed to be a i18n string.
          display_text = display_text + data_caregiver_attr;
        }
        $(el).text(display_text);
        if (display_field.length > 0) {
          display_field.text(display_text);
        }
      }
    });
  },

  abide_validator_date_not_future: function(el, required, parent) {
    if (el.getAttribute("disabled") !== "disabled") {
      return _primero.valid_datepicker_value(el.value, required) && _primero.date_not_future(el.value, required);
    } else {
      //Don't validate disabled inputs, browser does not send anyway.
      return true;
    }
  },

  date_not_future: function(value, required) {
    if (value !== "") {
      try {
          var date = $.datepicker.parseDate($.datepicker.defaultDateFormat, value);
          return date < Date.now();
      } catch(e) {
          console.error("An error occurs parsing date value." + e);
          return false;
      }
    } else {
      //If value is empty check if required or not.
      return !required;
    }
  },

  abide_validator_date: function(el, required, parent) {
    if (el.getAttribute("disabled") !== "disabled") {
      return _primero.valid_datepicker_value(el.value, required);
    } else {
      //Don't validate disabled inputs, browser does not send anyway.
      return true;
    }
  },

  valid_datepicker_value: function(value, required) {
    if (value !== "") {
      try {
          var date = $.datepicker.parseDate($.datepicker.defaultDateFormat, value);
          return date !== null && date !== undefined;
      } catch(e) {
          console.error("An error occurs parsing date value." + e);
          return false;
      }
    } else {
      //If value is empty check if required or not.
      return !required;
    }
  }

});