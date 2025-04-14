export interface Option<T> {
    value?: T
    errors: string
    code: number
}

export function Ok<T>(value: T): Option<T> {
    return {
        value: value,
        errors: "",
        code: 200,
    }
}

export function Err<T>(errMsg: string, code = 500): Option<T> {
    return {
        value: undefined,
        errors: errMsg,
        code: code,
    }
}