<template>
  <!-- 用户风控 -->
  <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields pad_b_no">
      <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" label-width="90px" class="demo-form-inline">
        <!-- 注册时间 -->
        <el-form-item label="注册时间" prop="registrationTime">
          <el-date-picker
            v-model="queryForm.registrationTime"
            type="date"
            class="wid_140"
            value-format="yyyy-MM-dd"
            placeholder="注册时间">
          </el-date-picker>
          <!-- <el-date-picker
            v-model="queryForm.registrationTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="wid_382"
          ></el-date-picker> -->
        </el-form-item>
        <!-- 姓名 -->
        <el-form-item label="用户姓名" prop="username">
          <el-input v-model="queryForm.username" placeholder="用户姓名" class="wid_140"></el-input>
        </el-form-item>
        <!-- 所属上级 -->
        <el-form-item label="所属上级" prop="up_username">
          <el-input v-model="queryForm.up_username" placeholder="所属上级" class="wid_140"></el-input>
        </el-form-item>
        <!-- 一级推荐人 -->
        <el-form-item label="一级推荐人" prop="grand_username">
          <el-input v-model="queryForm.grand_username" placeholder="一级推荐人" class="wid_140"></el-input>
        </el-form-item>
        <!-- 所属机构 -->
        <el-form-item label="所属机构" prop="agent_name">
          <el-input v-model="queryForm.agent_name" placeholder="所属机构" class="wid_140"></el-input>
        </el-form-item>
        <!-- 联系电话 -->
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="queryForm.phone" placeholder="联系电话" class="wid_140"></el-input>
        </el-form-item>
        <!-- 查询 -->
        <el-form-item>
          <el-button type="primary" size="mini" @click="queryData">查询</el-button>
          <el-button type="success" size="mini" @click="resetData('queryForm')">重置</el-button>
          <el-button type="primary" size="mini" @click="handle_refresh">刷新</el-button>

        </el-form-item>
      </el-form>
    </div>
    <!-- M2 主列表 -->
    <div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
        <el-table-column prop="username" label="用户姓名" width="80"></el-table-column>
        <el-table-column prop="agent_name" label="所属机构" :show-overflow-tooltip="true" width="100"></el-table-column>
        <el-table-column prop="createtime" label="注册时间" :show-overflow-tooltip="true" width="110"></el-table-column>
        <el-table-column prop="up_username" label="所属上级" :show-overflow-tooltip="true" width="80"></el-table-column>
        <el-table-column prop="grand_username" label="一级推荐人" width="98"></el-table-column>
        <el-table-column prop="phone" label="电话" width="110"></el-table-column>
        <!-- 交易状态account_consume_status  提现状态account_withdraw_status  邀请状态is_invite-->
        <el-table-column prop="" label="交易状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.account_consume_status == 1">可交易</span>
            <span v-else>不交易</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="提现状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.account_withdraw_status == 1">可提现</span>
            <span v-else>不可提现</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="邀请状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.is_invite == 1">可邀请</span>
            <span v-else>不可邀请</span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width>
          <template slot-scope="scope">
            <el-button v-if="scope.row.account_consume_status == 1"  @click="handle_frozen(scope.row,'account_consume_status')" type="text" size="small">冻结交易</el-button>
            <el-button v-else  @click="handle_frozen(scope.row,'account_consume_status')" type="text" size="small">解冻交易</el-button>

            <el-button v-if="scope.row.account_withdraw_status == 1"  @click="handle_frozen(scope.row,'account_withdraw_status')" type="text" size="small">冻结提现</el-button>
            <el-button v-else @click="handle_frozen(scope.row,'account_withdraw_status')" type="text" size="small">解冻提现</el-button>

            <el-button v-if="scope.row.is_invite == 1" @click="handle_frozen(scope.row,'is_invite')" type="text" size="small">冻结邀请</el-button>
            <el-button v-else @click="handle_frozen(scope.row,'is_invite')" type="text" size="small">解冻邀请</el-button>
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
        ></el-pagination>
      </div>
    </div>

  </div>
</template>
<script>
import provinces from "../../utils/area.js";
import commonUrl from "../../utils/common";

