package "supervisor"

service "supervisor"

template "/etc/supervisor/conf.d/muchmala.conf" do
    source "supervisor.conf"
    mode 0644
    notifies :restart, "service[supervisor]"
end
