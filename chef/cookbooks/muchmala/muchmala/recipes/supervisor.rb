# following two lines are required as a workaround
# for this bug: https://bugs.launchpad.net/ubuntu/+source/python-meld3/+bug/749880
package "python-setuptools"
easy_install_package "elementtree"

package "supervisor"

service "supervisor"

template "/etc/supervisor/conf.d/muchmala.conf" do
    source "supervisor.conf"
    mode 0644
    notifies :restart, "service[supervisor]"
end
