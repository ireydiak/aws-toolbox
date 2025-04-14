import { createSignal, For, onMount, Show } from 'solid-js'
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from '@solidjs/router'
import "./App.css";

function App() {
    const navigate = useNavigate();
  const [error, setError] = createSignal("");
  const [profiles, setProfiles] = createSignal<string[]>([]);
  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
      try {
          const profiles = await invoke("list_aws_profiles") as string[];
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
          await invoke("login_aws_profile", { profile });
          navigate("/functions");
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

export default App;
