fields = [
  Field.new({"name" => "record_state",
        "type" => "tick_box",
        "editable" => false,
        "disabled" => true,
        "display_name_all" => "Valid Record?"
        }),
]

FormSection.create_or_update_form_section({
  :unique_id=>"other_reportable_fields_tracing_request",
  :parent_form=>"tracing_request",
  "visible" => false,
  :order => 1000,
  :order_form_group => 1000,
  "editable" => true,
  :fields => fields,
  "name_all" => "Other Reportable Fields",
  "description_all" => "Other Reportable Fields"
})