// src/features/course-management/ui/offering-edit-page.tsx
"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getCourseOffering } from "@/features/course-management/api/courses";
import { OfferingForm } from "./offering-form";
import type { CourseOffering } from "@/entities/course";

interface OfferingEditPageProps {
  offeringId: string;
}

export function OfferingEditPage({ offeringId }: OfferingEditPageProps) {
  const [offering, setOffering] = useState<CourseOffering | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOffering() {
      try {
        const data = await getCourseOffering(offeringId);
        setOffering(data);
      } catch (err) {
        console.error("Failed to load offering:", err);
        setError("Не удалось загрузить набор");
      } finally {
        setLoading(false);
      }
    }
    loadOffering();
  }, [offeringId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !offering) {
    return (
      <div className="text-center py-24">
        <p className="text-destructive">{error || "Набор не найден"}</p>
      </div>
    );
  }

  return <OfferingForm offering={offering} isEdit />;
}

