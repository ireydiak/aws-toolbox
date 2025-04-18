import { createContext } from 'solid-js'

// Define the context value type
export type AppContext = [
    {
        awsConfigLocation: string;
    },
    {
        setAwsConfigLocation: (path: string) => void;
    }
];

const contextSetters = {
    // @ts-expect-error the `path` parameter is declared here but will be used in the provider implementation
    setAwsConfigLocation: (path: string) => {},
}

export const AppContext = createContext<AppContext>([
    { awsConfigLocation: '' },
    contextSetters,
])