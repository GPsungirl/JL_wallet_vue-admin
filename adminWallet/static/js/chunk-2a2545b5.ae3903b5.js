(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2a2545b5"],{"9fcd":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"pad_5"},[a("div",{staticClass:"query_fields pad_b_no"},[a("el-form",{ref:"queryForm",staticClass:"demo-form-inline",attrs:{inline:!0,model:e.queryForm,size:"mini"}},[a("el-form-item",{attrs:{label:"所属机构",prop:"agent_name"}},[a("el-input",{staticClass:"wid_140",attrs:{placeholder:"请输入所属机构"},model:{value:e.queryForm.agent_name,callback:function(t){e.$set(e.queryForm,"agent_name",t)},expression:"queryForm.agent_name"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"向导ID",prop:"live_customid"}},[a("el-input",{staticClass:"wid_140",attrs:{placeholder:"请输入向导ID"},model:{value:e.queryForm.live_customid,callback:function(t){e.$set(e.queryForm,"live_customid",t)},expression:"queryForm.live_customid"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"向导姓名",prop:"name"}},[a("el-input",{staticClass:"wid_140",attrs:{placeholder:"请输入向导姓名"},model:{value:e.queryForm.name,callback:function(t){e.$set(e.queryForm,"name",t)},expression:"queryForm.name"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"用户ID",prop:"customid","label-width":"68px"}},[a("el-input",{staticClass:"wid_140",attrs:{placeholder:"请输入上级ID"},model:{value:e.queryForm.customid,callback:function(t){e.$set(e.queryForm,"customid",t)},expression:"queryForm.customid"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"订单时间",prop:"orderTime"}},[a("el-date-picker",{attrs:{type:"daterange","value-format":"yyyy-MM-dd","range-separator":"至","start-placeholder":"开始时间","end-placeholder":"结束时间"},model:{value:e.queryForm.orderTime,callback:function(t){e.$set(e.queryForm,"orderTime",t)},expression:"queryForm.orderTime"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"预约时间",prop:"reserveTime"}},[a("el-date-picker",{attrs:{type:"daterange","value-format":"yyyy-MM-dd","range-separator":"至","start-placeholder":"开始时间","end-placeholder":"结束时间"},model:{value:e.queryForm.reserveTime,callback:function(t){e.$set(e.queryForm,"reserveTime",t)},expression:"queryForm.reserveTime"}})],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:e.queryData}},[e._v("查询")]),e._v(" "),a("el-button",{attrs:{type:"success",size:"mini"},on:{click:function(t){return e.resetData("queryForm")}}},[e._v("重置")]),e._v(" "),a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:e.handle_refresh}},[e._v("刷新")])],1)],1)],1),e._v(" "),a("div",[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.tableLoading,expression:"tableLoading"}],staticStyle:{width:"100%"},attrs:{data:e.tableData,border:"",stripe:""}},[a("el-table-column",{attrs:{prop:"customid",label:"用户ID",width:"80"}}),e._v(" "),a("el-table-column",{attrs:{prop:"nickname",label:"昵称",width:"80"}}),e._v(" "),a("el-table-column",{attrs:{prop:"",label:"向导ID",width:"80"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){return e.handle_detail(t.row)}}},[e._v("\n              "+e._s(t.row.live_customid))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"name",label:"向导姓名",width:"80"}}),e._v(" "),a("el-table-column",{attrs:{prop:"agent_name",label:"所属机构",width:""}}),e._v(" "),a("el-table-column",{attrs:{prop:"orderCreatetime",label:"订单时间",width:"160"}}),e._v(" "),a("el-table-column",{attrs:{prop:"",label:"订单状态",width:"80"},scopedSlots:e._u([{key:"default",fn:function(t){return[0==t.row.live_order_status?a("span",[e._v("下单")]):1==t.row.live_order_status?a("span",[e._v("订单完成")]):3==t.row.live_order_status?a("span",[e._v("支付成功")]):4==t.row.live_order_status?a("span",[e._v("订单确认")]):5==t.row.live_order_status?a("span",[e._v("订单取消")]):6==t.row.live_order_status?a("span",[e._v("订单取消已退款")]):7==t.row.live_order_status?a("span",[e._v("订单取消退款失败")]):e._e()]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"",label:"拒绝类别",width:"80"},scopedSlots:e._u([{key:"default",fn:function(t){return[0==t.row.reject_type?a("span",[e._v("未拒绝")]):1==t.row.reject_type?a("span",[e._v("直接拒绝")]):2==t.row.reject_type?a("span",[e._v("未接单到时拒绝")]):3==t.row.reject_type?a("span",[e._v("未完成清理")]):e._e()]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"task_begin_time",label:"预约时间",width:"160"}}),e._v(" "),a("el-table-column",{attrs:{prop:"amount",label:"贝壳",width:"60"}})],1),e._v(" "),a("div",{staticClass:"block mar_t10"},[a("el-pagination",{attrs:{"current-page":e.currentPage,total:e.pageTotal,background:"",layout:"total, prev, pager, next, jumper"},on:{"current-change":e.handleCurrentChange}})],1)],1),e._v(" "),a("el-dialog",{directives:[{name:"loading",rawName:"v-loading",value:e.detail_loading,expression:"detail_loading"}],staticClass:"agent_detail",attrs:{title:"向导详情",visible:e.detail_dialogVisible,width:"50%",center:"","close-on-click-modal":!1,"element-loading-text":"拼命加载中","element-loading-spinner":"el-icon-loading","element-loading-background":"rgba(0, 0, 0, 0.8)"},on:{"update:visible":function(t){e.detail_dialogVisible=t}}},[a("el-form",{staticClass:"demo-form-inline ",attrs:{inline:!0,model:e.detail_form,"label-width":"68px",disabled:""}},[a("el-form-item",{attrs:{label:"向导ID",prop:"customid"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.detail_form.customid,callback:function(t){e.$set(e.detail_form,"customid",t)},expression:"detail_form.customid"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"向导姓名",prop:"name"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.detail_form.name,callback:function(t){e.$set(e.detail_form,"name",t)},expression:"detail_form.name"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"民族",prop:"traveler_native"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.detail_form.traveler_native,callback:function(t){e.$set(e.detail_form,"traveler_native",t)},expression:"detail_form.traveler_native"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"性别",prop:"sex"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.detail_form.sex,callback:function(t){e.$set(e.detail_form,"sex",t)},expression:"detail_form.sex"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"居住地",prop:"juzhudi"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.detail_form.juzhudi,callback:function(t){e.$set(e.detail_form,"juzhudi",t)},expression:"detail_form.juzhudi"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"职业",prop:"profession"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.detail_form.profession,callback:function(t){e.$set(e.detail_form,"profession",t)},expression:"detail_form.profession"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"详细地址",prop:"address"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.detail_form.address,callback:function(t){e.$set(e.detail_form,"address",t)},expression:"detail_form.address"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"身高",prop:"tall"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.detail_form.tall,callback:function(t){e.$set(e.detail_form,"tall",t)},expression:"detail_form.tall"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"体重",prop:"weight"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.detail_form.weight,callback:function(t){e.$set(e.detail_form,"weight",t)},expression:"detail_form.weight"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"联系电话",prop:"phone"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.detail_form.phone,callback:function(t){e.$set(e.detail_form,"phone",t)},expression:"detail_form.phone"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"陌陌号",prop:"momo"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.detail_form.momo,callback:function(t){e.$set(e.detail_form,"momo",t)},expression:"detail_form.momo"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"微信号",prop:"webchat"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.detail_form.webchat,callback:function(t){e.$set(e.detail_form,"webchat",t)},expression:"detail_form.webchat"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"出生日期",prop:"birthday"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.detail_form.birthday,callback:function(t){e.$set(e.detail_form,"birthday",t)},expression:"detail_form.birthday"}})],1)],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{size:"mini"},on:{click:function(t){e.detail_dialogVisible=!1}}},[e._v("关 闭")])],1)],1)],1)},i=[],l=(a("7f7f"),a("ff82"),a("cf45")),o=a("61f7"),s={name:"InvitationOnlineRecord",data:function(){var e=this,t=function(e,t,a){t?Object(o["c"])(t)?a():a(new Error("请输入正确手机号码")):a(new Error("请输入电话号码"))},a=function(e,t,a){t||0==t?Object(o["f"])(t)?a():a(new Error("请输入0-15之间的数")):a(new Error("请输入值"))},r=function(t,a,r){var i=e.limit_virtual_rate;a||0==a?Object(o["d"])(a,i)?r():r(new Error("请输入0-"+i+"之间的数")):r(new Error("请输入值"))};return{roleId:"",loading:!1,searchResult:"",add_dialogVisible:!1,add_loading:!1,limit_virtual_rate:"",add_form_traveler:{name:"",customId:"",virtual_rate:"",profit_virtual_rate:"",profit_account_rate:"",phone:""},add_bank_traveler_rules:{name:[{required:!0,message:"请输入姓名",trigger:"blur"}],customId:[{required:!0,message:"请输入向导ID",trigger:"blur"}],virtual_rate:[{required:!0,validator:r,trigger:"blur"},{type:"number",message:"贝壳分成必须为数字"}],profit_virtual_rate:[{required:!0,validator:a,trigger:"blur"},{type:"number",message:"贝壳分成必须为数字"}],profit_account_rate:[{required:!0,validator:a,trigger:"blur"},{type:"number",message:"贝壳分成必须为数字"}],phone:[{required:!0,validator:t,trigger:"blur"}]},districtSearch:"",tableLoading:!1,tableData:[],detail_dialogVisible:!1,detail_loading:!1,up_detail_dialogVisible:!1,up_detail_loading:!1,agent_detail_dialogVisible:!1,agent_detail_loading:!1,pageTotal:0,currentPage:1,queryForm:{agent_name:"",name:"",customid:"",live_customid:"",orderTime:"",liveStartTime:"",liveEndTime:"",reserveTime:"",orderStartTime:"",orderEndTime:""},detail_form:{customid:"",name:"",up_customid:"",up_name:"",traveler_native:"",sex:"",juzhudi:"",profession:"",address:"",tall:"",weight:"",phone:"",webchat:"",momo:"",birthday:"",virtual_rate:"",account_rate:""},up_detail_form:{customid:"",name:"",up_customid:"",up_name:"",traveler_native:"",sex:"",juzhudi:"",profession:"",address:"",tall:"",weight:"",phone:"",webchat:"",momo:"",birthday:"",virtual_rate:"",account_rate:""},bankInfo:"",agent_detail_form:{regions:[],cities:[],bankInfo:"",agentid:"",agent_name:"",charger:"",province_code:"",city_code:"",address:"",virtual_rate:"",account_rate:"",phone:"",email:"",contract_no:"",bank_code:"",account_user:"",account_no:"",account_regions:"",account_cities:[],account_province_code:"",account_city_code:""}}},created:function(){this.roleId=this.$store.getters.roleId,this.getTableDataList(1)},methods:{getTableDataList:function(e){var t=this,a={data:{signInUserId:this.$store.getters.userId,signInRoleId:this.$store.getters.roleId,pageNum:e,pageSize:10,agent_name:this.queryForm.agent_name,customid:this.queryForm.customid,name:this.queryForm.name,live_customid:this.queryForm.live_customid,liveStartTime:this.queryForm.liveStartTime,liveEndTime:this.queryForm.liveEndTime,orderStartTime:this.queryForm.orderStartTime,orderEndTime:this.queryForm.orderEndTime}};this.tableLoading=!0,this.$http.post("".concat(l["a"].baseUrl,"/liveOrderInfo/selectLiveOrderInfoList"),a).then(function(e){"0000"==e.data.code&&(console.log(e),t.tableData=e.data.data.liveOrderInfoList,t.pageTotal=e.data.data.page.pageTotal,t.tableLoading=!1)}).catch(function(e){})},resetPsw:function(e){var t=this;this.$confirm("是否重置密码","重置密码",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning",size:"mini",center:!0}).then(function(){var a={data:{travelerid:e.travelerid,signInRoleId:t.roleId}};t.$http.post("".concat(l["a"].baseUrl,"/travelerInfo/resetTravelerPassword"),a).then(function(e){"0000"==e.data.code?(t.m_message(e.data.msg,"success"),t.handle_refresh()):t.m_message(e.data.msg,"warning")}).catch(function(e){})})},queryData:function(){console.log(this.queryForm),this.queryForm.reserveTime.length>0&&(this.queryForm.liveStartTime=this.queryForm.reserveTime[0],this.queryForm.liveEndTime=this.queryForm.reserveTime[1]),this.queryForm.orderTime.length>0&&(this.queryForm.orderStartTime=this.queryForm.orderTime[0],this.queryForm.orderEndTime=this.queryForm.orderTime[1]),this.getTableDataList(1),this.currentPage=1},resetData:function(e){this.$refs[e]&&this.$refs[e].resetFields(),this.queryForm.liveStartTime="",this.queryForm.liveEndTime="",this.queryForm.orderStartTime="",this.queryForm.orderEndTime=""},handle_refresh:function(){this.getTableDataList(this.currentPage)},handle_detail:function(e){var t=this;this.detail_dialogVisible=!0,this.detail_loading=!0,this.$http.post("".concat(l["a"].baseUrl,"/travelerInfo/findByCustomId"),{data:{customid:e.live_customid}}).then(function(e){if("0000"==e.data.code){console.log(e);var a=e.data.data.travelerInfo;t.detail_form.name=a.name,t.detail_form.customid=a.customid,t.detail_form.agent_name=a.agent_name,t.detail_form.up_customid=a.up_customid,t.detail_form.up_name=a.up_name,t.detail_form.traveler_native=a.traveler_native,t.detail_form.sex="01"==a.sex?"男":"女",t.detail_form.juzhudi=a.province+a.city;var r="";switch(a.profession_type){case 0:r="其他";break;case 1:r="学生";break;case 2:r="都市白领";break;case 3:r="导游";break;case 4:r="自由职业";break}t.detail_form.profession=r,t.detail_form.address=a.address,t.detail_form.tall=a.tall+"cm",t.detail_form.weight=a.weight+"kg",t.detail_form.phone=a.phone,t.detail_form.webchat=a.webchat,t.detail_form.momo=a.momo,t.detail_form.birthday=a.birthday,t.detail_form.virtual_rate=a.virtual_rate,t.detail_form.account_rate=a.account_rate,t.detail_loading=!1}}).catch(function(e){})},m_message:function(e,t){this.$message({message:e,type:t})},m_valid_addForm:function(e){var t=!1;return this.$refs[e].validate(function(e){return e?(t=!0,!0):(t=!1,!1)}),t},handleCurrentChange:function(e){this.currentPage=e,this.getTableDataList(e)}}},n=s,d=a("2877"),m=Object(d["a"])(n,r,i,!1,null,null,null);t["default"]=m.exports},ff82:function(e,t,a){"use strict";t["a"]={province_list:{11e4:"北京市",12e4:"天津市",13e4:"河北省",14e4:"山西省",15e4:"内蒙古自治区",21e4:"辽宁省",22e4:"吉林省",23e4:"黑龙江省",31e4:"上海市",32e4:"江苏省",33e4:"浙江省",34e4:"安徽省",35e4:"福建省",36e4:"江西省",37e4:"山东省",41e4:"河南省",42e4:"湖北省",43e4:"湖南省",44e4:"广东省",45e4:"广西壮族自治区",46e4:"海南省",5e5:"重庆市",51e4:"四川省",52e4:"贵州省",53e4:"云南省",54e4:"西藏自治区",61e4:"陕西省",62e4:"甘肃省",63e4:"青海省",64e4:"宁夏回族自治区",65e4:"新疆维吾尔自治区",71e4:"台湾省",81e4:"香港特别行政区",82e4:"澳门特别行政区"},adcode_list:{"上海市":"310000","云南省":"530000","内蒙古自治区":"150000","北京市":"110000","台湾省":"710000","吉林省":"220000","四川省":"510000","天津市":"120000","宁夏回族自治区":"640000","安徽省":"340000","山东省":"370000","山西省":"140000","广东省":"440000","广西壮族自治区":"450000","新疆维吾尔自治区":"650000","江苏省":"320000","江西省":"360000","河北省":"130000","河南省":"410000","浙江省":"330000","海南省":"460000","湖北省":"420000","湖南省":"430000","澳门特别行政区":"820000","甘肃省":"620000","福建省":"350000","西藏自治区":"540000","贵州省":"520000","辽宁省":"210000","重庆市":"500000","陕西省":"610000","青海省":"630000","香港特别行政区":"810000","黑龙江省":"230000"}}}}]);