'use client';

import { useEffect, useState } from 'react';
import { Component } from '@/types/dashboard';
import { api } from '@/lib/api';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import MetricCard from './renderers/MetricCard';
import LineChartRenderer from './renderers/LineChartRenderer';
import BarChartRenderer from './renderers/BarChartRenderer';
import PieChartRenderer from './renderers/PieChartRenderer';
import AreaChartRenderer from './renderers/AreaChartRenderer';
import FunnelChartRenderer from './renderers/FunnelChartRenderer';
import TableRenderer from './renderers/TableRenderer';
import ScatterPlotRenderer from './renderers/ScatterPlotRenderer';
import GaugeRenderer from './renderers/GaugeRenderer';
import HeatmapRenderer from './renderers/HeatmapRenderer';
import TreemapRenderer from './renderers/TreemapRenderer';
import ProgressBarRenderer from './renderers/ProgressBarRenderer';
import TextBlockRenderer from './renderers/TextBlockRenderer';
import ImageRenderer from './renderers/ImageRenderer';
import IframeRenderer from './renderers/IframeRenderer';
import TimelineRenderer from './renderers/TimelineRenderer';
import CalendarRenderer from './renderers/CalendarRenderer';
import KanbanRenderer from './renderers/KanbanRenderer';
import MapRenderer from './renderers/MapRenderer';
import CustomHTMLRenderer from './renderers/CustomHTMLRenderer';
import ComponentWrapper from './ComponentWrapper';

interface ComponentGridProps {
  components: Component[];
  editMode: boolean;
  onUpdate: () => void;
  onComponentClick?: (component: Component) => void;
}

export default function ComponentGrid({ components, editMode, onUpdate, onComponentClick }: ComponentGridProps) {
  const [componentsWithData, setComponentsWithData] = useState<Map<string, any[]>>(new Map());
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Use data that's already provided with components (from optimized dashboard endpoint)
    const dataMap = new Map();
    components.forEach(component => {
      if (component.data) {
        dataMap.set(component.componentId, component.data);
      }
    });
    setComponentsWithData(dataMap);
    updateLayouts();
  }, [components]);

  const updateLayouts = () => {
    const newLayouts = components.map(comp => ({
      i: comp.componentId,
      x: comp.position.x,
      y: comp.position.y,
      w: comp.position.w,
      h: comp.position.h,
      minW: comp.position.minW || 2,
      minH: comp.position.minH || 2,
      maxW: comp.position.maxW || 12,
      maxH: comp.position.maxH || 20,
      static: comp.position.static || false,
    }));
    setLayouts(newLayouts);
  };

  // Removed fetchAllComponentData - now using data provided directly with components
  // This eliminates multiple API calls and improves performance

  const handleLayoutChange = async (newLayout: Layout[]) => {
    if (!editMode || isSaving) return;
    
    setLayouts(newLayout);
    
    // Debounce saving to avoid too many API calls
    setIsSaving(true);
    setTimeout(async () => {
      try {
        // Update each component's position
        for (const layout of newLayout) {
          const component = components.find(c => c.componentId === layout.i);
          if (component) {
            await api.patch(`/api/v1/components/${component.componentId}`, {
              position: {
                x: layout.x,
                y: layout.y,
                w: layout.w,
                h: layout.h,
                minW: layout.minW,
                minH: layout.minH,
                maxW: layout.maxW,
                maxH: layout.maxH,
                static: layout.static,
              }
            });
          }
        }
        onUpdate();
      } catch (error) {
        console.error('Failed to save layout:', error);
      } finally {
        setIsSaving(false);
      }
    }, 1000);
  };

  const renderComponent = (component: Component) => {
    const data = componentsWithData.get(component.componentId) || [];
    
    switch (component.type) {
      // Charts
      case 'metric-card':
        return <MetricCard data={data} config={component.config} name={component.name} />;
      case 'line-chart':
        return <LineChartRenderer data={data} config={component.config} name={component.name} />;
      case 'bar-chart':
        return <BarChartRenderer data={data} config={component.config} name={component.name} />;
      case 'pie-chart':
        return <PieChartRenderer data={data} config={component.config} name={component.name} />;
      case 'area-chart':
        return <AreaChartRenderer data={data} config={component.config} name={component.name} />;
      case 'scatter-plot':
        return <ScatterPlotRenderer data={data} config={component.config} name={component.name} />;
      case 'gauge':
        return <GaugeRenderer data={data} config={component.config} name={component.name} />;
      case 'heatmap':
        return <HeatmapRenderer data={data} config={component.config} name={component.name} />;
      case 'treemap':
        return <TreemapRenderer data={data} config={component.config} name={component.name} />;
      case 'funnel-chart':
        return <FunnelChartRenderer data={data} config={component.config} name={component.name} />;
      
      // Data Display
      case 'table':
        return <TableRenderer data={data} config={component.config} name={component.name} />;
      case 'progress-bar':
        return <ProgressBarRenderer data={data} config={component.config} name={component.name} />;
      
      // Content
      case 'text-block':
        return <TextBlockRenderer data={data} config={component.config} name={component.name} />;
      case 'image':
        return <ImageRenderer data={data} config={component.config} name={component.name} />;
      case 'iframe':
        return <IframeRenderer data={data} config={component.config} name={component.name} />;
      case 'custom-html':
        return <CustomHTMLRenderer data={data} config={component.config} name={component.name} />;
      
      // Layout
      case 'timeline':
        return <TimelineRenderer data={data} config={component.config} name={component.name} />;
      case 'calendar':
        return <CalendarRenderer data={data} config={component.config} name={component.name} />;
      case 'kanban':
        return <KanbanRenderer data={data} config={component.config} name={component.name} />;
      case 'map':
        return <MapRenderer data={data} config={component.config} name={component.name} />;
      
      default:
        return (
          <div className="h-full flex items-center justify-center text-gray-500 bg-white/5 rounded-xl border border-white/10">
            <div className="text-center p-8">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-sm text-white">{component.type}</div>
              <div className="text-xs mt-1 text-gray-400">Renderer not implemented</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full">
      <style jsx global>{`
        .react-grid-layout {
          position: relative;
        }
        .react-grid-item {
          transition: all 200ms ease;
        }
        .react-grid-item.react-grid-placeholder {
          background: rgba(6, 182, 212, 0.2);
          border: 2px dashed rgba(6, 182, 212, 0.5);
          border-radius: 0.75rem;
        }
      `}</style>
      
      <GridLayout
        className="layout"
        layout={layouts}
        cols={12}
        rowHeight={100}
        width={typeof window !== 'undefined' ? Math.min(window.innerWidth - 100, 1400) : 1200}
        isDraggable={editMode}
        isResizable={editMode}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
        compactType={null}
        preventCollision={false}
        margin={[16, 16]}
        containerPadding={[0, 0]}
      >
        {components.map((component) => (
          <div key={component.componentId} className="isolate">
            <ComponentWrapper
              component={component}
              editMode={editMode}
              onUpdate={onUpdate}
              onDataUpdate={onUpdate}
              onComponentClick={onComponentClick}
            >
              {renderComponent(component)}
            </ComponentWrapper>
          </div>
        ))}
      </GridLayout>
      
      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-cyan-500/20 backdrop-blur-xl border border-cyan-500/30 rounded-lg px-4 py-2 text-sm text-cyan-400 z-50">
          💾 Saving layout...
        </div>
      )}
    </div>
  );
}
