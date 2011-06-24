package "supervisor"

template "/etc/supervisor/conf.d/muchmala.conf" do
    source "supervisor.conf"
    mode 0644
end

service "supervisor" do
  supports :status => true, :restart => true, :reload => true
  action [ :enable, :stop, :start ]
end