export default {
  name: "userWind",
  data() {
    let validMobile = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        callback();
      } else {
        let reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正确手机号"));
        } else {
          callback();
        }
      }
    };
    return {
      roleId:'',
       // 地图
      districtSearch: "",
      // 主列表
      tableLoading: false,
      tableData: [],
      // 分页
      pageTotal: 100,
      currentPage: 1,
      // 查询参数
      queryForm: {
        // 初始化 省 regions  市 cities
        regions: "",
        cities: [],
        // 省市
        province_code: "",
        city_code: "",
        // 注册时间段 姓名 所属上级 一级推荐人 所属机构
        registrationTime:'',
        startTime:'',
        endTime:'',
        username: "",
        up_username:'',
        grand_username:'',
        agent_name:'',
        phone:''
      },
      value1: "",
    };
  },
  created() {

    // 获取roleId
    this.roleId = this.$store.getters.roleId;
    // 初始化 地图plugin
    this.initMap();
    // 初始化 省份
    this.initProvinces();
    // 初始化 主列表数据
    this.getTableDataList(1);
  },
  methods: {
    // 初始化 主列表数据
    getTableDataList(pageNum) {
      let param = {
        data: {
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          pageNum: pageNum,
          pageSize: 10,
          // 注册时间
          // startTime:this.queryForm.startTime,
          // endTime:this.queryForm.endTime,
          registrationTime:this.queryForm.registrationTime,
          username: this.queryForm.username,
          up_username:this.queryForm.up_username,
          grand_username:this.queryForm.grand_username,
          agent_name:this.queryForm.agent_name,
          phone:this.queryForm.phone
        }
      };
      this.tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/userInfo/selectUserWindControllerList`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.tableLoading = false;
            this.tableData = res.data.data.userWindControllerList;
            // 分页 总数
            this.pageTotal = res.data.data.page.pageTotal;
          }else{
            this.tableLoading = false;
            this.m_message(res.data.msg,'error')
          }
        })
        .catch(err => {});
    },
    // 冻结/解冻交易 冻结/解冻提现 冻结/解冻邀请
    handle_frozen(row,type){
      switch(type){
        // 交易account_consume_status  提现account_withdraw_status  邀请is_invite
        case 'account_consume_status':
          this.handle_frozen_real(row,'account_consume_status','交易','/userAccount/updateConsumeOrWithDrawStatus')
          break;
        case 'account_withdraw_status':
          this.handle_frozen_real(row,'account_withdraw_status','提现','/userAccount/updateConsumeOrWithDrawStatus')
          break;
        case 'is_invite':
          this.handle_frozen_real(row,'is_invite','邀请','/userInfo/updateInviteStatus')
          break;
      }

    },
    //
    handle_frozen_real(row,type,txt,url) {
      let dialog_title = ""
      let dialog_content =""
      if(row[type]== 1){
        dialog_title="冻结"
        dialog_content=`是否冻结${txt}?`
      }else{
        dialog_title="解冻"
        dialog_content=`是否解冻${txt}?`
      }
      this.$confirm(dialog_content, dialog_title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        size: "mini",
        center: true
      }).then(() => {
        let param = {
          data: {
            signInUserId: this.$store.getters.userId,
            signInRoleId: this.$store.getters.roleId,
            accountid: row.accountid,
            userid: row.userid
          }
        };
        let flag;
        if(row[type] == 1){
          flag = "0";
        }else{
          flag = "1";
        }
        switch(type){
          case 'account_consume_status':
            param.data.account_consume_status = flag
            break;
          case 'account_withdraw_status':
            param.data.account_withdraw_status = flag
            break;
          case 'is_invite':
            param.data.is_invite = flag
        }

        const loading = this.$loading({
        lock: true,
        text: dialog_title+'中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$http
          .post(`${commonUrl.baseUrl}${url}`, param)
          .then(res => {
            if (res.data.code == "0000") {
              loading.close();
              this.m_message(res.data.msg, "success");
              // 刷新
              this.handle_refresh();
            } else {
              loading.close();
              this.m_message(res.data.msg, "warning");
            }
          })
          .catch(err => {});
      });
    },
    // 查询按钮
    queryData() {
      // if (this.queryForm.registrationTime.length > 0) {
      //   // 修正 开始 和结束 时间
      //   this.queryForm.startTime = this.queryForm.registrationTime[0];
      //   this.queryForm.endTime = this.queryForm.registrationTime[1];
      // }
      // 参数
      // let param = {
      //   member_status: this.queryForm.member_status,
      //   username: this.queryForm.username
      // };

      this.getTableDataList(1);
      this.currentPage = 1;
    },
    // 重置按钮
    resetData(formName) {
      // this.queryForm.username = "";
      // this.queryForm.member_status = "";

      this.$refs[formName].resetFields();
      // 对于queryForm 下拉
      this.queryForm.startTime = "";
      this.queryForm.endTime = "";
    },
    // 刷新按钮
    handle_refresh() {
      this.getTableDataList(this.currentPage);
      // this.currentPage = 1;
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      // 获取单前页数据列表
      this.getTableDataList(val);
      //console.log(`当前页: ${val}`);
    },

    // 新增 校验规则
    m_valid_addForm(formName) {
        let  flag  = false ;
        this.$refs[formName].validate((valid) => {
            if (valid) {
            flag = true;
            return true
            } else {
            flag = false;
            return false;
            }
        });
        return flag;
    },
    // 提示信息 message:提示信息   type 提示类型
    m_message(message, type) {
      this.$message({
        message,
        type
      });
    },
    // 省份change事件
    changeOption_province(e) {
      // 参数收集
      this.queryForm.province_param = {
        adcode: e,
        txt: provinces.province_list[e]
      };
      // console.log(e)
      // console.log(provinces.province_list[e])
      // 赋值cities (先清理 后赋值)
      this.queryForm.cities = [];
      this.queryForm.city_code = "";
      this.queryCity(provinces.province_list[e], "queryForm");
    },
     // 查 市区 txt: String 省份名,dataOrigin 是指 add_form  或是queryeForm 这种 父级数据源
    queryCity(txt, dataOrigin) {
      let vm = this;
      // 搜索所有省/直辖市信息

      this.districtSearch.search(txt, function(status, result) {
        // console.log(result)
        // 查询成功时，result即为对应的行政区信息
        for (let item of result.districtList[0].districtList) {
          vm[dataOrigin].cities.push({
            adcode: item.adcode,
            city: item.name
          });
        }
      });
    },
    // 市区change事件
    changeOption_city(e) {},
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
      this.queryForm.regions = arr;
      // 详情
      //this.detail_form.regions = this.detail_form.account_regions = arr;
      // 详情并修改
      //this.agent_detail_form.regions = this.agent_detail_form.account_regions = arr;
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
  }
};
</script>
