'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KanbanRendererProps {
  data: any[];
  config: any;
  name: string;
}

export default function KanbanRenderer({ data, config, name }: KanbanRendererProps) {
  if (!data || data.length === 0) return null;

  const columns = config?.columns || ['To Do', 'In Progress', 'Done'];
  const tasks = data.map(d => d.data);

  const getTasksByColumn = (column: string) => {
    return tasks.filter(task => task.status === column);
  };

  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {columns.map((column: string, index: number) => {
            const columnTasks = getTasksByColumn(column);
            
            return (
              <div key={column} className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white">{column}</h3>
                  <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                
                <div className="space-y-2 min-h-[200px]">
                  {columnTasks.map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      className="p-3 rounded-lg bg-white/10 border border-white/10 hover:border-cyan-500/50 cursor-pointer"
                    >
                      <div className="font-medium text-white text-sm mb-1">
                        {task.task || task.title}
                      </div>
                      {task.description && (
                        <div className="text-xs text-gray-400 line-clamp-2">
                          {task.description}
                        </div>
                      )}
                      {task.assignee && (
                        <div className="text-xs text-cyan-400 mt-2">
                          {task.assignee}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
