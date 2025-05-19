<template>
  <div class="dashboard">
    <div class="dashboard-stats">
      <div class="stat-card crd">
        <div class="stat-card-data">
          <p>Total Complaints</p>
          <h2>{{ analytics.totalComplaints }}</h2>
        </div>
        <div class="stat-card-icon">
          <span class="material-symbols-rounded">checklist</span>
        </div>
      </div>
      <div class="stat-card crd">
        <div class="stat-card-data">
          <p>Resolved Complaints</p>
          <h2>{{ analytics.resolvedComplaints }}</h2>
        </div>
        <div class="stat-card-icon">
          <span class="material-symbols-rounded">check</span>
        </div>
      </div>

      <div class="stat-card crd">
        <div class="stat-card-data">
          <p>Pending Complaints</p>
          <h2>{{ analytics.pendingComplaints }}</h2>
        </div>
        <div class="stat-card-icon">
          <span class="material-symbols-rounded">pending_actions</span>
        </div>
      </div>

      <div class="stat-card crd">
        <div class="stat-card-data">
          <p>Complaints Made Today</p>
          <h2>{{ analytics.complaintsMadeToday }}</h2>
        </div>
        <div class="stat-card-icon">
          <span class="material-symbols-rounded">calendar_month</span>
        </div>
      </div>
    </div>
    <div class="dashboard-chart crd">
      <h1 class="dashboard-stat-title">Complaints in the last 7 days</h1>
      <div id="data-chart">
        <Chart type="line" :data="chartData" :options="chartOptions" />
      </div>
    </div>
    <div class="dashboard-pie-chart crd">
      <h1 class="dashboard-stat-title">Complaint Categories Distribution</h1>
      <div id="pie-chart">
        <Chart type="pie" :data="pieChartData" :options="pieChartOptions" />
      </div>
    </div>
    <div class="dashboard-ai-insights crd" v-if="renderedInsights">
      <h1 class="dashboard-stat-title">AI Insights</h1>
      <div class="ai-insights-content" v-html="renderedInsights"></div>
    </div>
  </div>  
</template>

<script setup lang="ts">
  import { AnalyticsActionTypes, UsersActionTypes } from '@/stores/actions/action-types.enum';
  import { useUsersStore } from '@/stores/users';
  import { useHead } from '@unhead/vue';
  import { ChartOptions, ChartData } from 'chart.js';
  import Chart from 'primevue/chart';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import { useToast } from 'primevue/usetoast';
  import { onMounted, ref, watchEffect } from 'vue';
  import dayjs from 'dayjs';
  import { marked } from 'marked';
  import { useAnalyticsStore } from '@/stores/analytics';
  import { IGetAnalyticsResDto } from '@shared/interfaces/analytics/IAnalyticsRes.dto';

  const isLoading = ref(false);
  const usersStore = useUsersStore();
  const analyticsStore = useAnalyticsStore();
  const toast = useToast();
  const aiInsights = ref('');
  const renderedInsights = ref('');
  

  const analytics = ref<IGetAnalyticsResDto>({
    totalComplaints: '--',
    resolvedComplaints: '--',
    pendingComplaints: '--',
    complaintsMadeToday: '--',
    complaintsByDays: {
      labels: [],
      datasets: []
    },
    complaintsByCategory: {
      labels: [],
      datasets: [{
        data: []
      }]
    }
  });

  const chartColors = ['#7c98b3', '#b38d7c', '#7c98b3', '#b38d7c', '#7c98b3']; 
  const pieChartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8AC249', '#EA526F', '#23B5D3', '#279AF1'];
  
  const chartData = ref<ChartData>({
    labels: [],
    datasets: []
  })

  useHead({
    title: 'Dashboard'
  })

  const chartOptions = ref<ChartOptions>({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      axis: 'x',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'My Custom Chart'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false
        }
      },
      x: {
      },
    },
    elements: {
      line: {
        borderJoinStyle: 'round',
      }
    }
  })

  const pieChartData = ref<ChartData>({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: pieChartColors,
      hoverBackgroundColor: pieChartColors
    }]
  });

  const pieChartOptions = ref<ChartOptions>({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw as number;
            const data = (context.dataset.data as number[]).filter((val): val is number => val !== null);
            const total = data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  });

  const getAnalytics = async () => {
    isLoading.value = true;
    try {
      const res = await analyticsStore[AnalyticsActionTypes.GET_ANALYTICS]();
      const data = res.data as IGetAnalyticsResDto;
      analytics.value = data;
      
      // Update line chart data
      chartData.value.labels = analytics.value.complaintsByDays.labels.map(label => dayjs(label).format('ddd, DD-MM-YYYY'));
      chartData.value.datasets = analytics.value.complaintsByDays.datasets.map((dataset, index) => ({
        ...dataset,
        borderColor: chartColors[index],
        backgroundColor: 'transparent',
        tension: 0.5,
        fill: true,
      }));

      // Update pie chart data
      pieChartData.value.labels = analytics.value.complaintsByCategory.labels;
      pieChartData.value.datasets = [{
        ...pieChartData.value.datasets[0],
        data: analytics.value.complaintsByCategory.datasets[0].data
      }];

      // Get AI insights
      const insightsRes = await analyticsStore[AnalyticsActionTypes.GET_AI_INSIGHTS]();
      aiInsights.value = insightsRes.data;
      renderedInsights.value = marked(aiInsights.value) as string;
    } catch (error: any) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data.message ? error.response?.data.message : 'An error occurred while fetching analytics',
        life: 3000,
      });
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(() => {
    getAnalytics();
  });

