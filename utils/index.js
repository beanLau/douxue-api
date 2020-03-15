module.exports = {
    filterArray: function(list, pid) {
        let vm = this;
        var tree = [];
        var temp;
        pid = pid || '';
        for (var i = 0; i < list.length; i++) {
            if (list[i].pid == pid) {
                var obj = list[i];
                temp = this.filterArray(list, list[i]._id);
                if (temp.length > 0) {
                    obj.subs = temp;
                }
                tree.push(obj);
            }
        }
        return tree;
    },
    formatDbDate: function(data,fmt){
        data = new Date(data)
        fmt = fmt || "yyyy-MM-dd"
        var o = {
        "M+": data.getMonth() + 1, // 月份
        "d+": data.getDate(), // 日
        "h+": data.getHours(), // 小时
        "m+": data.getMinutes(), // 分
        "s+": data.getSeconds(), // 秒
        "q+": Math.floor((data.getMonth() + 3) / 3), // 季度
        "S": data.getMilliseconds() // 毫秒
        };
        if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
}
