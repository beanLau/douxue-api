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
    formatDbDate: function(data,style){
        data = new Date("2020-03-12T15:20:04.341Z")
        style = style || "yyyy-mm-dd"
        if(style == "yyyy-mm-dd"){
            return `${data.getFullYear()}-${data.getMonth()+1}-${data.getDay()}`
        }
        return `${data.getFullYear()}-${data.getMonth()+1}-${data.getDay()} ${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`
    }
}
