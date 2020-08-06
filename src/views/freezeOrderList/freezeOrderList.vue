<template>
  <!-- 资金冻结订单查询 -->
  <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields pad_b_no">
      <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" label-width="90px" class="demo-form-inline">
        <!-- 冻结日期 -->
        <el-form-item label="冻结日期" prop="times">
          <!-- <el-date-picker
            v-model="queryForm.times"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="wid_382"
          ></el-date-picker> -->
          <el-date-picker
            v-model="queryForm.startFreezeTime"
            type="date"
            class="wid_140"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
            :picker-options="pickerOptions_register1"
          ></el-date-picker>
          <el-date-picker
            v-model="queryForm.endFreezeTime"
            type="date"
            class="wid_140"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
            :picker-options="pickerOptions_register2"
          >
          </el-date-picker>
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
        <el-table-column prop="username" label="姓名" width="70"></el-table-column>
        <el-table-column prop="agent_name" label="所属机构" :show-overflow-tooltip="true" width></el-table-column>
        <el-table-column prop="freeze_time" label="冻结时间" :show-overflow-tooltip="true" width="110"></el-table-column>
        <el-table-column prop="up_username" label="所属上级" :show-overflow-tooltip="true" width="80"></el-table-column>
        <el-table-column prop="grand_username" label="一级推荐人" width="100"></el-table-column>
        <el-table-column prop="phone" label="电话" width></el-table-column>
        <el-table-column prop="freezeAmount" label="冻结金额" width="80"></el-table-column>
        <el-table-column prop="alreadyFreezeAmountOften" label="已冻结金额" width>
        </el-table-column>
        <el-table-column prop="operater" label="操作人" width="100"></el-table-column>
        <el-table-column prop="account_freeze_recordid" label="冻结订单号" width="200"></el-table-column>
        <el-table-column prop="" label="状态" width="70">
          <!-- 0冻结中 1划拨退款 2财务划拨 3已解冻-->
          <template slot-scope="scope">
            <span v-if="scope.row.freeze_order_status == 0">冻结中</span>
            <span v-else-if="scope.row.freeze_order_status == 1">划拨退款</span>
            <span v-else-if="scope.row.freeze_order_status == 2">财务划拨</span>
            <span v-else-if="scope.row.freeze_order_status == 3">已解冻</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop label="操作" width="60">
          <template slot-scope="scope">
            <el-button v-if="scope.row.freeze_order_status == 0" @click="handle_frozen(scope.row)" type="text" size="small">解冻</el-button>

          </template>
        </el-table-column> -->
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
import qs from 'qs';
export default {
  name: "freezeOrderList",
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
      // 冻结日期
      pickerOptions_register1: {
        disabledDate: time => {
          let vm  = this;
          if (vm.queryForm.endFreezeTime != "") {
            return time.getTime() > new Date(vm.queryForm.endFreezeTime).getTime() ;
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      pickerOptions_register2: {
        disabledDate: time=>{
          let vm = this;
          if(vm.queryForm.startFreezeTime != ""){
            return time.getTime() < new Date(vm.queryForm.startFreezeTime).getTime() || time.getTime() > Date.now();
          }else{
            return time.getTime() > Date.now();
          }
        }
      },
      // 查询参数
      queryForm: {
        // 初始化 省 regions  市 cities
        regions: "",
        cities: [],
        // 省市
        province_code: "",
        city_code: "",
        // 注册时间段 姓名 所属上级 一级推荐人 所属机构
        times:'',
        startFreezeTime:'',
        endFreezeTime:'',
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

          startFreezeTime:this.queryForm.startFreezeTime,
          endFreezeTime:this.queryForm.endFreezeTime,
          username: this.queryForm.username,
          up_username:this.queryForm.up_username,
          grand_username:this.queryForm.grand_username,
          agent_name:this.queryForm.agent_name,
          phone:this.queryForm.phone
        }
      };
      this.tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/accountFreezeRecord/selectFreezeRecordList`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.tableLoading = false;
            this.tableData = res.data.data.freezeRecordList;
            // 分页 总数
            this.pageTotal = res.data.data.page.pageTotal;
          }
        })
        .catch(err => {});
    },
    // 冻结/解冻
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
      this.$confirm('是否解冻该机构?', '解冻', {
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


      this.getTableDataList(1);
      this.currentPage = 1;
    },
    // 重置按钮
    resetData(formName) {


      this.$refs[formName].resetFields();


      this.queryForm.startFreezeTime = "";
      this.queryForm.endFreezeTime = "";
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
