import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

@Injectable()
export class AiService {
    private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

    // Метод для настройки модели под конкретную задачу
    private getModel(schema: any) {
        return this.genAI.getGenerativeModel({
            model: "gemini-3-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
    }

    // 1. Определение интересов
    async getInterests(topic: string, level: string): Promise<string[]> {
        const schema = { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } };
        const prompt = `Тема: ${topic}. Уровень знаний: ${level}. 
    Тебе нужно создать список интересов (знания которых помогут в проекте). 
    Сделай так, чтобы вопросы не дублировались по темам, пиши оригинально.`;

        const result = await this.getModel(schema).generateContent(prompt);
        return JSON.parse(result.response.text());
    }

    // 2. Определение проекта
    async getProjects(topic: string, level: string, interests: string[]): Promise<string[]> {
        const schema = { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } };
        const prompt = `Тема: ${topic}. Уровень знаний: ${level}. Интересы: ${interests.join(', ')}.
    На основе этих интересов создай список мини-проектов, чтобы проходить все темы по порядку, как в roadmap. Сделай так, чтобы вопросы не дублировались по темам, пиши оригинально.`;

        const result = await this.getModel(schema).generateContent(prompt);
        return JSON.parse(result.response.text());
    }

    // 3. Генерация Roadmap
    async generateRoadmap(topic: string, level: string, interests: string[], project: string): Promise<any> {
        const schema = {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    title: { type: SchemaType.STRING },
                    difficulty: { type: SchemaType.NUMBER },
                    to_node: { type: SchemaType.STRING },
                },
                required: ["title", "difficulty", "to_node"]
            }
        };

        const prompt = `Тебе нужно создать roadmap, по заданной теме: ${topic}.
    Сделай для уровня: ${level}. Больше опирайся на интересы: ${interests.join(', ')}.
    По мере прохождения roadmap вы делаете проект: ${project}. Сделай так, чтобы вопросы не дублировались по темам, пиши оригинально.`;

        const result = await this.getModel(schema).generateContent(prompt);
        return JSON.parse(result.response.text());
    }
}