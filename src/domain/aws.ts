export interface LambdaFunction {
    name: string
    memory: number
    runtime: string
    lastModified: string
    timeout: number
    logGroupName: string
}

export interface BackendLambdaFunction {
    name: string
    memory: number
    runtime: string
    last_modified: string
    timeout: number
    log_group: string
}

export function mapLambdaFunctions(docs: BackendLambdaFunction[]): LambdaFunction[] {
    return docs.map((doc) => ({
        ...doc,
        lastModified: doc.last_modified,
        logGroupName: doc.log_group,
    }));
}

export interface BackendLogEvent {
    timestamp: number
    message: string
    ingestion_time: number
}

export interface LogEvent {
    timestamp: number
    message: string
    ingestionTime: number
}

export function mapLogEvent(source: BackendLogEvent): LogEvent {
    return {
        ...source,
        ingestionTime: source.ingestion_time,
    }
}