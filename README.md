# ruamgun
A web portal aggregating data from Facebook Pages

Uses: **<a href="https://github.com/criso/fbgraph">fbgraph</a>, 
<a href="https://github.com/kelektiv/node-cron">cron</a>,
<a href="https://github.com/louischatriot/nedb">NeDB</a>, 
<a href="https://github.com/expressjs/express">Express.js</a>**


## How it works
The program will fetch and store posts from Facebook Pages that has been added to db/pages (using the addPages script) every set interval. Duplicate posts will not be inserted. The UI is under construction.

## Running
`npm install`

`npm start`

## Adding/removing pages

Edit array in scripts/addPages.js, then run:

`node scripts/addPages`


## Terminating job

`Call 'ps ax' to list running processes`

`kill {PID} to kill `