<template>
<!-- 机构充值记录 -->
 <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields">
        <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">
          <!-- 机构名称 -->
          <el-form-item label="机构名称" prop="agent_name">
              <el-input v-model="queryForm.agent_name" placeholder="请输入机构名称" class="wid_140"></el-input>
          </el-form-item>
          <!-- 机构地区 -->
          <el-form-item label="机构地区">
            <el-col :span="12">
              <el-form-item prop="province_code">
                <el-select v-model="queryForm.province_code" placeholder="选择省" class="wid_140" @change="changeOption_province($event)">
                  <el-option v-for="(item, index) in queryForm.regions" :key="index" :label=" item.province " :value=" item.adcode ">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="city_code">
                <el-select v-model="queryForm.city_code" placeholder="选择市" class="wid_140" @change="changeOption_city($event)">
                  <el-option v-for="(item, index) in queryForm.cities" :key="index" :label=" item.city " :value=" item.adcode ">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <!-- 联系人 -->
          <el-form-item label="联系人" prop="charger">
              <el-input v-model="queryForm.charger" placeholder="请输入联系人" class="wid_140"></el-input>
          </el-form-item>
          <!-- 银行账号 -->
          <el-form-item label="银行账号" prop="account_no">
              <el-input v-model="queryForm.account_no" placeholder="请输入银行账号" class="wid_140"></el-input>
          </el-form-item>
          <!-- 充值金额 -->
          <el-form-item label="充值金额" label-width="68px">
          <el-col :span="24">
            <el-form-item prop="startAmount">
              <el-input v-model="queryForm.startAmount" placeholder="最小金额" class style="width:70px"></el-input>-
            </el-form-item>
            <el-form-item prop="closeAmount">
              <el-input v-model="queryForm.closeAmount" placeholder="最大金额" class style="width:70px"></el-input>元
            </el-form-item>
          </el-col>
        </el-form-item>
        <!-- 审核状态 -->
        <el-form-item label="审核状态" prop="recharge_check_status" label-width="68px">
          <el-select v-model="queryForm.recharge_check_status" class="wid_140" placeholder="选择审核状态">
            <el-option
              v-for="(item, index) in queryForm.recharge_check_statuss"
              :key="index"
              :label=" item.value "
              :value=" item.id "
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 查询 -->
        <el-form-item>
            <el-button type="primary" size='mini' @click="queryData">查询</el-button>
            <el-button type="success" size='mini' @click="resetData('queryForm')">重置</el-button>
            <el-button type="primary" size='mini' @click="handle_refresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- M2 主列表 -->
    <div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
          <el-table-column prop="agent_name" show-overflow-tooltip label="机构名称" width="" >
          </el-table-column>
          <!-- 业务地区 -->
          <el-table-column prop label="业务地区" width="">
            <template slot-scope="scope">
              <span>{{scope.row.province+scope.row.city}}</span>
            </template>
          </el-table-column>
          <!-- 联系人 -->
          <el-table-column prop="charger" label="联系人" width="80" >
          </el-table-column>
          <!-- 联系电话 -->
          <el-table-column prop="phone" label="联系电话" width="120" >
          </el-table-column>
          <!-- 银行账号 -->
          <el-table-column prop="account_no" show-overflow-tooltip label="银行账号" width="" >
          </el-table-column>
          <!-- 充值金额 -->
          <el-table-column prop="recharge_money" label="充值金额(元)" width="110" >
          </el-table-column>

          <!-- 创建时间 -->
          <el-table-column prop="rechargeTime" show-overflow-tooltip label="充值时间" width="120" >
          </el-table-column>
          <!-- 审核状态 recharge_check_status:1未审核2通过3拒绝-->
          <el-table-column prop label="审核状态" width="">
            <template slot-scope="scope">
              <span v-if="scope.row.recharge_check_status == '1'">待审核</span>
              <span v-if="scope.row.recharge_check_status == '2'">审核通过</span>
              <span v-if="scope.row.recharge_check_status == '3'">审核拒绝</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column prop="" label="操作" width="140">
            <template slot-scope="scope">
              <el-button @click="view_upload(scope.row)" type="text" size="small">查看入账凭证</el-button>

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

    <!-- M4 dialog 查看发票 -->
    <el-dialog
      title="查看入账凭证"
      :visible.sync="view_dialog"
      width="30%"

      center
      v-loading="view_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"

      >

      <img width="100%" :src="viewImageUrl" alt="">

      <!-- footer -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="view_dialog = false" size='mini'>取 消</el-button>
      </span>
    </el-dialog>

 </div>

</template>

<script>
import provinces from "../../utils/area.js";
import { mapGetters } from 'vuex'
import commonUrl from '../../utils/common';
import qs from 'qs';
import axios from 'axios'
// 引入 COS
import COS from 'cos-js-sdk-v5'

