import React, { useEffect, useState } from "react";
import Navbar from "../components/HomePage/navbar";
import axios from "axios";
import {
  Play,
  CheckCircle,
  Lock,
  ChevronRight,
  Search,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  thumbnail?: string;
  completed?: boolean;
  locked?: boolean;
}

interface Course {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

const CourseContent: React.FC = () => {
  // Estados
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModule, setActiveModule] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Cargar datos de cursos
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/courses")
      .then((res) => {
        const coursesData = res.data;
        setCourses(coursesData);
        console.log(coursesData);

        // Establecer el módulo y lección activos inicialmente
        if (coursesData.length > 0) {
          setActiveModule(coursesData[0]);
          if (coursesData[0].lessons && coursesData[0].lessons.length > 0) {
            setActiveLesson(coursesData[0].lessons[0]);
          }
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses", err);
        setError(
          "No se pudieron cargar los cursos. Por favor, intenta de nuevo más tarde."
        );
        setLoading(false);
      });
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.lessons.some((lesson) =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-[#FF5722] animate-spin mb-4" />
          <p className="text-xl">Cargando cursos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] text-white flex items-center justify-center">
        <div className="bg-[#2A2A2A] p-8 rounded-xl max-w-md text-center">
          <AlertTriangle className="w-16 h-16 text-[#FF5722] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-white/80 mb-6">{error}</p>
          <div className="space-x-4 grid grid-cols-2 md:grid-cols-2">
            <button
              onClick={() => window.location.reload()}
              className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white py-2 px-6 rounded-lg text-sm font-medium"
            >
              Intentar de nuevo
            </button>
            <button
              onClick={() => window.location.replace("/")}
              className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white py-2 px-6 rounded-lg text-sm font-medium"
            >
              Volver a la página de inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay cursos disponibles
  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] text-white flex items-center justify-center">
        <div className="bg-[#2A2A2A] p-8 rounded-xl max-w-md text-center">
          <h2 className="text-2xl font-bold mb-2">No hay cursos disponibles</h2>
          <p className="text-white/80">
            Vuelve más tarde para ver nuevos cursos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#1E1E1E]  text-white">
        <Navbar />
      </div>
      <div className="min-h-screen bg-[#1E1E1E] text-white">
        <header className="bg-[#FF5722] py-6">
          <div className="container-mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h1 className="text-2xl md:text-3xl font-bold">
                Material del Curso
              </h1>
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full bg-white rounded-full py-2 px-4 pl-10 text-[#6a6a6a] placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/70" />
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar con nuestros modulos y lecciones */}
            <div className="lg:col-span-1">
              <div className="bg-[#2A2A2A] rounded-xl overflow-hidden sticky top-8">
                <div className="p-4 bg-[#333333]">
                  <h2 className="text-xl font-semibold">Contenido del curso</h2>
                  <p className="text-white/70 text-sm mt-1">
                    {courses.length} {courses.length === 1 ? "curso" : "cursos"}{" "}
                    disponibles
                  </p>
                </div>
                <div className="p-4 max-h-[70vh] overflow-y-auto">
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <div key={course.id} className="mb-6">
                        <button
                          onClick={() => {
                            setActiveModule(course);
                            if (course.lessons && course.lessons.length > 0) {
                              setActiveLesson(course.lessons[0]);
                            }
                          }}
                          className={`flex justify-between items-center w-full text-left mb-2 ${
                            activeModule?.id === course.id
                              ? "text-[#FF5722]"
                              : "text-white"
                          }`}
                        >
                          <h3 className="font-medium">{course.title}</h3>
                          <ChevronRight
                            className={`w-4 h-4 transform transition-transform ${
                              activeModule?.id === course.id ? "rotate-90" : ""
                            }`}
                          />
                        </button>

                        {(activeModule?.id === course.id || searchQuery) && (
                          <div className="ml-2 border-l-2 border-[#444444] pl-4 space-y-3">
                            {course.lessons
                              .filter((lesson) =>
                                searchQuery
                                  ? lesson.title
                                      .toLowerCase()
                                      .includes(searchQuery.toLowerCase())
                                  : true
                              )
                              .map((lesson) => (
                                <motion.button
                                  key={lesson.id}
                                  onClick={() => setActiveLesson(lesson)}
                                  className={`flex items-center gap-3 w-full text-left text-sm py-1 ${
                                    activeLesson?.id === lesson.id
                                      ? "text-[#FF5722]"
                                      : lesson.locked
                                      ? "text-white/50"
                                      : "text-white/80"
                                  }`}
                                  whileHover={{ x: 4 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 10,
                                  }}
                                >
                                  {lesson.completed ? (
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                  ) : lesson.locked ? (
                                    <Lock className="w-4 h-4 flex-shrink-0" />
                                  ) : (
                                    <Play className="w-4 h-4 flex-shrink-0" />
                                  )}
                                  <span className="flex-1">{lesson.title}</span>
                                  <span className="text-xs text-white/50">
                                    {lesson.duration}
                                  </span>
                                </motion.button>
                              ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-white/70">
                      No se encontraron resultados
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Contenido principal con video y descripición */}
            {activeLesson && activeModule && (
              <div className="lg:col-span-2 space-y-6">
                {/* Video Player*/}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  key={activeLesson.id}
                  className="bg-[#2A2A2A] rounded-xl overflow-hidden"
                >
                  <div className="relative aspect-video bg-black">
                    {activeLesson.locked ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                        <Lock className="w-16 h-16 text-white" />
                        <p className="text-white/70 mt-2">
                          Esta lección está bloqueada
                        </p>
                        <Link
                          to="/inscripcion"
                          className="mt-4 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white py-2 px-6 rounded-full text-sm font-medium"
                        >
                          Desbloquear Ahora
                        </Link>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={
                            activeLesson.thumbnail ||
                            "/placeholder.svg?height=200&width=350" ||
                            "./src/assets/placeholder.png"
                          }
                          alt={activeLesson.title}
                          className="object-cover"
                        />
                        <a
                          href={activeLesson.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
                        >
                          <div className="w-16 h-16 rounded-full bg-[#FF5722] flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 text-white ml-1" />
                          </div>
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold">
                          {activeLesson.title}
                        </h2>
                        <p className="text-white/70 mt-1">
                          Curso: {activeModule.title} • {activeLesson.duration}
                        </p>
                      </div>
                      {activeLesson.completed && (
                        <div className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs font-medium">
                          Completado
                        </div>
                      )}
                    </div>

                    <p className="text-white/80 leading-relaxed">
                      {activeLesson.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-4">
                      <a
                        href={activeLesson.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white py-2 px-6 rounded-lg text-sm font-medium inline-flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Ver lección
                      </a>
                      <button className="bg-white/10 hover:bg-white/20 text-white py-2 px-6 rounded-lg text-sm font-medium">
                        Marcar como completada
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Navegación entre lecciones */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Lógica para encontrar la lección anterior */}
                  {(() => {
                    const currentLessonIndex = activeModule.lessons.findIndex(
                      (lesson) => lesson.id === activeLesson.id
                    );
                    if (currentLessonIndex > 0) {
                      const prevLesson =
                        activeModule.lessons[currentLessonIndex - 1];
                      return (
                        <button
                          onClick={() => setActiveLesson(prevLesson)}
                          className="bg-[#2A2A2A] hover:bg-[#333333] rounded-xl p-4 flex items-center gap-3 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <ChevronRight className="w-5 h-5 transform rotate-180" />
                          </div>
                          <div>
                            <p className="text-xs text-white/50">
                              Lección anterior
                            </p>
                            <p className="text-sm font-medium">
                              {prevLesson.title}
                            </p>
                          </div>
                        </button>
                      );
                    }
                    return <div></div>; // Espacio vacío si no hay lección anterior
                  })()}

                  {/* Lógica para encontrar la siguiente lección */}
                  {(() => {
                    const currentLessonIndex = activeModule.lessons.findIndex(
                      (lesson) => lesson.id === activeLesson.id
                    );
                    if (currentLessonIndex < activeModule.lessons.length - 1) {
                      const nextLesson =
                        activeModule.lessons[currentLessonIndex + 1];
                      return (
                        <button
                          onClick={() => setActiveLesson(nextLesson)}
                          className="bg-[#2A2A2A] hover:bg-[#333333] rounded-xl p-4 flex items-center justify-between gap-3 transition-colors"
                        >
                          <div>
                            <p className="text-xs text-white/50 text-right">
                              Siguiente lección
                            </p>
                            <p className="text-sm font-medium">
                              {nextLesson.title}
                            </p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </button>
                      );
                    }
                    return <div></div>; // Espacio vacío si no hay siguiente lección
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseContent;
