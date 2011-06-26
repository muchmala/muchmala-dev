if !node[:muchmala][:npm_packages].empty? then
    packages = node[:muchmala][:npm_packages].join(' ')
    execute "install npm packages" do
        command "npm install -g #{packages}"
    end
end
