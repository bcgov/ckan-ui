# CKAN-UI

## Requirements 
- CKAN (with solr/postgres), running

## Backend
Modify backend/config/dev.json (or test/prod as might be the case) by copying the template and overriding the values 
custom to your environment (Ckan url, solr url, port)

Run the backend with `npm start` in the backend directory or `npm run serve` to do hot reloading (dev)

## Front end 
Modify frontend/vue.config.js and frontend/src/config/config.js by changing the values as needed

Run the frontend with `npm run build && npm install -g serve && serve -s dist` in the frontend directory or `npm run serve` to do hot reloading (dev) 


## Docker Container
Build the backend docker container with 
```
docker build .
```

Run the backend container container with
```
hostip=$(ifconfig en0 | awk '$1 == "inet" {print $2}')
docker run -p 3000:3000 -v $(pwd)/backend/config:/app/config --add-host=docker:$hostip $CONTAINER_ID
```
Replacing $CONTAINER_ID with the output from docker build (or the tag if you tagged it)


Build the frontend docker container with 
```
docker build . -f Dockerfile-frontend
```

Run the backend container container with
```
hostip=$(ifconfig en0 | awk '$1 == "inet" {print $2}')
docker run -p 8080:8080 -e HOSTNAME=docker --add-host=docker:$hostip $CONTAINER_ID
```
Replacing $CONTAINER_ID with the output from docker build (or the tag if you tagged it)

## Helm
Create a config.yaml in helm/ckan-ui/ create it from a copy of values.yaml, overriding the values as needed.

##### Install
`helm install ./helm/ckan-ui -n ckan-ui -f ./helm/ckan-ui/config.yaml`

##### Upgrade
`helm upgrade ckan-ui ./helm/ckan-ui -f ./helm/ckan-ui/config.yaml`
