import { Subject, Observable } from "rxjs"

export const fromCallback = <T extends (...a: any) => void>(fn: (arg: any, callback: T) => void, arg: any) => {
    const subject = new Subject<Parameters<T>>()
    fn(arg, <T>((...args) => subject.next(args)))
    return subject as Observable<Parameters<T>>
}

export const lazy = <T>(init: () => T) => {
    let value: T | undefined = undefined
    return () => {
        if (!value) value = init()
        return value
    }
}
