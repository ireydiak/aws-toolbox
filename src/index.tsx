/* @refresh reload */
import { render } from 'solid-js/web'
import { Route, Router } from '@solidjs/router'
import { createSignal, onMount, Show } from 'solid-js'
import { TauriCmds, tryInvoke } from './utils/tauri.ts'
import { AppContextProvider } from './providers/AppContextProvider.tsx'
import Layout from './components/Layout.tsx'
import { Routes } from './routes.ts'

const App = () => {

    const [awsConfigLocation, setAwsConfigLocation] = createSignal<string>('')
    const [isLoading, setIsLoading] = createSignal<boolean>(false)

    onMount(async () => {
        setIsLoading(true)
        const result = await tryInvoke<string>(TauriCmds.LoginAWSProfile)
        if (!result.value) {
            // setError(result.errors);
        } else {
            setAwsConfigLocation(result.value)
        }
        setIsLoading(false)
    })

    return (
        <AppContextProvider awsConfigLocation={awsConfigLocation()}>
            <Show when={!isLoading()} fallback={<div>Loading configuration...</div>}>
                <div class="app-container">
                    <Router root={Layout}>
                        <Route path={Routes.Home.path} component={Routes.Home.component}></Route>
                        <Route path={Routes.ListFunctions.path} component={Routes.ListFunctions.component}></Route>
                        <Route path={Routes.EditConfig.path} component={Routes.EditConfig.component}></Route>
                        <Route path={Routes.GetLogs.path} component={Routes.GetLogs.component}></Route>
                    </Router>
                </div>
            </Show>
        </AppContextProvider>
    )
}

const wrapper = document.getElementById('root') as HTMLElement
render(
    () => <App/>, wrapper,
)

