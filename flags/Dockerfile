FROM node:argon
# ADD package.json /usr/src/app/package.json
ADD package.json npm-shrinkwrap.json* /usr/src/app/
ADD bower.json /usr/src/app/bower.json
ADD bower_components /usr/src/app/bower_components
ADD node_modules /usr/src/app/node_modules
ADD styles/. /usr/src/app/styles
ADD index.html /usr/src/app/index.html
ADD b_ph20.png /usr/src/app/b_ph20.png
ADD ph29.png /usr/src/app/ph29.png
ADD ph8.png /usr/src/app/ph8.png
ADD locations.csv /usr/src/app/locations.csv
ADD locations_nest.csv /usr/src/app/locations_nest.csv
ADD locationsinter.csv /usr/src/app/locationsinter.csv
ADD res2.csv /usr/src/app/res2.csv
ADD NeueHaas.json /usr/src/app/NeueHaas.json
ADD ph29.png /usr/src/app/ph29.png
ADD scripts/. /usr/src/app/scripts
WORKDIR /usr/src/app
RUN npm --unsafe-perm install
RUN npm install -g bower
RUN bower install --allow-root
ADD app.js /usr/src/app/app.js
ADD cluster.js /usr/src/app/cluster.js
ADD package.json /usr/src/app/package.json
EXPOSE 8080
CMD [ "npm", "start" ]
