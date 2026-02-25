import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
    private genAI = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY || ''
    });

    // Метод для настройки модели под конкретную задачу
    private getModel() {
        return this.genAI.models.get({
            model: "gemini-3-flash-preview"
        });
    }

    getInterestsPrompt(topic: string, level: string): string {
        return `Тема: ${topic}. Уровень знаний: ${level}. 
Тебе нужно создать список интересов (знания которых помогут в проекте). 
Сделай так, чтобы вопросы не дублировались по темам.
Формат для ответа: string[]
ВЕСЬ ОТВЕТ ДОЛЖЕН СООТВЕТСТВОВАТЬ УКАЗАННОМУ ВЫШЕ ФОРМАТУ`;
    }

    getProjectsPrompt(topic: string, level: string, interests: string[]): string {
        return `Тема: ${topic}. Уровень знаний: ${level}. Интересы: ${interests.join(', ')}.
    На основе этих интересов создай список мини-проектов, чтобы проходить все темы по порядку, как в roadmap.
Формат для ответа: string[]
ВЕСЬ ОТВЕТ ДОЛЖЕН СООТВЕТСТВОВАТЬ УКАЗАННОМУ ВЫШЕ ФОРМАТУ`;
    }

    getRoadmapPrompt(topic: string, level: string, interests: string[], project: string): string {
        return `Тебе нужно создать roadmap, по заданной теме: ${topic}.
Сделай для уровня: ${level}. Больше опирайся на интересы: ${interests.join(', ')}.
По мере прохождения roadmap вы делаете проект: ${project}.
Формат для ответа: { title: string, difficulty: number, toNode: string }[]
ВЕСЬ ОТВЕТ ДОЛЖЕН СООТВЕТСТВОВАТЬ УКАЗАННОМУ ВЫШЕ ФОРМАТУ`;
    }

    getRoadmapNodePrompt(level: string, project: string, nodeName: string): string {
        return `Уровень знаний пользователя в теме проекта: ${level}. 
Краткое описание проекта: ${project}. Он делается в рамках roadmap. 
Тебе нужно сделать описание для node: ${nodeName}.
Формат для ответа: { description: string, tasks: { title: string, description: string, difficulty: number }[], history: string }
ВЕСЬ ОТВЕТ ДОЛЖЕН СООТВЕТСТВОВАТЬ УКАЗАННОМУ ВЫШЕ ФОРМАТУ`;
    }

    async generateByPrompt(prompt: string): Promise<any> {
        const result = await this.genAI.models.generateContent({
            model: ((await this.getModel()).name || ""),
            contents: [{
                parts: [{
                    text: prompt
                }
                ]
            }
            ]
        });
        return JSON.parse(result.text || "");
    }

    async generateInterests(topic: string, level: string): Promise<string[]> {
        const prompt = this.getInterestsPrompt(topic, level);
        return this.generateByPrompt(prompt);
    }

    async generateProjects(topic: string, level: string, interests: string[]): Promise<string[]> {
        const prompt = this.getProjectsPrompt(topic, level, interests);
        return this.generateByPrompt(prompt);
    }

    async generateRoadmap(topic: string, level: string, interests: string[], project: string): Promise<{ title: string, difficulty: number, toNode: string }[]> {
        const prompt = this.getRoadmapPrompt(topic, level, interests, project);
        return this.generateByPrompt(prompt) as Promise<{ title: string, difficulty: number, toNode: string }[]>;
    }

    async generateRoadmapNode(level: string, project: string, nodeName: string): Promise<{ description: string, tasks: { title: string, description: string, difficulty: number }[], history: string }> {
        const prompt = this.getRoadmapNodePrompt(level, project, nodeName);
        return this.generateByPrompt(prompt) as Promise<{ description: string, tasks: { title: string, description: string, difficulty: number }[], history: string }>;
    }
}