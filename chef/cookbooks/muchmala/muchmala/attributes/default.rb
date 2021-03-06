#
# Author:: George Miroshnykov (george.miroshnykov@gmail.com)
# Cookbook Name:: muchmala
# Attributes:: default
#
# Copyright 2011, George Miroshnykov
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

default.nodejs[:version] = "0.4.8"
default.nodejs[:npm] = "1.0.8"

default['java']['install_flavor'] = "sun"

default[:muchmala][:user] 	= ENV['SUDO_USER']
default[:muchmala][:group]	= ENV['SUDO_USER']
default[:muchmala][:root]   = "/opt/muchmala"

default[:muchmala][:npm_packages] = [:jake, :stylus]
#default[:muchmala][:npm_registry]  = "http://registry.npm.muchmala.com"
