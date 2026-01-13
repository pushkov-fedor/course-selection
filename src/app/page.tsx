// src/app/page.tsx
import Link from "next/link";
import { Header } from "@/components/Header";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { mockCourses } from "@/lib/mock-data";

export default function HomePage() {
  // Показываем 4 популярных курса на главной
  const featuredCourses = mockCourses.slice(0, 4);

  return (
    <div className="min-h-screen bg-grid-pattern">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-background" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
        
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Запись на весенний семестр 2026 открыта
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Выбирай курсы,{" "}
              <span className="text-gradient">развивайся</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
              Платформа для записи на элективные курсы университета. 
              Удобный выбор, прозрачные условия, быстрая запись.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/courses">
                <Button size="lg" className="gap-2">
                  Смотреть курсы
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link href="/courses/create">
                <Button size="lg" variant="outline">
                  Создать курс
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-md">
              <div>
                <div className="text-3xl font-bold text-primary">{mockCourses.length}</div>
                <div className="text-sm text-muted-foreground">курсов</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">5</div>
                <div className="text-sm text-muted-foreground">факультетов</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">180+</div>
                <div className="text-sm text-muted-foreground">студентов</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Популярные курсы
            </h2>
            <p className="mt-2 text-muted-foreground">
              Курсы с наибольшим количеством записей
            </p>
          </div>
          <Link href="/courses">
            <Button variant="ghost" className="gap-2">
              Все курсы
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50">
        <div className="container mx-auto px-4 py-16">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background p-8 md:p-12 ring-1 ring-primary/20">
            <div className="relative z-10 max-w-xl">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Преподаватель?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Создайте свой курс и начните набор студентов. 
                Удобное управление записями и расписанием.
              </p>
              <Link href="/courses/create" className="inline-block mt-6">
                <Button size="lg" variant="secondary">
                  Создать курс
                </Button>
              </Link>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 UniCourses. Платформа записи на курсы университета.</p>
        </div>
      </footer>
    </div>
  );
}
