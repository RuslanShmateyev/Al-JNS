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

    getRoadmapNodePrompt(level: string, project: string, nodeName: string, history: string): string {
        return `Уровень знаний пользователя в теме проекта: ${level}. 
Краткое описание проекта: ${project}. Он делается в рамках roadmap. 
Тебе нужно сделать описание для node: ${nodeName}.
В description должны быть описано описание для текущей node. Должны быть примеры и введены ключевые понятия.
В tasks должны быть основные задания, которые нужно выполнить для прохождения node.
В history должна быть добавлена история прохождения node (и что было изменено в проекте).
Текущая история прохождения: ${history}. 
Формат для ответа: { description: string, tasks: { title: string, description: string, difficulty: number }[], history: string }
ВЕСЬ ОТВЕТ ДОЛЖЕН СООТВЕТСТВОВАТЬ УКАЗАННОМУ ВЫШЕ ФОРМАТУ`;
    }

    getTaskPrompt(nodeTitle: string, level: string) {
        return `Ты — преподаватель. Создай одно контрольное задание в свободной форме 
по теме "${nodeTitle}" для уровня ${level}. 
Это должен быть вопрос, требующий развернутого ответа или мини-эссе. 
В ответе выдай ТОЛЬКО текст задания.
Формат для ответа: { title: string, description: string, difficulty: number }
ВЕСЬ ОТВЕТ ДОЛЖЕН СООТВЕТСТВОВАТЬ УКАЗАННОМУ ВЫШЕ ФОРМАТУ`;
    }

    getCheckAnswerPrompt(task: string, userAnswer: string) {
        return `Задание: ${task}\nОтвет пользователя: ${userAnswer}\n
Оцени ответ. Дай конструктивный фидбек и укажи, что было упущено.
Формат для ответа: { status: string, feedback: string }
ВЕСЬ ОТВЕТ ДОЛЖЕН СООТВЕТСТВОВАТЬ УКАЗАННОМУ ВЫШЕ ФОРМАТУ`;
    }

    getTenMinuteTaskPrompt(theme: string): string {
        return `Тема: ${theme}. 
Создай одно небольшое задание, которое можно выполнить за 10 минут и которое можно выполнить без доступа к компьютеру (на телефоне или планшете). 
Это должно быть практическое задание или вопрос для проверки понимания.
Формат для ответа: { title: string, description: string, difficulty: number }
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

    async generateRoadmapNode(level: string, project: string, nodeName: string, history: string): Promise<{ description: string, tasks: { title: string, description: string, difficulty: number }[], history: string }> {
        const prompt = this.getRoadmapNodePrompt(level, project, nodeName, history);
        return this.generateByPrompt(prompt) as Promise<{ description: string, tasks: { title: string, description: string, difficulty: number }[], history: string }>;
    }

    async generateTask(nodeTitle: string, level: string): Promise<{ title: string, description: string, difficulty: number }> {
        const prompt = this.getTaskPrompt(nodeTitle, level);
        return this.generateByPrompt(prompt) as Promise<{ title: string, description: string, difficulty: number }>;
    }

    async checkAnswer(task: string, userAnswer: string): Promise<{ status: string, feedback: string }> {
        const prompt = this.getCheckAnswerPrompt(task, userAnswer);
        return this.generateByPrompt(prompt) as Promise<{ status: string, feedback: string }>;
    }

    async generateTenMinuteTask(theme: string): Promise<{ title: string, description: string, difficulty: number }> {
        const prompt = this.getTenMinuteTaskPrompt(theme);
        return this.generateByPrompt(prompt) as Promise<{ title: string, description: string, difficulty: number }>;
    }
}