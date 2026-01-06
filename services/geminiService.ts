
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getFeedback(score: number, total: number, animalName: string) {
  try {
    const prompt = `你现在是一位名叫"${animalName}"的森林动物老师。一个小学生刚完成了一个10道题的"10以内加减法"数学测试，得分是 ${score}/${total}。
    请写一段非常简短、亲切、充满鼓励的话语（50字以内）。
    如果分数高，请夸奖他们的努力；如果分数低，请温柔地鼓励他们下次加油。
    用符合你动物形象的语气（比如狮子可以带点吼声，兔子可以带点蹦跳感）。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "你是一个温柔、充满爱心的森林动物教师，专门鼓励小学生学习数学。",
        temperature: 0.8,
      },
    });

    return response.text || "太棒了！继续加油哦！";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return score === total ? "哇！全对了！你真聪明！" : "别灰心，多练习一定会更棒的！";
  }
}
