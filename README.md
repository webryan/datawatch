# datawatch
A simple data watcher for async data

# Sample

## global variable

>  DataWatch.put('Client.info',{client:1});
>  DataWatch.watch(['Client.info','Group.info'],function(data1,data2){
        console.log(data1,data2) 
        //when Client.info and Group.info all ready, print '{client:1} {group:2}'
   });
>  DataWatch.put('Group.info',{group:2});

## common js
put this on the top:
> var DataWatch = require('./datawatch-common.js');
  

