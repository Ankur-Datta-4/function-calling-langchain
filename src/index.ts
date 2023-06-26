import * as dotenv from "dotenv";
import { OpenAI } from "langchain";
// import { HuggingFaceInference } from "langchain/llms";
import type { ObjectSchema, OutputSchema } from "@/model.d.ts";
import FunctionPromptTemplate from "./promptTemplates.ts";

dotenv.config();

const model = new OpenAI({
  modelName: "gpt-3.5-turbo",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// accepts schema as an object
// later describes a function, which accepts a string as input and returns object in the schema format

class FunctionCalling {
  schema: ObjectSchema[];

  constructor(schemainput: ObjectSchema[]) {
    this.schema = schemainput;
  }

  async request(input: string) {
    const result: OutputSchema[] = [];
    for (const prompt of this.schema) {
      const formattedPrompt = await FunctionPromptTemplate.format({
        input,
        type: prompt.type,
        description: prompt.description,
      });
      const res = await model.call(formattedPrompt);
      result.push({
        type: prompt.type,
        description: prompt.description,
        output: res,
      });
    }
    return result;
  }
}

const schema: ObjectSchema[] = [
  {
    type: "string",
    description: "What is the name of the person?",
  },
  {
    type: "number",
    description: "What is the age of the person?",
  },
  {
    type: "boolean",
    description: "Is the person married? Default false",
  },
];

const instance = new FunctionCalling(schema);
const result = await instance.request(
  "The person is named John Doe and is 25 years old and is married"
);
console.log(result);
