// src/features/course-management/ui/admin-header.tsx
import Link from "next/link";
import { Settings, ArrowLeft, BookOpen, Calendar } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 bg-foreground text-background shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Settings className="size-5" />
              </div>
              <span className="font-semibold">Админ-панель</span>
            </Link>

            <nav className="flex items-center gap-1">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <BookOpen className="size-4" />
                Курсы
              </Link>
              <Link
                href="/admin/offerings"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Calendar className="size-4" />
                Открытие курсов
              </Link>
            </nav>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="size-4" />
            На сайт
          </Link>
        </div>
      </div>
    </header>
  );
}

