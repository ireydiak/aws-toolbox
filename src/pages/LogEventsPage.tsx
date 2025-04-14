import { createSignal, For, onMount, Show } from 'solid-js'
import { TauriCmds, tryInvoke } from '../utils/tauri.ts'
import { LogEvent } from '../domain/aws.ts'
import { Option } from '../utils/errHandling.ts'
import { useParams } from "@solidjs/router";

export interface LogEventPageProps {
    logGroupName: string
}

export function LogEventsRoute() {
    const params = useParams();

    return <LogEventsPage logGroupName={params.logGroupName} />
}

export function LogEventsPage({ logGroupName }: LogEventPageProps) {
    console.log(`logGroupName: ${logGroupName}`);
    const [error, setError] = createSignal('')
    const [isLoading, setIsLoading] = createSignal(true)
    const [logs, setLogs] = createSignal<LogEvent[]>([])

    onMount(async () => {
        setIsLoading(true)
        const result = await tryInvoke(TauriCmds.ListFunctionLogs, {
            logGroupName: decodeURIComponent(logGroupName),
        }) as Option<LogEvent[]>
        console.log(JSON.stringify(result))
        if (!result.value) {
            setError(result.errors)
        } else {
            setLogs(result.value)
        }
        setIsLoading(false)
    })

    return (
        <div>
            <Show when={!isLoading()} fallback={<div>loading...</div>}>

                <Show when={error().length > 0}>
                    <p>{error()}</p>
                </Show>

                <ul>
                    <For each={logs()}>
                        {(log, _) => (
                            <li>{ log.timestamp }</li>
                        )}
                    </For>
                </ul>
            </Show>
        </div>
    )
}