<template>
  <!-- 推送管理》》信息推送 -->
  <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields pad_b_no">
      <el-form
        :inline="true"
        :model="queryForm"
        ref="queryForm"
        size="mini"
        class="demo-form-inline">

        <el-form-item label="发送时间" prop="allTime">
          <el-date-picker
              v-model="queryForm.allTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <!-- 发送人 -->
        <el-form-item label="发送人" prop="realName">
          <el-input v-model="queryForm.realName" placeholder="请输入发送人" class="wid_140"></el-input>
        </el-form-item>

        <!-- 查询 -->
        <el-form-item>
          <el-button type="primary" size="mini" @click="queryData">查询</el-button>
          <el-button type="success" size="mini" @click="resetData('queryForm')">重置</el-button>
          <el-button type="warning" size="mini" @click="handle_addIM">新增推送</el-button>
          <el-button type="primary" size="mini" @click="handle_refresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- M2 主列表 -->
    <div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
        <el-table-column prop="title" label="消息标题" width="">
        </el-table-column>
        <el-table-column prop="content" label="消息内容" width="">
        </el-table-column>
        <el-table-column prop="realName" label="发送人" width="">
        </el-table-column>
        <el-table-column prop="insert_date" label="发送日期" width="">
        </el-table-column>
        <el-table-column prop="" label="群体" width="">
          <template slot-scope="scope">
            <span v-if="scope.row.push_type == '1'">用户</span>
            <span v-else-if="scope.row.push_type == '2'">地区用户</span>
            <span v-else-if="scope.row.push_type == '3'">全体向导</span>
            <span v-else-if="scope.row.push_type == '4'">地区向导</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="备注" :show-overflow-tooltip="true" width="">
          <template slot-scope="scope">
             <span v-if="scope.row.push_type == '1'">
               {{ scope.row.customid }}
             </span>
            <span v-else-if="scope.row.push_type == '2'">
              {{scope.row.province + scope.row.city}}
            </span>
            <span v-else-if="scope.row.push_type == '3'">

            </span>
            <span v-else-if="scope.row.push_type == '4'">
               {{scope.row.province + scope.row.city}}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block mar_t10">
          <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :total="pageTotal"
          background
          layout="total, prev, pager, next, jumper"
          >
          </el-pagination>
      </div>
    </div>
    <!-- M3 推送消息 -->
    <el-dialog
      title="消息推送"
      :visible.sync="add_dialogVisible"
      top="8vh"
      class
      center
      :close-on-click-modal="false"
      v-loading="add_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-form
        :model="IMForm"
        :rules="IMForm_rules"
        ref="IMForm"
        label-width="100px"
        class="demo-IMForm"
        size="small"
      >
        <el-form-item label="消息标题" prop="title">
          <el-input v-model="IMForm.title"></el-input>
        </el-form-item>
        <el-form-item label="消息内容" prop="content">
          <el-input type="textarea" v-model="IMForm.content"></el-input>
        </el-form-item>
        <el-form-item label="消息群体" prop="target">
          <el-tabs v-model="target" @tab-click="handleClick">
            <el-tab-pane label="用户ID" name="1">
              <el-form>
                <el-form-item>
                  <div
                    class="input_itemgroup"
                    v-for="(item,index) in userID_form.dynamic_users"
                    :key="item.key"
                  >
                    <el-button
                      v-if="index != 0"
                      class="my_icon"
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      @click="delInput(item,index)"
                    ></el-button>
                    <el-input
                      class="id_input"
                      clearable
                      placeholder="输入用户ID"
                      v-model="userID_form.dynamic_users[index].userid"
                    ></el-input>
                  </div>
                  <el-button
                    class="userid_addicon"
                    size="mini"
                    type="primary"
                    icon="el-icon-plus"
                    circle
                    @click="addInput"
                  ></el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="地区用户" name="2">
              <el-form>
                <el-form-item label>
                  <el-col :span="9">
                    <el-form-item prop="province_code">
                      <el-select
                        v-model="region_form.province_code"
                        placeholder="选择省"
                        class="wid_140"
                        @change="changeOption_province($event,region_form)"
                      >
                        <el-option
                          v-for="(item, index) in region_form.regions"
                          :key="index"
                          :label=" item.province "
                          :value=" item.adcode "
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="city_code">
                      <el-select
                        v-model="region_form.city_code"
                        placeholder="选择市"
                        class="wid_140"
                        @change="changeOption_city($event,region_form)"
                      >
                        <el-option
                          v-for="(item, index) in region_form.cities"
                          :key="index"
                          :label=" item.city "
                          :value=" item.adcode "
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="全体向导" name="3">全体向导</el-tab-pane>
            <el-tab-pane label="地区向导" name="4">
              <el-form>
                <el-form-item label>
                  <el-col :span="9">
                    <el-form-item prop="province_code">
                      <el-select
                        v-model="regionGuider_form.province_code"
                        placeholder="选择省"
                        class="wid_140"
                        @change="changeOption_province($event,regionGuider_form)"
                      >
                        <el-option
                          v-for="(item, index) in regionGuider_form.regions"
                          :key="index"
                          :label=" item.province "
                          :value=" item.adcode "
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="city_code">
                      <el-select
                        v-model="regionGuider_form.city_code"
                        placeholder="选择市"
                        class="wid_140"
                        @change="changeOption_city($event,regionGuider_form)"
                      >
                        <el-option
                          v-for="(item, index) in regionGuider_form.cities"
                          :key="index"
                          :label=" item.city "
                          :value=" item.adcode "
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>

        <!-- <el-form-item>
          <el-button type="primary" @click="submitForm('IMForm')">推送消息</el-button>
          <el-button @click="resetForm('IMForm')">重置</el-button>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="add_dialogVisible = false" size="mini">取 消</el-button>
        <!-- 新增客服 -->
        <el-button type="primary" @click="submitForm('IMForm')" size="mini">推 送</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import provinces from "../../utils/area.js";
