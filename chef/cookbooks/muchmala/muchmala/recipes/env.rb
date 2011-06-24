template "/home/#{node[:muchmala][:user]}/.profile" do
    source "profile.env"
    mode 0644
    owner "#{node[:muchmala][:user]}"
    group "#{node[:muchmala][:group]}"
end

template "/home/#{node[:muchmala][:user]}/.muchmala" do
    source "muchmala.env"
    mode 0644
    owner "#{node[:muchmala][:user]}"
    group "#{node[:muchmala][:group]}"
end
