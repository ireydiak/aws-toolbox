import { createSignal, onMount, useContext } from 'solid-js'
import { AppContext } from '../contexts/AppContext.ts'
import { TauriCmds, tryInvoke } from '../utils/tauri.ts'

function SettingsPage() {

    const [configPath, setConfigPath] = createSignal<string>('')
    const [context, {setAwsConfigLocation}] = useContext(AppContext)
    const [isSaving, setIsSaving] = createSignal<boolean>(false)
    const [statusMessage, setStatusMessage] = createSignal<string>('')

    onMount(() => {
        setConfigPath(context.awsConfigLocation)
    })

    const saveSettings = async () => {
        setIsSaving(true)
        const { error } = await tryInvoke<void>(TauriCmds.UpdateAwsConfigLocation, {path: configPath()})
        if (error.length > 0) {
            setStatusMessage(`Failed to save configuration: ${error}`)
        } else {
            setAwsConfigLocation(configPath())
            setStatusMessage('Configuration saved successfully')
        }
        setIsSaving(false);
    }

    return (
        <div class="settings-page">
            <h1>Settings</h1>

            <div class="form-group">
                <label class="aws-config-path">AWS Config File Path</label>
                <input
                    id="aws-config-path"
                    type="text"
                    value={configPath()}
                    onInput={(e) => setConfigPath(e.target.value)}
                    placeholder="~/.aws/config"
                />
                <button
                    onClick={saveSettings}
                    disabled={isSaving()}
                >
                    {isSaving() ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setConfigPath('')}>Clear</button>
            </div>

            {statusMessage() && <p class="message">{statusMessage()}</p>}
        </div>
    )
}

export default SettingsPage