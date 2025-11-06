declare module 'svelte-apexcharts' {
  import type { SvelteComponentTyped } from 'svelte';

  interface ApexChartProps {
    options?: any;
    series?: any;
    type?: 'line'|'area'|'bar'|'donut'|'pie'|'radar'|'heatmap'|string;
    width?: number|string;
    height?: number|string;
  }

  export default class ApexCharts extends SvelteComponentTyped<ApexChartProps> {}
}



