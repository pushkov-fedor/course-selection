// src/features/course-selection/ui/course-selection-page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import type { DisplayCourse } from "@/entities/course";
import { mergeCoursesWithOfferings } from "@/entities/course";
import {
  getCourses,
  getCourseOfferings,
  createEnrollmentRequest,
  getEnrollmentRequest,
} from "../api";
import { CourseGrid } from "./course-grid";
import { CourseDetailModal } from "./course-detail-modal";
import { ConfirmModal } from "./confirm-modal";
import { SwitchModal } from "./switch-modal";
import { SelectionSidebar } from "./selection-sidebar";
import { MobileSelectionBar } from "./mobile-selection-bar";
import { EnrolledCourses } from "./enrolled-courses";
import { CourseGridSkeleton, SidebarSkeleton } from "./loading-skeleton";
import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";
import { Spinner } from "@/shared/ui";
import { getErrorMessage } from "@/shared/lib";
import { toast } from "sonner";

// Test IDs from environment
const STUDENT_ID =
  process.env.NEXT_PUBLIC_TEST_STUDENT_ID ||
  "7a926ded-3337-4e3a-a318-96b61fb65fd9";
const COHORT_SEMESTER_ID =
  process.env.NEXT_PUBLIC_TEST_COHORT_SEMESTER_ID ||
  "7b84b712-083a-4d25-b32a-7014352f0188";

