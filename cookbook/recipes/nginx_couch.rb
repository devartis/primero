include_recipe 'primero::nginx_common'

couch_conf_file = "#{node[:nginx_dir]}/sites-available/couchdb"
template couch_conf_file do
  source "nginx_couch.erb"
  owner 'root'
  group 'root'
  mode '0644'
  variables({
    :ssl_cert_path => node[:primero][:couchdb][:cert_path],
    :ssl_key_path => node[:primero][:couchdb][:key_path],
    :log_dir => ::File.join(node[:primero][:log_dir], 'couchdb'),
    :dh_param => "#{node[:nginx_dir]}/ssl/dhparam.pem",
  })
  notifies :restart, 'service[nginx]'
end

link "#{node[:nginx_dir]}/sites-enabled/couchdb" do
  to couch_conf_file
end

service 'nginx' do
  supports [:enable, :restart, :start, :reload]
  action [:enable, :start]
end