</script>

<style scoped lang="scss">
  .dashboard {
    .dashboard-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      align-items: center;
      justify-content: space-between;
      gap: 20px;

      @media (max-width: 1000px) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (max-width: 770px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 500px) {
        grid-template-columns: repeat(1, 1fr);
      }

      .stat-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding: 20px;
        border-radius: 10px;
        width: 100%;
        // width: calc(100% / 4);

        .stat-card-data {
          display: flex;
          justify-content: space-between;
          flex-direction: column;

          p {
            font-size: .89rem;
            font-weight: 600;
            opacity: .7;
          }

          h2 {
            font-size: 1.7rem;
            font-weight: 600;
          }
        }

        .stat-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: var(--pale-blue);

          span {
            font-size: 1.8rem;
            color: var(--blue);
          } 
        }
      }
    }

    .dashboard-chart {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      gap: 20px;
      padding: 20px;
      margin-top: 20px;
      border-radius: 10px;

      #data-chart {
        width: 100%;
        height: 300px;

        .p-chart {
          width: 100%;
          height: 100%;
        }
      }
    }

    .dashboard-pie-charts {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-top: 20px;
    }

    .dashboard-pie-chart {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      gap: 20px;
      padding: 20px;
      border-radius: 10px;
      margin: 20px 0;

      #pie-chart {
        width: 100%;
        height: 350px;

        .p-chart {
          width: 100%;
          height: 100%;
        }
      }
    }

    .dashboard-ai-insights {
      padding: 20px;
      border-radius: 10px;

      .ai-insights-content {
        font-size: .95rem;
        margin-top: 15px;
        line-height: 1.6;

        :deep(h3) {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 1.5rem 0 1rem;
          color: var(--text-color);
        }

        :deep(ul) {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }

        :deep(li) {
          margin: 0.5rem 0;
        }

        :deep(strong) {
          color: var(--primary-color);
          font-weight: 600;
        }
      }
    }

    .dashboard-table {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      gap: 20px;
      padding: 20px;
      margin-top: 20px;
      border-radius: 10px;
    }

    .dashboard-stat-title {
      font-size: 1.1rem;
      font-weight: 600;
    }
  }

  .dashboard-mb {
    margin-bottom: 15px;
  }

  .dashboard-tp {
    margin-top: 15px;
  }
</style>