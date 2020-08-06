(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2620b352"],{f7cc:function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"pad_5"},[a("div",{staticClass:"query_fields pad_b_no"},[a("el-form",{ref:"queryForm",staticClass:"demo-form-inline",attrs:{inline:!0,model:e.queryForm,size:"mini"}},[a("el-form-item",{attrs:{label:"所属机构",prop:"agentName"}},[a("el-input",{staticClass:"wid_140",attrs:{placeholder:"请输入所属机构"},model:{value:e.queryForm.agentName,callback:function(t){e.$set(e.queryForm,"agentName",t)},expression:"queryForm.agentName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"向导姓名",prop:"name"}},[a("el-input",{staticClass:"wid_140",attrs:{placeholder:"请输入向导姓名"},model:{value:e.queryForm.name,callback:function(t){e.$set(e.queryForm,"name",t)},expression:"queryForm.name"}})],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:e.queryData}},[e._v("查询")]),e._v(" "),a("el-button",{attrs:{type:"success",size:"mini"},on:{click:function(t){return e.resetData("queryForm")}}},[e._v("重置")]),e._v(" "),a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:e.handle_refresh}},[e._v("刷新")])],1)],1)],1),e._v(" "),a("div",[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.tableLoading,expression:"tableLoading"}],staticStyle:{width:"100%"},attrs:{data:e.tableData,border:"",stripe:""}},[a("el-table-column",{attrs:{prop:"customid",label:"向导ID",width:""}}),e._v(" "),a("el-table-column",{attrs:{prop:"name",label:"姓名",width:"80px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"",label:"性别",width:"50px"},scopedSlots:e._u([{key:"default",fn:function(t){return["01"==t.row.sex?a("span",[e._v("男")]):"02"==t.row.sex?a("span",[e._v("女")]):e._e()]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"birthday",label:"出生日期",width:""}}),e._v(" "),a("el-table-column",{attrs:{prop:"agentName",label:"所属机构",width:""}}),e._v(" "),a("el-table-column",{attrs:{prop:"address",label:"居住地",width:""}}),e._v(" "),a("el-table-column",{attrs:{prop:"",label:"操作",width:""},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){return e.handle_examine(t.row)}}},[e._v("视频审核")])]}}])})],1),e._v(" "),a("div",{staticClass:"block mar_t10"},[a("el-pagination",{attrs:{"current-page":e.currentPage,total:e.pageTotal,background:"",layout:"total, prev, pager, next, jumper"},on:{"current-change":e.handleCurrentChange}})],1)],1),e._v(" "),a("el-dialog",{directives:[{name:"loading",rawName:"v-loading",value:e.detail_loading,expression:"detail_loading"}],staticClass:"agent_detail",attrs:{title:"审核视频",visible:e.detail_dialogVisible,width:"50%",center:"","append-to-body":"","before-close":e.handle_close,"close-on-click-modal":!1,"element-loading-text":"拼命加载中","element-loading-spinner":"el-icon-loading","element-loading-background":"rgba(0, 0, 0, 0.8)"},on:{"update:visible":function(t){e.detail_dialogVisible=t}}},[a("p",[e._v("共"+e._s(e.video_num)+"条视频记录")]),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.detail_tableLoading,expression:"detail_tableLoading"}],staticStyle:{width:"100%"},attrs:{data:e.detail_tableData,border:"",stripe:""}},[a("el-table-column",{attrs:{prop:"file_id",label:"视频名",width:""}}),e._v(" "),a("el-table-column",{attrs:{prop:"duration",label:"视频时长(秒)",width:""}}),e._v(" "),a("el-table-column",{attrs:{prop:"",label:"操作",width:""},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){return e.handle_view(t.row)}}},[e._v("查看")])]}}])})],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{size:"mini"},on:{click:e.handle_close}},[e._v("关 闭")])],1),e._v(" "),a("el-dialog",{directives:[{name:"loading",rawName:"v-loading",value:e.video_loading,expression:"video_loading"}],staticClass:"agent_detail",attrs:{title:"视频查看",visible:e.video_dialogVisible,width:"50%",center:"","append-to-body":"","before-close":e.handleDialogClose,"close-on-click-modal":!1,"element-loading-text":"拼命加载中","element-loading-spinner":"el-icon-loading","element-loading-background":"rgba(0, 0, 0, 0.8)"},on:{"update:visible":function(t){e.video_dialogVisible=t}}},[a("div",{staticStyle:{height:"300px"},attrs:{id:"dplayer"}}),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{size:"mini"},on:{click:e.close_video}},[e._v("关 闭")])],1)])],1),e._v(" "),a("el-dialog",{directives:[{name:"loading",rawName:"v-loading",value:e.agent_detail_loading,expression:"agent_detail_loading"}],staticClass:"agent_detail",attrs:{title:"机构详情",visible:e.agent_detail_dialogVisible,width:"50%",center:"","close-on-click-modal":!1,"element-loading-text":"拼命加载中","element-loading-spinner":"el-icon-loading","element-loading-background":"rgba(0, 0, 0, 0.8)"},on:{"update:visible":function(t){e.agent_detail_dialogVisible=t}}},[a("el-form",{staticClass:"demo-form-inline ",attrs:{inline:!0,model:e.agent_detail_form,"label-width":"68px",disabled:""}},[a("el-form-item",{attrs:{label:"机构名称",prop:"agent_name"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:"审批人"},model:{value:e.agent_detail_form.agent_name,callback:function(t){e.$set(e.agent_detail_form,"agent_name",t)},expression:"agent_detail_form.agent_name"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"机构编号",prop:"agentid"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.agent_detail_form.agentid,callback:function(t){e.$set(e.agent_detail_form,"agentid",t)},expression:"agent_detail_form.agentid"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"负责人",prop:"charger","label-width":"68px"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:"负责人"},model:{value:e.agent_detail_form.charger,callback:function(t){e.$set(e.agent_detail_form,"charger",t)},expression:"agent_detail_form.charger"}})],1),e._v(" "),a("el-form-item",{staticClass:"marg_r0",attrs:{label:"业务地区"}},[a("el-col",{attrs:{span:11}},[a("el-form-item",{staticClass:"marg_b0",attrs:{prop:"province_code"}},[a("el-select",{staticClass:"wid_90",attrs:{placeholder:"选择省"},on:{change:function(t){return e.changeOption_province_addBusiness(t)}},model:{value:e.agent_detail_form.province_code,callback:function(t){e.$set(e.agent_detail_form,"province_code",t)},expression:"agent_detail_form.province_code"}},e._l(e.agent_detail_form.regions,function(e,t){return a("el-option",{key:t,attrs:{label:e.province,value:e.adcode}})}),1)],1)],1),e._v(" "),a("el-col",{attrs:{span:11}},[a("el-form-item",{staticClass:"marg_b0",attrs:{prop:"city_code"}},[a("el-select",{staticClass:"wid_90",attrs:{placeholder:"选择市"},on:{change:function(t){return e.changeOption_city_addBusiness(t)}},model:{value:e.agent_detail_form.city_code,callback:function(t){e.$set(e.agent_detail_form,"city_code",t)},expression:"agent_detail_form.city_code"}},e._l(e.agent_detail_form.cities,function(e,t){return a("el-option",{key:t,attrs:{label:e.city,value:e.adcode}})}),1)],1)],1)],1),e._v(" "),a("el-form-item",{attrs:{label:"联系地址",prop:"address"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:"联系地址"},model:{value:e.agent_detail_form.address,callback:function(t){e.$set(e.agent_detail_form,"address",t)},expression:"agent_detail_form.address"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"贝壳分成",prop:"virtual_rate"}},[a("el-input",{staticClass:"wid_181",attrs:{placeholder:"贝壳分成"},model:{value:e.agent_detail_form.virtual_rate,callback:function(t){e.$set(e.agent_detail_form,"virtual_rate",t)},expression:"agent_detail_form.virtual_rate"}}),e._v("%\n            ")],1),e._v(" "),a("el-form-item",{attrs:{label:"联系电话",prop:"phone"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:"联系电话"},model:{value:e.agent_detail_form.phone,callback:function(t){e.$set(e.agent_detail_form,"phone",t)},expression:"agent_detail_form.phone"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"出行分成",prop:"account_rate"}},[a("el-input",{staticClass:"wid_181",attrs:{placeholder:"出行分成"},model:{value:e.agent_detail_form.account_rate,callback:function(t){e.$set(e.agent_detail_form,"account_rate",t)},expression:"agent_detail_form.account_rate"}}),e._v("%\n            ")],1),e._v(" "),a("el-form-item",{attrs:{label:"联系邮箱",prop:"email"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:"联系邮箱"},model:{value:e.agent_detail_form.email,callback:function(t){e.$set(e.agent_detail_form,"email",t)},expression:"agent_detail_form.email"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"合同编号",prop:"contract_no"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:"合同编号"},model:{value:e.agent_detail_form.contract_no,callback:function(t){e.$set(e.agent_detail_form,"contract_no",t)},expression:"agent_detail_form.contract_no"}})],1),e._v(" "),a("div"),e._v(" "),a("el-form-item",{attrs:{label:"开户名",prop:"account_user","label-width":"68px"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:"开户名"},model:{value:e.agent_detail_form.account_user,callback:function(t){e.$set(e.agent_detail_form,"account_user",t)},expression:"agent_detail_form.account_user"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"开户行",prop:"bank_code","label-width":"68px"}},[a("el-select",{staticClass:"wid_190",attrs:{placeholder:"开户行"},on:{change:function(t){return e.changeOption_bank(t)}},model:{value:e.agent_detail_form.bank_code,callback:function(t){e.$set(e.agent_detail_form,"bank_code",t)},expression:"agent_detail_form.bank_code"}},e._l(e.agent_detail_form.bankInfo,function(e,t){return a("el-option",{key:t,attrs:{label:e.bankname,value:e.bankcode}})}),1)],1),e._v(" "),a("el-form-item",{attrs:{label:"账号",prop:"account_no","label-width":"68px"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:"账号"},model:{value:e.agent_detail_form.account_no,callback:function(t){e.$set(e.agent_detail_form,"account_no",t)},expression:"agent_detail_form.account_no"}})],1),e._v(" "),a("el-form-item",{staticClass:"marg_r0",attrs:{label:"开户地","label-width":"68px"}},[a("el-col",{attrs:{span:11}},[a("el-form-item",{staticClass:"marg_b0",attrs:{prop:"account_province_code"}},[a("el-select",{staticClass:"wid_90",attrs:{placeholder:"选择省"},on:{change:function(t){return e.changeOption_province_addBank(t)}},model:{value:e.agent_detail_form.account_province_code,callback:function(t){e.$set(e.agent_detail_form,"account_province_code",t)},expression:"agent_detail_form.account_province_code"}},e._l(e.agent_detail_form.account_regions,function(e,t){return a("el-option",{key:t,attrs:{label:e.province,value:e.adcode}})}),1)],1)],1),e._v(" "),a("el-col",{attrs:{span:11}},[a("el-form-item",{staticClass:"marg_b0",attrs:{prop:"city_code"}},[a("el-select",{staticClass:"wid_90",attrs:{placeholder:"选择市"},on:{change:function(t){return e.changeOption_city_addBank(t)}},model:{value:e.agent_detail_form.account_city_code,callback:function(t){e.$set(e.agent_detail_form,"account_city_code",t)},expression:"agent_detail_form.account_city_code"}},e._l(e.agent_detail_form.account_cities,function(e,t){return a("el-option",{key:t,attrs:{label:e.city,value:e.adcode}})}),1)],1)],1)],1)],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{size:"mini"},on:{click:function(t){e.agent_detail_dialogVisible=!1}}},[e._v("关 闭")])],1)],1),e._v(" "),a("el-dialog",{directives:[{name:"loading",rawName:"v-loading",value:e.up_detail_loading,expression:"up_detail_loading"}],staticClass:"agent_detail",attrs:{title:"向导详情",visible:e.up_detail_dialogVisible,width:"50%",center:"","close-on-click-modal":!1,"element-loading-text":"拼命加载中","element-loading-spinner":"el-icon-loading","element-loading-background":"rgba(0, 0, 0, 0.8)"},on:{"update:visible":function(t){e.up_detail_dialogVisible=t}}},[a("el-form",{staticClass:"demo-form-inline ",attrs:{inline:!0,model:e.up_detail_form,"label-width":"68px",disabled:""}},[a("el-form-item",{attrs:{label:"向导ID",prop:"customid"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.up_detail_form.customid,callback:function(t){e.$set(e.up_detail_form,"customid",t)},expression:"up_detail_form.customid"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"向导姓名",prop:"name"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.up_detail_form.name,callback:function(t){e.$set(e.up_detail_form,"name",t)},expression:"up_detail_form.name"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"上级ID",prop:"up_customid"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.up_detail_form.up_customid,callback:function(t){e.$set(e.up_detail_form,"up_customid",t)},expression:"up_detail_form.up_customid"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"上级姓名",prop:"up_name"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.up_detail_form.up_name,callback:function(t){e.$set(e.up_detail_form,"up_name",t)},expression:"up_detail_form.up_name"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"民族",prop:"traveler_native"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.up_detail_form.traveler_native,callback:function(t){e.$set(e.up_detail_form,"traveler_native",t)},expression:"up_detail_form.traveler_native"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"性别",prop:"sex"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.up_detail_form.sex,callback:function(t){e.$set(e.up_detail_form,"sex",t)},expression:"up_detail_form.sex"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"居住地",prop:"juzhudi"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.up_detail_form.juzhudi,callback:function(t){e.$set(e.up_detail_form,"juzhudi",t)},expression:"up_detail_form.juzhudi"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"职业",prop:"profession"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.up_detail_form.profession,callback:function(t){e.$set(e.up_detail_form,"profession",t)},expression:"up_detail_form.profession"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"详细地址",prop:"address"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.up_detail_form.address,callback:function(t){e.$set(e.up_detail_form,"address",t)},expression:"up_detail_form.address"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"身高",prop:"tall"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.up_detail_form.tall,callback:function(t){e.$set(e.up_detail_form,"tall",t)},expression:"up_detail_form.tall"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"体重",prop:"weight"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.up_detail_form.weight,callback:function(t){e.$set(e.up_detail_form,"weight",t)},expression:"up_detail_form.weight"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"联系电话",prop:"phone"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.up_detail_form.phone,callback:function(t){e.$set(e.up_detail_form,"phone",t)},expression:"up_detail_form.phone"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"陌陌号",prop:"momo"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.up_detail_form.momo,callback:function(t){e.$set(e.up_detail_form,"momo",t)},expression:"up_detail_form.momo"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"微信号",prop:"webchat"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.up_detail_form.webchat,callback:function(t){e.$set(e.up_detail_form,"webchat",t)},expression:"up_detail_form.webchat"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"出生日期",prop:"birthday"}},[a("el-input",{staticClass:"wid_180",attrs:{placeholder:""},model:{value:e.up_detail_form.birthday,callback:function(t){e.$set(e.up_detail_form,"birthday",t)},expression:"up_detail_form.birthday"}})],1)],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{size:"mini"},on:{click:function(t){e.up_detail_dialogVisible=!1}}},[e._v("关 闭")])],1)],1)],1)},l=[],o=(a("7f7f"),a("ff82"),a("cf45")),n=(a("61f7"),a("eccb"),a("1947")),r=a("f7a5"),s=a.n(r),d=a("5118"),c={name:"videoExamine",data:function(){return{dp:"",examine_row:"",video_num:"",districtSearch:"",tableLoading:!1,tableData:[],detail_tableData:[],detail_tableLoading:!1,detail_dialogVisible:!1,detail_loading:!1,video_dialogVisible:!1,video_loading:!1,up_detail_dialogVisible:!1,up_detail_loading:!1,agent_detail_dialogVisible:!1,agent_detail_loading:!1,pageTotal:0,currentPage:1,queryForm:{regions:"",cities:[],agentName:"",province_code:"",city_code:"",name:"",traveler_statuss:[{id:0,txt:"待审核"},{id:1,txt:"可用 "},{id:2,txt:"审批拒绝"},{id:3,txt:"不可用"}],traveler_status:"",up_customid:"",up_name:"",province_param:"",city_param:""},detail_form:{customid:"",name:"",up_customid:"",up_name:"",traveler_native:"",sex:"",juzhudi:"",profession:"",address:"",tall:"",weight:"",phone:"",webchat:"",momo:"",birthday:"",virtual_rate:"",account_rate:""},up_detail_form:{customid:"",name:"",up_customid:"",up_name:"",traveler_native:"",sex:"",juzhudi:"",profession:"",address:"",tall:"",weight:"",phone:"",webchat:"",momo:"",birthday:"",virtual_rate:"",account_rate:""},bankInfo:"",agent_detail_form:{regions:[],cities:[],bankInfo:"",agentid:"",agent_name:"",charger:"",province_code:"",city_code:"",address:"",virtual_rate:"",account_rate:"",phone:"",email:"",contract_no:"",bank_code:"",account_user:"",account_no:"",account_regions:"",account_cities:[],account_province_code:"",account_city_code:""}}},created:function(){this.roleId=this.$store.getters.roleId,this.getTableDataList(1)},methods:{getTableDataList:function(e){var t=this,a={data:{signInUserId:this.$store.getters.userId,signInRoleId:this.$store.getters.roleId,pageNum:e,pageSize:10,agentName:this.queryForm.agentName,name:this.queryForm.name}};this.tableLoading=!0,this.$http.post("".concat(o["a"].baseUrl,"/liveVideoRecord/getTravelerVideoExamine"),a).then(function(e){"0000"==e.data.code&&(t.tableData=e.data.data.liveVideoRecordList,t.pageTotal=e.data.data.page.pageTotal,t.tableLoading=!1)}).catch(function(e){})},handle_view:function(e){var t=this,a={data:{file_id:e.file_id}};this.detail_loading=!0,this.$http.post("".concat(o["a"].baseUrl,"/liveVideoRecord/getVideoPlay"),a).then(function(e){"0000"==e.data.code?(t.detail_loading=!1,t.video_dialogVisible=!0,Object(d["setTimeout"])(function(){t.dp=new s.a({container:document.getElementById("dplayer"),video:{url:e.data.data.video_url,type:"customFlv",autoplay:"auto",customType:{customFlv:function(e,t){var a=n["a"].createPlayer({type:"flv",url:e.src});a.attachMediaElement(e),a.load()}}}})},1)):t.m_message(e.data.msg,"warning")}).catch(function(e){})},close_video:function(){this.dp&&this.dp.destroy(),this.video_dialogVisible=!1,this.refresh_examineTableData()},handle_use:function(e){var t=this,a={data:{video_status:1,live_video_recordid:e.live_video_recordid,fileId:e.file_id}};this.detail_tableLoading=!0,this.$http.post("".concat(o["a"].baseUrl,"/liveVideoRecord/updateVideoStatus"),a).then(function(e){"0000"==e.data.code?(t.detail_tableLoading=!1,t.m_message(e.data.msg,"success"),t.refresh_examineTableData()):(t.detail_tableLoading=!1,t.m_message(e.data.msg,"warning"))}).catch(function(e){})},handle_fobidden:function(e){var t=this,a={data:{video_status:2,live_video_recordid:e.live_video_recordid,fileId:e.file_id}};this.detail_tableLoading=!0,this.$http.post("".concat(o["a"].baseUrl,"/liveVideoRecord/updateVideoStatus"),a).then(function(e){"0000"==e.data.code?(t.detail_tableLoading=!1,t.m_message("删除成功","success"),t.refresh_examineTableData()):(t.detail_tableLoading=!1,t.m_message(e.data.msg,"warning"))}).catch(function(e){})},handle_examine:function(e){var t=this;this.examine_row=e,this.detail_dialogVisible=!0,this.detail_loading=!0;var a={data:{signInUserId:this.$store.getters.userId,signInRoleId:this.$store.getters.roleId,customid:e.customid}};this.$http.post("".concat(o["a"].baseUrl,"/liveVideoRecord/getVideoExamine"),a).then(function(e){if("0000"==e.data.code){var a=e.data.data.liveVideoRecordList;t.detail_tableData=a,t.video_num=a.length,t.detail_loading=!1}}).catch(function(e){})},handleDialogClose:function(){this.dp&&this.dp.destroy(),this.video_dialogVisible=!1,this.refresh_examineTableData()},handle_close:function(){this.detail_dialogVisible=!1,this.handle_refresh()},queryData:function(){this.getTableDataList(1),this.currentPage=1},refresh_examineTableData:function(){var e=this,t=this.examine_row;this.detail_loading=!0;var a={data:{signInUserId:this.$store.getters.userId,signInRoleId:this.$store.getters.roleId,customid:t.customid}};this.$http.post("".concat(o["a"].baseUrl,"/liveVideoRecord/getVideoExamine"),a).then(function(t){if("0000"==t.data.code){var a=t.data.data.liveVideoRecordList;e.detail_tableData=a,e.video_num=a.length,e.detail_loading=!1}}).catch(function(e){})},resetData:function(e){this.$refs[e]&&this.$refs[e].resetFields()},handle_refresh:function(){this.getTableDataList(this.currentPage)},handle_up_name:function(e){var t=this;console.log(e.agentid);var a={data:{up_customid:e.up_customid}};this.up_detail_dialogVisible=!0,this.up_detail_loading=!0,this.$http.post("".concat(o["a"].baseUrl,"/travelerInfo/findByUpCustomId"),a).then(function(e){if("0000"==e.data.code){console.log(e);var a=e.data.data.travelerInfo;t.up_detail_form.name=a.name,t.up_detail_form.customid=a.customid,t.up_detail_form.agent_name=a.agent_name,t.up_detail_form.up_customid=a.up_customid,t.up_detail_form.up_name=a.up_name,t.up_detail_form.traveler_native=a.traveler_native,t.up_detail_form.sex="01"==a.sex?"男":"女",t.up_detail_form.juzhudi=a.province+a.city;var i="";switch(a.profession_type){case 0:i="其他";break;case 1:i="学生";break;case 2:i="都市白领";break;case 3:i="导游";break;case 4:i="自由职业";break}t.up_detail_form.profession=i,t.up_detail_form.address=a.address,t.up_detail_form.tall=a.tall+"cm",t.up_detail_form.weight=a.weight+"kg",t.up_detail_form.phone=a.phone,t.up_detail_form.webchat=a.webchat,t.up_detail_form.momo=a.momo,t.up_detail_form.birthday=a.birthday,t.up_detail_form.virtual_rate=a.virtual_rate,t.up_detail_form.account_rate=a.account_rate,t.up_detail_loading=!1}}).catch(function(e){})},handle_agent_name:function(e){var t=this;e.agentid;this.agent_detail_dialogVisible=!0,this.agent_detail_loading=!0,this.$http.post("".concat(o["a"].baseUrl,"/agent/selectAgentInfo"),{data:{agentid:e.agentid}}).then(function(e){if("0000"==e.data.code){console.log("机构信息："),console.log(e);var a=e.data.data.agentInfo;t.agent_detail_form.agentid=a.agentid,t.agent_detail_form.agent_name=a.agent_name,t.agent_detail_form.charger=a.charger,t.agent_detail_form.province_code=a.province_code,t.queryCity(a.province,"agent_detail_form"),t.agent_detail_form.city_code=a.city_code,t.agent_detail_form.address=a.address,t.agent_detail_form.virtual_rate=a.virtual_rate,t.agent_detail_form.account_rate=a.account_rate,t.agent_detail_form.phone=a.phone,t.agent_detail_form.email=a.email,t.agent_detail_form.contract_no=a.contract_no,t.agent_detail_form.bank_code=a.bank_code,t.agent_detail_form.account_user=a.account_user,t.agent_detail_form.account_no=a.account_no,t.queryBankCity(a.account_province,"agent_detail_form"),t.agent_detail_form.account_province_code=a.account_pro_code,t.agent_detail_form.account_city_code=a.account_city_code,t.agent_detail_loading=!1}}).catch(function(e){})},handle_frozen:function(e){var t=this;console.log(e),this.$confirm("是否冻结该向导?","冻结",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning",size:"mini",center:!0}).then(function(){var a="";a=1==e.traveler_status?3:1;var i={data:{traveler_status:a,travelerid:e.travelerid}};t.$http.post("".concat(o["a"].baseUrl,"/travelerInfo/updateTravelerStatus"),i).then(function(e){"0000"==e.data.code?(t.m_message(e.data.msg,"success"),t.handle_refresh()):t.m_message(e.data.msg,"warning")}).catch(function(e){})})},m_message:function(e,t){this.$message({message:e,type:t})},m_valid_addForm:function(e){var t=!1;return this.$refs[e].validate(function(e){return e?(t=!0,!0):(t=!1,!1)}),t},handleCurrentChange:function(e){this.currentPage=e,this.getTableDataList(e)}}},_=c,u=a("2877"),m=Object(u["a"])(_,i,l,!1,null,null,null);t["default"]=m.exports},ff82:function(e,t,a){"use strict";t["a"]={province_list:{11e4:"北京市",12e4:"天津市",13e4:"河北省",14e4:"山西省",15e4:"内蒙古自治区",21e4:"辽宁省",22e4:"吉林省",23e4:"黑龙江省",31e4:"上海市",32e4:"江苏省",33e4:"浙江省",34e4:"安徽省",35e4:"福建省",36e4:"江西省",37e4:"山东省",41e4:"河南省",42e4:"湖北省",43e4:"湖南省",44e4:"广东省",45e4:"广西壮族自治区",46e4:"海南省",5e5:"重庆市",51e4:"四川省",52e4:"贵州省",53e4:"云南省",54e4:"西藏自治区",61e4:"陕西省",62e4:"甘肃省",63e4:"青海省",64e4:"宁夏回族自治区",65e4:"新疆维吾尔自治区",71e4:"台湾省",81e4:"香港特别行政区",82e4:"澳门特别行政区"},adcode_list:{"上海市":"310000","云南省":"530000","内蒙古自治区":"150000","北京市":"110000","台湾省":"710000","吉林省":"220000","四川省":"510000","天津市":"120000","宁夏回族自治区":"640000","安徽省":"340000","山东省":"370000","山西省":"140000","广东省":"440000","广西壮族自治区":"450000","新疆维吾尔自治区":"650000","江苏省":"320000","江西省":"360000","河北省":"130000","河南省":"410000","浙江省":"330000","海南省":"460000","湖北省":"420000","湖南省":"430000","澳门特别行政区":"820000","甘肃省":"620000","福建省":"350000","西藏自治区":"540000","贵州省":"520000","辽宁省":"210000","重庆市":"500000","陕西省":"610000","青海省":"630000","香港特别行政区":"810000","黑龙江省":"230000"}}}}]);