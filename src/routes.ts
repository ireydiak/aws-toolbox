import AccountsPage from './pages/AccountsPage.tsx'
import FunctionsPage from './pages/FunctionsPage.tsx'
import SettingsPage from './pages/SettingsPage.tsx'
import { LogEventsRoute } from './pages/LogEventsPage.tsx'
import { JSX } from 'solid-js'

export interface Route {
    [key: string]: {
        path: string
        component: JSX.Element
        label: string
    }
}
export const Routes = {
    Home: {
        path: "/",
        component: AccountsPage,
        label: "Home",
    },
    ListFunctions: {
        path: "/functions",
        component: FunctionsPage,
        label: "Functions",
    },
    EditConfig: {
        path: "/config/edit",
        component: SettingsPage,
        label: "Settings",
    },
    GetLogs: {
        path: "/logs/:logGroupName",
        component: LogEventsRoute,
        label: "Logs",
    }
} as const

export type RouteKey = keyof typeof Routes;