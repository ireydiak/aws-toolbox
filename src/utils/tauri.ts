import { invoke, InvokeArgs, InvokeOptions } from '@tauri-apps/api/core'
import { Err, Ok, Option } from './errHandling.ts'

export const TauriCmds = {
    ListAWSProfiles: 'list_aws_profiles',
    LoginAWSProfile: 'login_aws_profile',
    ListLambdaFunctions: 'list_lambda_functions',
    ListFunctionLogs: 'list_function_logs',
    GetAwsConfigLocation: 'get_aws_config_location',
    UpdateAwsConfigLocation: 'update_aws_config_location',
} as const

export type TauriCmd = typeof TauriCmds[keyof typeof TauriCmds];

export async function tryInvoke<T>(cmd: TauriCmd, args?: InvokeArgs, options?: InvokeOptions): Promise<Option<T>> {
    try {
        const resp = await invoke<T>(cmd, args, options);
        return Ok(resp)
    } catch(e) {
        console.error(e)
        if (typeof e === 'string') {
            return Err(e, 500)
        } else if (e instanceof Error) {
            return Err(e.message, 500)
        } else {
            return Err("Unknown error", 500)
        }
    }
}