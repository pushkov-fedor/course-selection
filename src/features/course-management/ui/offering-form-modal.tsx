// src/features/course-management/ui/offering-form-modal.tsx
"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui";
import {
  createCourseOffering,
  updateCourseOffering,
  type CreateCourseOfferingDTO,
  type UpdateCourseOfferingDTO,
} from "../api/courses";
import type { CourseOffering } from "@/entities/course";
import { getErrorMessage } from "@/shared/lib";

interface OfferingFormModalProps {
  isOpen: boolean;
  offering: CourseOffering | null;
  courseId: string;
  onClose: () => void;
  onSuccess: () => void;
}

function toLocalDatetimeString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function OfferingFormModal({
  isOpen,
  offering,
  courseId,
  onClose,
  onSuccess,
}: OfferingFormModalProps) {
  const isEdit = !!offering;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    capacity: "30",
    year: new Date().getFullYear().toString(),
    term: "spring" as "spring" | "fall",
    enrollment_open: toLocalDatetimeString(new Date()),
    enrollment_close: toLocalDatetimeString(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    ),
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (offering) {
        setFormData({
          capacity: offering.capacity?.toString() || "30",
          year: offering.year?.toString() || new Date().getFullYear().toString(),
          term: offering.term || "spring",
          enrollment_open: offering.enrollment_open
            ? toLocalDatetimeString(new Date(offering.enrollment_open))
            : toLocalDatetimeString(new Date()),
          enrollment_close: offering.enrollment_close
            ? toLocalDatetimeString(new Date(offering.enrollment_close))
            : toLocalDatetimeString(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
        });
      } else {
        setFormData({
          capacity: "30",
          year: new Date().getFullYear().toString(),
          term: "spring",
          enrollment_open: toLocalDatetimeString(new Date()),
          enrollment_close: toLocalDatetimeString(
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          ),
        });
      }
      setError(null);
    }
  }, [isOpen, offering]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && offering) {
        const updateData: UpdateCourseOfferingDTO = {
          capacity: parseInt(formData.capacity, 10),
          year: parseInt(formData.year, 10),
          term: formData.term,
          enrollment_open: new Date(formData.enrollment_open).toISOString(),
          enrollment_close: new Date(formData.enrollment_close).toISOString(),
        };
        await updateCourseOffering(offering.id, updateData);
      } else {
        const createData: CreateCourseOfferingDTO = {
          course_id: courseId,
          capacity: parseInt(formData.capacity, 10),
          year: parseInt(formData.year, 10),
          term: formData.term,
          enrollment_open: new Date(formData.enrollment_open).toISOString(),
          enrollment_close: new Date(formData.enrollment_close).toISOString(),
        };
        await createCourseOffering(createData);
      }

      onSuccess();
    } catch (err) {
      console.error("Failed to save offering:", err);
      setError(getErrorMessage(err, "Не удалось сохранить запись"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Редактировать запись" : "Открыть запись на курс"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Year and Term */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Год *</label>
              <Input
                type="number"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                min={2020}
                max={2050}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Семестр *</label>
              <select
                value={formData.term}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    term: e.target.value as "spring" | "fall",
                  })
                }
                required
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
              >
                <option value="spring">Весна</option>
                <option value="fall">Осень</option>
              </select>
            </div>
          </div>

          {/* Capacity */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Количество мест *</label>
            <Input
              type="number"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
              min={1}
              max={1000}
              required
            />
          </div>

          {/* Enrollment Period */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Начало записи *</label>
              <Input
                type="datetime-local"
                value={formData.enrollment_open}
                onChange={(e) =>
                  setFormData({ ...formData, enrollment_open: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Конец записи *</label>
              <Input
                type="datetime-local"
                value={formData.enrollment_close}
                onChange={(e) =>
                  setFormData({ ...formData, enrollment_close: e.target.value })
                }
                required
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin mr-2" />}
              {isEdit ? "Сохранить" : "Создать"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

