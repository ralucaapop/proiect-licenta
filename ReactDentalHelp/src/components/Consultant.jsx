import React, { useState } from 'react';
import axios from 'axios';
import {addResponseMessage, Widget} from "react-chat-widget";

const Consultant = () => {
    const [isOpen, setIsOpen] = useState(false);

    const [messages, setMessages] = useState([
        {
            message:"Bună ziua! Cu ce vă pot ajuta?",
            sender: "ChatGPT"
        }
    ])

    const handleSend = async (message) =>{
        const newMessage = {
            message: message,
            sender: "user"
        }

        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        console.log(newMessages)
        await processMessageToChatGPT(newMessages);
    }

    async function processMessageToChatGPT(userMessage) {
        console.log("Tipul mesajului:", typeof userMessage);
        console.log("Mesaj utilizator:", userMessage);
        try {
            const threadResponse = await fetch("https://api.openai.com/v1/threads", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "OpenAI-Beta": "assistants=v2"
                }
            });

            const threadData = await threadResponse.json();
            if (!threadData.id) throw new Error("Eroare la crearea thread-ului.");
            const threadId = threadData.id;
            console.log("Thread ID:", threadId);

            const messageResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "OpenAI-Beta": "assistants=v2"
                },
                body: JSON.stringify({
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": JSON.stringify(userMessage)
                        }
                    ]
                })
            });


            const messageData = await messageResponse.json();
            if (!messageResponse.ok) {
                console.error("Eroare OpenAI (Mesaj Thread):", messageData);
                throw new Error("Eroare la adăugarea mesajului în thread.");
            }
            console.log("Mesaj adăugat în Thread:", messageData);


            // PAS 3: Inițiază rularea (Run) asistentului
            const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "OpenAI-Beta": "assistants=v2"
                },
                body: JSON.stringify({
                    "assistant_id": "asst_TkEL4S45DnfnVkLqHAVbZw8f"
                })
            });

            const runData = await runResponse.json();
            if (!runData.id) throw new Error("Eroare la inițierea rulării.");
            const runId = runData.id;
            console.log("Run ID:", runId);

            let status = "in_progress";
            while (status !== "completed") {
                await new Promise(res => setTimeout(res, 2000)); // Așteaptă 2 secunde
                const checkResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
                    headers: {
                        "Authorization": `Bearer ${API_KEY}`,
                        "OpenAI-Beta": "assistants=v2"
                    }
                });

                const checkData = await checkResponse.json();
                status = checkData.status;
                console.log("Statusul rulării:", status);
            }

            const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "OpenAI-Beta": "assistants=v2"
                }
            });

            const messagesData = await messagesResponse.json();
            console.log("Mesaje în thread:", messagesData);

            // Găsește primul mesaj al asistentului
            const assistantMessage = messagesData.data.find(msg => msg.role === "assistant")?.content[0].text.value;

            if (assistantMessage) {
                setMessages([...messages, { message: assistantMessage, sender: "ChatGPT" }]);
                addResponseMessage(assistantMessage);
            } else {
                console.error("Nu s-a primit niciun răspuns de la asistent.");
            }

        } catch (error) {
            console.error("Eroare API OpenAI:", error);
        }
    }


    const handleNewUserMessage = (newMessage) => {
        handleSend(newMessage)
    };


    return (
        <div >
            <Widget
                handleNewUserMessage={handleNewUserMessage}
                title="Consultantul dumneavoastră virtual"
                subtitle="Cum vă pot ajuta?"
                open={true}
                handleToggle={() => setIsOpen(!isOpen)}
            />
        </div>
    );
};

export default Consultant;
