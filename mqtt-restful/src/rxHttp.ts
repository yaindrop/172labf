import { createServer, Server, IncomingMessage, ServerResponse, OutgoingHttpHeaders } from "http"
import { Subject, Observable, Observer, of, ReplaySubject } from "rxjs"
import { tap, filter, map, share, takeUntil, toArray } from "rxjs/operators"
import { parse, UrlWithParsedQuery } from "url"
import UrlPattern = require("url-pattern")

import { fromCallback } from "./util"

export type UrlMatchResult = {
    [param: string]: string
}

type PreTransaction = {
    req: IncomingMessage,
    res: ServerResponse,
    unmatchedCount: number,
    consumed: boolean,
    replied: boolean,
}

type TransactionReply = {
    status: number,
    headers: OutgoingHttpHeaders,
    message: string
}

type Transaction = {
    req: IncomingMessage,
    res: ServerResponse,
    parsedUrl: UrlWithParsedQuery,
    urlParams: UrlMatchResult,
    postData?: Observable<string>,
    okText: Observer<string>,
    okJson: Observer<object>,
    reply: Observer<TransactionReply>
}

type TransactionRoute = {
    method: string,
    pattern: string
}

export class RxHttp {
    private server: Server
    private server$ = new Subject<PreTransaction>()
    private unmatched$ = new Subject<Transaction>()
    private route2Transaction$: { [pattern: string]: Observable<Transaction> } = {}
    public logPackets = false
    public transaction$ = (pattern: string, method: string = "GET") => {
        const routeToString = (r: TransactionRoute) => `${r.method} ${r.pattern}`
        const routeStr = routeToString({ method, pattern })
        if (!this.route2Transaction$[routeStr]) {
            const getPatternCounts = () => Object.keys(this.route2Transaction$).length
            const getUrlParams = (t: { req: IncomingMessage }) => new UrlPattern(pattern).match(t.req.url!)
            const matchPreTransaction = (p: PreTransaction) => p.req.method == method && getUrlParams(p) as boolean
            const readPostData = (p: PreTransaction) => {
                const onData$ = fromCallback(p.req.on.bind(p.req), "data") as Observable<unknown> as Observable<string>
                const onEnd$ = fromCallback(p.req.on.bind(p.req), "end") as Observable<[]>
                const postData$ = new ReplaySubject<string>()
                onData$.pipe(takeUntil(onEnd$)).subscribe(postData$)
                return postData$.pipe(toArray(), map(arr => arr.join('')))
            }
            const writeReply = (p: PreTransaction, status: number, headers: OutgoingHttpHeaders, message: string) => {
                if (p.replied) return
                p.replied = true
                p.res.writeHead(status, headers)
                p.res.write(message)
                p.res.end()
                console.log("[HTTP]", "Response", status, headers, message)
            }
            const reply = <T>(p: PreTransaction, status: (m: T) => number, headers: (m: T) => OutgoingHttpHeaders, message: (m: T) => string) => <Observer<T>>({
                next: (m: T) => writeReply(p, status(m), headers(m), message(m)),
                error: (err: any) => { console.log("[HTTP]", "Response Error", pattern, err) },
                complete: () => { }
            })
            const toTransaction = (p: PreTransaction) => <Transaction>{
                ...p,
                parsedUrl: parse(p.req.url!, true),
                urlParams: getUrlParams(p),
                postData: method == "POST" ? readPostData(p) : undefined,
                okJson: reply<object>(p, () => 200, () => ({ 'Content-Type': 'application/json' }), JSON.stringify),
                okText: reply<string>(p, () => 200, () => ({ 'Content-Type': 'text/plain' }), s => s),
                reply: reply<TransactionReply>(p, r => r.status, r => r.headers, r => r.message),
            }
            const notMatched = this.server$.pipe(filter(p => !matchPreTransaction(p)))
            notMatched.pipe(
                tap(p => p.unmatchedCount++),
                filter(p => getPatternCounts() === p.unmatchedCount),
                map(toTransaction)
            ).subscribe(this.unmatched$)
            const matched = this.server$.pipe(filter(matchPreTransaction))
            const matchedNotConsumed = matched.pipe(filter(p => !p.consumed))
            this.route2Transaction$[routeStr] = matchedNotConsumed.pipe(
                tap(p => p.consumed = true),
                map(toTransaction),
                share()
            )
        }
        return this.route2Transaction$[routeStr]
    }
    constructor(port: number) {
        this.server = createServer((req, res) => this.server$.next({ req, res, unmatchedCount: 0, consumed: false, replied: false }))
        this.server.listen(port)
        this.server$.pipe(
            tap(p => console.log("[HTTP]", "Reveived", ...this.logPackets ? [p.req] : [p.req.method!, p.req.url!]))
        ).subscribe()
        this.unmatched$.pipe(
            tap(t =>
                of<TransactionReply>(
                    { status: 404, headers: { 'Content-Type': 'text/plain' }, message: "not found" }
                ).subscribe(t.reply)
            )
        ).subscribe()
    }
}
