# Dashboard

This dashboard is built using Javascript, HTML, CSS and D3. 

The slider filter has range of [114,126]. When slider points to value N, data is filtered using the range [114-N). The table and the map update themselves to reflect the filtered data. D3-simple-slider (https://github.com/johnwalley/d3-simple-slider) was used for adding sliding filter capability to the dashboard. And Google Maps JS API is used for adding map and marker feature on the dashboard. 

Data folder contains the integrated data in json format. 

This dashboard should be run as http server. It can be done by running command 'python3 -m http.server 1234' from the project folder.
