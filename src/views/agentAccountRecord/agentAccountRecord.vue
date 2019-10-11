<template>
 <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields">
        <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">
          <!-- 名称 -->
          <el-form-item label="机构名称" prop="agentName">
              <el-input v-model="queryForm.agentName" placeholder="请输入机构名称" class="wid_140"></el-input>
          </el-form-item>
          <!-- 周期 -->
          <el-form-item label="收益周期" prop="profitTime">
            <el-date-picker
              class="wid_140"
              v-model="queryForm.profitTime"
              type="month"
              value-format="yyyy-MM"
              placeholder="请选收益周期">
            </el-date-picker>
          </el-form-item>
          <!-- 审核状态 -->
          <el-form-item label="审核状态" prop="check_status">
            <el-select v-model="queryForm.check_status"
              class="wid_140"
              placeholder="请选择收益状态"
             >
              <el-option v-for="(item, index) in queryForm.check_statuss"
                :key="index"
                :label="item.txt"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 出账状态 -->
          <el-form-item label="出账状态" prop="revenue_status">
            <el-select v-model="queryForm.revenue_status"
              class="wid_140"
              placeholder="请选择出账状态"
              >
              <el-option v-for="(item, index) in queryForm.revenue_statuss"
                :key="index"
                :label="item.txt"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 查询 -->
          <el-form-item>

              <el-button type="primary" size='mini' @click="queryData">查询</el-button>
              <el-button type="success" size='mini' @click="resetData('queryForm')">重置</el-button>
              <el-button type="primary" size='mini' @click="handle_refresh">刷新</el-button>
              <!-- 当前登录角色id为4,5 不可导出 -->
              <el-button v-if="roleId != 4 && roleId != 5" type="success" size='mini' @click="exportAccount">导出出账</el-button>
              <!-- <el-button type="warning" size='mini' @click="uploadAccount">上传出账凭据</el-button>                   -->
          </el-form-item>
        </el-form>
    </div>
    <!-- M2 主列表 -->
    <div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
          <el-table-column prop="agentName" label="机构名称" width="" >
          </el-table-column>

          <el-table-column prop="virtualMonthTotal" label="贝壳收益(元)" width="">
          </el-table-column>
          <el-table-column prop="accountMonthTotal" label="出行收益(元)" width="">
          </el-table-column>
          <el-table-column prop="totalAmont" label="总收益(元)" width="">
            
          </el-table-column>
          <el-table-column prop="month" label="收益周期" width="">
          </el-table-column>
          <el-table-column prop="" label="审核状态" width="">
            <!-- 1待审核2通过3拒绝 -->
            <template slot-scope="scope">
              <span v-if="scope.row.check_status == 1">待审核</span>
              <span v-else-if="scope.row.check_status == 2">通过</span>
              <span v-else-if="scope.row.check_status == 3">拒绝</span>
            </template>
          </el-table-column>

          <el-table-column prop="" label="出账状态" width="">
            <!-- 收益状态1待开票2已开票3待发放4已发放5拒绝6数据错误 -->
            <template slot-scope="scope">
              <span v-if="scope.row.revenue_status == 1">待开票</span>
              <span v-else-if="scope.row.revenue_status == 2">已开票</span>
              <span v-else-if="scope.row.revenue_status == 3">待发放</span>
              <span v-else-if="scope.row.revenue_status == 4">已发放</span>
              <span v-else-if="scope.row.revenue_status == 5">财务拒绝</span>
              <span v-else-if="scope.row.revenue_status == 6">数据错误</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="">
          <template slot-scope="scope">
              <!-- <el-button v-if="scope.row.revenue_status == 1 || scope.row.revenue_status == 5" @click="handle_upload(scope.row)" type="text" size="small">上传发票</el-button> -->
              <el-button  @click="view_upload(scope.row)" type="text" size="small">查看发票</el-button>
              <!-- 角色 4 5 1 不显示 -->
              <!-- 通过 且不是已发放 -->
              <el-button v-if="roleId != 4  && roleId != 5 && roleId !=1 &&  scope.row.check_status == 2 && scope.row.revenue_status != 4"  @click="handle_exportAccount(scope.row)" type="text" size="small">出账</el-button>

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
    <!-- M3 dialog 上传发票-->
    <el-dialog

      title="上传发票"
      :visible.sync="add_dialog"
      width="30%"
      center

      v-loading="invoice_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      >
      <!-- body append-to-body-->
      <!-- :http-request="handleUpload" -->
      <div class="wid_b75">
        <el-upload
          action="#"
          :http-request="handleUpload"
          :before-upload="beforeInvoiceUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-exceed="limitTip"
          :limit="1"
          ref="uploadRef"
          >
          <i  class="el-icon-plus"></i>
        </el-upload>
        <el-dialog

          title="查看发票"
          :visible.sync="invoiceDialogVisible"
          append-to-body
          center
          top="10vh"
          class="invoiceimg_wrap"
          >
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
      <!-- footer  -->
      <span slot="footer" class="dialog-footer">
      <el-button @click="add_dialog = false" size='mini'>取 消</el-button>
      <el-button type="primary" @click="saveData" size='mini'>确 定</el-button>
      </span>
    </el-dialog>
    <!-- M4 dialog 查看发票 -->
    <el-dialog
      title="查看发票"
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
import { mapGetters } from 'vuex'
import commonUrl from '../../utils/common';
import qs from 'qs';
import axios from 'axios'
// 引入 COS
import COS from 'cos-js-sdk-v5'


