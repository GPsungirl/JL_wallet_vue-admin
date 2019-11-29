
<template>
<div class="userPermission">
  <!--module1 功能区域 -->
  <div class="query_field mar_b10">
    <el-row>
      <el-button type="primary" size='mini' @click="handle_addMessageInfo">新增信息</el-button>
      <el-button type="primary" size='mini' @click="refreshData">刷新</el-button>
    </el-row>
  </div>

  <!--module2 表格 -->
  <el-table :data="tableData" v-loading="tableLoading" border  style="width: 100%">

    <!-- 信息 -->
    <el-table-column prop="message_info" label="信息内容" width="850">
    </el-table-column>
    <!-- 状态 -->
    <el-table-column prop="" label="状态" width="">
      <template slot-scope="scope">
        <span v-if="scope.row.message_status == 1">可用</span>
        <span v-if="scope.row.message_status == 2">不可用</span>
      </template>
    </el-table-column>
    <!-- 类型 -->
    <el-table-column prop="message_type" label="类型" width="">
    </el-table-column>
    <el-table-column prop="" label="操作" width="">
      <template slot-scope="scope">
          <el-button @click="modi_refuseCause(scope.row)" type="text" size="small">修改</el-button>
          <!-- <el-button v-if="scope.row.message_status == 1" @click="modi_status(scope.row)" type="text" size="small">禁用</el-button>
          <el-button v-else-if="scope.row.message_status == 2" @click="modi_status(scope.row)" type="text" size="small">可用</el-button> -->
      </template>
    </el-table-column>
  </el-table>

  <!--module3 分页 -->
  <div class="block mar_t10">
    <el-pagination

      @current-change="handleCurrentChange"
      :current-page="currentPage"

      background
      layout="total, prev, pager, next, jumper"
      :total="pageTotal">
    </el-pagination>
  </div>
  <!--module5 新增消息 dialog2 -->
  <el-dialog
    :title="dialog_title"
    :visible.sync="addUsers_dialogVisible"
    width="30%"
    class=""
    center
    :close-on-click-modal="false"
    v-loading="add_loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    >
    <!--新增 body -->
    <div class="dialogBody_addPermission ">
      <div class="grid-content bg-purple-dark pad_t2">
        <el-form :inline="true" :model="valid_addForm" :rules="add_rules" ref="valid_addForm" label-width="" class=" valid_form">
          <!-- 信息内容 -->
          <el-form-item label="信息内容" prop="message_info">
            <el-input v-model="valid_addForm.message_info" class="message_info" placeholder="请输入信息内容" type="textarea"></el-input>
          </el-form-item>
          <!-- 信息类型 -->
           <el-form-item label="信息类型" prop="message_type">
            <el-input v-model="valid_addForm.message_type" class="" placeholder="请输入信息类型"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="info" @click="addUsers_dialogVisible = false" size='mini'>取 消</el-button>
      <el-button type="primary" @click="save_addMessageInfo" size='mini'>确 定</el-button>
    </span>
  </el-dialog>
  <!-- M6  修改消息 dialog3 -->
  <el-dialog
    :title="modiSys_dialogTitle"
    :visible.sync="modiUsers_dialogVisible"
    :close-on-click-modal="false"
    width="30%"
    class=""
    center

    v-loading="modiUser_loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    >
    <!--新增 body -->
    <div class="dialogBody_addPermission">
      <div class="grid-content bg-purple-dark pad_t2">
        <el-form :inline="true" :model="valid_modiForm" :rules="modi_rules" ref="valid_modiForm" label-width="" class="valid_form">
          <!-- 信息内容 -->
          <el-form-item label="信息内容" prop="message_info">
            <el-input v-model="valid_modiForm.message_info" class="message_info" placeholder="请输入信息内容" type="textarea"></el-input>
          </el-form-item>
          <!-- 信息类型 -->
          <el-form-item label="信息类型" prop="message_type">
            <el-input v-model="valid_modiForm.message_type" class="" placeholder="请输入信息类型"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="info" @click="modiUsers_dialogVisible = false" size='mini'>取 消</el-button>
      <el-button type="primary" @click="save_modiRefuseCause" size='mini'>确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import commonUrl from '../../utils/common';
import gpCommonJs from '../../utils/functions'

