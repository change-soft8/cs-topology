;
// 命名空间方法体
(function() {
    // 拓扑工具方法
    var util = {
    	// 返回div DOM 字符串
        div: function(dom, id, className) {
            var d = [];
            // 添加div id属性
            d.push('<div id="')
            if (id) {
                d.push(id);
            }
            d.push('"');
            // 添加div class属性
            d.push(' class="')
            if (className) {
                d.push(className);
            }
            d.push('">');
            // 添加div 子节点
            if(dom) {
            	d.push(dom);
            }
            d.push('</div>');
            return d.join('');
        },
        // 根据总数量，与每页数量，计算页数
        page: function(num, size) {
            var dif = num * 1.0 / size;
            var idif = parseInt(dif);
            // 需要页数加1 的情况
            if (dif > idif) {
                idif++;
            }
            return idif;
        }
    }

    // 图片DOM 处理对象
    var img = {
    	// 图片单元DOM 字符串
    	box: function(className) {
    		return util.div(img.dom(className));
    	},
    	// 单个图片DOM 字符串
    	dom: function(className) {
    		return util.div(null, null, 'cs-icon-bg ' + className);
    	}
    }

    // 文本DOM 处理对象
    var text = {
    	// 返回文本DOM 字符串
    	dom: function(text, className) {
    		return util.div(text, null, 'cs-text ' + className);
    	}
    }

    // 拓扑背景DOM 操作对象
    var bg = {
    	// 拓扑表格id计数标识
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
        	// 如果存在容器宽度
            if (width) {
            	// 根据单元个宽度，计数单元格个数
                var dif = parseInt(width / bg.tdWidth);
                // 如果单元格为奇数
                if (dif % 2 !== 0) {
                	// 将其变为偶数
                    dif--;
                }
                bg.trTds = dif;
                // 返回计数后的单元格数量
                return dif;
            }
            // 返回默认单元格数量
            return bg.trTds;
        },
        // 计算路由占据行数
        routeRows: function(rs) {
        	// 路由总个数
            var rsl = rs.length;
            // 计算路由放置行数
            var p = util.page(rsl, bg.trTds);
            // 计数路由占据行数
            var r = 2 * p + 1;
            return r;
        },
        // 计数绘制网络占用行数
        networkRows: function(nws) {
        	// 返回拓扑行数
        	var r = 0;
        	// 遍历拓扑网络数组
        	for(var nw of nws) {
        		// 一个临时数组
        		var t = [];
        		// 遍历子网对象
        		for(var snw of nw.subNetworks) {
        			// 数组连接子网设备
        			t = t.concat(snw.devices || []);
        		}
        		// 设备本身占一行
        		r++;
        		// 存在网络设备，计数设备占用行数
        		if(t.length > 0) {
        			// 计数该网络下，所有设备占据的行数
        			r += bg.routeRows(t);
        		} else {
        			// 没有设备，空隙占一行
        			r ++;
        		}
        	}
        	// 返回拓扑行数
        	return r;
        },
        // 计算拓扑行数
        rows: function(data) {
        	// 如果存在数据
        	if(data) {
        		// 设置返回行数
        		var trs = 0;
        		// 计算路由占据行数
        		trs += bg.routeRows(data.routers);
        		// 计算网络占据行数
        		trs += bg.networkRows(data.networks);
        		// 返回拓扑行数
        		return trs;
        	}
        	// 返回默认行数
            return bg.trs;
        },
        // 表格头部内容
        theadDom: function(columns, tid) {
            var t = [];
            // 构建表格头部
            t.push('<thead>')
            var trid = tid + '-htr';
            t.push('<tr id="');
            t.push(trid);
            t.push('">');
            // 构建头部单元格
            for (var c = 0; c < columns; c++) {
                t.push('<td id="');
                t.push(trid);
                t.push('-td');
                t.push(c);
                t.push('"></td>');
            }
            t.push('</tr></thead>');
            // 返回头部DOM
            return t.join('');
        },
        // 构建拓扑背景网格
        dom: function(columns, rows, tid) {
            var t = [];
            // 构建表格DOM
            t.push('<table cellspacing="0" cellpadding="0" border="0" width="100%" class="cs-topology-table" id="');
            t.push(tid);
            t.push('">');
            t.push(bg.theadDom(columns, tid));
            // 构建tbody DOM
            t.push('<tbody>');
            for (var r = 0; r < rows; r++) {
                var trid = tid + '-tr' + r;
                // 构建带 id 的TR DOM
                t.push('<tr id="');
                t.push(trid);
                t.push('">');
                for (var c = 0; c < columns; c++) {
                    var tdid = trid + '-td' + c;
                    // 构建带 id 的TD DOM
                    t.push('<td id="');
                    t.push(tdid);
                    t.push('"></td>');
                }
                t.push('</tr>')
            }
            t.push('</tbody></table>');
            // 返回表格对象
            return t.join('');
        },
        // 构建背景表格
        table: function(width, data) {
        	// 计数表格列数
            var cs = bg.columns(width);
            // 计数表格行数
            var rs = bg.rows(data);
            // 累计表格id标识
            bg.num++;
            // 表格id 字符串
            var tid = 'cs-tp-tb' + bg.num;
            // 构建表格DOM
            var dom = bg.dom(cs, rs, tid);
            // 返回表格对象
            return { tid: tid, dom: dom };
        }
    };

    // 公网组件
    var pubNet = {
    	// 添加公网图标
        append: function(tid) {
            $(tid).find('thead td:eq(' + bg.trTds / 2 + ')').html(img.box('cs-icon-pub-net'));
        }
    };

    // 路由组件
    var router = {
        // 路由绑定属性
        attr: function(data) {
        	// 映射路由属性
            return {
                status: data.status,
                uuid: data.uuid,
                name: data.name
            };
        },
        // 路由绑定方法
        method: function(ret) {
        	// 映射路由操作
            return {
                dom: router.dom.bind(ret)
            };
        },
        // 构建路由id
        id: function(id) {
            return 'cs-route-' + id;
        },
        // 构建单个路由DOM 并添加到拓扑网格
        dom: function(ps) {
            var d = [];
            // 路由图标组件
            d.push(img.dom('cs-icon-route'));
            // 路由状态组件
            d.push(img.dom('cs-icon-ok'));
            // 路由名称组件
            d.push(text.dom(this.attr.name, 'cs-text-route'));
            // 将路由DOM 添加到拓扑网格
            $(ps).html(util.div(d.join(''), router.id(this.attr.uuid), 'cs-td-box'));
        },
        // 构建一个路由对象
        build: function(data) {
            var ret = {};
            // 构建路由属性
            ret.attr = router.attr(data);
            // 构建路由操作
            ret.method = router.method(ret);
            // 返回路由对象
            return ret;
        }
    };

    // 对象定位对象
    var position = {
    	// 默认当前行号
        curRow: 1,
        // 定位初始化方法
        init: function() {
        	// 新的拓扑，当前行归 1
            position.curRow = 1;
        },
        // 返回拓扑单元格对象
        sel: function(p, tid) {
        	// 单元格对象【表格id + tr
            return $(tid + '-tr' + p[0] + '-td' + p[1]);
        },
        // 获得路由对象拓扑单元格坐标
        route: function(rs) {
            var rsl = rs.length;
            var column;
            var ret = [];
            var p = util.page(rsl, bg.trTds);
            for (var pi = 0; pi < p; pi++) {
            	column = 0;
                if (pi > 0 && rsl % bg.trTds !== 0 && pi === p - 1) {
                    column = parseInt((bg.trTds - (rsl % bg.trTds)) / 2);
                }
                for (var i = 0; i < bg.trTds; i++, column++) {
                	if(ret.length >= rsl) {
                		break;
                	}
                    ret.push([position.curRow, column]);
                }
                position.curRow = position.curRow + 2
            }
            return ret;
        },
        // 获得网络对象拓扑单元格坐标
        network: function(nws) {

        }
    };

    // 拓扑对象，组装其他组件
    var topology = {
        // 新拓扑对象需初始化对象
        init: function() {
            // 初始化定位对象
            position.init();
        },
        // 构建拓扑路由对象
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
        // 构建拓扑网络对象
        network: function(data, tid) {
        	// var nws = data.networks;
        	// if(!nws)  {
        	// 	return;
        	// }
        	// var ps = position.network(nws);
        	// for(var i = 0; i < nws.length; i++) {
        	// 	var nw = nws[i];
        	// 	var p = ps[i];
        	// 	var sel = position.sel(p, tid);
        	// 	network.dom(sel, nw);
        	// }
        },
        // 构建拓扑图
        build: function(data, tid) {
            // 初始化对象参数
            topology.init();
            // 拓扑添加路由对象
            topology.route(data, tid);
            // 拓扑添加网络对象
            topology.network(data, tid);
        }
    };

    $.fn.csTopology = function(data) {
        var s = $(this);
        var w = s.width();
        // 1.构建拓扑图背景表格
        var t = bg.table(w, data);
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
    css.push('.cs-icon-bg{position:absolute;top:0px;left:0px;background-image: url("data:image/png;base64,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");}');
    css.push('.cs-icon-pub-net{background-position:0 0;width:100px;height:77px;bottom:0px;top:initial;}');
    css.push('.cs-icon-route{background-position:0 -93px;width:26px;height:26px;position:static;margin:8px auto 0;}');
    css.push('.cs-icon-ok{background-position:-50px -93px;width:16px;height:16px;top:4px;left:initial;right:2px;}');
    css.push('.cs-text{text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}');
    css.push('.cs-text-route{position:static;width:76px;margin:3px auto 0;color:#666;font-family:"microsoft yahei";font-size: 13px;}');
    style1.innerHTML = css.join('\n');
    document.head.appendChild(style1);
})();
