import { connect, OnMessageCallback, MqttClient, OnConnectCallback } from "mqtt"
import { Observer, BehaviorSubject, of, Observable, Subject } from "rxjs"
import { filter, map, tap, share, first } from "rxjs/operators"

import { lazy, fromCallback } from "./util"

export class RxMqtt {
    private client: MqttClient
    public logPackets = false
    private clientOn = lazy(() => this.client.on.bind(this.client))
    private message$ = () => fromCallback<OnMessageCallback>(this.clientOn(), "message")
    private topic2Sub$: { [topic: string]: BehaviorSubject<string | undefined> } = {}
    public connect$ = () => fromCallback<OnConnectCallback>(this.clientOn(), "connect")
    public sub$ = (topic: string) => <Observable<string>>(this.topic2Sub$[topic] ? this.topic2Sub$[topic] : of(undefined))
    public subCache$ = (topic: string) => this.sub$(topic).pipe(first())
    public pub = (topic: string) => <Observer<string>>({
        next: (message: string) => {
            this.client.publish(topic, message)
            console.log("[MQTT]", "Published", topic, message)
        },
        error: (err: any) => { console.log("[MQTT]", "Publish Error", topic, err) },
        complete: () => { }
    })
    public subscribe = () => <Observer<string>>({
        next: (topic: string) => {
            this.client.subscribe(topic)
            this.topic2Sub$[topic] = new BehaviorSubject<string | undefined>(undefined)
            this.message$().pipe(
                filter(m => m[0] == topic),
                map(m => m[1].toString()),
                share()
            ).subscribe(this.topic2Sub$[topic])
            console.log("[MQTT]", "Subscribed", topic)
        },
        error: (err: any) => { console.log("[MQTT]", "Subscribe Error", err) },
        complete: () => { }
    })
    public unsubscribe = () => <Observer<string>>({
        next: (topic: string) => {
            if (!this.topic2Sub$[topic]) return
            this.topic2Sub$[topic].complete()
            delete this.topic2Sub$[topic]
            this.client.unsubscribe(topic)
            console.log("[MQTT]", "Unsubscribed", topic)
        },
        error: (err: any) => { console.log("[MQTT]", "Subscribe Error", err) },
        complete: () => { }
    })
    constructor(...args: Parameters<typeof connect>) {
        this.client = connect(...args)
        this.connect$().pipe(
            tap(m => console.log("[MQTT]", "Connected", ...this.logPackets ? [m] : []))
        ).subscribe()
        this.message$().pipe(
            tap(m => console.log("[MQTT]", "New Message", ...this.logPackets ? [m] : [m[0], m[1].toString()]))
        ).subscribe()
    }
}
