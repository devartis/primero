closure_fields = [
  Field.new({"name" => "closure_approved",
              "type" => "tick_box",
              "tick_box_label_all" => "Yes",
              "display_name_all" => "Approved by Manager",
              "disabled" => true,
              "editable" => false
            }),
  Field.new({"name" => "closure_approved_date",
             "type" => "date_field",
             "display_name_all" => "Date",
             "disabled" => true,
             "editable" => false
            }),
  Field.new({"name" => "closure_approved_comments",
             "type" => "textarea",
             "display_name_all" => "Manager Comments",
             "disabled" => true,
             "editable" => false
            }),
  Field.new({"name" => "approval_status_closure",
             "type" => "select_box",
             "display_name_all" => "Approval Status",
             "editable" => false,
             "disabled" => true,
             "option_strings_text_all" =>
                        ["Pending",
                         "Approved",
                         "Rejected"].join("\n")
            }),
  Field.new({"name" => "closure_reason",
             "type" => "select_box",
             "display_name_all" => "What is the reason for closing the child's file?",
             "option_strings_text_all" =>
                        ["Death of Child",
                         "Formal Closing",
                         "Not Seen During Verification",
                         "Repatriated",
                         "Transferred",
                         "Other"].join("\n")
            }),
  Field.new({"name" => "closure_reason_other",
             "type" => "text_field",
             "display_name_all" => "If other, please specify ",
            }),
  Field.new({"name" => "date_closure",
             "type" => "date_field",
             "display_name_all" => "Date of Closure",
            }),
  Field.new({"name" => "name_caregiver_closing",
             "type" => "text_field",
             "display_name_all" => "Caregiver Name",
            }),
  Field.new({"name" => "relationship_caregiver_closing",
             "type" => "text_field",
             "display_name_all" => "Caregiver Relationship",
            }),
  Field.new({"name" => "address_caregiver_closing",
             "type" => "textarea",
             "display_name_all" => "Caregiver Address",
            }),
  Field.new({"name" => "location_caregiver_closing",
             "type" => "select_box",
             "display_name_all" => "Caregiver Location",
             "searchable_select" => true,
             "option_strings_source" => "Location"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "closure_form",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 110,
  :order => 21,
  :order_subform => 0,
  :form_group_name => "Closure",
  "editable" => true,
  :fields => closure_fields,
  "name_all" => "Closure",
  "description_all" => "Closure"
})