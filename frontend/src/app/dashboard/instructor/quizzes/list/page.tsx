'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { FiLoader, FiPlus, FiEdit2, FiEye, FiTrash2, FiSearch } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface Quiz {
    id: number;
    title: string;
    topic: string;
    type: string;
    status: string;
    generated_by_ai: boolean;
    created_at: string;
}

export default function QuizListPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<"all" | "draft" | "published">("all");
    const [quizToDelete, setQuizToDelete] = useState<number | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const token = localStorage.getItem("auth_token");
                const res = await axios.get("/api/auth/quizzes/created", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setQuizzes(res.data);
            } catch (err) {
                console.error("Error loading quizzes", err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    const filteredQuizzes = quizzes.filter(quiz => {
        const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.topic.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === "all" || quiz.status === filter;
        return matchesSearch && matchesFilter;
    });

    const confirmDelete = (quizId: number) => {
        setQuizToDelete(quizId);
    };

    const handleConfirmDelete = async () => {
        if (!quizToDelete) return;

        try {
            const res = await fetch(`/api/auth/quizzes/${quizToDelete}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (res.ok) {
                toast.success("Cuestionario eliminado");
                setQuizzes((prev) => prev.filter((q) => q.id !== quizToDelete));
            } else {
                const data = await res.json();
                toast.error(data.message || "Error al eliminar cuestionario");
            }
        } catch (error) {
            toast.error("Error de red al eliminar");
        } finally {
            setQuizToDelete(null); // cerrar modal
        }
    };

    const handleCancelDelete = () => {
        setQuizToDelete(null);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Mis Cuestionarios</h1>
                        <p className="text-gray-400 mt-2">
                            {quizzes.length} cuestionario{quizzes.length !== 1 ? 's' : ''} en total
                        </p>
                    </div>

                    <button
                        onClick={() => router.push('/dashboard/instructor/quizzes/new')}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <FiPlus /> Nuevo cuestionario
                    </button>
                </div>

                <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden mb-8">
                    <div className="p-4 border-b border-gray-700 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por título o tema..."
                                className="pl-10 pr-4 py-2 w-full bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-gray-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === "all" ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                            >
                                Todos
                            </button>
                            <button
                                onClick={() => setFilter("draft")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === "draft" ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                            >
                                Borradores
                            </button>
                            <button
                                onClick={() => setFilter("published")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === "published" ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                            >
                                Publicados
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center p-12">
                            <FiLoader className="animate-spin text-blue-400 text-2xl" />
                            <span className="ml-2 text-gray-400">Cargando cuestionarios...</span>
                        </div>
                    ) : filteredQuizzes.length === 0 ? (
                        <div className="text-center p-12">
                            <p className="text-gray-400">
                                {searchTerm || filter !== "all"
                                    ? "No se encontraron cuestionarios que coincidan con tu búsqueda"
                                    : "Aún no has creado ningún cuestionario"}
                            </p>
                            {!searchTerm && filter === "all" && (
                                <button
                                    onClick={() => router.push('/dashboard/instructor/quizzes/new')}
                                    className="mt-4 inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
                                >
                                    <FiPlus /> Crear mi primer cuestionario
                                </button>
                            )}
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-700">
                            {filteredQuizzes.map((quiz) => (
                                <li key={quiz.id} className="hover:bg-gray-750 transition-colors">
                                    <div className="p-4 md:p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h2 className="text-lg font-semibold text-white">{quiz.title}</h2>
                                                    {quiz.status === 'draft' && (
                                                        <span className="text-xs font-medium bg-yellow-900 text-yellow-200 px-2 py-1 rounded-full">
                                                            Borrador
                                                        </span>
                                                    )}
                                                    {quiz.status === 'published' && (
                                                        <span className="text-xs font-medium bg-green-900 text-green-200 px-2 py-1 rounded-full">
                                                            Publicado
                                                        </span>
                                                    )}
                                                    {quiz.generated_by_ai && (
                                                        <span className="text-xs font-medium bg-purple-900 text-purple-200 px-2 py-1 rounded-full">
                                                            Generado por IA
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-300 mt-1">
                                                    {quiz.topic} · {quiz.type}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Creado el {new Date(quiz.created_at).toLocaleDateString('es-ES', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>

                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/dashboard/instructor/quizzes/${quiz.id}/edit`}
                                                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <FiEdit2 />
                                                </Link>

                                                <Link
                                                    href={`/dashboard/instructor/quizzes/${quiz.id}/edit`}
                                                    className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-lg transition-colors"
                                                    title="Vista previa"
                                                >
                                                    <FiEye />
                                                </Link>
                                                <button
                                                    onClick={() => confirmDelete(quiz.id)}
                                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Modal de confirmación */}
            {quizToDelete !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full text-white">
                        <h3 className="text-lg font-semibold mb-4">Confirmar eliminación</h3>
                        <p className="mb-6">¿Seguro quieres eliminar este cuestionario?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
