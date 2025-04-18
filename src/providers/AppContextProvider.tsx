import { AppContext } from '../contexts/AppContext.ts'
import { createStore } from 'solid-js/store'
import { JSX } from 'solid-js'

export interface AppContextProviderProps {
    awsConfigLocation: string;
    children?: JSX.Element;
}

export function AppContextProvider(props: AppContextProviderProps) {
    const [value, setValue] = createStore({ awsConfigLocation: props.awsConfigLocation })

    const setter: AppContext = [
        value,
        {
            setAwsConfigLocation(path: string) {
                setValue("awsConfigLocation", path)
            }
        }
    ]

    return (
        <AppContext.Provider value={setter}>
            { props.children }
        </AppContext.Provider>
    )
}