## DeployApp Homework 4 

The folder structure created is as follows:
* deploy/
  * blue.git/
  * blue-www/
  * green.git/
  * green-www/

Deployed the web application with the following additional considerations:
* git/hook setup for triggering deployment on push:
  The hook is in the post-receive file in the hooks directory in blue.git and green.git as follows:


    #!/bin/sh
    GIT_WORK_TREE=/Users/tejal/deploy/blue-www/ git checkout -f
    cd /Users/tejal/deploy/blue-www/ && npm install && cd -  

* Create blue/green infrastructure for deployment, including a blue redis instance and green redis instance.


* Default infrastructure will route traffic to the blue instance.


* Introduce a new route, /switch, that will trigger a switch from "blue" to "green" and vice versa.

* Extend /switch so that if a redis instance currently has values in the picture list, then migrate those instances over to the new instance.


* Introduce a feature flag in the application, "mirroring", which when turned on, will forward information added to the picture list, to the other slice.


