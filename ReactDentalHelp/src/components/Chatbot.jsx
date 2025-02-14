import 'react-chat-widget/lib/styles.css';
import { Widget , addResponseMessage, addUserMessage} from 'react-chat-widget';
import {useEffect, useState} from 'react';
import axios from "axios";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const API_KEY =""
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

    async function processMessageToChatGPT(chatMessages){
        let apiMessages = chatMessages.map((messageObject) =>{
            let role = "";
            if(messageObject.sender === "ChatGPT"){
                role="assistant"
            }
            else{
                role = "user"
            }
            return {role:role, content: messageObject.message}
        });

        const requirements = "I want you to act like you are a dental assistant. Give short answers and respond in the language that the user addresses you." +
            "If the user asks about medical advices give him some short advice, but remind him that he always should contact a doctor." +
            "Respond just to question related to dental problems and information about the cabinet, if there is another type of question please say that you can not help." +
            "Now, there are the cabinet information: The address is: Strada Gheorghe Lazăr 12, Timisoara, the program: every monday to saturday from 7 am. to 8 pm. " +
            "The cabinet services can be find in our website." +
            " Contact information: tel: 0721321111, email: contact@denthelp.ro. For appointments use the special section from our website, or call by number."

        const systemMessage = {
            role: "system",
            content: requirements
        }

        const apiRequestBody={
            "model" : "gpt-3.5-turbo",
            "messages" : [systemMessage,
                ...apiMessages]
        }

        await fetch("https://api.openai.com/v1/chat/completions",{
            method : "POST",
            headers:{
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then((data) =>{
            return data.json();
        }).then((data) =>{
            setMessages([...chatMessages, {
                message: data.choices[0].message.content,
                sender: "ChatGPT"
            }])
            addResponseMessage(data.choices[0].message.content);
        });

    }

    const handleNewUserMessage = (newMessage) => {
        handleSend(newMessage)
    };


    return (
        <div >
            <Widget
                handleNewUserMessage={handleNewUserMessage}
                title="Asistentul virtual"
                subtitle="Cum vă putem ajuta?"
                open={isOpen}
                handleToggle={() => setIsOpen(!isOpen)}
            />
        </div>
    );
};

export default Chatbot;
