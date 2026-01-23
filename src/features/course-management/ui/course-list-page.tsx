// src/features/course-management/ui/course-list-page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  BookOpen,
  Calendar,
  ChevronRight,
  Copy,
  Check,
  AlertTriangle,
  Search,
  Users,
} from "lucide-react";
import {
  Button,
  Badge,
  Card,
  Input,
  Spinner,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/ui";
import { toast } from "sonner";
import { cn, getErrorMessage } from "@/shared/lib";
import type { Course, CourseOffering } from "@/entities/course";
import {
  getCourses,
  getCourseOfferings,
  deleteCourse,
  deleteCourseOffering,
} from "../api";
import { OfferingFormModal } from "./offering-form-modal";

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

function getOfferingStatus(offering: CourseOffering): {
  label: string;
  variant: "success" | "secondary" | "destructive";
} {
  const now = new Date();
  const open = new Date(offering.enrollment_open);
  const close = new Date(offering.enrollment_close);

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

export function CourseListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [offerings, setOfferings] = useState<CourseOffering[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  // Modal state
  const [showOfferingForm, setShowOfferingForm] = useState(false);
  const [editingOffering, setEditingOffering] = useState<CourseOffering | null>(null);
  const [offeringCourseId, setOfferingCourseId] = useState<string>("");

  // Delete confirmation dialog state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "course" | "offering";
    id: string;
    name?: string;
  } | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [activeCourses, inactiveCourses, offeringsData] = await Promise.all([
        getCourses({ limit: 200, is_active: true }),
        getCourses({ limit: 200, is_active: false }),
        getCourseOfferings({ limit: 500 }),
      ]);

      const allCourses = [...activeCourses, ...inactiveCourses];
      allCourses.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      setCourses(allCourses);
      setOfferings(offeringsData);

      // Auto-expand first course
      if (allCourses.length > 0 && !expandedCourseId) {
        setExpandedCourseId(allCourses[0].id);
      }
    } catch (err) {
      console.error("Failed to load data:", err);
      toast.error(getErrorMessage(err, "Не удалось загрузить данные"));
    } finally {
      setLoading(false);
    }
  }, [expandedCourseId]);

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteCourse = (id: string, name: string) => {
    setDeleteConfirm({ type: "course", id, name });
  };

  const handleDeleteOffering = (id: string) => {
    setDeleteConfirm({ type: "offering", id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    const { type, id, name } = deleteConfirm;
    setDeleteConfirm(null);

    try {
      if (type === "course") {
        await deleteCourse(id);
        setCourses((prev) => prev.filter((c) => c.id !== id));
        setOfferings((prev) => prev.filter((o) => o.course_id !== id));
        toast.success(`Курс "${name}" успешно удалён`);
      } else {
        await deleteCourseOffering(id);
        setOfferings((prev) => prev.filter((o) => o.id !== id));
        toast.success("Запись на курс удалена");
      }
    } catch (err) {
      console.error(`Failed to delete ${type}:`, err);
      const fallback = `Не удалось удалить ${type === "course" ? "курс" : "запись"}`;
      toast.error(getErrorMessage(err, fallback));
    }
  };

  const getOfferingsForCourse = (courseId: string) => {
    return offerings
      .filter((o) => o.course_id === courseId)
      .sort((a, b) => {
        // Sort by year desc, then by term
        if (b.year !== a.year) return b.year - a.year;
        return a.term === "fall" ? -1 : 1;
      });
  };

  const filteredCourses = courses.filter((course) => {
    const searchLower = search.toLowerCase();
    return (
      (course.title || "").toLowerCase().includes(searchLower) ||
      (course.code || "").toLowerCase().includes(searchLower)
    );
  });

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
          <h1 className="text-2xl font-bold">Курсы</h1>
          <p className="text-muted-foreground">
            {courses.length} курсов, {offerings.length} открытых записей
          </p>
        </div>
        <Link href="/admin/courses/create">
          <Button className="gap-2">
            <Plus className="size-4" />
            Создать курс
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или коду..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      {filteredCourses.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="size-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">Нет курсов</h3>
          <p className="text-muted-foreground mb-4">
            {search ? "Курсы не найдены по запросу" : "Создайте первый курс"}
          </p>
          {!search && (
            <Link href="/admin/courses/create">
              <Button>
                <Plus className="size-4 mr-2" />
                Создать курс
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredCourses.map((course) => {
            const isExpanded = expandedCourseId === course.id;
            const courseOfferings = getOfferingsForCourse(course.id);

            return (
              <Card key={course.id} className="overflow-hidden">
                {/* Course Header */}
                <div
                  className={cn(
                    "p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors",
                    isExpanded && "border-b"
                  )}
                  onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                >
                  <ChevronRight
                    className={cn(
                      "size-5 text-muted-foreground transition-transform",
                      isExpanded && "rotate-90"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <BookOpen className="size-5 text-primary" />
                      <h3 className="font-semibold">{course.title || "Без названия"}</h3>
                      {course.code && (
                        <Badge variant="outline">{course.code}</Badge>
                      )}
                      <Badge variant={course.is_active ? "success" : "secondary"}>
                        {course.is_active ? "Опубликован" : "Скрыт"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{courseOfferings.length} открытий курса</span>
                      <span className="flex items-center gap-1">
                        ID: <code className="text-xs">{course.id.slice(0, 8)}...</code>
                        <CopyButton text={course.id} />
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/courses/${course.id}`} onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm">
                        Редактировать
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCourse(course.id, course.title || "курс");
                      }}
                    >
                      Удалить
                    </Button>
                  </div>
                </div>

                {/* Offerings */}
                {isExpanded && (
                  <div className="p-4 bg-muted/20">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Открытие курсов
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setOfferingCourseId(course.id);
                          setEditingOffering(null);
                          setShowOfferingForm(true);
                        }}
                      >
                        <Plus className="size-4 mr-1" />
                        Открыть запись
                      </Button>
                    </div>

                    {courseOfferings.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <Calendar className="size-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Нет открытых записей</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {courseOfferings.map((offering) => {
                          const status = getOfferingStatus(offering);
                          return (
                            <div
                              key={offering.id}
                              className="p-3 rounded-lg bg-background border flex items-center gap-4"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {getTermLabel(offering.term)} {offering.year}
                                  </span>
                                  <Badge variant={status.variant}>
                                    {status.label}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Users className="size-3.5" />
                                    {offering.enrolled || 0}/{offering.capacity} мест
                                  </span>
                                  <span>
                                    Запись: {formatDate(offering.enrollment_open)} —{" "}
                                    {formatDate(offering.enrollment_close)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    ID: <code className="text-xs">{offering.id.slice(0, 8)}...</code>
                                    <CopyButton text={offering.id} />
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setOfferingCourseId(course.id);
                                    setEditingOffering(offering);
                                    setShowOfferingForm(true);
                                  }}
                                >
                                  Редактировать
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteOffering(offering.id)}
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

      {/* Offering Form Modal */}
      <OfferingFormModal
        isOpen={showOfferingForm}
        offering={editingOffering}
        courseId={offeringCourseId}
        onClose={() => {
          setShowOfferingForm(false);
          setEditingOffering(null);
        }}
        onSuccess={() => {
          setShowOfferingForm(false);
          setEditingOffering(null);
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
                {deleteConfirm?.type === "course" ? "Удалить курс?" : "Удалить запись?"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-left pt-2">
              {deleteConfirm?.type === "course" ? (
                <>
                  Вы уверены, что хотите удалить курс{" "}
                  <span className="font-semibold text-foreground">
                    {deleteConfirm.name}
                  </span>
                  ? Все открытия курса тоже будут удалены. Это действие нельзя отменить.
                </>
              ) : (
                <>
                  Вы уверены, что хотите удалить эту запись на курс? Это действие нельзя отменить.
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
