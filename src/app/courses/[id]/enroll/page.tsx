// src/app/courses/[id]/enroll/page.tsx
"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getCourseById, mockStudent } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface EnrollPageProps {
  params: Promise<{ id: string }>;
}

type Step = 1 | 2 | 3 | 4;

const steps = [
  { id: 1, title: "Проверка данных", description: "Личная информация" },
  { id: 2, title: "Мотивация", description: "Почему этот курс" },
  { id: 3, title: "Документы", description: "Загрузка файлов" },
  { id: 4, title: "Подтверждение", description: "Отправка заявки" },
];

export default function EnrollPage({ params }: EnrollPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const course = getCourseById(id);

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form state
  const [motivation, setMotivation] = useState("");
  const [priority, setPriority] = useState<number>(1);
  const [files, setFiles] = useState<File[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  if (!course) {
    return (
      <div className="min-h-screen bg-grid-pattern">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Курс не найден</h1>
          <Link href="/courses" className="text-primary hover:underline mt-4 inline-block">
            Вернуться к каталогу
          </Link>
        </main>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true; // Данные студента предзаполнены
      case 2:
        return motivation.trim().length >= 50;
      case 3:
        return true; // Файлы опциональны
      case 4:
        return agreedToTerms;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Симуляция отправки
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // TODO: отправить заявку на бэкенд
    console.log({
      courseId: course.id,
      studentId: mockStudent.id,
      motivation,
      priority,
      files: files.map((f) => f.name),
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-grid-pattern">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
              <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Заявка отправлена!</h1>
            <p className="text-muted-foreground mb-6">
              Ваша заявка на курс «{course.title}» успешно отправлена. 
              Вы получите уведомление о результате рассмотрения на почту.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/courses">
                <Button variant="outline">К каталогу</Button>
              </Link>
              <Link href="/my-enrollments">
                <Button>Мои заявки</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grid-pattern">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <Link
          href={`/courses/${course.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад к курсу
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Запись на курс</h1>
          <p className="mt-2 text-muted-foreground">{course.title}</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                      currentStep > step.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : currentStep === step.id
                        ? "border-primary text-primary"
                        : "border-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center hidden sm:block">
                    <div className={cn(
                      "text-sm font-medium",
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-full mx-2 sm:mx-4 transition-colors",
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Personal Data */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Проверьте ваши данные. Если информация неверна, обратитесь в деканат.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">ФИО</label>
                    <div className="rounded-lg border border-input bg-muted/30 px-3 py-2">
                      {mockStudent.lastName} {mockStudent.firstName} {mockStudent.middleName}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Студенческий ID</label>
                    <div className="rounded-lg border border-input bg-muted/30 px-3 py-2">
                      {mockStudent.studentId}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <div className="rounded-lg border border-input bg-muted/30 px-3 py-2">
                      {mockStudent.email}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Группа</label>
                    <div className="rounded-lg border border-input bg-muted/30 px-3 py-2">
                      {mockStudent.group}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Факультет</label>
                    <div className="rounded-lg border border-input bg-muted/30 px-3 py-2">
                      {mockStudent.department}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Курс</label>
                    <div className="rounded-lg border border-input bg-muted/30 px-3 py-2">
                      {mockStudent.year} курс
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Motivation */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Мотивационное письмо *</label>
                  <p className="text-sm text-muted-foreground">
                    Расскажите, почему вы хотите записаться на этот курс (минимум 50 символов)
                  </p>
                  <textarea
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="Меня интересует этот курс, потому что..."
                    rows={6}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {motivation.length} / 50 символов минимум
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Приоритет курса</label>
                  <p className="text-sm text-muted-foreground">
                    Если вы записываетесь на несколько курсов, укажите приоритет этого курса
                  </p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={cn(
                          "h-10 w-10 rounded-lg border transition-colors",
                          priority === p
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input hover:border-primary/50"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    1 — наивысший приоритет
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Documents */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Документы (опционально)</label>
                  <p className="text-sm text-muted-foreground">
                    Вы можете приложить документы, подтверждающие вашу квалификацию 
                    (сертификаты, портфолио и т.д.)
                  </p>
                </div>

                <div
                  className="border-2 border-dashed border-input rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <svg
                    className="mx-auto h-12 w-12 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Нажмите для загрузки или перетащите файлы
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, DOC, DOCX, JPG, PNG до 10MB
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Загруженные файлы</label>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border border-input px-4 py-2"
                        >
                          <div className="flex items-center gap-3">
                            <svg
                              className="h-5 w-5 text-muted-foreground"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                              />
                            </svg>
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="rounded-lg bg-muted/50 p-4 space-y-4">
                  <h3 className="font-medium">Сводка заявки</h3>

                  <div className="grid gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Курс</span>
                      <span className="font-medium">{course.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Студент</span>
                      <span>{mockStudent.lastName} {mockStudent.firstName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Приоритет</span>
                      <span>{priority}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Документов</span>
                      <span>{files.length}</span>
                    </div>
                  </div>

                  {motivation && (
                    <div className="pt-2 border-t border-border">
                      <span className="text-sm text-muted-foreground">Мотивация:</span>
                      <p className="text-sm mt-1 line-clamp-3">{motivation}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-input"
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    Я подтверждаю, что указанная информация верна, и соглашаюсь с{" "}
                    <a href="#" className="text-primary hover:underline">
                      правилами записи на курсы
                    </a>
                  </label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад
          </Button>

          {currentStep < 4 ? (
            <Button onClick={nextStep} disabled={!canProceed()}>
              Далее
              <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Отправка...
                </>
              ) : (
                <>
                  Отправить заявку
                  <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

