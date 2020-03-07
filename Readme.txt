redis-server.exe -k install -n "Redis 16000" --port 16000 --service-install redis.windows.conf --loglevel verbose
redis-server.exe --port 11000 --service-install redis.windows.conf --loglevel verbose

node --max-old-space-size=4096 core.js

npm install mustache node-fetch cron uuid node-fetch express body-parser csv-stringify mustache lodash tedious -S

npm install cookie-parser grpc redis level grpc @grpc/proto-loader socket.io -S

npm install kue
npm install response-time



services.msc
RUN > Certmgr.msc



httpd.exe -k install -n "Apache HTTP Server"
nginx.exe -k install -n "NGINX HTTP Server"

nginx.exe -s start
nginx.exe -s stop

TASKKILL /F /IM "nginx*"

TASKKILL /F /IM "httpd*"

Update-Package -reinstall


















