template "/etc/sudoers.d/muchmala" do
    source "sudoers.erb"
    mode 0440
end

# template "/etc/profile.d/muchmala.sh" do
#     source "profile.erb"
#     mode 0755
# end
