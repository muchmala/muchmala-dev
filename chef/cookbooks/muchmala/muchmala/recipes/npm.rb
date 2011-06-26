include_recipe "nodejs-debs"

if !node[:muchmala][:npm_packages].empty?
    execute "set private npm registry" do
      user "#{node[:muchmala][:user]}"
      group "#{node[:muchmala][:group]}"
      command "npm config set registry #{node[:muchmala][:npm_registry]}"
      not_if "npm config get registry | grep '#{node[:muchmala][:npm_registry]}'"
    end
end

if !node[:muchmala][:npm_packages].empty? then
    node[:muchmala][:npm_packages].each do |package|
        execute "install npm package: #{package}" do
            command "npm install -g #{package}"
            not_if "npm ls -g -p | grep '#{package}'"
        end
    end
end
