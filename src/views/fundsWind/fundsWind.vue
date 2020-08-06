<template>
  <!-- 资金风控 -->
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
          <el-input v-model="queryForm.username" placeholder="姓名" class="wid_140"></el-input>
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
        <el-table-column prop="agent_name" label="所属机构" :show-overflow-tooltip="true" width></el-table-column>
        <el-table-column prop="createtime" label="注册时间" :show-overflow-tooltip="true" width="110"></el-table-column>
        <el-table-column prop="up_username" label="所属上级" :show-overflow-tooltip="true" width></el-table-column>
        <el-table-column prop="grand_username" label="一级推荐人" width="98"></el-table-column>
        <el-table-column prop="phone" label="电话" width></el-table-column>
        <el-table-column prop="" label="状态" width>
          <template slot-scope="scope">
            <span v-if="scope.row.account_freeze_status == 1">已冻结</span>
            <span v-else>已解冻</span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width>
          <template slot-scope="scope">
            <el-button  @click="handle_frozenMoney(scope.row)" type="text" size="small">冻结资金</el-button>
            <el-button v-if="scope.row.account_freeze_status == 1" @click="handle_frozen(scope.row)" type="text" size="small">解冻</el-button>
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
    <!-- M3 冻结资金dialog-->
    <el-dialog
      title="冻结资金"
      :visible.sync="dialogVisible_vip"
      width="30%"
      class="addUsers_dialog"
      center
      v-loading="vip_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <!--新增 body -->
      <div class="dialogBody_addPermission">
        <div class="grid-content bg-purple-dark pad_t2">
          <el-form
            :inline="true"
            :model="vipForm"
            label-width="80px"
            class="valid_form"
            ref="vip_form"
            :rules="vip_form_rules">
            <div class="frozen_usertip">
              您即将操作用户
              <span style="color:red">{{vipForm.username}}</span>
              的资金冻结
            </div>
            <el-form-item label="冻结金额" prop="freeze_amount">
              <el-input v-model.number="vipForm.freeze_amount"  class="wid_140" placeholder="冻结金额"></el-input>
              <span> 元 </span>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogVisible_vip = false" size="mini">关 闭</el-button>
        <el-button type="primary" @click="save_vip" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import provinces from "../../utils/area.js";
import commonUrl from "../../utils/common";

export default {
  name: "fundsWind",
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
      // 冻结资金
      vip_loading: false,
      dialogVisible_vip:false,
      vipForm:{
        freeze_amount:'',
        username:'',
        accountid:'',
      },
      vip_form_rules:{
        freeze_amount:[
          { required: true, message: '冻结金额不能为空', trigger:'blur'},
          { type: 'number', message: '冻结金额必须为数字值',trigger:'blur'}
        ]
      },
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
        .post(`${commonUrl.baseUrl}/userAccount/selectMoneyWindControllerList`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.tableLoading = false;
            this.tableData = res.data.data.moneyWindControllerList;
            // 分页 总数
            this.pageTotal = res.data.data.page.pageTotal;
          }
        })
        .catch(err => {});
    },
    // 操作冻结资金
    handle_frozenMoney(row){
      this.vipForm.username = row.username;
      this.vipForm.accountid = row.accountid;
      // 开弹框
      this.dialogVisible_vip = true;


      // 加载中
      // this.vip_loading = true;

    },
    // 保存冻结资金
    save_vip(){

      if(this.m_valid_addForm('vip_form')){
        // 提交
        let param = {
          data:{
            signInUserId: this.$store.getters.userId,
            signInRoleId: this.$store.getters.roleId,
            accountid: this.vipForm.accountid,
            account_freeze_status:"1",
            freeze_amount: this.vipForm.freeze_amount*100,
          }
        }
        this.vip_loading = true;
        this.$http.post(`${ commonUrl.baseUrl }/userAccount/freezeOrUnfreezeMoney`, param).then(res=>{
          if(res.data.code == '0000'){
            this.vip_loading = false
            this.m_message(res.data.msg, 'success')
            this.resetData('vip_form')
            this.dialogVisible_vip = false
            // 刷新
            this.handle_refresh();
          }else{
            this.vip_loading = false
            this.m_message(res.data.msg, 'warning')
            this.resetData('vip_form');
          }
        }).catch(err=>{})
      }
    },
     // 解冻
    handle_frozen(row){
      // let _flag = "";
      // let _flag_title = ""
      // let _flag_txt = "";
      // if (row.agent_status == 1) {//冻结
      //   _flag = 2;
      //   _flag_title="冻结"
      //   _flag_txt = "是否冻结该机构?";
      // } else {
      //   _flag = 1;
      //   _flag_title="解冻"
      //   _flag_txt = "是否解冻该机构?";
      // }
      this.$confirm('是否解冻资金?', '解冻', {
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
            accountid:row.accountid,
            account_freeze_status:'0',
            freeze_amount:row.freezeAmount
          }
        };
        const loading = this.$loading({
        lock: true,
        text: '解冻中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$http
          .post(`${commonUrl.baseUrl}/userAccount/freezeOrUnfreezeMoney`, param)
          .then(res => {
            if (res.data.code == "0000") {
              loading.close()
              this.m_message(res.data.msg, "success");
              // 刷新
              this.handle_refresh();
            } else {
              loading.close()
              this.m_message(res.data.msg, "warning");
            }
          })
          .catch(err => {});
      });
    },
    // 查询按钮
    queryData() {
      if (this.queryForm.registrationTime.length > 0) {
        // 修正 开始 和结束 时间
        this.queryForm.startTime = this.queryForm.registrationTime[0];
        this.queryForm.endTime = this.queryForm.registrationTime[1];
      }
      // 参数
      let param = {
        member_status: this.queryForm.member_status,
        username: this.queryForm.username
      };
      // console.log(param);
      // console.log(this.queryForm)
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
<style>
  .frozen_usertip{
    margin-bottom:10px;
  }
</style>
