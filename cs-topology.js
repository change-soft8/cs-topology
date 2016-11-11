;
(function() {
	// 拓扑工具方法
	var util = {
		div: function(dom, id) {
			var d = [];
			d.push('<div style="position:relative;width:100%" id="')
			if(id) {
				d.push(id);
			}
			d.push('">');
			d.push(dom);
			d.push('</div>');
			return d.join('');
		},
		page: function(num, size) {
			var dif = num * 1.0 / size;
			var idif = parseInt(dif);
			if(dif > idif) {
				idif++;
			}
			return idif;
		}
	}

	// 图片对象
	var img = {
		psBottom: function(src) {
			return util.div('<img style="postion:absolute;bottom:0px;left:0px;" src="' + src + '"/>');
		}
	}

	// 拓扑背景对象
    var bg = {
        num: 0,
        // 默认单元格宽度为80px
        tdWidth: 80,
        // 默认单元格高度为60px
        tdHeight: 60,
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
    	icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABVCAMAAACmX5D8AAAAA3NCSVQICAjb4U/gAAABYlBMVEX////////8/f38/P36+/v5+/v5+vv3+fnx+vz3+Pn19/j09/ju+fvs+frt+fv09vfz9ffx9fXo9/rm9/nw8/Xj9vnv8vPt8fPv8fPh9fjt7/Hr7/Hp7u/p7e/r7e/n7O/p6+7l6+3n6ezj6evj6ezh5+vk5+rg5+nf5uni5end5efg4+fd5Ofb4+bb4+fe4eXZ4eXc3+TX4OPX3+PV3uLZ3eLX2+DV2d/T2N3R1tvP09rM0tia3+nK0NbIztWT3eeR3OeO2+bGzNOM2+bEytHDytGJ2uWH2eXByM+/xs69xMy7wsq5wMm3vse0vMVmz92yusNizt1kzt2wuMJizd1gzdyutsBcy9tay9tZy9urtL6ps72nsbulr7mlr7qjrbihq7acp7OapbGYo6+Woa6Tn6yRnaqPm6mNmaeLl6WJlaSGk6KEkaCCj5+AjZ1+i5t8ipp7iZl4iZl3hpZ1hJRzgpN/YgBhAAAAdnRSTlMA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7tKBHgAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMS8xMC8xNrkYUY4AAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAFc0lEQVRoge2Z7VfiRhSHd2IKErcFu1QsoMiCr4hA5oriFte27i6y0dpa2yJadY2KiNBV8//3BiFAyCRBYT/s8XeOnjDM3Gfmzsu9E16QL6wXz8Bn4NcM5DwTc0lAJedC3qFBA4fGFqBDiz5+gEA+JALQ2cBIHcK7fRH1c9gO8lHAIAWY9XSWeSKIDHKDADqWAKJOg/IwQNyg/KlArwhxwfgrYRHoWL+BAYAw03EcDjLYX6APwGfxvTmxR6BAwcJnXjCv0RvQIcKEVR0fULOV0xtwESLWlcIQN9kdPQEDpqaa4pbMptEK6ApMJ4HGo+phyVMYsdMvASj7zDEHCm0HZpQP2XGoqiiEHgXkQgBiyOMgnGMsQoFSsDxHHuQAyoweJkB+CWhAmzM+CjBtj0dIhL1Z2UAurjsZPdRrF+iBxd6BuLp1fnHaWKINicDyKRM4CqLDtv0uRYDlDSZwyfzMtJCPuU5ZQDckn8DD5nM9Aieswoy5HMz+soAL4HoKkAPaI5CC/SVpJIDegPoejldQpR2tE7HzRnHzqd9Av7KWSmWqu83PqUqjmAgxO+0tgK7grK6HfsWP/zfLZCaBB0AWgf78Oq8CvRk89t5Iq50W8DSdC3mMZqUbyAfj9ejQse0fgPkSkQ7r40p9rhyXr3j1qUL4y+ujWrHDiKdugka6V54eyPkwh05OeHQBza9sZbPS7TsNqKQJd7X+AFy/cpKpkq7F0IgP3QTT35gDnTi6aYMo61cuZPnkDdGAVSzcKT4AD3a6G9TFB0UMOGbAMQpxXQrfBPofHprAmzbg4TYDiOPERDXMBmKSyzgCNeDHU0LWVJdOEq7UcOnmBeYG/00atxwVIcoCethJrgZMKId/XaqL5mr7vNxYNEL5bPvqlNGSuJIdY2wDOkUI6Gs3JUjN68RKcXtcIv7c/MG2G4vxCY9q6XCTfTA5abvdFhAjfNSgeh/kAdraYy1gkJ0WPFXhtmxIA2LSybiEPV1DYsu2BgzaTTofozbjGjA+uAHiEFuJahPogvjgeIRMw6gOGDDJzvugVlLVBEa0LgxEAizogHFgZqGZihpjYxWtYD7BqHjMBA6BqAOK7Bwmq5Qx9KQUrUDOMirKTGAr5WgCKSsHQTu1m90GMC2tO0miXExnOYz7mFyveclMPocP6cl8RgWm08ZGaDeQPcLKyn2sDjy6ObooC/nP5fxNgqwqOeK/d767Ozm7jRH5+lhCYK46ZRNoModZjHglDoGxa7xN/butunRvh+yVP5HNM+cdDmnnnMgHqkuZvO45jIBh4G0AhaqEwHxVlmXEIHC5TErZW+5sM1bDGlP39XnN3ipFho3uVRpgvw9BIMnc5xQiXWRRadU4V0vc8ZXlu/FEtQ1YS98aJo1G+1BgxwoVSE5uFbJSRZeuZerGi59kcnhRIsL9PCFblw9AmWxdGS+F2a6ThiSZF/g60F1TCCdf7xTvUuRUXiXLioT7RcL5q+0W71aaQK700cgEnqXNjmjAkC7ZaWkmp/5PoXH+l8O91+jBgxzhpCnildQ8JlPcm0EY/s0g9HXeaIhG0cLRHpb7LIyHWkbcivhh+y8pepVhxCd88kmXbBONtr+ZasvavADuQfBctH0k7XnpBNABEF0iKy9Vfd1/r3opO/NW9wZE7Pz48HLjz/2Nb21UHIqa3i3qr+xp2HJ7fP9bAfX7D1b1+AkKVOcz/f2QR7fCQtBtCt0ofPju5UbhvSnMHZgDA4d134CdYREstF9Adw7/87dVPWrwe4rRHZ9zB2eT1sCCKTA5F3Tbu+Pb0M+Ft8PDPxU+PKbto4Cv/lAXzf6PXwxIXv1aKLy3XKR9BBJSKDyy4TPwGfgMfAZ+hcD/ASnUK1k5FxSDAAAAAElFTkSuQmCC',
    	append: function(tid) {
    		$(tid).find('thead td:eq(' + bg.trTds / 2 + ')').html(img.psBottom(pubNet.icon));
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
    		
    		$(ps).html(util.div(d.join(''), router.id(this.attr.uuid)));
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
    		for(var pi = 0; pi < p; pi++,position.row += 2) {
    			if(pi === p - 1) {
    				column = parseInt(bg.trTds - (rsl % bg.trTds) / 2);
    			}
    			for(var i = 0; i < rsl; i++,column++) {
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
    		if(!rs) {
    			return;
    		}
    		var ps = position.route(rs);
    		for(var i = 0; i < rs.length; i++) {
    			var r = rs[i];
    			var p = ps[i];
    			var ps = position.sel(p, tid);
    			var ro = router.build(r);
    			// 放置路由到拓扑
    			ro.method.dom(ps);
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
})();
