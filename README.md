# CKAN-UI

## Requirements
- CKAN (with solr), running

## Backend
Modify backend/config/dev.json (or test/prod as might be the case) by copying the template and overriding the values 
custom to your environment (Ckan url, solr url, port)

Run the backend with `npm start` in the backend directory or `npm run serve` to do hot reloading (dev)

##Front end 
Modify frontend/vue.config.s by changing the values as needed

Run the frontend with `npm run build && npm install -g serve && serve -s dist` in the frontend directory or `npm run serve` to do hot reloading (dev) 