import { createSignal, For, onMount, Show } from 'solid-js';
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from '@solidjs/router';
import { TauriCmds } from '../utils/tauri.ts';
import "../App.css";
import { AppRoutes } from '../utils/routes.ts'

function AccountsPage() {
    const navigate = useNavigate();
    const [error, setError] = createSignal("");
    const [profiles, setProfiles] = createSignal<string[]>([]);
    const [loading, setLoading] = createSignal(true);

    onMount(async () => {
        try {
            const profiles = await invoke(TauriCmds.ListAWSProfiles) as string[];
            setProfiles(profiles);
            setLoading(false)
        } catch (e) {
            console.log(e);
            setError(e instanceof Error ? e.message : "Unknown error encountered");
            setLoading(false)
        }
    })

    async function loadProfile(profile: string) {
        try {
            setLoading(true);
            await invoke(TauriCmds.LoginAWSProfile, { profile });
            navigate(AppRoutes.FunctionsPage);
        } catch(e) {
            console.error(e);
            setError(e instanceof Error ? e.message : "Unknown error encountered")
            setLoading(false)
        }
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
