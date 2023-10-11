"use client"
import { useEffect, useState } from "react"
import { AiOutlineSend } from "react-icons/ai"
const INITIAL_MESSAGES = [
    {
        role: "assistant",
        content: "hello"
    }
]


export default function Chat() {
    const [messages, setMessages] = useState<any>(INITIAL_MESSAGES)//messages in EN
    const [translatedMessages, setTranslatedMessages] = useState<any>([])//messages in obscure foreign language
    const [input, setInput] = useState("")
    const [response, setResponse] = useState("")
    const [target, setTarget] = useState("zu")

    const messageComponents = messages.map((message: any, index: any) => {
        let content = message.content;
        if (typeof content !== 'string') {
            content = String(content);
        }
        const contentArray = content.split('\n').map((text: string, i: number) => (
            <p key={i}>{text}</p>
        ));
        return (
            <div key={index} className={`w-full flex flex-col gap-2 p-2 ${message.role == "assistant" ? "bg-gray-100" : ""}`}>
                <b>{message.role}</b>
                {contentArray}
            </div>
        )
    })

    const handleTranslate = async (text: string, target: string) => {
        const response = await fetch('/api/translate', {
            method: 'POST',
            body: JSON.stringify({ text, target }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return await response.json()
    }
    const handleChat = async (messages: any[]) => {
        const response = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ messages }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return await response.json()
    }

    //translated chat
    useEffect(() => {
        if (translatedMessages.length === 0) return
        if (translatedMessages[translatedMessages.length - 1].role === "assistant") return
        handleChat(translatedMessages).then(async (res) => {
            setTranslatedMessages([...translatedMessages, { role: "assistant", content: res[0] }])
            const translatedOutput = await handleTranslate(res, "en")
            setMessages([...messages, { role: "assistant", content: translatedOutput }])
        })
    }, [translatedMessages])

    //normal chat
    /* useEffect(() => {
        if (messages.length === 0) return
        if (messages[messages.length - 1].role === "assistant") return
        handleChat(messages).then(async (res) => {
            setMessages([...messages, { role: "assistant", content: res }])
        })
    }, [messages]) */


    const handleSubmitInput = async (e: any) => {
        e.preventDefault()
        setMessages([...messages, { role: "user", content: input }])
        const translatedInput = await handleTranslate(input, target)
        setTranslatedMessages([...translatedMessages, { role: "user", content: translatedInput[0] }])
        setInput("")
    }

    //debugging
    useEffect(() => {
        //console.log(messages)
        console.log(translatedMessages)
        //console.log(input)
    }, [messages, translatedMessages, input])

    return (
        <div className="w-full h-full">
            <div className="pb-28">
                {messageComponents}
            </div>
            <div className="fixed bottom-0 left-0 flex flex-col w-full p-2 gap-4 bg-gray-100 border-t-[1px] border-gray-300">
                <form onSubmit={(e) => handleSubmitInput(e)} className="flex flex-row w-full gap-4">
                    <input type="text" placeholder="Send a Message" className="px-4 w-full h-12 rounded-xl shadow-d" value={input} onChange={(e) => setInput(e.target.value)} />
                    <button type="submit" ><AiOutlineSend className="w-8 h-8 text-gray-400" /></button>
                </form>
                <p className="text-xs text-gray-500">Free research preview. Ukuhumusha will produce inaccurate information about people, places, or facts. <u>Ukuhumusha September 25 Version</u></p>
            </div>

        </div>
    )
}