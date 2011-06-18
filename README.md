# Installation

    git checkout https://github.com/muchmala/muchmala-dev.git --recursive
    cd muchmala-dev
    vagrant up
    vagrant ssh
    cd /opt/muchmala
    [sudo] npm install ejs http-proxy
    [sudo] npm install -g stylus jake
    [sudo] jake start