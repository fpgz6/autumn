$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'gen/gentype/list',
        datatype: "json",
        colModel: [			
			{ label: 'id', name: 'id', index: 'id', width: 50, key: true },
			{ label: '数据库类型', name: 'databaseType', index: 'database_type', width: 80 }, 			
			{ label: '程序根包名', name: 'rootPackage', index: 'root_package', width: 80 }, 			
			{ label: '模块根包名', name: 'modulePackage', index: 'module_package', width: 80 }, 			
			{ label: '模块名(用于包名)', name: 'moduleName', index: 'module_name', width: 80 }, 			
			{ label: '模块名称(用于目录)', name: 'moduleText', index: 'module_text', width: 80 }, 			
			{ label: '作者名字', name: 'authorName', index: 'author_name', width: 80 }, 			
			{ label: '作者邮箱', name: 'email', index: 'email', width: 80 }, 			
			{ label: '表前缀', name: 'tablePrefix', index: 'table_prefix', width: 80 }, 			
			{ label: '表字段映射', name: 'mappingString', index: 'mapping_string', width: 80 }, 			
        ],
		viewrecords: true,
        height: 385,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader : {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames : {
            page:"page", 
            rows:"limit", 
            order: "order"
        },
        gridComplete:function(){
        	//隐藏grid底部滚动条
        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
        }
    });
});

var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: true,
		title: null,
		genType: {}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.genType = {};
		},
		update: function (event) {
			var id = getSelectedRow();
			if(id == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(id)
		},
		saveOrUpdate: function (event) {
			var url = vm.genType.id == null ? "gen/gentype/save" : "gen/gentype/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.genType),
			    success: function(r){
			    	if(r.code === 0){
						alert('操作成功', function(index){
							vm.reload();
						});
					}else{
						alert(r.msg);
					}
				}
			});
		},
		del: function (event) {
			var ids = getSelectedRows();
			if(ids == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "gen/gentype/delete",
                    contentType: "application/json",
				    data: JSON.stringify(ids),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								$("#jqGrid").trigger("reloadGrid");
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		getInfo: function(id){
			$.get(baseURL + "gen/gentype/info/"+id, function(r){
                vm.genType = r.genType;
            });
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{ 
                page:page
            }).trigger("reloadGrid");
		}
	}
});