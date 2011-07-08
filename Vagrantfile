Vagrant::Config.run do |config|
  config.vm.box = "muchmala"
  config.vm.box_url = "http://vagrant.muchmala.com/muchmala.box"

  config.vm.customize do |vm|
    #vm.memory_size = 512
    #vm.memory_size = 640
    #vm.memory_size = 768
  end

  config.vm.network "33.33.33.15"
  config.vm.share_folder("v-root", "/opt/muchmala", ".", :nfs => true)

  config.vm.provision :chef_solo do |chef|
    chef.cookbooks_path = [
        "chef/cookbooks/muchmala",
        "chef/cookbooks/opscode",
        "chef/cookbooks/mdxp",
        "chef/cookbooks/laggyluke"
    ]
    chef.add_recipe "muchmala"
    chef.add_recipe "muchmala::vagrant"
  end
end
