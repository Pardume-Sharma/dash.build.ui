import { ComponentTypeInfo } from '@/types/dashboard';

export const COMPONENT_TYPES: ComponentTypeInfo[] = [
  // Charts
  {
    type: 'pie-chart',
    label: 'Pie Chart',
    description: 'Display data in circular segments',
    icon: '🥧',
    category: 'chart',
    defaultConfig: { showLegend: true, showLabels: true },
    defaultPosition: { x: 0, y: 0, w: 4, h: 4, minW: 2, minH: 2 },
  },
  {
    type: 'bar-chart',
    label: 'Bar Chart',
    description: 'Compare values with vertical or horizontal bars',
    icon: '📊',
    category: 'chart',
    defaultConfig: { orientation: 'vertical', showGrid: true },
    defaultPosition: { x: 0, y: 0, w: 6, h: 4, minW: 3, minH: 2 },
  },
  {
    type: 'line-chart',
    label: 'Line Chart',
    description: 'Show trends over time',
    icon: '📈',
    category: 'chart',
    defaultConfig: { showDots: true, smooth: false },
    defaultPosition: { x: 0, y: 0, w: 6, h: 4, minW: 3, minH: 2 },
  },
  {
    type: 'area-chart',
    label: 'Area Chart',
    description: 'Display quantitative data with filled areas',
    icon: '📉',
    category: 'chart',
    defaultConfig: { stacked: false, fillOpacity: 0.6 },
    defaultPosition: { x: 0, y: 0, w: 6, h: 4, minW: 3, minH: 2 },
  },
  {
    type: 'scatter-plot',
    label: 'Scatter Plot',
    description: 'Show correlation between two variables',
    icon: '⚫',
    category: 'chart',
    defaultConfig: { showTrendline: false },
    defaultPosition: { x: 0, y: 0, w: 6, h: 4, minW: 3, minH: 2 },
  },
  {
    type: 'gauge',
    label: 'Gauge',
    description: 'Display a single metric with min/max range',
    icon: '🎯',
    category: 'chart',
    defaultConfig: { min: 0, max: 100, unit: '%' },
    defaultPosition: { x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
  },
  {
    type: 'funnel-chart',
    label: 'Funnel Chart',
    description: 'Visualize stages in a process',
    icon: '🔻',
    category: 'chart',
    defaultConfig: { showPercentages: true },
    defaultPosition: { x: 0, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
  },
  
  // Data Display
  {
    type: 'table',
    label: 'Table',
    description: 'Display data in rows and columns',
    icon: '📋',
    category: 'data',
    defaultConfig: { sortable: true, filterable: true, pagination: true, pageSize: 10 },
    defaultPosition: { x: 0, y: 0, w: 8, h: 6, minW: 4, minH: 3 },
  },
  {
    type: 'metric-card',
    label: 'Metric Card',
    description: 'Highlight a key metric with trend',
    icon: '💳',
    category: 'data',
    defaultConfig: { showTrend: true, showIcon: true },
    defaultPosition: { x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
  },
  {
    type: 'progress-bar',
    label: 'Progress Bar',
    description: 'Show completion percentage',
    icon: '▬',
    category: 'data',
    defaultConfig: { showLabel: true, animated: true },
    defaultPosition: { x: 0, y: 0, w: 4, h: 1, minW: 2, minH: 1 },
  },
  {
    type: 'heatmap',
    label: 'Heatmap',
    description: 'Visualize data density with colors',
    icon: '🔥',
    category: 'chart',
    defaultConfig: { colorScheme: 'blue' },
    defaultPosition: { x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
  },
  {
    type: 'treemap',
    label: 'Treemap',
    description: 'Display hierarchical data',
    icon: '🌳',
    category: 'chart',
    defaultConfig: { showLabels: true },
    defaultPosition: { x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
  },
  
  // Content
  {
    type: 'text-block',
    label: 'Text Block',
    description: 'Add formatted text content',
    icon: '📝',
    category: 'content',
    defaultConfig: { richText: true },
    defaultPosition: { x: 0, y: 0, w: 4, h: 2, minW: 2, minH: 1 },
  },
  {
    type: 'image',
    label: 'Image',
    description: 'Display an image',
    icon: '🖼️',
    category: 'content',
    defaultConfig: { fit: 'cover' },
    defaultPosition: { x: 0, y: 0, w: 4, h: 3, minW: 2, minH: 2 },
  },
  {
    type: 'iframe',
    label: 'Iframe',
    description: 'Embed external content',
    icon: '🌐',
    category: 'content',
    defaultConfig: { allowFullscreen: true },
    defaultPosition: { x: 0, y: 0, w: 6, h: 4, minW: 3, minH: 3 },
  },
  {
    type: 'custom-html',
    label: 'Custom HTML',
    description: 'Add custom HTML/CSS/JS',
    icon: '💻',
    category: 'content',
    defaultConfig: { sandboxed: true },
    defaultPosition: { x: 0, y: 0, w: 4, h: 3, minW: 2, minH: 2 },
  },
  
  // Layout & Organization
  {
    type: 'timeline',
    label: 'Timeline',
    description: 'Display events chronologically',
    icon: '⏱️',
    category: 'layout',
    defaultConfig: { orientation: 'vertical' },
    defaultPosition: { x: 0, y: 0, w: 6, h: 6, minW: 4, minH: 4 },
  },
  {
    type: 'calendar',
    label: 'Calendar',
    description: 'Show events in calendar view',
    icon: '📅',
    category: 'layout',
    defaultConfig: { view: 'month' },
    defaultPosition: { x: 0, y: 0, w: 8, h: 6, minW: 6, minH: 4 },
  },
  {
    type: 'kanban',
    label: 'Kanban Board',
    description: 'Organize tasks in columns',
    icon: '📌',
    category: 'layout',
    defaultConfig: { columns: ['To Do', 'In Progress', 'Done'] },
    defaultPosition: { x: 0, y: 0, w: 12, h: 6, minW: 8, minH: 4 },
  },
  {
    type: 'map',
    label: 'Map',
    description: 'Display geographic data',
    icon: '🗺️',
    category: 'layout',
    defaultConfig: { zoom: 10, showMarkers: true },
    defaultPosition: { x: 0, y: 0, w: 8, h: 6, minW: 4, minH: 4 },
  },
];

export const getComponentTypeInfo = (type: string): ComponentTypeInfo | undefined => {
  return COMPONENT_TYPES.find(ct => ct.type === type);
};

export const getComponentsByCategory = (category: string) => {
  return COMPONENT_TYPES.filter(ct => ct.category === category);
};
