import { createContext, useState } from "react"
import runChat from "../config/gemini";
export const Context = createContext();

const ContextProvider =(props) =>{
    
    const [input,SetInput] = useState("")// Use to save the input data
    const [recentPrompt, SetRecentPrompt] = useState(""); // when we click the sent button input feild data is saved here
    const [previousPrompt,SetPreviousPrompt] = useState([]); // To store inputs and results to display in recent 
    const [showResult,SetShowResult] = useState(false); // If True - Hide the Card and display the result
    const [loading,SetLoading] = useState(false) // if True - display the loading animation
    const [resultData,SetResultData] = useState('') // To display result 
    
    const delayPara =(index,nextWord)=>{
        setTimeout(function(){
                SetResultData(prev => prev+nextWord);
        },75*index)
    }
        const newChat = () =>{
        SetLoading(false)
        SetShowResult(false)
    }

    const onSent = async (prompt) =>{
        SetResultData("")
        SetLoading(true)
        SetShowResult(true)
        let response;
        if (prompt !== undefined ){
            response = await runChat(prompt);
            SetRecentPrompt(prompt)
        }else{
            SetPreviousPrompt(prev=>[...prev,input])
            SetRecentPrompt(input)
            response = await runChat(input)
        }


       
        let responseArray = response.split("**");
        let newResponse=""; // to take the undefined 
        for (let i=0; i<responseArray.length;i++){
            // Whenever 0 or given number 
            if(i === 0 || i%2 !== 1){
                    newResponse+=responseArray[i];
            }
            // Whenever we get get the triple star - there text will become bold
            else {
                newResponse += "<b>" +responseArray[i]+"</b>";
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>")
        let newResponseArray = newResponse2.split(" ");
        for(let i=0; i<newResponseArray.length;i++){
            const nextWord = newResponseArray[i]
            delayPara(i,nextWord+" ")
        }
        SetLoading(false)
        SetInput("")
    }
    
    
    const contextValue = {
        onSent,
        previousPrompt,
        SetPreviousPrompt,
        recentPrompt,
        SetRecentPrompt,
        showResult,
        SetShowResult,
        loading,
        SetLoading,
        resultData,
        SetResultData,
        input,
        SetInput,
        newChat,
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider