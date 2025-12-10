export type ComponentType = 
  | 'pie-chart' | 'bar-chart' | 'line-chart' | 'area-chart' | 'scatter-plot'
  | 'table' | 'metric-card' | 'text-block' | 'image' | 'iframe'
  | 'gauge' | 'heatmap' | 'treemap' | 'funnel-chart' | 'progress-bar'
  | 'timeline' | 'calendar' | 'kanban' | 'map' | 'custom-html';

export type DataSourceType = 'manual' | 'rest-api' | 'webhook' | 'csv-upload' | 'real-time-stream';

export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'email' | 'url' | 'json' | 'array' | 'object';

export type VisibilityType = 'public' | 'private' | 'password-protected';

export type UserRole = 'viewer' | 'editor' | 'admin';

export interface FieldDefinition {
  name: string;
  type: FieldType;
  required?: boolean;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: any[];
  };
  computed?: {
    formula: string;
    dependencies: string[];
  };
  deprecated?: boolean;
}

export interface GridPosition {
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  static?: boolean;
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'custom';
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: number;
  spacing: number;
  borderRadius: number;
}

export interface ResponsiveBreakpoint {
  breakpoint: 'mobile' | 'tablet' | 'desktop';
  cols: number;
  layouts: GridPosition[];
}

export interface Dashboard {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  thumbnail?: string;
  theme: ThemeSettings;
  visibility: VisibilityType;
  isSystemDashboard?: boolean;
  isSystem?: boolean; // For UI display
  tags: string[];
  refreshInterval?: number;
  exportPermissions: {
    allowPDF: boolean;
    allowPNG: boolean;
    allowCSV: boolean;
  };
  responsiveBreakpoints: ResponsiveBreakpoint[];
  collaborators: {
    userId: string;
    role: UserRole;
    addedAt: Date;
  }[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  components?: Component[];
}

export interface Component {
  _id: string;
  componentId: string;
  dashboardSlug: string;
  type: ComponentType;
  name: string;
  position: GridPosition;
  config: Record<string, any>;
  dataSource: {
    type: DataSourceType;
    config?: Record<string, any>;
  };
  fieldSchema: FieldDefinition[];
  styling: Record<string, any>;
  conditionalVisibility?: {
    field: string;
    operator: string;
    value: any;
  }[];
  createdAt: Date;
  updatedAt: Date;
  data?: ComponentData[];
}

export interface ComponentData {
  _id: string;
  componentId: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  _id: string;
  templateId: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  dashboardConfig: Partial<Dashboard>;
  components: Partial<Component>[];
  sampleData: Record<string, any[]>;
  rating: number;
  downloads: number;
  createdBy: string;
  createdAt: Date;
}

export interface ComponentTypeInfo {
  type: ComponentType;
  label: string;
  description: string;
  icon: string;
  category: 'chart' | 'data' | 'content' | 'layout';
  defaultConfig: Record<string, any>;
  defaultPosition: GridPosition;
}
