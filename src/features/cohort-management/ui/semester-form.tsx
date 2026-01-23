// src/features/cohort-management/ui/semester-form.tsx
"use client";

import { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
} from "@/shared/ui";
import { createCohortSemester, updateCohortSemester, type CohortSemester } from "../api";
import { getErrorMessage } from "@/shared/lib";

interface SemesterFormProps {
  isOpen: boolean;
  semester: CohortSemester | null;
  cohortId: string;
  onClose: () => void;
  onSuccess: () => void;
}

function toLocalDatetimeString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function SemesterForm({
  isOpen,
  semester,
  cohortId,
  onClose,
  onSuccess,
}: SemesterFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    number: "1",
    term: "fall" as "spring" | "fall",
    enrollment_open: toLocalDatetimeString(new Date()),
    enrollment_close: toLocalDatetimeString(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    ),
  });

  useEffect(() => {
    if (semester) {
      setFormData({
        number: semester.number.toString(),
        term: semester.term,
        enrollment_open: toLocalDatetimeString(new Date(semester.enrollment_open)),
        enrollment_close: toLocalDatetimeString(new Date(semester.enrollment_close)),
      });
    } else {
      setFormData({
        number: "1",
        term: "fall",
        enrollment_open: toLocalDatetimeString(new Date()),
        enrollment_close: toLocalDatetimeString(
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        ),
      });
    }
    setError(null);
  }, [semester, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (semester) {
        await updateCohortSemester(semester.id, {
          number: parseInt(formData.number, 10),
          term: formData.term,
          enrollment_open: new Date(formData.enrollment_open).toISOString(),
          enrollment_close: new Date(formData.enrollment_close).toISOString(),
        });
      } else {
        await createCohortSemester({
          cohort_id: cohortId,
          number: parseInt(formData.number, 10),
          term: formData.term,
          enrollment_open: new Date(formData.enrollment_open).toISOString(),
          enrollment_close: new Date(formData.enrollment_close).toISOString(),
        });
      }

      onSuccess();
    } catch (err) {
      console.error("Failed to save semester:", err);
      setError(getErrorMessage(err, "Не удалось сохранить семестр"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>
            {semester ? "Редактировать семестр" : "Добавить семестр"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Номер семестра *</label>
              <Input
                type="number"
                value={formData.number}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, number: e.target.value })
                }
                min={1}
                max={12}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Сезон *</label>
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
                <option value="fall">Осень</option>
                <option value="spring">Весна</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Начало записи *</label>
            <Input
              type="datetime-local"
              value={formData.enrollment_open}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, enrollment_close: e.target.value })
              }
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <Save className="size-4 mr-2" />
              )}
              {semester ? "Сохранить" : "Добавить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

