// src/features/cohort-management/ui/cohort-list-page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Users, Calendar, ChevronRight, Loader2, Copy, Check, AlertTriangle } from "lucide-react";
import { Button, Badge, Card, Spinner, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shared/ui";
import { toast } from "sonner";
import { cn } from "@/shared/lib";
import { ApiError } from "@/shared/api/client";
import {
  getCohorts,
  getCohortSemesters,
  deleteCohort,
  deleteCohortSemester,
  type Cohort,
  type CohortSemester,
} from "../api";
import { CohortForm } from "./cohort-form";
import { SemesterForm } from "./semester-form";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getTermLabel(term: string): string {
  return term === "spring" ? "Весна" : "Осень";
}

function getSemesterStatus(semester: CohortSemester): {
  label: string;
  variant: "success" | "secondary" | "destructive";
} {
  const now = new Date();
  const open = new Date(semester.enrollment_open);
  const close = new Date(semester.enrollment_close);

  if (now < open) {
    return { label: "Скоро", variant: "secondary" };
  }
  if (now > close) {
    return { label: "Запись закрыта", variant: "destructive" };
  }
  return { label: "Запись открыта", variant: "success" };
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
      title="Копировать ID"
    >
      {copied ? (
        <Check className="size-3.5 text-success" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  );
}

export function CohortListPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [semesters, setSemesters] = useState<CohortSemester[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCohortId, setExpandedCohortId] = useState<string | null>(null);

  // Modal state
  const [showCohortForm, setShowCohortForm] = useState(false);
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(null);
  const [showSemesterForm, setShowSemesterForm] = useState(false);
  const [editingSemester, setEditingSemester] = useState<CohortSemester | null>(null);
  const [semesterCohortId, setSemesterCohortId] = useState<string>("");
  
  // Delete confirmation dialog state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "cohort" | "semester";
    id: string;
    name?: string;
  } | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [cohortsData, semestersData] = await Promise.all([
        getCohorts({ limit: 100 }),
        getCohortSemesters({ limit: 200 }),
      ]);
      setCohorts(cohortsData);
      setSemesters(semestersData);

      // Auto-expand first cohort
      if (cohortsData.length > 0 && !expandedCohortId) {
        setExpandedCohortId(cohortsData[0].id);
      }
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  }, [expandedCohortId]);

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteCohort = (id: string, name: string) => {
    setDeleteConfirm({ type: "cohort", id, name });
  };

  const handleDeleteSemester = (id: string) => {
    setDeleteConfirm({ type: "semester", id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    const { type, id, name } = deleteConfirm;
    setDeleteConfirm(null); // Close confirmation modal immediately
    
    try {
      if (type === "cohort") {
        await deleteCohort(id);
        setCohorts((prev) => prev.filter((c) => c.id !== id));
        setSemesters((prev) => prev.filter((s) => s.cohort_id !== id));
        toast.success(`Поток "${name}" успешно удалён`);
      } else {
        await deleteCohortSemester(id);
        setSemesters((prev) => prev.filter((s) => s.id !== id));
        toast.success("Семестр успешно удалён");
      }
    } catch (err) {
      console.error(`Failed to delete ${type}:`, err);
      let errorMessage = `Не удалось удалить ${type === "cohort" ? "поток" : "семестр"}`;
      
      if (err instanceof ApiError) {
        if (err.message && err.message !== `Request failed with status ${err.status}`) {
          errorMessage = err.message;
        } else if (err.status === 500) {
          errorMessage = "Ошибка сервера. Возможно, поток связан с другими данными.";
        } else if (err.status === 404) {
          errorMessage = `${type === "cohort" ? "Поток" : "Семестр"} не найден.`;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    }
  };

  const getSemestersForCohort = (cohortId: string) => {
    return semesters
      .filter((s) => s.cohort_id === cohortId)
      .sort((a, b) => b.number - a.number);
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" />
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Потоки и семестры</h1>
          <p className="text-muted-foreground">
            {cohorts.length} потоков, {semesters.length} семестров
          </p>
        </div>
        <Button onClick={() => setShowCohortForm(true)} className="gap-2">
          <Plus className="size-4" />
          Создать поток
        </Button>
      </div>

      {/* Content */}
      {cohorts.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="size-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">Нет потоков</h3>
          <p className="text-muted-foreground mb-4">
            Создайте первый поток студентов
          </p>
          <Button onClick={() => setShowCohortForm(true)}>
            <Plus className="size-4 mr-2" />
            Создать поток
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {cohorts.map((cohort) => {
            const isExpanded = expandedCohortId === cohort.id;
            const cohortSemesters = getSemestersForCohort(cohort.id);

            return (
              <Card key={cohort.id} className="overflow-hidden">
                {/* Cohort Header */}
                <div
                  className={cn(
                    "p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors",
                    isExpanded && "border-b"
                  )}
                  onClick={() => setExpandedCohortId(isExpanded ? null : cohort.id)}
                >
                  <ChevronRight
                    className={cn(
                      "size-5 text-muted-foreground transition-transform",
                      isExpanded && "rotate-90"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <Users className="size-5 text-primary" />
                      <h3 className="font-semibold">{cohort.name}</h3>
                      <Badge variant="outline">
                        {cohort.admission_year}–{cohort.graduation_year}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{cohortSemesters.length} семестров</span>
                      <span className="flex items-center gap-1">
                        ID: <code className="text-xs">{cohort.id.slice(0, 8)}...</code>
                        <CopyButton text={cohort.id} />
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCohort(cohort);
                        setShowCohortForm(true);
                      }}
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCohort(cohort.id, cohort.name);
                      }}
                    >
                      Удалить
                    </Button>
                  </div>
                </div>

                {/* Semesters */}
                {isExpanded && (
                  <div className="p-4 bg-muted/20">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Семестры потока
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSemesterCohortId(cohort.id);
                          setEditingSemester(null);
                          setShowSemesterForm(true);
                        }}
                      >
                        <Plus className="size-4 mr-1" />
                        Добавить семестр
                      </Button>
                    </div>

                    {cohortSemesters.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <Calendar className="size-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Нет семестров</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {cohortSemesters.map((semester) => {
                          const status = getSemesterStatus(semester);
                          return (
                            <div
                              key={semester.id}
                              className="p-3 rounded-lg bg-background border flex items-center gap-4"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {semester.number}-й семестр
                                  </span>
                                  <Badge variant="outline">
                                    {getTermLabel(semester.term)}
                                  </Badge>
                                  <Badge variant={status.variant}>
                                    {status.label}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                  <span>
                                    Запись: {formatDate(semester.enrollment_open)} —{" "}
                                    {formatDate(semester.enrollment_close)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    ID: <code className="text-xs">{semester.id.slice(0, 8)}...</code>
                                    <CopyButton text={semester.id} />
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSemesterCohortId(cohort.id);
                                    setEditingSemester(semester);
                                    setShowSemesterForm(true);
                                  }}
                                >
                                  Редактировать
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteSemester(semester.id)}
                                >
                                  Удалить
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Cohort Form Modal */}
      <CohortForm
        isOpen={showCohortForm}
        cohort={editingCohort}
        onClose={() => {
          setShowCohortForm(false);
          setEditingCohort(null);
        }}
        onSuccess={() => {
          setShowCohortForm(false);
          setEditingCohort(null);
          loadData();
        }}
      />

      {/* Semester Form Modal */}
      <SemesterForm
        isOpen={showSemesterForm}
        semester={editingSemester}
        cohortId={semesterCohortId}
        onClose={() => {
          setShowSemesterForm(false);
          setEditingSemester(null);
        }}
        onSuccess={() => {
          setShowSemesterForm(false);
          setEditingSemester(null);
          loadData();
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteConfirm !== null} 
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-full bg-destructive/10">
                <AlertTriangle className="size-5 text-destructive" />
              </div>
              <DialogTitle className="text-left">
                {deleteConfirm?.type === "cohort" ? "Удалить поток?" : "Удалить семестр?"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-left pt-2">
              {deleteConfirm?.type === "cohort" ? (
                <>
                  Вы уверены, что хотите удалить поток{" "}
                  <span className="font-semibold text-foreground">
                    {deleteConfirm.name}
                  </span>
                  ? Все семестры потока тоже будут удалены. Это действие нельзя отменить.
                </>
              ) : (
                <>
                  Вы уверены, что хотите удалить этот семестр? Это действие нельзя отменить.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              className="w-full sm:w-auto"
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="w-full sm:w-auto"
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </main>
  );
}

