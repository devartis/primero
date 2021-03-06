module RecordFilteringPagination
  extend ActiveSupport::Concern

  included do
    before_filter :load_age_range, :only => [:index]
    before_filter :load_inactivity_range, :only => [:index]
  end

  def page
    params[:page] ? params[:page].to_i : 1
  end

  def per_page
    params[:per] ? params[:per].to_i : 20
  end

  def pagination
    { page: page, per_page: per_page }
  end

  def order
    column = params[:column]
    order = params[:order]
    if order && column
      {:"#{column}" => order.downcase.to_sym}
    else
      {created_at: :desc}
    end
  end

  # Expected format for filters:
  # scope[filter_name]=filter_type||value(s)
  #   filter_type       separator
  #   "range"           "-"
  #   "date_range"      "."
  #   "list"            "||"
  #   "single"          none
  #   "or_op"           hash with the fields and values:
  #                     "approval_status"=>{"approval_status_case_plan"=>"group||Pending",
  #                                         "approval_status_closure"=>"group||Pending",
  #                                         "approval_status_bia"=>"group||Pending"}
  def filter
    filter_scope = {}
    if params[:scope].present?
      @invalid_date_filter_value = false
      model_class = params[:model_class].constantize if params[:model_class].present?
      model_class ||= params[:controller].camelize.singularize.constantize
      params[:scope].reject{|k,v| k == 'users'}
      params[:scope][:module_id] = "list||#{current_user.modules.map{|m| m.id}.join('||')}"
      params[:scope].each_key do |key|
        if params[:scope][key].instance_of? String
          filter_values = params[:scope][key].split "||"
          filter_type = filter_values.shift
        else
          #Assuming hash for fields that should be "OR" on the query search.
          #Normally "OR" are several values for the same field, in this case
          #need to ORerd different fields.
          filter_values = params[:scope][key].map do |param_k, param_v|
            values = param_v.split("||")
            filter_type = values.shift
            [param_k, values]
          end.to_h
        end
        case filter_type
        when "range"
          filter_values = filter_values.map{|filter| filter.split "-"}
        when "date_range"
          filter_values = sanitize_date_range_filter(filter_values.first.split("."))
        else
          filter_values = filter_values.map{|value| value == 'true' } if model_class.properties_by_name[key].try(:type) == TrueClass
          filter_values = filter_values.first if ["single", "location"].include? filter_type
        end
        filter_scope[key] = {:type => filter_type, :value => filter_values} if filter_values.present? || filter_values == false
      end
      flash.now[:error] = I18n.t("messages.invalid_date_filter_value") if @invalid_date_filter_value
    end

    filter_scope
  end

  def associated_users
    @associated_users ||= current_user.managed_user_names
  end

  def users_filter
    if params[:scope].present? and params[:scope][:users].present?
      users = params[:scope][:users].split(',')
      users.shift
      users
    else
      current_user.record_scope
    end

  end

  def load_age_range
    sys = SystemSettings.current
    primary_range = sys.primary_age_range
    @age_ranges ||= sys.age_ranges[primary_range].map{ |r| r.to_s }
  end

  def load_inactivity_range
    Date::DATE_FORMATS[:dmy] = "%d-%b-%Y"
    zeroDate = Date.new(0, 1, 1)
    ninetyDaysAgo = (Date.today - 90)
    @inactive_range ||= zeroDate.to_s(:dmy) + '.' + ninetyDaysAgo.to_s(:dmy)
  end

  def sanitize_date_range_filter (date_range)
    date_range.each_with_index do |value, i|
      begin
        date_range[i] = PrimeroDate.parse_with_format value
      rescue ArgumentError => arg_error
        @invalid_date_filter_value = true
        return []
      end
    end
    date_range
  end

  #Use this method if we are not relying on Sunspot to paginate for us.
  def paginated_collection(collection, total_rows)
    WillPaginate::Collection.create(page, per_page, total_rows) do |pager|
      pager.replace(collection)
    end
  end
end