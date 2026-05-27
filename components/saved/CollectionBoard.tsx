"use client";

import React, { useState, useEffect, useTransition } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { TrackerCard } from "./TrackerCard";
import { updateCollectionStatus } from "@/app/actions/collections";

interface CollectionBoardProps {
  initialItems: any[];
  activeFilter: string;
}

interface ColumnsState {
  [key: string]: {
    id: string;
    title: string;
    items: any[];
  };
}

export function CollectionBoard({ initialItems, activeFilter }: CollectionBoardProps) {
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  // Local state for columns
  const [columns, setColumns] = useState<ColumnsState>({
    incoming: {
      id: "incoming",
      title: "Saved",
      items: [],
    },
    safety: {
      id: "safety",
      title: "Safety",
      items: [],
    },
    target: {
      id: "target",
      title: "Target",
      items: [],
    },
    reach: {
      id: "reach",
      title: "Dream",
      items: [],
    },
  });

  // Sync when initialItems change, grouping by collectionStatus
  useEffect(() => {
    setColumns(prev => {
      const newColumns = {
        incoming: { ...prev.incoming, items: [] as any[] },
        safety: { ...prev.safety, items: [] as any[] },
        target: { ...prev.target, items: [] as any[] },
        reach: { ...prev.reach, items: [] as any[] },
      };

      initialItems.forEach(item => {
        const status = item.collectionStatus || "incoming";
        if (newColumns[status as keyof ColumnsState]) {
          newColumns[status as keyof ColumnsState].items.push(item);
        } else {
          newColumns.incoming.items.push(item);
        }
      });

      return newColumns;
    });
  }, [initialItems]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceCol = columns[source.droppableId];
      const destCol = columns[destination.droppableId];
      const sourceItems = [...sourceCol.items];
      const destItems = [...destCol.items];
      const [removed] = sourceItems.splice(source.index, 1);
      
      // Update item with new status locally
      removed.collectionStatus = destination.droppableId;
      destItems.splice(destination.index, 0, removed);
      
      // Optimistic update
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceCol,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destCol,
          items: destItems
        }
      });

      // Background persistence
      startTransition(() => {
        updateCollectionStatus(draggableId, destination.droppableId);
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
  };

  const getFilteredItems = (items: any[]) => {
    if (activeFilter === "all") return items;
    if (activeFilter === "urgent") return items.filter(item => {
      if (!item.scholarship.deadline) return false;
      const days = Math.ceil((new Date(item.scholarship.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return days >= 0 && days <= 14;
    });
    if (activeFilter === "fully_funded") return items.filter(item => 
      item.scholarship.eligibilityParsed?.fundingType?.toLowerCase() === "full" || !item.scholarship.amount
    );
    if (activeFilter === "updated") return items.filter(item => item.changeAlerted);
    return items;
  };

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory min-h-[70vh]">
        {Object.entries(columns).map(([columnId, column]) => {
          const filteredItems = getFilteredItems(column.items);
          
          return (
            <div key={columnId} className="w-[320px] shrink-0 snap-start flex flex-col">
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="font-editorial text-[20px] text-ink">{column.title}</h2>
                <span className="font-ui text-[12px] text-ink-secondary bg-surface border border-border px-2 py-0.5 rounded-full">
                  {filteredItems.length}
                </span>
              </div>
              
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 rounded-2xl transition-colors duration-200 p-2 -mx-2 flex flex-col gap-4 ${
                      snapshot.isDraggingOver ? "bg-surface-hover/50" : ""
                    }`}
                  >
                    {filteredItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <TrackerCard
                            item={item}
                            provided={provided}
                            isDragging={snapshot.isDragging}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
