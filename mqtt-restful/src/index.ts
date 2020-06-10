import { of, from, interval } from "rxjs"
import { map, tap, filter, distinctUntilChanged, share } from "rxjs/operators"

import { RxMqtt } from "./rxMqtt"
import { RxHttp } from "./rxHttp"

const BROKER_URL = "mqtt://192.168.86.28"
const CLIENT_OPTIONS = {
    clientId: "mqtt-restful",
    username: "pi",
    password: "qazwsxedc",
    clean: true
}
const TOPICS = ["/light/on", "/light/off", "/light/toggle", "/light/status", "/sensor/temp", "/sensor/humi", "/sensor/motion", "/cc3200/ScreenControl"]

const HTTP_PORT = 8080

const mqtt = new RxMqtt(BROKER_URL, CLIENT_OPTIONS)
from(TOPICS).subscribe(mqtt.subscribe())
const http = new RxHttp(HTTP_PORT)

mqtt.connect$().pipe(
    tap(() => of("0").subscribe(mqtt.pub("/cc3200/ScreenControl"))),
).subscribe()

const notUndefined = <T>() => filter<T>(t => t !== undefined)
const SCREEN_MAX_LINE_LEN = 22
const screenCommand = (size: number, cursorX: number, cursorY: number, message: string) =>
    `${size} ${cursorX} ${cursorY} ${message.padEnd(SCREEN_MAX_LINE_LEN, " ").slice(0, SCREEN_MAX_LINE_LEN)}`

mqtt.sub$("/sensor/motion").pipe(
    notUndefined(),
).subscribe(mqtt.pub("/light/toggle"))

// Light Status
mqtt.sub$("/light/status").pipe(
    notUndefined(),
    map(status => !!parseInt(status)),
    distinctUntilChanged(),
    map(status => screenCommand(2, 2, 2, `Light: ${status ? "ON" : "OFF"}`)),
).subscribe(mqtt.pub("/cc3200/ScreenControl"))

// Temperature
mqtt.sub$("/sensor/temp").pipe(
    notUndefined(),
    map(temp => parseInt(temp)),
    distinctUntilChanged(),
    map(temp => screenCommand(2, 2, 20, `Temp: ${temp}C`)),
).subscribe(mqtt.pub("/cc3200/ScreenControl"))

// Humidity
mqtt.sub$("/sensor/humi").pipe(
    notUndefined(),
    map(humi => parseInt(humi)),
    distinctUntilChanged(),
    map(humi => screenCommand(2, 2, 38, `Humi: ${humi}%`)),
).subscribe(mqtt.pub("/cc3200/ScreenControl"))

const clock$ = interval(5000).pipe(
    map(_ => new Date()),
    share(),
)

// Date
clock$.pipe(
    map(date => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`),
    map(date => screenCommand(2, 2, 74, date)),
    distinctUntilChanged(),
).subscribe(mqtt.pub("/cc3200/ScreenControl"))

// Time
clock$.pipe(
    map(date => [date.getHours(), date.getMinutes(), date.getSeconds()]),
    map(time => time.map(n => `${n}`.padStart(2, "0"))),
    map(time => `${time[0]}:${time[1]}:${time[2]}`),
    map(time => screenCommand(2, 2, 92, time)),
).subscribe(mqtt.pub("/cc3200/ScreenControl"))

// Year Progress Bar
clock$.pipe(
    map(date => {
        const yearBeginning = new Date(date.getFullYear(), 0, 1).getTime()
        const nextYearBeginning = new Date(date.getFullYear() + 1, 0, 1).getTime()
        return (date.getTime() - yearBeginning) / (nextYearBeginning - yearBeginning)
    }),
    map(percent => [percent, 1 - percent].map(p => p * SCREEN_MAX_LINE_LEN)),
    map(symbolCounts => "#".repeat(symbolCounts[0]) + "=".repeat(symbolCounts[1])),
    map(progress => screenCommand(1, 2, 114, progress)),
    distinctUntilChanged(),
).subscribe(mqtt.pub("/cc3200/ScreenControl"))

const restfulCache$ = http.transaction$('/mqtt/*')
restfulCache$.pipe(
    tap(t => t.urlParams._ = `/${t.urlParams._}`),
    tap(t =>
        mqtt.subCache$(t.urlParams._).pipe(
            map(c => ({ topic: t.urlParams._, cache: c })),
        ).subscribe(t.okJson)
    )
).subscribe()

const restfulPub$ = http.transaction$('/mqtt/*', "POST")
restfulPub$.pipe(
    tap(t => t.urlParams._ = `/${t.urlParams._}`),
    tap(t => {
        t.postData!.subscribe(mqtt.pub(t.urlParams._))
        mqtt.sub$(t.urlParams._).pipe(
            map(message => ({ topic: t.urlParams._, published: message }))
        ).subscribe(t.okJson)
    })
).subscribe()
