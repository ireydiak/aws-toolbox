export interface Option<T> {
    value?: T
    error: string
    code: number
}

export function Ok<T>(value: T): Option<T> {
    return {
        value: value,
        error: "",
        code: 200,
    }
}

export function Err<T>(errMsg: string, code = 500): Option<T> {
    return {
        value: undefined,
        error: errMsg,
        code: code,
    }
}

export function resolveErrorMessage(e: unknown): string {
    if (typeof e === 'string') {
        return e
    } else if (e instanceof Error) {
        return e.message
    } else {
        return `${e}`
    }
}