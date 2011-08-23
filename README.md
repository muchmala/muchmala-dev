# Installation

    git clone --recursive https://github.com/muchmala/muchmala-dev.git
    cd muchmala-dev
    vagrant up
    vagrant ssh
    cd /opt/muchmala
    npm install
    jake install
    jake start

# Production Installation (temporary)

1. Create S3 bucket with the name like `static.muchmala.com` for JS/CSS/images, including puzzles images.
2. Launch instance based on AMI `ami-cef405a7` (others weren't tested, but any Ubuntu 10.10+ should work). Don't forget to allow incoming connections to port 80 in EC2 security group settings.
3. SSH into your EC2 instance.
4. Create `~/muchmala.env` and redefine all required variables like S3 keys etc.

        grep -nr "process.env.MUCHMALA_" .

5. Load those redefined variables with `. ~/muchmala.env`.
6. Update packages info.

        sudo apt-get update

7. Install git, ruby and rubygems.

        sudo apt-get install -y git ruby1.8-dev rubygems

8. Install chef.

        sudo gem install --version 0.10.4 chef --no-rdoc --no-ri

9. Create project directory and change it's owner/group to the current user.

        sudo mkdir /opt/muchmala
        sudo chown $USER:$USER /opt/muchmala

10. Clone the project repository into project directory.

        git clone --recursive https://github.com/muchmala/muchmala-dev.git /opt/muchmala

11. Go into project directory and run chef-solo.

        cd /opt/muchmala
        sudo /var/lib/gems/1.8/bin/chef-solo -c chef/solo.rb -j chef/node.json

12. Install required node modules.

        npm install

13. Install the rest of dependencies using jake.

        jake install

14. Prepare and upload static files.

        cd components/muchmala-frontend
        jake prepare-static

15. Run all services.

        cd ../..
        jake start

16. That's all, folks.
