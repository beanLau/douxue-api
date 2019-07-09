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
    }
}
