;
(function() {
    // 拓扑工具方法
    var util = {
        div: function(dom, id, className) {
            var d = [];
            d.push('<div id="')
            if (id) {
                d.push(id);
            }
            d.push('"');
            d.push(' class="')
            if (className) {
                d.push(className);
            }
            d.push('">');
            if(dom) {
            	d.push(dom);
            }
            d.push('</div>');
            return d.join('');
        },
        page: function(num, size) {
            var dif = num * 1.0 / size;
            var idif = parseInt(dif);
            if (dif > idif) {
                idif++;
            }
            return idif;
        }
    }

    // 图片对象
    var img = {
    	box: function(className) {
    		return util.div(img.dom(className));
    	},
    	dom: function(className) {
    		return util.div(null, null, 'cs-icon-bg ' + className);
    	}
    }

    // 文本对象
    var text = {
    	dom: function(text, className) {
    		return util.div(text, null, 'cs-text ' + className);
    	}
    }

    // 拓扑背景对象
    var bg = {
        num: 0,
        // 默认单元格宽度为80px
        tdWidth: 86,
        // 默认单元格高度为60px
        tdHeight: 62,
        // 一行有多少个td
        trTds: 14,
        // 默认行数
        trs: 17,
        // 计算表格列数 
        columns: function(width) {
            if (width) {
                var dif = parseInt(width / bg.tdWidth);
                if (dif % 2 !== 0) {
                    dif--;
                }
                return dif;
            }
            return bg.trTds;
        },
        // 计算表格行数
        rows: function() {

            return bg.trs;
        },
        // 表格头部内容
        theadDom: function(columns, tid) {
            var t = [];
            t.push('<thead>')
            var trid = tid + '-htr';
            t.push('<tr id="');
            t.push(trid);
            t.push('">');
            for (var c = 0; c < columns; c++) {
                t.push('<td id="');
                t.push(trid);
                t.push('-td');
                t.push(c);
                t.push('"></td>');
            }
            t.push('</tr></thead>');
            return t.join('');
        },
        // 构建表格dom
        dom: function(columns, rows, tid) {
            var t = [];
            t.push('<table cellspacing="0" cellpadding="0" border="0" width="100%" class="cs-topology-table" id="');
            t.push(tid);
            t.push('">');
            t.push(bg.theadDom(columns, tid));
            t.push('<tbody>');
            for (var r = 0; r < rows; r++) {
                var trid = tid + '-tr' + r;
                t.push('<tr id="');
                t.push(trid);
                t.push('">');
                for (var c = 0; c < columns; c++) {
                    var tdid = trid + '-td' + c;
                    t.push('<td id="');
                    t.push(tdid);
                    t.push('"></td>');
                }
                t.push('</tr>')
            }
            t.push('</tbody></table>');
            return t.join('');
        },
        // 构建背景表格
        table: function(width) {
            var cs = bg.columns(width);
            var rs = bg.rows();
            // 累计
            bg.num++;
            var tid = 'cs-tp-tb' + bg.num;
            var dom = bg.dom(cs, rs, tid);
            return { tid: tid, dom: dom };
        }
    };

    // 公网组件
    var pubNet = {
        append: function(tid) {
            $(tid).find('thead td:eq(' + bg.trTds / 2 + ')').html(img.box('cs-icon-pub-net'));
        }
    };

    // 路由组件
    var router = {
        // 路由绑定属性
        attr: function(data) {
            return {
                status: data.status,
                uuid: data.uuid,
                name: data.name
            };
        },
        // 路由绑定方法
        method: function(ret) {
            return {
                dom: router.dom.bind(ret)
            };
        },
        id: function(id) {
            return 'cs-route-' + id;
        },
        // 将路由加载到拓扑
        dom: function(ps) {
            var d = [];
            d.push(img.dom('cs-icon-route'));
            d.push(img.dom('cs-icon-ok'));
            d.push(text.dom(this.attr.name, 'cs-text-route'));
            $(ps).html(util.div(d.join(''), router.id(this.attr.uuid), 'cs-td-box'));
        },
        build: function(data) {
            var ret = {};
            ret.attr = router.attr(data);
            ret.method = router.method(ret);
            return ret;
        }
    };

    // 对象定位对象
    var position = {
        row: 1,
        init: function() {
            position.row = 1;
        },
        sel: function(p, tid) {
            return $(tid + '-tr' + p[0] + '-td' + p[1]);
        },
        route: function(rs) {
            var rsl = rs.length;
            var column = 0;
            var ret = [];
            var p = util.page(rsl, bg.trTds);
            for (var pi = 0; pi < p; pi++, position.row += 2) {
                if (pi === p - 1) {
                    column = parseInt((bg.trTds - (rsl % bg.trTds)) / 2);
                }
                for (var i = 0; i < rsl; i++, column++) {
                    ret.push([position.row, column]);
                }
            }
            return ret;
        }
    };

    // 拓扑对象，组装其他组件
    var topology = {
        route: function(data, tid) {
            var rs = data.routers;
            if (!rs) {
                return;
            }
            var ps = position.route(rs);
            for (var i = 0; i < rs.length; i++) {
                var r = rs[i];
                var p = ps[i];
                var sel = position.sel(p, tid);
                var ro = router.build(r);
                // 放置路由到拓扑
                ro.method.dom(sel);
            }
        },
        // 新拓扑对象需初始化对象
        init: function() {
            // 初始化定位对象
            position.init();
        },
        // 构建拓扑图
        build: function(data, tid) {
            // 初始化对象参数
            topology.init();
            // 拓扑添加路由对象
            topology.route(data, tid);
        }
    };

    $.fn.csTopology = function(data) {
        var s = $(this);
        var w = s.width();
        // 1.构建拓扑图背景表格
        var t = bg.table(w);
        // 表格id
        var tid = '#' + t.tid;
        // 表格dom
        var tdom = t.dom;
        // 向容器添加表格
        s.html(tdom);
        // 加载公有云
        pubNet.append(tid);
        // 构建其他对象
        topology.build(data, tid);
    }

    var css = [];
    var style1 = document.createElement('style');
    css.push('.cs-topology-table {padding-top:35px}');
    css.push('.cs-topology-table td{width:80px;height:60px;}');
    css.push('.cs-topology-table td>div{width:100%;height:100%;position:relative;}');
    css.push('.cs-topology-table td .cs-td-box{border:1px solid #D5DEE2;margin:0 auto;width:88%;}');
    css.push('.cs-topology-table thead td{border-bottom:5px solid #59CBDB}');
    css.push('.cs-icon-bg{position:absolute;top:0px;left:0px;background-image: url("data:image/png;base64,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")}');
    css.push('.cs-icon-pub-net{background-position:0 0;width:100px;height:77px;bottom:0px;top:initial;}');
    css.push('.cs-icon-route{background-position:0 -93px;width:26px;height:26px;position:static;margin:8px auto 0;}');
    css.push('.cs-icon-ok{background-position:-50px -93px;width:16px;height:16px;top:4px;left:initial;right:2px;}');
    css.push('.cs-text{text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}');
    css.push('.cs-text-route{position:static;width:76px;margin:1px auto 0;}');
    style1.innerHTML = css.join('\n');
    document.head.appendChild(style1);
})();