export default {
  name: 'messageInfo',

  data() {
    return {

      //M1 主列表
      tableData: [],
      tableLoading: false,
      modi_loading:false,
      add_loading: false,
      //M2 分页
      pageTotal: 100,
      currentPage: 1,
      //M3 俩弹框
      permission_dialogVisible: false,
      addUsers_dialogVisible: false,
      // 修改弹框
      modiUsers_dialogVisible:false,
      modiUser_loading:false,
      dialog_title:'新增消息',
      modiSys_dialogTitle:'',
      formLabelWidth: '120px',
      // 新增 树的数据
      addDialog_tree: [],
      // 修改 树
      modiDialog_tree: [],
      // 默认展开 和 默认选中项
      modi_default_ids: [],
      // 修改时的id
      modi_id:'',
      // 新增消息
      valid_addForm: {
        message_info:'',
        message_type:'',
      },
      add_rules: {
        message_info: [
          { required: true, message: '请输入信息内容', trigger: 'blur' },
        ],
        message_type: [
          { required: true, message: '请输入信息类型', trigger: 'blur' },
        ],
      },
      // 修改消息
      valid_modiForm: {
        message_info:'',
        message_type:'',
        messageId:'',
      },
      modi_rules:{
        message_info: [
          { required: true, message: '请输入信息内容', trigger: 'blur' },
        ],
        message_type: [
          { required: true, message: '请输入信息类型', trigger: 'blur' },
        ],
      },


    }
  },
  created() {
    // 初始化数据列表
    this.getTableList(1);
  },
  methods: {

    // 主列表（提示信息列表)
    async getTableList(pageNum) {
      // 参数
      let param = {
        data: {
          // 公有
          message_type:'',
          message_status:'',
          pageNum: pageNum,
          pageSize: 10,

        }
      }
      this.tableLoading = true
      const res = await this.$http.post(`${commonUrl.baseUrl}/messageInfo/selectAllMessages`, param)
      if (res.data.code == '0000') {
        this.tableLoading = false
        // console.log(res)
        // debugger
        this.tableData = res.data.data.messageInfoList
        // 分页 总数
        this.pageTotal = res.data.data.page.pageTotal;
      }
    },
    // 刷新界面(目前刷新 数据列表)
    refreshData(){
      // 初始化数据列表
      this.getTableList(1);
      // 分页 回到第一页
      this.currentPage = 1
    },
    // 新增按钮 (新增消息)
    handle_addMessageInfo() {
      // 弹框
      this.dialog_title = '新增消息'

      // 初始化新增页面
      let param = {
        data: {

        }
      }
      this.$http.post(`${ commonUrl.baseUrl }/messageInfo/addMessagesPage`, param).then( res =>{
        if(res.data.code === '0000'){
          console.log(res)
          // 打开弹框
          this.addUsers_dialogVisible = true
          this.resetForm('valid_addForm')
        }

      }).catch( err =>{ console.log(err) })

    },
    // 新增=保存按钮(保存信息)
    save_addMessageInfo(){
      if(this.m_valid_addForm('valid_addForm')){
        let param = {
          data:{
            message_info:this.valid_addForm.message_info,
            message_type:this.valid_addForm.message_type
          }
        }
        this.add_loading = true;
        this.$http.post(`${ commonUrl.baseUrl }/messageInfo/addMessagesAndUpdate`, param).then( res =>{

          if(res.data.code == '0000'){
            this.add_loading = false;
            // 成功提示
            this.m_message(res.data.msg, 'success')
            // 重新初始化数据列表
            this.getTableList( this.currentPage );
            // 关闭 弹框
            this.addUsers_dialogVisible = false

          }else{
            this.add_loading = false;
            this.m_message(res.data.msg, 'warning')
          }
        }).catch( err => {
          console.log(err)
        })
      }
    },
    // 修改操作(修改信息)
    modi_refuseCause(row) {
      console.log(row)
      // 打开 弹框
      this.modiUsers_dialogVisible = true
      // 清空
      this.resetForm('valid_modiForm')
      let param = {
        data:{
          messageId:row.messageid
        }
      }
      this.modiUser_loading = true
      // 获取信息
      this.$http.post(`${ commonUrl.baseUrl }/messageInfo/updateMessagesPage`,param).then(res=>{
        if(res.data.code == '0000'){
          // 获取数据
          let  result = res.data.data.messageInfo
          this.valid_modiForm.messageId = result.messageid
          this.valid_modiForm.message_info = result.message_info
          this.valid_modiForm.message_type = result.message_type
          // 关闭加载
          this.modiUser_loading = false
        }
      }).catch(err=>{})

    },
    // 修改保存(保存修改信息)
    save_modiRefuseCause(){
      if(this.m_valid_addForm('valid_modiForm')){
        // 保存到 后台
        let param = {
          data:{
            messageId:this.valid_modiForm.messageId,
            message_info:this.valid_modiForm.message_info,
            message_type:this.valid_modiForm.message_type
          }
        }
        this.modi_loading = true;
        this.$http.post(`${ commonUrl.baseUrl }/messageInfo/addMessagesAndUpdate`, param).then( res =>{
          if(res.data.code == '0000'){
            this.modi_loading = false;
            // 成功提示
            this.m_message(res.data.msg, 'success')
            // 重新初始化数据列表
            this.getTableList( this.currentPage );
            // 关闭 弹框
            this.modiUsers_dialogVisible = false
          }else{
            this.modi_loading = false;
            this.m_message(res.data.msg, 'success')
          }
        }).catch( err => {
          console.log(err)
        })
      }
    },
    // 可用 不可用
    modi_status(row){
      let _flag = '';
      let _flag_txt = '';
      if(row.cause_status == 1){
          _flag = 2
          _flag_txt ='是否禁用该条原因?'
      }else{
          _flag = 1
          _flag_txt ='是否设置该条原因为可用?'
      }
      this.$confirm(_flag_txt, '可用/禁用', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              size:'mini',
              center: true
      }).then(() => {
        let param = {
            data:{
              causeid:row.causeid,
              cause_status:_flag
            }
        }
        this.$http.post(`${ commonUrl.baseUrl }/remarkRefusedCause/updateRefusedCauseStatus`, param).then(res=>{
            if(res.data.code == '0000'){
              this.m_message(res.data.msg, 'success');
              // 刷新
              this.refreshData()
            }else{

              this.m_message(res.data.msg, 'warning');
            }
        }).catch(err=>{})
      })
    },

    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      // 获取单前页数据列表
      this.getTableList(val);

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
    m_message(message,type){
      this.$message({
        message,
        type
      })
    },
    // 重置
    resetForm(formName) {
      if(this.$refs[formName]){
        this.$refs[formName].resetFields();
      }
    }


  },

}
</script>

<style lang="scss">
.userPermission {
  .mar_b10 {
    margin-bottom: 5px;
  }
  .mar_t10 {
    margin-top: 10px;
  }
  padding:5px; // 功能区域0
  .query_field {
    padding: 12px 8px;
    background-color: #fff;
  }

  .addUsers_dialog .el-dialog__body,
  .modiUsers_dialog .el-dialog__body{height: 50vh;overflow: auto;}
  .message_info .el-textarea__inner{
    min-height: 100px !important;
  }
}
</style>