export function CourseSelectionPage() {
  // Data state
  const [courses, setCourses] = useState<DisplayCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Selection state
  const [selectedOfferingIds, setSelectedOfferingIds] = useState<string[]>([]);
  const [selectedCourseForModal, setSelectedCourseForModal] =
    useState<DisplayCourse | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Switch state
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [courseToSwitch, setCourseToSwitch] = useState<DisplayCourse | null>(
    null
  );

  useEffect(() => {
    loadCourses();
    checkExistingRequest();
  }, []);

  async function loadCourses() {
    setLoading(true);
    setError("");

    try {
      const offerings = await getCourseOfferings({ limit: 100 });
      const courseIds = [...new Set(offerings.map((o) => o.course_id))];
      const coursesData = await getCourses({ limit: 100, is_active: true });
      const relevantCourses = coursesData.filter((c) => courseIds.includes(c.id));
      const displayCourses = mergeCoursesWithOfferings(relevantCourses, offerings);

      displayCourses.sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        if (a.term !== b.term) return a.term === "spring" ? -1 : 1;
        return a.title.localeCompare(b.title);
      });

      setCourses(displayCourses);
    } catch (err) {
      console.error("Failed to load courses:", err);
      setError(getErrorMessage(err, "Не удалось загрузить курсы"));
    } finally {
      setLoading(false);
    }
  }

  async function checkExistingRequest() {
    try {
      const existingRequest = await getEnrollmentRequest(
        STUDENT_ID,
        COHORT_SEMESTER_ID
      );

      if (!existingRequest) return;

      if (existingRequest.status !== "failed") {
        setIsSubmitted(true);

        if (existingRequest.courses && existingRequest.courses.length > 0) {
          const offeringIds = existingRequest.courses.map(
            (c) => c.CourseOfferingID
          );
          setSelectedOfferingIds(offeringIds);
        }
      }
    } catch (err) {
      console.error("Error checking enrollment request:", err);
    }
  }

  function handleToggleSelection(offeringId: string) {
    if (isSubmitted) return;

    setSelectedOfferingIds((prev) =>
      prev.includes(offeringId)
        ? prev.filter((id) => id !== offeringId)
        : [...prev, offeringId]
    );
  }

  async function handleConfirm() {
    const payload = {
      student_id: STUDENT_ID,
      cohort_semester_id: COHORT_SEMESTER_ID,
      courses: selectedOfferingIds.map((id) => ({
        course_offering_id: id,
        type: "main" as const,
      })),
      type: "new" as const,
    };

    try {
      await createEnrollmentRequest(payload);
      setIsSubmitted(true);
      toast.success("Запись на курсы успешно отправлена!");
    } catch (err) {
      console.error("Failed to submit enrollment:", err);
      toast.error(getErrorMessage(err, "Не удалось записаться на курсы"));
    }
  }

  async function handleSwitchCourse(
    oldOfferingId: string,
    newOfferingId: string
  ) {
    const payload = {
      student_id: STUDENT_ID,
      cohort_semester_id: COHORT_SEMESTER_ID,
      courses: [],
      type: "switch" as const,
      switch: [
        {
          from_course_offering_id: oldOfferingId,
          to_course_offering_id: newOfferingId,
        },
      ],
    };

    try {
      await createEnrollmentRequest(payload);
      await checkExistingRequest();
      toast.success("Курс успешно заменён!");
    } catch (err) {
      console.error("Failed to switch course:", err);
      toast.error(getErrorMessage(err, "Не удалось заменить курс"));
    }
  }

  // Computed
  const selectedCourses = useMemo(() => {
    return courses.filter((c) => selectedOfferingIds.includes(c.offeringId));
  }, [courses, selectedOfferingIds]);

  // If submitted but no courses found (stale enrollment request after DB reset),
  // reset the submitted state so user can re-enroll
  useEffect(() => {
    if (
      isSubmitted &&
      !loading &&
      courses.length > 0 &&
      selectedOfferingIds.length > 0 &&
      selectedCourses.length === 0
    ) {
      // Enrollment request references offerings that no longer exist
      console.warn("Enrollment request references stale offering IDs, resetting state");
      setIsSubmitted(false);
      setSelectedOfferingIds([]);
      toast.error("Ваша предыдущая запись устарела. Пожалуйста, выберите курсы заново.");
    }
  }, [isSubmitted, loading, courses, selectedOfferingIds, selectedCourses]);

  const modalIsSelected = selectedCourseForModal
    ? selectedOfferingIds.includes(selectedCourseForModal.offeringId)
    : false;

  const showSelectionUI = !isSubmitted && !loading && courses.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold">Запись на курсы</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Выберите курсы для записи
              </p>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner size="sm" />
                <span className="hidden sm:inline">Загрузка...</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-6">
        {error && <ErrorState message={error} onRetry={loadCourses} />}

        <div className="flex gap-6">
          {/* Main content */}
          <div className="flex-1 min-w-0 pb-24 lg:pb-0">
            {loading ? (
              <CourseGridSkeleton />
            ) : courses.length === 0 ? (
              <EmptyState />
            ) : isSubmitted ? (
              <EnrolledCourses
                courses={selectedCourses}
                onOpenDetails={setSelectedCourseForModal}
                onSwitchCourse={(course) => {
                  setCourseToSwitch(course);
                  setIsSwitchModalOpen(true);
                }}
              />
            ) : (
              <CourseGrid
                courses={courses}
                selectedOfferingIds={selectedOfferingIds}
                onToggleSelection={handleToggleSelection}
                onOpenCourse={setSelectedCourseForModal}
              />
            )}
          </div>

          {/* Desktop Sidebar */}
          {showSelectionUI && (
            <div className="hidden lg:block">
              <SelectionSidebar
                selectedCourses={selectedCourses}
                onRemove={handleToggleSelection}
                onOpenCourse={setSelectedCourseForModal}
                onConfirm={() => setIsConfirmModalOpen(true)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Selection Bar */}
      {showSelectionUI && (
        <MobileSelectionBar
          selectedCourses={selectedCourses}
          onRemove={handleToggleSelection}
          onOpenCourse={setSelectedCourseForModal}
          onConfirm={() => setIsConfirmModalOpen(true)}
        />
      )}

      {/* Modals */}
      <CourseDetailModal
        course={selectedCourseForModal}
        isSelected={modalIsSelected}
        isSubmitted={isSubmitted}
        onClose={() => setSelectedCourseForModal(null)}
        onToggleSelect={() => {
          if (selectedCourseForModal) {
            handleToggleSelection(selectedCourseForModal.offeringId);
          }
        }}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        selectedCourses={selectedCourses}
        onConfirm={handleConfirm}
      />

      <SwitchModal
        isOpen={isSwitchModalOpen}
        onClose={() => {
          setIsSwitchModalOpen(false);
          setCourseToSwitch(null);
        }}
        courseToReplace={courseToSwitch}
        availableCourses={courses}
        enrolledOfferingIds={selectedOfferingIds}
        onSubmit={handleSwitchCourse}
      />
    </div>
  );
}
