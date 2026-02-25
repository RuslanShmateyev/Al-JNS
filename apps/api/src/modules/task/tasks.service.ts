// src/ai/tasks/tasks.service.ts
import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

@Injectable()
export class TasksService {
    private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

    // 1. Генерируем задание в свободной форме
    async generateTask(nodeTitle: string, level: string) {
        const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Ты — преподаватель. Создай одно контрольное задание в свободной форме 
    по теме "${nodeTitle}" для уровня ${level}. 
    Это должен быть вопрос, требующий развернутого ответа или мини-эссе. 
    В ответе выдай ТОЛЬКО текст задания.`;

        const result = await model.generateContent(prompt);
        return { instruction: result.response.text() };
    }

    // 2. Проверяем ответ пользователя и даем фидбек
    async checkAnswer(task: string, userAnswer: string) {
        const schema = {
            type: SchemaType.OBJECT,
            properties: {
                score: { type: SchemaType.NUMBER, description: "Оценка от 1 до 10" },
                feedback: { type: SchemaType.STRING, description: "Развернутый разбор ответа" },
                missingPoints: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Что пользователь упустил" }
            },
            required: ["score", "feedback"]
        };

        const model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json", responseSchema: schema }
        });

        const prompt = `Задание: ${task}\nОтвет пользователя: ${userAnswer}\n
    Оцени ответ. Дай конструктивный фидбек и укажи, что было упущено.`;

        const result = await model.generateContent(prompt);
        return JSON.parse(result.response.text());
    }
}