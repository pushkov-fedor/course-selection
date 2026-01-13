// src/app/page.tsx
"use client";

import { useState, useMemo } from "react";
import { SemesterCalendar } from "@/components/SemesterCalendar";
import { CourseTiles } from "@/components/CourseTiles";
import { CourseModal } from "@/components/CourseModal";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { Button } from "@/components/ui/button";
import { mockCourses, courseBlocks, getBlockById } from "@/lib/mock-data";
import { Selection, ViewMode, BLOCK_COLORS, Course } from "@/types";
import { cn } from "@/lib/utils";

export default function CoursesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");
  const [selections, setSelections] = useState<Selection[]>(
    courseBlocks.map(block => ({ blockId: block.id, courseId: null }))
  );
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<Course | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectCourse = (blockId: string, courseId: string | null) => {
    setSelections(prev => 
      prev.map(s => s.blockId === blockId ? { ...s, courseId } : s)
    );
  };

  const handleOpenCourseModal = (course: Course) => {
    setSelectedCourseForModal(course);
  };

  const handleCloseCourseModal = () => {
    setSelectedCourseForModal(null);
  };

  const handleConfirm = () => {
    setIsSubmitted(true);
    // TODO: отправить на бэкенд
    console.log("Отправлено:", selections.filter(s => s.courseId).map(s => s.courseId));
  };

  const selectedCourses = useMemo(() => {
    return selections
      .filter(s => s.courseId !== null)
      .map(s => mockCourses.find(c => c.id === s.courseId))
      .filter((c): c is Course => c !== undefined);
  }, [selections]);

  const totalCredits = useMemo(() => {
    return selectedCourses.reduce((sum, course) => sum + course.credits, 0);
  }, [selectedCourses]);

  const requiredBlocksSelected = useMemo(() => {
    return courseBlocks
      .filter(b => b.required)
      .every(b => selections.find(s => s.blockId === b.id)?.courseId !== null);
  }, [selections]);

  // For course modal
  const modalBlock = selectedCourseForModal ? getBlockById(selectedCourseForModal.blockId) : null;
  const modalIsSelected = selectedCourseForModal 
    ? selections.find(s => s.blockId === selectedCourseForModal.blockId)?.courseId === selectedCourseForModal.id
    : false;
  const modalIsDisabled = selectedCourseForModal
    ? selections.find(s => s.blockId === selectedCourseForModal.blockId)?.courseId !== null && !modalIsSelected
    : false;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Запись на курсы
              </h1>
              <p className="text-sm text-muted-foreground">
                Весенний семестр 2026
              </p>
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-border p-1 bg-muted/30">
                <button
                  onClick={() => setViewMode("tiles")}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    viewMode === "tiles"
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Плитки
                </button>
                <button
                  onClick={() => setViewMode("timeline")}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    viewMode === "timeline"
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Семестр
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {viewMode === "tiles" ? (
              <CourseTiles
                courses={mockCourses}
                blocks={courseBlocks}
                selections={selections}
                onSelectCourse={handleSelectCourse}
                onOpenCourse={handleOpenCourseModal}
              />
            ) : (
              <SemesterCalendar
                courses={mockCourses}
                blocks={courseBlocks}
                selections={selections}
                onSelectCourse={handleSelectCourse}
                onOpenCourse={handleOpenCourseModal}
              />
            )}
          </div>

          {/* Selection sidebar */}
          <aside className="w-80 shrink-0">
            <div className="sticky top-24 bg-white rounded-lg border border-border p-4 space-y-4">
              <div>
                <h2 className="font-semibold text-lg">Выбранные курсы</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedCourses.length} из {courseBlocks.length} блоков
                </p>
              </div>

              {/* Selected courses list */}
              <div className="space-y-2">
                {courseBlocks.map(block => {
                  const selection = selections.find(s => s.blockId === block.id);
                  const course = selection?.courseId 
                    ? mockCourses.find(c => c.id === selection.courseId)
                    : null;
                  const colors = BLOCK_COLORS[block.color];

                  return (
                    <div 
                      key={block.id}
                      className={cn(
                        "p-3 rounded-lg border transition-colors",
                        course ? colors.light : "border-dashed",
                        course && colors.border
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={cn(
                          "w-2.5 h-2.5 rounded-full",
                          course ? colors.bg : "bg-muted"
                        )} />
                        <span className="text-xs font-medium text-muted-foreground">
                          {block.name}
                        </span>
                        {block.required && !course && (
                          <span className="text-xs text-amber-600">*</span>
                        )}
                      </div>
                      {course ? (
                        <div className="flex items-start justify-between gap-2">
                          <button
                            onClick={() => handleOpenCourseModal(course)}
                            className="text-left hover:underline"
                          >
                            <div className={cn("font-medium text-sm", colors.text)}>
                              {course.shortTitle || course.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {course.credits} кр. • {course.schedule.slots.map(s => 
                                `${["Вс","Пн","Вт","Ср","Чт","Пт","Сб"][s.dayOfWeek]} ${s.startTime}`
                              ).join(", ")}
                            </div>
                          </button>
                          <button
                            onClick={() => handleSelectCourse(block.id, null)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Не выбран
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="pt-4 border-t border-border space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Всего кредитов:</span>
                  <span className="font-semibold">{totalCredits}</span>
                </div>

                {!requiredBlocksSelected && (
                  <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg text-xs text-amber-700">
                    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Выберите курсы из всех обязательных блоков</span>
                  </div>
                )}

                {isSubmitted ? (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg text-emerald-700">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">Заявка отправлена</span>
                  </div>
                ) : (
                  <Button 
                    className="w-full"
                    disabled={!requiredBlocksSelected || selectedCourses.length === 0}
                    onClick={() => setIsConfirmModalOpen(true)}
                  >
                    Подтвердить выбор
                  </Button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Course Modal */}
      <CourseModal
        course={selectedCourseForModal}
        block={modalBlock ?? null}
        isSelected={modalIsSelected}
        isDisabled={modalIsDisabled}
        onClose={handleCloseCourseModal}
        onSelect={() => {
          if (selectedCourseForModal) {
            handleSelectCourse(
              selectedCourseForModal.blockId, 
              modalIsSelected ? null : selectedCourseForModal.id
            );
          }
        }}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        selectedCourses={selectedCourses}
        blocks={courseBlocks}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
