<template>
    <!-- 向导体现页面 -->
    <div class="pad_5">
        <!-- M1 查询区域 -->
        <div class="query_fields pad_b_no handle_timerange">
            <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">
              <!-- 向导姓名 -->
              <el-form-item label="向导姓名" prop="travelerName" label-width="">
                  <el-input v-model="queryForm.travelerName" placeholder="请输入向导姓名" class="wid_140"></el-input>
              </el-form-item>
              <!-- 银行卡号 -->
              <el-form-item label="银行卡号" prop="cardno" label-width="">
                  <el-input v-model="queryForm.cardno" placeholder="请输入银行卡号" class="wid_140"></el-input>
              </el-form-item>
              <!-- 提现日期 -->
              <el-form-item label="提现日期" prop="finish_time" >
                  <el-date-picker
                    v-model="queryForm.finish_time"
                    type="date"
                    class="wid_140"
                    value-format="yyyy-MM-dd"
                    placeholder="选择提现日期">
                  </el-date-picker>
              </el-form-item>
              <!-- 向导电话 -->
              <el-form-item label="向导电话" prop="phone" label-width="">
                  <el-input v-model="queryForm.phone" placeholder="请输入向导电话" class="wid_140"></el-input>
              </el-form-item>
              <!-- 提现类型 -->
              <el-form-item label="提现类型" prop="withdraw_type" label-width="68px">
                  <el-select v-model="queryForm.withdraw_type" placeholder="请选择提现类型" class="wid_140">
                    <el-option
                      v-for="(item, index) of queryForm.withdraw_types"
                      :key="index"
                      :label="item.value"
                      :value="item.id"
                      >
                    </el-option>
                  </el-select>
              </el-form-item>
              <!-- 出账状态 -->
              <el-form-item label="出账状态" prop="withdraw_status" label-width="68px">
                  <el-select v-model="queryForm.withdraw_status" placeholder="请选择出账状态" class="wid_140">
                    <el-option
                      v-for="(item, index) of queryForm.withdraw_statuss"
                      :key="index"
                      :label="item.value"
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
                  <el-button type="primary" size='mini' @click="exportData('queryForm')">导出出账账单</el-button>

              </el-form-item>
            </el-form>
        </div>
        <!-- M2 主列表 -->
        <div>
            <!-- 表格 -->
            <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">

                <!-- 向导姓名 -->
                <el-table-column prop="travelerName" label="向导姓名" width="80px">
                </el-table-column>
                <!-- 提现总金额 -->
                <el-table-column prop="money" label="提现总金额(元)" width="">
                </el-table-column>
                <!-- 电话 -->
                <el-table-column prop="phone" label="电话" width="">
                </el-table-column>
                <!-- 银行卡号 -->
                <el-table-column prop="cardno" label="银行卡号" width="">
                </el-table-column>
                <!-- 提现日期 -->
                <el-table-column prop="finish_time" label="提现日期" width="">
                </el-table-column>
                <!-- 提现类型 -->
                <el-table-column prop="" label="提现类型" width="80px">
                  <template slot-scope="scope">
                    <!-- 1现金 2贝壳 -->
                    <span v-if="scope.row.withdraw_type == 1">现金</span>
                    <span v-else-if="scope.row.withdraw_type == 2">贝壳</span>
                  </template>
                </el-table-column>
                <!-- 出账状态 withdraw_status-->
                <el-table-column prop="" label="出账状态" width="">
                  <template slot-scope="scope">
                    <!-- 0处理中 1提现成功 2提现失败 3作废 -->
                    <span v-if="scope.row.withdraw_status == 0">处理中</span>
                    <span v-else-if="scope.row.withdraw_status == 1">提现成功</span>
                    <span v-else-if="scope.row.withdraw_status == 2">提现失败</span>
                    <span v-else-if="scope.row.withdraw_status == 3">作废</span>
                  </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column prop="" label="操作" width="60px">
                  <template slot-scope="scope">
                    <!-- 0处理中 1提现成功 2提现失败 3作废 -->
                    <el-button
                      v-if="scope.row.withdraw_status == 0"
                      @click="handle_upload(scope.row)"
                      type="text" size="small"
                      >
                      已出账
                    </el-button>
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
    </div>
</template>
<script>
import commonUrl from '../../utils/common';