export default {
  name: 'agentAccountRecord',
  data(){
    return {
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
        // ***查询区
        queryForm: {
            agentName:'',
            profitTime:'',
            // 1待审核2通过3拒绝
            check_statuss:[
              {
                id:1,
                txt:'待审核'
              },
              {
                id:2,
                txt:'通过'
              },
              {
                id:3,
                txt:'拒绝'
              }
            ] ,
            check_status:'',
            // 收益状态1待开票2已开票3待发放4已发放5拒绝6数据错误
            revenue_statuss:[
              {
                id:1,
                txt:'待开票'
              },
              {
                id:2,
                txt:'已开票'
              },
              {
                id:3,
                txt:'待发放'
              },
              {
                id:4,
                txt:'已发放'
              },
              {
                id:5,
                txt:'财务拒绝'
              },
              {
                id:6,
                txt:'数据错误'
              }
            ],
            revenue_status:'',
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
        _key:'' // 记录一下上传时的key

    }
  },
  created(){
    // 获取登录角色
    this.roleId = this.$store.getters.roleId;
    console.log(this.roleId)
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
          month:this.queryForm.profitTime,
          agentName:this.queryForm.agentName,

          check_status:this.queryForm.check_status,
          revenue_status:this.queryForm.revenue_status,

        }
      }
      this.tableLoading = true
      this.$http.post(`${ commonUrl.baseUrl }/agentAccount/getAgentAccountRecord`, param).then(res=>{
        if(res.data.code == '0000'){

          // 数据
          this.tableData = res.data.data.agentAccountList
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
    },
    // 出账操作
    handle_exportAccount(row){
        console.log(row)

        // let  _flag = '';
        // let  _flag_txt = '';
        // let _flag_title = '';
        // if(row.agent_status == 1){
        //     _flag = 2
        //     _flag_txt = '是否冻结该该机构?'
        //     _flag_title='冻结'
        // }else{
        //     _flag = 1
        //     _flag_txt = '是否解冻该该机构?'
        //     _flag_title = '解冻'
        // }

        this.$confirm('是否出账?', '出账', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                size:'mini',
                center: true
            })
            .then(() => {
                let param = {
                    data:{
                        // agent_status:_flag,
                        //agentid:row.,
                        // phone:row.phone
                        agent_accountid:row.agent_accountid,
                        revenue_status:4
                    }
                }

                this.$http.post(`${ commonUrl.baseUrl }/agentAccount/confirmPayment`, param).then(res=>{
                    if(res.data.code == '0000'){
                        this.m_message(res.data.msg, 'success');

                        // 刷新
                        this.handle_refresh()
                    }else{
                          this.m_message(res.data.msg, 'warning');
                    }
                }).catch(err=>{})
            })
    },
    // 刷新 主列表
    handle_refresh(){
        this.getTableDataList(1);
        this.currentPage = 1
    },
    // 预检 上传
    beforeInvoiceUpload(file){

      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      if(!isJPG){
        this.m_message('只能上传图片', 'warning')
        return false
      }

    },
    // 上传 发票
    handleUpload(param){

      const vm = this

      let file = param.file;
      if (!file) return;
      let originName = file.name;
      let originSize = file.size;
      let originType = file.type;
      // 文件夹 文件名
      let  fileName =  new Date().getTime() + originName
      let  fileFolder = 'InvoiceImg/'
      let  key = 'InvoiceImg/' + new Date().getTime() + originName   // fileFolder + fileName
      this._key = key;
      vm.invoice_loading = true
      vm.cos.sliceUploadFile({
        Bucket: vm.Bucket,
        Region: vm.Region,
        Key: key, //上传的文件夹和图片名称
        Body: file, //要上传的文件
        onProgress: function (progressData) {
            /* 上传进度 */
            console.log(progressData);
        }
      }, function (err, data) {

          if (data.statusCode == 200) { // 上传成功返回url
            vm.invoice_loading = false
          }

      });

    },
    handlePictureCardPreview(file){

      this.dialogImageUrl = file.url;
      this.invoiceDialogVisible = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 个数限制
    limitTip(){
      this.m_message('只能上传一张', 'warning')
    },
    // 上传发票
    handle_upload(row){
      // 清空 imgUrl
      this.dialogImageUrl = ''

      this.add_dialog = true

      this.agent_accountid = row.agent_accountid
    },
    // 保存上传发票
    saveData(){
      let param = {
        data:{
            agent_accountid:this.agent_accountid+'',  // vm.agent_accountid
            invoice_url:'/'+this._key
        }
      }
      this.invoice_loading = true
      // 将数据传给后台
      this.$http.post(`${commonUrl.baseUrl}/agentAccount/uploadInvoice`, param).then(res=>{
        if(res.data.code == '0000'){
          this.invoice_loading = false
          this.add_dialog = false
          // 提示成功
          this.m_message(res.data.msg, 'success')
          this.$refs.uploadRef.clearFiles()

          // 刷新 主数据列表
          this.getTableDataList(1);
        }
      }).catch(err=>{  })
    },
    // 查看发票
    view_upload(row){
      let param = {
        data:{
          agent_accountid:row.agent_accountid+''
        }
      }
      // 弹框  加载中
      this.viewImageUrl = ''

      this.view_dialog = true
      this.view_loading= true

      this.$http.post(`${commonUrl.baseUrl}/agentAccount/checkInvoices`, param).then(res=>{
        if(res.data.code == '0000'){
          //console.log(res)

          this.viewImageUrl = res.data.data.agentAccount.invoice_url
          // 加载 结束
          this.view_loading = false
        }
      }).catch(err=>{  })
    },
    // 导出出账
    exportAccount(){
      let param = {
        data:{
          // 公有
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,

          // 私有参数
          month:this.queryForm.profitTime,
          agentName:this.queryForm.agentName,

          check_status:this.queryForm.check_status,
          revenue_status:this.queryForm.revenue_status,
        }
      }
      window.location.href = `
      ${commonUrl.baseUrl}/agentAccount/exportAgentAccount?
      signInUserId=${param.data.signInUserId}&
      signInRoleId=${param.data.signInRoleId}&
      agentName=${param.data.agentName}&
      month=${param.data.month}&
      revenue_status=${param.data.revenue_status}
      `
      // this.$http.post(`${ commonUrl.baseUrl }/agentAccount/exportAgentAccount`, param).then(res=>{
      //   if(res.data.code == '0000'){
      //     this.m_message(res.data.msg, 'success')
      //   }
      // }).catch(err=>{})
    },
    // 上传出账
    uploadAccount(){

    },
    // 审核状态
    changeOption_reviewState(e){

    },
    // 出账状态 change事件
    changeOption_exportAccount(e){

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
