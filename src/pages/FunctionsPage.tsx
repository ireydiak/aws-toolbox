import { createSignal, For, onMount, Show } from 'solid-js';
import { invoke } from '@tauri-apps/api/core';
import '../App.css';
import { TauriCmds } from '../utils/tauri.ts'
import { A } from '@solidjs/router'
import { BackendLambdaFunction, mapLambdaFunctions } from '../domain/aws.ts'

interface LambdaFunction {
    name: string
    logGroupName: string
}

function FunctionsPage() {

    const [error, setError] = createSignal('')
    const [isLoading, setIsLoading] = createSignal(true)
    const [lambdas, setLambdas] = createSignal<LambdaFunction[]>([])

    onMount(async () => {
        try {
            setIsLoading(true);
            const lambdas = await invoke(TauriCmds.ListLambdaFunctions) as BackendLambdaFunction[];
            console.log(lambdas);
            setLambdas(mapLambdaFunctions(lambdas));
            setIsLoading(false);
        } catch (e) {
            console.log(e);
            setIsLoading(false);
            const msg = e instanceof Error ? e.message : 'Unknown error encountered';
            setError(msg);
        }
    })

    return (
        <div>
            <Show when={!isLoading()} fallback={<div>Loading...</div>}>
                <h1>Functions</h1>
                <Show when={error().length > 0}>
                    <p class="error">{error()}</p>
                </Show>
                <ul>
                    <For each={lambdas()}>
                        {(lambda, _) => (
                            <li>
                                <A href={"/logs/" + encodeURIComponent(lambda.logGroupName)}>{lambda.name}</A>
                            </li>
                        )}
                    </For>
                </ul>
            </Show>
        </div>
    )
}

export default FunctionsPage