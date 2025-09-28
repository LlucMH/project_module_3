import { Card } from "@/components/ui/card";
import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-cream border-t border-muted mt-12">
        <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Texto */}
            <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
                Proyecto final del <strong>Módulo 3</strong> del curso de{" "}
                <strong>Desarrollo de Aplicaciones con Tecnologías Web</strong>{" "}
                impartido por
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <img src="/ironhack-logo.png" alt="Ironhack" className="h-6" />
                <span className="text-sm font-medium">Ironhack</span>
            </div>
            </div>

            {/* Autor */}
            <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex items-center gap-3">
                <img
                src="/llucMH.jpg"
                alt="Lluc Mata"
                className="h-12 w-12 rounded-full border border-muted shadow-sm object-cover"
                />
                <p className="text-sm font-medium">
                Realizado por <strong>Lluc Mata</strong>
                </p>
            </div>
            <div className="flex gap-4">
                <a
                href="https://github.com/LlucMH"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition"
                >
                <Github className="h-5 w-5" />
                </a>
                <a
                href="https://www.linkedin.com/in/lluc-mata/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition"
                >
                <Linkedin className="h-5 w-5" />
                </a>
            </div>
            </div>
        </div>
        </div>
    </footer>
  );
}
