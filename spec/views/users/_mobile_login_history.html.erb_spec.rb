require 'spec_helper'

describe "users/_mobile_login_history.html.erb" do
  describe "Viewing a user's mobile login history" do

    it "should show the login events" do
      user = User.new()
      Clock.stub(:now).and_return(Time.parse("2010-01-20 12:04:24UTC"))
      LoginActivity.create!(imei: '1234', mobile_number: '01234 56789')
      user.time_zone = TZInfo::Timezone.get("US/Samoa")

      assign(:user, user)
      assign(:current_user, stub_model(User, :time_zone => TZInfo::Timezone.get("US/Samoa")))
      render

      rendered.should have_tag(".device-information") do
        with_tag("th", /Timestamp/)
        with_tag("th", /IMEI/)
        with_tag("th", /Mobile Number/)
      end

      rendered.should have_tag(".device-information") do
        with_tag("td", /2010-01-20 01:04:24 -1100/)
        with_tag("td", /1234/)
        with_tag("td", /01234 56789/)
      end
    end
  end
end
