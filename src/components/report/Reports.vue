<template>
  <div>
    <el-card>
      <div id="main" style="width: 100%;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import { getReports } from "@/api/report";

  export default {
  name: 'report',
  data(){
    return{
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  mounted() {
    let myChart = echarts.init(document.getElementById('main'));
    getReports().then(res => {
      const result = Object.assign(this.options, res.data);
      result.xAxis[0].boundaryGap = false;
      myChart.setOption(result);
    })
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>

</style>
