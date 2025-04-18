import { createSignal, For, onMount, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import {TauriCmds, tryInvoke} from '../utils/tauri.ts';
import "../App.css";
import { AppRoutes } from '../utils/routes.ts'

function AccountsPage() {
    const navigate = useNavigate();
    const [error, setError] = createSignal("");
    const [profiles, setProfiles] = createSignal<string[]>([]);
    const [loading, setLoading] = createSignal(true);

    onMount(async () => {
        const result = await tryInvoke(TauriCmds.ListAWSProfiles)
        if (!result.value) {
            setError(result.errors)
        } else {
            setProfiles(result.value as string[]);
        }
        setLoading(false);
    })

    async function loadProfile(profile: string) {
        setLoading(true);
        const result = await tryInvoke(TauriCmds.LoginAWSProfile, { profile });
        if (!result.value) {
            setError(result.errors);
        } else {
            navigate(AppRoutes.FunctionsPage);
        }
        setLoading(false);
    }

    return (
        <main class="container">
            <Show when={!loading()} fallback={<div>Loading</div>}>
                <Show when={error().length > 0}>
                    <p class="error">{ error() }</p>
                </Show>

                <ul>
                    <For each={profiles()}>
                        {(profile, _) => (
                            <li onClick={() => loadProfile(profile)}>{ profile }</li>
                        )}
                    </For>
                </ul>
            </Show>
        </main>
    );
}

export default AccountsPage;