import commonUrl from "../../utils/common";

export default {
  name: "IMpush",
  data() {
    return {
      roleId: "",
      add_dialogVisible: false,
      add_loading: false,
      // 主列表
      tableLoading: false,
      tableData: [],
      // 分页
      pageTotal: 0,
      currentPage: 1,
      queryForm: {
        allTime: "",
        // 开始时间
        startTime:'',
        // 结束时间
        endTime:'',
        realName: ""
      },
      IMForm: {
        title: "",
        content: ""
      },
      target: "1",
      IMForm_rules: {
        title: [{ required: true, message: "请输入消息标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入消息内容", trigger: "blur" }
        ]
      },

      // 用户ID
      userID_form: {
        // 动态加入的
        dynamic_users: [
          {
            userid: "",
            key: Date.now()
          }
        ]
      },
      // 地区用户
      region_form: {
        // 初始化 省 regions  市 cities
        regions: "",
        cities: [],
        // 省市
        province_code: "",
        city_code: "",
        province_param: "", //作为收集参数
        city_param: "" //作为收集参数
      },
      // 全体向导
      allGuider_form: {
        // 默认未被选中
        isAllGuider: false
      },
      // 地区向导
      regionGuider_form: {
        // 初始化 省 regions  市 cities
        regions: "",
        cities: [],
        // 省市
        province_code: "",
        city_code: "",
        province_param: "", //作为收集参数
        city_param: "" //作为收集参数
      }
    };
  },
  watch: {
    // 监听tabs的变化
    target(newVal, oldVal) {
      // 若 是3，则 allGuider_form.isAllGuider 为true
      if (newVal === "3") {
        this.allGuider_form.isAllGuider = true;
      } else {
        this.allGuider_form.isAllGuider = false;
      }
    }
  },
  created() {
    // 初始化roleId
    this.roleId = this.$store.getters.roleId;
    // 初始化 地图plugin
    this.initMap();
    // 初始化 省份
    this.initProvinces();
    // 初始化 主列表
    this.getTableDataList(1);
  },
  methods: {
    // 获取主列表
    getTableDataList(pageNum) {
      let param = {
        data: {
          // 公有
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          pageNum: pageNum,
          pageSize: 10,
          // 私有
          realName:this.queryForm.realName,
          startTime:this.queryForm.startTime,
          endTime:this.queryForm.endTime,
        }
      };
      this.tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}//systemPush/getSystemPushList`, param)
        .then(res => {
          if (res.data.code == "0000") {
            // console.log(res);
            this.tableData = res.data.data.systemPushLsit;
            // 分页总数
            this.pageTotal = res.data.data.page.pageTotal;
            this.tableLoading = false;
          }
        })
        .catch(err => {});
    },
    // 查询按钮
    queryData() {
      // console.log(this.queryForm)
      if(this.queryForm.allTime.length>0){
        // 修正 开始 和结束 时间
        this.queryForm.startTime = this.queryForm.allTime[0]
        this.queryForm.endTime = this.queryForm.allTime[1]
      }else{
        this.queryForm.startTime = ""
        this.queryForm.endTime = ""
      }
      // 根据参数进行查询
      this.getTableDataList(1);
      this.currentPage = 1
    },
    // 刷新按钮
    handle_refresh() {
      this.getTableDataList(this.currentPage);
      // this.currentPage = 1;
    },
    // 新增推送
    handle_addIM() {
      this.add_dialogVisible = true;
      this.add_loading = true;
      // 处理
      this.resetForm("IMForm");
      this.resetMessageGroup();
      this.add_loading = false;
    },
    // 推送消息
    submitForm(formName) {
      if (this.valid_IMform(formName) && this.valid_tabs(this.target)) {
        // 推送
        // console.log("推送");
        // 判断push_type,修正param
        let param;
        param = this.modify_param(this.target);
        // console.log(param)
        // debugger
        this.add_loading = true;
        this.$http.post(`${ commonUrl.baseUrl }/systemPush/saveSystemPush`, param).then(res=>{
          if(res.data.code == '0000'){
              this.add_loading = false
              this.add_dialogVisible = false

              this.m_message(res.data.msg,'success')
              this.handle_refresh();

          }else{
              this.add_loading = false
              this.m_message(res.data.msg,'warning')

          }

        }).catch(err=>{})
      }
    },
    // 消息群体类型
    handleClick(tab, event) {
      // tab.name  页签项
      // 1 用户ID 2 地区用户 3全体向导 4地区向导
      //console.log(tab.name);
      //console.log(this.target)
    },
    // 添加input框
    addInput() {
      this.userID_form.dynamic_users.push({
        userid: "",
        key: Date.now()
      });
    },
    // 删除input框
    delInput(item, index) {
      let delId;
      this.userID_form.dynamic_users.map((val, index) => {
        val.key == item.key && (delId = index);
      });
      this.userID_form.dynamic_users.splice(delId, 1);
    },
    // 重置按钮
    resetData(formName){
        this.$refs[formName].resetFields();
        // 对于queryForm 下拉
        this.queryForm.startTime = ''
        this.queryForm.endTime = ''
    },
    // 重置内容
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    // 重置消息群体
    resetMessageGroup() {
      // 重置userid 地区
      if (this.userID_form.dynamic_users.length > 1) {
        this.userID_form.dynamic_users = this.userID_form.dynamic_users.splice(0, 1);

        this.userID_form.dynamic_users[0].userid = ""
      }else{

        this.userID_form.dynamic_users[0].userid = ""
      }

      // 重置 地区用户
      this.region_form.province_code = ""
      this.region_form.city_code = ""

      // 重置 全体向导
      this.allGuider_form.isAllGuider = false

      // 重置 地区向导
      this.regionGuider_form.province_code = ""
      this.regionGuider_form.city_code = ""

    },
    // 表单校验
    valid_IMform(formName) {
      let result;
      this.$refs[formName].validate(valid => {
        result = valid;
      });
      return result;
    },
    // 消息群体验证
    valid_tabs(target) {
      let flag;
      let tiptxt = "";
      switch (target) {
        // 用户ID 验证 userid  ;
        case "1":
          this.userID_form.dynamic_users.forEach(item => {
            if (item.userid) {
              flag = true;
            } else {
              flag = false;
              tiptxt = "请输入用户ID";
            }
          });
          break;
        // 地区用户 验证province_code city_code;
        case "2":
          if (this.region_form.province_code && this.region_form.city_code) {
            flag = true;
          } else {
            flag = false;
            tiptxt = "请选择用户地区";
          }
          break;
        // 全体向导 验证isAllGuider
        case "3":
          if (this.allGuider_form.isAllGuider) {
            flag = true;
          } else {
            flag = false;
          }
          break;
        // 地区向导 验证province_code city_code;
        case "4":
          if (
            this.regionGuider_form.province_code &&
            this.regionGuider_form.city_code
          ) {
            flag = true;
          } else {
            flag = false;
            tiptxt = "请选择向导地区";
          }
          break;
      }

      if (flag) {
        return true;
      } else {
        this.m_message(tiptxt, "error");
      }
    },
    modify_param(target){
      let param = {
        data:{
          // 公有
          signInUserId: this.$store.getters.userId,
          // 私参
          title:this.IMForm.title,
          content:this.IMForm.content,
          push_type:this.target,
        }
      }
      switch (target) {
        // 用户ID 验证 userid  ;
        case "1":
          // 收集所有userid
          let userids = this.collectUserId()
          param.data.customid = userids;

          break;
        // 地区用户 验证province_code city_code;
        case "2":
          // 收集省市
          param.data.province = this.region_form.province_param.txt
          param.data.province_code = this.region_form.province_param.adcode
          param.data.city = this.region_form.city_param.txt
          param.data.city_code = this.region_form.city_param.adcode
          break;
        // 全体向导 验证isAllGuider
        case "3":

          break;
        // 地区向导 验证province_code city_code;
        case "4":
          // 收集省市
          param.data.province = this.regionGuider_form.province_param.txt
          param.data.province_code = this.regionGuider_form.province_param.adcode
          param.data.city = this.regionGuider_form.city_param.txt
          param.data.city_code = this.regionGuider_form.city_param.adcode
          break;
      }
      return param;
    },
    // 收集所有的userid
    collectUserId(){
      let userids = []
      this.userID_form.dynamic_users.forEach(item=>{
        userids.push(item.userid)
      })
      let str_userids = userids.join(',')
      return str_userids;
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      // 获取单前页数据列表
      this.getTableDataList(val);
    },
    // 省份change事件
    changeOption_province(e, dataOrigin) {
      // console.log(dataOrigin);
      // 参数收集
      dataOrigin.province_param = {
        adcode: e,
        txt: provinces.province_list[e]
      };
      // console.log(e)
      // console.log(provinces.province_list[e])
      // 赋值cities (先清理 后赋值)
      dataOrigin.cities = [];
      dataOrigin.city_code = "";
      this.queryCity(provinces.province_list[e], dataOrigin);
    },
    // 市区change事件
    changeOption_city(e, dataOrigin) {
      // console.log(e, dataOrigin);
      dataOrigin.cities.forEach((city, index) => {
        if (e === city.adcode) {
          dataOrigin.city_param = {
            adcode: e,
            txt: city.city
          };
        }
      });
    },
    // 查 市区 txt: String 省份名,dataOrigin 是指 add_form  或是queryeForm 这种 父级数据源
    queryCity(txt, dataOrigin) {
      let vm = this;
      // 搜索所有省/直辖市信息

      this.districtSearch.search(txt, function(status, result) {
        // console.log(result)
        // 查询成功时，result即为对应的行政区信息
        for (let item of result.districtList[0].districtList) {
          dataOrigin.cities.push({
            adcode: item.adcode,
            city: item.name
          });
        }
      });
    },
    // 初始化 地图
    initMap() {
      let vm = this;
      //利用高德地图API 获取 所有省
      AMap.plugin("AMap.DistrictSearch", function() {
        vm.districtSearch = new AMap.DistrictSearch({
          // 关键字对应的行政区级别，country表示国家
          level: "city",
          //  显示下级行政区级数，1表示返回下一级行政区
          subdistrict: 1
        });
      });
    },
    // 初始化 省份数据
    initProvinces() {
      // 处理一下 数据
      let arr = [];
      for (let i in provinces.province_list) {
        arr.push({
          adcode: i,
          province: provinces.province_list[i]
        });
      }
      this.region_form.regions = arr;
      this.regionGuider_form.regions = arr;
    },
    // 提示信息 message:提示信息   type 提示类型
    m_message(message, type) {
      this.$message({
        message,
        type
      });
    }
  }
};
</script>
<style >
.demo-IMForm {
  width: 500px;
}
.demo-IMForm .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.demo-IMForm .el-form-item {
  margin-bottom: 20px !important;
}

.demo-IMForm .el-tabs__item {
  height: 31px;
  line-height: 31px;
}
/* 控制消息群体的input宽度 */
.demo-IMForm .id_input {
  width: 120px;
}
/* 动态新增input样式 */
.demo-IMForm .input_itemgroup {
  display: inline-block;
  position: relative;
  padding-top: 6px;
  margin-right: 11px;
}
.demo-IMForm .my_icon.el-button--mini.is-circle {
  position: absolute;
  right: -6px;
  top: 0;
  padding: 4px;
  z-index: 1;
}
.demo-IMForm .userid_addicon {
  margin-left: 14px;
}
</style>
