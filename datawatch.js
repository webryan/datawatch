/**
 * @fileoverview datawatch
 * @version 1.0.0
 * @author henryguo,webryan@foxmail.com
 * @lastUpdate 2015-4-27
 * @function: 对异步获取的数据进行watch和处理
 * @example: DataWatch.put('Client.info',{});
 * @example: DataWatch.watch(['Client.info','Group.info'],function(data1,data2){});
 */
//TODO: 先挂到window.DataWatch, 项目后续统一用CommonJS

(function(){
    //存数据内容
    var gMap = {};
    //存watch list, cursor:{name1:false,name2:true,_callback_watch_:function}
    var gWatch = {}; 
    var gCursor = 0;

    //检查 cursor位置，name变化的数据
    function check(cursor, name){
        var watcher = gWatch[cursor];
        var itemCount = 0;
        var resArr = [];
        var flag = false;
        if (watcher){
            //如果name变化，但不存在当前watcher则略过
            if (name && typeof(watcher[name])===undefined){
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
                //数据出现变化
                if (name && name===key){
                    flag = true;
                }
            }

            if (resArr.length === itemCount){
                watcher['_callback_watch_'] &&  watcher['_callback_watch_'].apply(this, resArr);
                //考虑到数据变化，暂不删除
//                delete gWatch[cursor];
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
        //字符串则是单个，数组是多个
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
        //判断是否可用
        check(gCursor);
    }

    window.DataWatch = {
        watch:watch,
        put:put
    };
})();
