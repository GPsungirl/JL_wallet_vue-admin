<template>
    <!-- 其他收益页面 -->
    <div class="pad_5">
        <!-- M1 查询区域 -->
        <div class="query_fields pad_b_no handle_timerange">
            <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">
             <!-- 收益类型 -->
            <el-form-item label="收益类型" prop="account_class" label-width="68px">
                <el-select v-model="queryForm.account_class" placeholder="请选择收益类型">
                   <el-option
                    v-for="(item, index) of queryForm.account_classs"
                    :key="index"
                    :label="item.value"
                    :value="item.id"
                    >
                   </el-option>
                </el-select>
            </el-form-item>
            <!-- 所属市级机构 -->
            <el-form-item label="所属机构" prop="city_agent_name" label-width="100px">
                <el-input v-model="queryForm.city_agent_name" placeholder="请输入所属市级机构" class="wid_140"></el-input>
            </el-form-item>
            <!-- 向导ID -->
            <el-form-item label="收益来源ID" prop="customid" label-width="">
                <el-input v-model="queryForm.customid" placeholder="请输入收益来源ID" class="wid_140"></el-input>
            </el-form-item>
            <!--  -->
            <!-- 出行时间 -->
            <el-form-item label="出行时间" prop="allTime">
                <el-date-picker
                    v-model="queryForm.allTime"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间">
                </el-date-picker>
            </el-form-item>
            <!-- 查询 -->
            <el-form-item>
                <el-button type="primary" size='mini' @click="queryData">查询</el-button>
                <el-button type="success" size='mini' @click="resetData('queryForm')">重置</el-button>
                <el-button type="primary" size='mini' @click="handle_refresh">刷新</el-button>
                <el-button type="primary" size='mini' @click="exportData('queryForm')">导出数据</el-button>

            </el-form-item>
            </el-form>
        </div>
        <!-- M2 主列表 -->
        <div>
            <!-- 表格 -->
            <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
                <el-table-column prop="" label="收益类型" width="" >
                    <template slot-scope="scope">
                        <span v-if="scope.row.account_class == 1">出行</span>
                    </template>
                </el-table-column>

                <el-table-column prop="" label="订单信息" width="">
                    <template slot-scope="scope">
                        <!-- 1晨光出行2暖阳午后3星空夜景 -->
                        <span v-if="scope.row.order_travel_type == 1">晨光出行</span>
                        <span v-else-if="scope.row.order_travel_type == 2">暖阳午后</span>
                        <span v-else-if="scope.row.order_travel_type == 3">星空夜景</span>
                    </template>
                </el-table-column>

                <el-table-column prop="totalPrice" label="订单金额" width="">
                </el-table-column>
                <el-table-column prop="customid" label="收益来源ID" width="">
                </el-table-column>
                <el-table-column prop="customid" label="向导ID" width="">
                </el-table-column>
                <el-table-column prop="custom_name" label="姓名" width="">
                </el-table-column>
                <el-table-column prop="city_agent_name" label="所属机构" width="">
                </el-table-column>
                <el-table-column prop="up_custom_name" label="所属上级" width="">
                </el-table-column>
                <el-table-column prop="customAmount" label="向导分成" width="">
                </el-table-column>

                <el-table-column prop="cityAmount" label="市机构分成" width="">
                </el-table-column>



                <el-table-column prop="upAmount" label="上级分成" width="">
                </el-table-column>

                <el-table-column prop="platAmount" label="平台收益" width="">
                </el-table-column>
                <el-table-column prop="totalPrice" label="总价" width="">
                </el-table-column>
                <el-table-column prop="createtime" show-overflow-tooltip label="订单时间" width="">
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
    name: 'accountProfit',
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
                account_classs:[
                    {
                        id:1,
                        value:'出行'
                    }
                ],
                // 收益类型
                account_class:'',
                // 所属市级机构
                city_agent_name:'',
                // 向导id
                customid:'',
                // 所有时间
                allTime:'',
                // 结束时间
                endTime:'',
                // 开始时间
                startTime:'',
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
                    signInUserId: this.$store.getters.usreId,
                    signInRoleId: this.$store.getters.roleId,
                    pageNum: pageNum,
                    pageSize: 10,
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
            // 贝壳   virtualProfit/selectVirtualProfit
            // 其他   virtualProfit/selectVirtualProfit
            this.tableLoading = true
            this.$http.post(`${ commonUrl.baseUrl }/accountProfit/selectAccountProfit`, param).then(res=>{

                if(res.data.code == '0000'){

                    this.tableData =  res.data.data.accountProfitList
                    // 分页 总数
                    this.pageTotal = res.data.data.page.pageTotal;
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
        // 查询按钮
        queryData(){
            if(this.queryForm.allTime.length > 0){
                // 修正 开始 和结束 时间
                this.queryForm.startTime = this.queryForm.allTime[0]
                this.queryForm.endTime = this.queryForm.allTime[1]
            }

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
