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

````
    #!/bin/sh
    GIT_WORK_TREE=/Users/tejal/deploy/blue-www/ git checkout -f
    cd /Users/tejal/deploy/blue-www/ && npm install && cd -  
````
* Created blue/green infrastructure for deployment, including a blue redis instance and green redis instance.
The two instances are created on ports 6379 and 6380 in the infrastructure.js file as follows:

````
var greenRedisClient = redis.createClient(6379, '127.0.0.1', {});
var blueRedisClient = redis.createClient(6380, '127.0.0.1', {});
````
* Default infrastructure will route traffic to the blue instance.
It is specified as:
```
var TARGET = BLUE;
```

* Introduce a new route, /switch, that will trigger a switch from "blue" to "green" and vice versa.

* Extend /switch so that if a redis instance currently has values in the picture list, then migrate those instances over to the new instance.


* Introduce a feature flag in the application, "mirroring", which when turned on, will forward information added to the picture list, to the other slice.


