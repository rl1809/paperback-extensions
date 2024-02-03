import { tagMapping, languageMapping } from "./external/mapping.json"

type StringToIntMapping = {
    [key: string]: number;
};

type StringToStringMapping = {
    [key: string]: string;
}

export const tagMappingDict = tagMapping as StringToIntMapping;
export const languageMappingDict = languageMapping as StringToStringMapping;



export const getLanguageCode = (dataLanguages: string[]): string => {
    const sortedDataLanguages = dataLanguages.sort(); // Sort the languages numerically if necessary

    for (const language of sortedDataLanguages) {
        const code = languageMapping[language as keyof typeof languageMapping];
        if (code && code !== "UNKNOWN") {
            return code;
        }
    }

    return "UNKNOWN";
};