export default {
    name: 'withdraw',
    data(){
        return {
            // 主列表
            tableLoading:false,
            tableData:[],
            // 分页
            pageTotal: 100,
            currentPage:1,
            // 查询参数
            queryForm: {
              travelerName:'',
              cardno:'',
              finish_time:'',
              phone:'',
              // 提现类型 1现金 2贝壳
              withdraw_types:[
                {
                  id:1,
                  value:'现金'
                },
                {
                  id:2,
                  value:'贝壳'
                }
              ],
              withdraw_type:'',
              // 出账状态 0处理中 1提现成功 2提现失败 3作废
              withdraw_statuss:[
                {
                  id:0,
                  value:'处理中'
                },
                {
                  id:1,
                  value:'提现成功'
                },
                {
                  id:2,
                  value:'提现失败'
                },
                {
                  id:3,
                  value:'作废'
                },
              ],
              withdraw_status:'',
            },
        }
    },
    created(){
        // 初始化主列表
        this.getTabelDataList(1)
    },
    methods:{
        // 初始化主列表
        getTabelDataList(pageNum){
            // 参数
            let param = {
                data: {
                    // 公有
                    signInUserId: this.$store.getters.userId,
                    signInRoleId: this.$store.getters.roleId,
                    pageNum: pageNum,
                    pageSize: 10,
                    // 私有
                    travelerName:this.queryForm.travelerName,
                    cardno:this.queryForm.cardno,
                    finish_time:this.queryForm.finish_time,
                    phone:this.queryForm.phone,
                    withdraw_type:this.queryForm.withdraw_type,
                    withdraw_status:this.queryForm.withdraw_status,
                }
            }
            this.tableLoading = true
            this.$http.post(`${ commonUrl.baseUrl }/withdrawInfo/getWithdrawInfo`, param).then(res=>{
              if(res.data.code == '0000'){
                  // console.log(res)
                  // debugger
                  this.tableData =  res.data.data.withdrawList
                  // 分页 总数
                  this.pageTotal = res.data.data.page.pageTotal;
                  // 关闭加载
                  this.tableLoading = false
              }else{
                this.m_message(res.data.msg, 'warning')
                // 关闭加载
                this.tableLoading = false
              }
            }).catch(err=>{})
        },
        // 导出数据
        exportData(){
            let param = {
                data:{
                    // 公有
                    signInUserId: this.$store.getters.usreId,
                    signInRoleId: this.$store.getters.roleId,
                    // 私有
                    // 收益类型
                    account_class:this.queryForm.account_class,
                    // 所属市级机构
                    city_agent_name:this.queryForm.city_agent_name,
                    // 向导ID
                    customid:this.queryForm.customid,
                    // 出行项目
                    travel_projects:this.queryForm.travel_projects,
                    // 出行开始时间
                    startTime:this.queryForm.startTime,
                    // 出行结束时间
                    endTime:this.queryForm.endTime,
                }
            }
            // 其他收益的数据导出
            window.location.href = `${commonUrl.baseUrl}/accountProfit/exportAccountProfit?signInUserId=${param.data.signInUserId}&signInRoleId=${param.data.signInRoleId}&customid=${param.data.customid}&account_class=${param.data.account_class}&city_agent_name=${param.data.city_agent_name}&startTime=${param.data.startTime}&endTime=${param.data.endTime}`
            // this.$http.post(`${ commonUrl.baseUrl}/accountProfit/exportAccountProfit`, param).then(res=>{
            //     if(res.data.code == '0000'){
            //         this.m_message(res.data.msg, 'success')
            //     }
            // }).catch(err=>{})
        },
        // 刷新
        handle_refresh(){
            this.getTabelDataList(1)
            this.currentPage = 1
        },
        // 处理待出账
        handle_upload(row){
          // console.log(row)
          // debugger
          this.$confirm('确定设置为已出账吗?', '处理待出账', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            size:'mini',
            center: true
          }).then(() => {  // 提现成功状态 2
              let param = {
                  data:{

                    withdrawid:row.withdrawid,
                    withdraw_status:1,
                  }
              }
              this.$http.post(`${ commonUrl.baseUrl }/withdrawInfo/uploadWithdrawStatus`, param).then(res=>{
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
        // 查询按钮
        queryData(){
          this.getTabelDataList(1);
        },
        // 重置按钮
        resetData(formName){
            this.$refs[formName].resetFields();
            // 对于queryForm 下拉
            this.queryForm.startTime = ''
            this.queryForm.endTime = ''
        },
        // 分页
        handleCurrentChange(val){
            this.currentPage = val
            // 获取单前页数据列表
            this.getTabelDataList(val);
            //console.log(`当前页: ${val}`);
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
