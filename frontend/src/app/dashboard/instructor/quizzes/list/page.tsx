'use client';

import { useEffect, useState } from "react";
import axios from "axios";

interface Quiz {
    id: number;
    title: string;
    topic: string;
    type: string;
    status: string;
    generated_by_ai: boolean;
    is_published: boolean;  // <- Asegúrate de que el backend lo incluya
    created_at: string;
}

export default function QuizListPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const token = localStorage.getItem("auth_token"); // O como guardes tu JWT

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

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Mis Cuestionarios</h1>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <ul className="space-y-4">
                    {quizzes.map((quiz) => (
                        <li key={quiz.id} className="border p-4 rounded shadow-sm hover:shadow-md">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold">{quiz.title}</h2>
                                {!quiz.is_published && (
                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                        Borrador
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600">{quiz.topic} · {quiz.type}</p>
                            <p className="text-xs text-gray-400">
                                Creado el {new Date(quiz.created_at).toLocaleDateString()}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
