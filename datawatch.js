/**
 * @fileoverview datawatch
 * @version 1.0.0
 * @author henryguo,webryan@foxmail.com
 * @lastUpdate 2015-4-27
 * @function: 对异步获取的数据进行watch和处理
 * @example: DataWatch.put('Client.info',{});
 * @example: DataWatch.watch(['Client.info','Group.info'],function(data1,data2){});
 */

var gMap = {};
var gWatch = {}; 
var gCursor = 0;

function check(cursor, name){
    var watcher = gWatch[cursor];
    var itemCount = 0;
    var resArr = [];
    var flag = false;
    if (watcher){
        if (name && typeof(watcher[name])==='undefined'){
            return;
        }


        for (var key in watcher){
            if (key === '_callback_watch_'){
                continue;
            } 

            itemCount++;
            if (gMap[key]){
                watcher[key] = true; 
                resArr.push(gMap[key]);
            }
            //data ready
            if (name && name===key){
                flag = true;
            }
        }

        if (resArr.length === itemCount){
            watcher['_callback_watch_'] &&  watcher['_callback_watch_'].apply(this, resArr);
        }
        resArr = null;
    } 
}


function put(key, value){
    //先放数据
    gMap[key] = value;    
    //然后遍历watch
    for (var cursor in gWatch){
        check(cursor, key);
    }
}

//添加watch
function watch(name,callback){
    //support string and array
    if (typeof(name) === 'string'){
        name = [name];
    }

    var watcher = {}; 
    for (var i=0,len=name.length; i<len; i++){
        watcher[name[i]] = false;
    }
    watcher['_callback_watch_'] = callback;
    gCursor++;
    gWatch[gCursor] = watcher;
    check(gCursor);
}

exports.watch = watch;
exports.put = put;
