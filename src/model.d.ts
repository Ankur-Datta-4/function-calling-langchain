export type KeyType = "string" | "number" | "boolean";

export interface ObjectSchema {
  type: KeyType;
  description: string;
}

// output type interface= objectschema+output:string
export interface OutputSchema {
  type: KeyType;
  description: string;
  output: string | number | boolean;
}

// Path: src\index.ts
