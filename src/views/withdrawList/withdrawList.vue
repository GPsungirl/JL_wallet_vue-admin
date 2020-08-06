<template>
  <!-- 提现记录 -->
  <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields pad_b_no">
      <el-form
        :inline="true"
        :model="queryForm"
        ref="queryForm"
        size="mini"
        label-width="90px"
        class="demo-form-inline"
      >
        <!-- 交易时间 -->
        <el-form-item label="交易时间" prop="order_time">
          <el-date-picker
            v-model="queryForm.order_time"
            type="date"
            class="wid_140"
            value-format="yyyy-MM-dd"
            placeholder="注册时间"
          ></el-date-picker>
          <!-- <el-date-picker
            v-model="queryForm.order_time"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="wid_382"
          ></el-date-picker>-->
        </el-form-item>
        <!-- 姓名 -->
        <el-form-item label="用户姓名" prop="userName">
          <el-input v-model="queryForm.userName" placeholder="姓名" class="wid_140"></el-input>
        </el-form-item>
        <!-- 所属机构 -->
        <el-form-item label="所属机构" prop="agent_name">
          <el-input v-model="queryForm.agent_name" placeholder="所属机构" class="wid_140"></el-input>
        </el-form-item>
        <!-- 所属上级 -->
        <!-- <el-form-item label="所属上级" prop="up_nickname">
          <el-input v-model="queryForm.up_nickname" placeholder="所属上级" class="wid_140"></el-input>
        </el-form-item>-->
        <!-- 一级推荐人 -->
        <!-- <el-form-item label="一级推荐人" prop="one_nickname">
          <el-input v-model="queryForm.one_nickname" placeholder="一级推荐人" class="wid_140"></el-input>
        </el-form-item>-->
        <!-- 交易状态 -->
        <!-- <el-form-item label="交易状态" prop="order_status">
          <el-select v-model="queryForm.order_status" class="wid_140" placeholder="交易状态" @change="changeOption_traveler_status($event)">
            <el-option v-for="(item, index) in queryForm.transaction_statuss" :key="index" :label=" item.txt " :value=" item.id ">
            </el-option>
          </el-select>
        </el-form-item>-->
        <!-- 查询 -->
        <el-form-item>
          <el-button type="primary" size="mini" @click="queryData">查询</el-button>
          <el-button type="success" size="mini" @click="resetData('queryForm')">重置</el-button>
          <el-button type="primary" size="mini" @click="handle_refresh">刷新</el-button>
          <el-button type="primary" size="mini" @click="exportData('/order/exportWithdraw')">导出数据</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- M2 主列表 -->
    <div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
        <el-table-column prop="userName" label="用户姓名" width></el-table-column>
        <el-table-column prop="agent_name" label="所属机构" :show-overflow-tooltip="true" width></el-table-column>
        <el-table-column prop="phone" label="联系电话" :show-overflow-tooltip="true" width></el-table-column>
        <el-table-column prop="cardOpenbank" label="开户行" :show-overflow-tooltip="true" width></el-table-column>
        <el-table-column prop="cardno" label="银行卡号" :show-overflow-tooltip="true" width></el-table-column>
        <el-table-column prop="order_time" label="提现时间" :show-overflow-tooltip="true" width="110"></el-table-column>
        <el-table-column prop label="渠道" width="100">
          <!-- 订单类别 0收款 1提现 2红包收益 3推荐收益 -->
          <template slot-scope="scope">
            <span v-if="scope.row.order_type == 0">收款</span>
            <span v-else-if="scope.row.order_type == 1">提现</span>
            <span v-else-if="scope.row.order_type == 2">红包收益</span>
            <span v-else-if="scope.row.order_type == 3">推荐收益</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderid" label="订单号" :show-overflow-tooltip="true" width></el-table-column>
        <el-table-column prop label="交易金额(元)" :show-overflow-tooltip="true" width>
          <template slot-scope="scope">
            <span>{{ scope.row.order_src_amount / 100 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop label="交易状态" :show-overflow-tooltip="true" width>
          <template slot-scope="scope">
            <!-- 0订单创建 1订单成功 2订单失败 -->
            <span v-if="scope.row.order_status == 0">待支付</span>
            <span v-else-if="scope.row.order_status == 1">成功</span>
            <span v-else-if="scope.row.order_status == 2">订单失败</span>
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
import { getToken } from "../../utils/auth.js";
import axios from "axios";
export default {
  name: "withdrawList",
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
      roleId: "",
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
        order_time: "",
        startTime: "",
        endTime: "",
        userName: "",
        up_nickname: "",
        one_nickname: "",
        agent_name: "",
        // 交易状态
        transaction_statuss: [
          {
            id: 0,
            txt: "成功"
          },
          {
            id: 1,
            txt: "待支付"
          },
          {
            id: 2,
            txt: "订单关闭"
          }
        ],
        order_status: ""
      },
      value1: ""
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
          order_time: this.queryForm.order_time,
          userName: this.queryForm.userName,
          agent_name: this.queryForm.agent_name
        }
      };
      this.tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/order/selecWithdrawList`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.tableLoading = false;
            this.tableData = res.data.data.withdrawList;
            // 分页 总数
            this.pageTotal = res.data.data.page.pageTotal;
          } else {
            this.tableLoading = false;
            this.m_message(res.data.msg, "error");
          }
        })
        .catch(err => {});
    },

    // 导出数据
    exportData(url) {
      const token = getToken();
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      axios({
        method: "post",
        url: `${commonUrl.baseUrl}${url}`,
        // headers里面设置token
        headers: {
          Authorization: token
        },
        data: {
          data: {
            signInUserId: this.$store.getters.userId,
            signInRoleId: this.$store.getters.roleId,
            // pageNum: pageNum,
            // pageSize: 10,
            // 注册时间
            // startTime:this.queryForm.startTime,
            // endTime:this.queryForm.endTime,
            order_time: this.queryForm.order_time,
            userName: this.queryForm.userName,
            agent_name: this.queryForm.agent_name
          }
        },
        // 二进制流文件，一定要设置成blob，默认是json
        responseType: "blob"
      })
        .then(res => {
          loading.close();
          // console.log(res.headers['content-disposition'])
          let fileName = res.headers["content-disposition"];

          const link = document.createElement("a");
          const blob = new Blob([res.data], { type: "text/csv" });

          link.style.display = "none";
          link.href = URL.createObjectURL(blob);

          link.setAttribute("download", `${fileName}`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(err => {
          loading.close();
        });
    },
    // 查询按钮
    queryData() {
      if (this.queryForm.order_time.length > 0) {
        // 修正 开始 和结束 时间
        this.queryForm.startTime = this.queryForm.order_time[0];
        this.queryForm.endTime = this.queryForm.order_time[1];
      }
      // // 参数
      // let param = {
      //   member_status: this.queryForm.member_status,
      //   userName: this.queryForm.userName
      // };
      // console.log(param);
      // console.log(this.queryForm)
      this.getTableDataList(1);
      this.currentPage = 1;
    },
    // 重置按钮
    resetData(formName) {
      // this.queryForm.userName = "";
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
      let flag = false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          flag = true;
          return true;
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
    }
  }
};
</script>