export default {
  name: 'rechargeRecordList',
  data(){

      // 校验分成
      let validRecharge=(val,value,callback)=>{
          if (!value){
              callback(new Error('请输入值'))
          }else {
              callback()
          }
      }
      return {
        // 地图
          districtSearch: "",
          roleId:'',
          // COS 所需参数
          cos:'',
          Bucket:'',
          Region:'',
          // ***主列表数据
          tableLoading: false,
          view_loading: false,
          tableData: [],

          invoice_loading:false,
          invoiceDialogVisible:false,

          detail_check_dialogVisible:false,
          detail_check_loading:false,
          // ***查询区
          queryForm: {
            agent_name:'',
            // 初始化 省 regions  市 cities
            regions: "",
            cities: [],
            // 省市
            province_code: "",
            city_code: "",
            // 银行账号
            account_no:'',
            // 联系人
            charger:'',
            startAmount:'',
            closeAmount:'',
            // 审核状态 1待审核 2审核通过 3审核拒绝
            recharge_check_statuss:[
              {
                id:'1',
                value:'待审核'
              },
              {
                id:'2',
                value:'审核通过'
              },
              {
                id:'3',
                value:'审核拒绝'
              }
            ],
            recharge_check_status:''
          },
          // 分页
          pageTotal: 0,
          currentPage:1,
          // 弹框
          add_dialog:false,
          view_dialog:false,

          dialogImageUrl:'',
          viewImageUrl:'', // 查看发票
          // 机构id (每次上传时都要存一下)
          agent_accountid:'',
          // 充值上传凭证需要
          agentid:'',
          _key:'' ,// 记录一下上传时的key

          //审核
          check_dialog:false,
          check_loading:false,

      }
  },
  created(){
    // 初始化 地图plugin
    this.initMap();
    // 初始化 省份
    this.initProvinces();
    this.roleId = this.$store.getters.roleId
    // 获取cos参数
    this.getCOSParam();
    //  获取所有数据
    this.getTableDataList(1);
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  methods: {
    // 获取cos参数
    getCOSParam(){
      let vm  = this
      this.$http.post(`${commonUrl.baseUrl}/agentAccount/getCosKey`)
      .then(function (res) {
        if(res.data.code == '0000'){
          let result = res.data.data.liveList
          // 创建cos实例
          vm.cos = new COS({
            AppId: result.Appid,
            SecretId: result.SecretId,
            SecretKey: result.SecretKey,
          });
          // 存 cos 桶 和 源
          vm.Bucket = result.Bucket
          vm.Region = result.Region
        }

      })
      .catch(function (err) {
        console.log(err);
      });
    },
    // 初始化 主列表 数据
    getTableDataList(pageNum){
      let param = {
        data:{
          // 公有
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          pageNum: pageNum,
          pageSize: 10,
          // 私有参数
          account_no:this.queryForm.account_no,
          charger:this.queryForm.charger,
          agent_name:this.queryForm.agent_name,
          province_code:this.queryForm.province_code,
          city_code:this.queryForm.city_code,
          startAmount:this.queryForm.startAmount*100,
          closeAmount:this.queryForm.closeAmount*100,
          recharge_check_status:this.queryForm.recharge_check_status
        }
      }
      this.tableLoading = true

      this.$http.post(`${ commonUrl.baseUrl }/agent/rechargeCheckRecordList`, param).then(res=>{
        if(res.data.code == '0000'){

          // 数据
          this.tableData = res.data.data.agentRechargeCheckList
          // 分页总数
          this.pageTotal = res.data.data.page.pageTotal;
          this.tableLoading = false
        }
      }).catch(err=>{

      })
    },

    // 查询按钮
    queryData(){
      this.getTableDataList(1);
      this.currentPage = 1
    },
    // 刷新 主列表
    handle_refresh(){
        this.getTableDataList(this.currentPage);
        // this.currentPage = 1
    },

    // 查看入账凭证
    view_upload(row){
      let param = {
        data:{
          agent_recharge_checkid:row.agent_recharge_checkid
        }
      }
      // 弹框  加载中
      this.viewImageUrl = ''

      this.view_dialog = true
      this.view_loading= true

      this.$http.post(`${commonUrl.baseUrl}/agentRechargeCheck/rechargeCheckInfo`, param).then(res=>{
        if(res.data.code == '0000'){
          console.log(res)

          this.viewImageUrl = res.data.data.agentRechargeCheckInfo.recharge_credit_url
          // 加载 结束
          this.view_loading = false
        }
      }).catch(err=>{  })
    },
    // 收益状态 change事件
    changeProfitState(e){

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
    // 校验文件上传
    validateFile (rule, value, callback) {
      if (!this.$refs.uploadlist.uploadFiles.length) {
        callback(new Error('请选择要上传的文件'))
      } else {
        callback()
      }
    },
    // 分页
    handleCurrentChange(val){
      this.currentPage = val
      // 获取主页列表数据(loading状态)
      this.getTableDataList(val)
      //console.log(`当前页: ${val}`);
    },
    // 重置查询条件
    resetData(formName){
        this.$refs[formName].resetFields();
    },
    // 提示信息 message:提示信息   type 提示类型
    m_message(message,type){
      this.$message({
        message,
        type
      })
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
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
<style scoped>
.box .myBtn {
  color: gray;
  background: gray;
}
</style>
