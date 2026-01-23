// src/features/cohort-management/ui/cohort-form.tsx
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
import { createCohort, updateCohort, type Cohort } from "../api";

interface CohortFormProps {
  isOpen: boolean;
  cohort: Cohort | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function CohortForm({ isOpen, cohort, onClose, onSuccess }: CohortFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    name: "",
    admission_year: currentYear.toString(),
    graduation_year: (currentYear + 2).toString(),
  });

  useEffect(() => {
    if (cohort) {
      setFormData({
        name: cohort.name,
        admission_year: cohort.admission_year.toString(),
        graduation_year: cohort.graduation_year.toString(),
      });
    } else {
      setFormData({
        name: "",
        admission_year: currentYear.toString(),
        graduation_year: (currentYear + 2).toString(),
      });
    }
    setError(null);
  }, [cohort, isOpen, currentYear]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        name: formData.name,
        admission_year: parseInt(formData.admission_year, 10),
        graduation_year: parseInt(formData.graduation_year, 10),
      };

      if (cohort) {
        await updateCohort(cohort.id, data);
      } else {
        await createCohort(data);
      }

      onSuccess();
    } catch (err) {
      console.error("Failed to save cohort:", err);
      setError("Не удалось сохранить поток");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {cohort ? "Редактировать поток" : "Создать поток"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Название *</label>
            <Input
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Например: Бакалавриат 2025"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Год поступления *</label>
              <Input
                type="number"
                value={formData.admission_year}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, admission_year: e.target.value })
                }
                min={2020}
                max={2050}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Год выпуска *</label>
              <Input
                type="number"
                value={formData.graduation_year}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, graduation_year: e.target.value })
                }
                min={2020}
                max={2050}
                required
              />
            </div>
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
              {cohort ? "Сохранить" : "Создать"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

