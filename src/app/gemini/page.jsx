// "use client";
// import {
//   GoogleGenerativeAI,
//   HarmCategory,
//   HarmBlockThreshold,
// } from "@google/generative-ai";

// const MODEL_NAME = "gemini-pro";
// const API_KEY = "AIzaSyAmSZrT436fy6pYvoxp9aSuelNbaWGv2Kw";

// import React, { useEffect } from "react";

// const Page = () => {
//   async function run() {
//     const genAI = new GoogleGenerativeAI(API_KEY);
//     const model = genAI.getGenerativeModel({ model: MODEL_NAME });

//     const generationConfig = {
//       temperature: 0.9,
//       topK: 1,
//       topP: 1,
//       maxOutputTokens: 2048,
//     };

//     const safetySettings = [
//       {
//         category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//         threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//       },
//       {
//         category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
//         threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//       },
//       {
//         category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
//         threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//       },
//       {
//         category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
//         threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//       },
//     ];

//     const parts = [
//       {
//         text: "Hii, Good morning",
//       },
//     ];

//     const result = await model.generateContent({
//       contents: [{ role: "user", parts }],
//       generationConfig,
//       safetySettings,
//     });

//     const response = result.response;
//     console.log(response.text());
//   }
//   useEffect(() => {
//     run();
//   }, []);
//   return <div>Page</div>;
// };

// export default Page;
"use client";
import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // Replace YOUR_API_KEY with your actual API key
  const API_KEY = "AIzaSyAmSZrT436fy6pYvoxp9aSuelNbaWGv2Kw";

  // Create a new Google Generative AI instance
  const genAI = new GoogleGenerativeAI(API_KEY);

  // Get the desired model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Set generation configurations
  const generationConfig = {
    temperature: 0.5,
    topK: 10,
    topP: 1,
    maxOutputTokens: 2048,
  };

  // Set safety settings
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  useEffect(() => {
    // Send an initial message to start the conversation
    const initialMessage = {
      contents: [{ role: "user", parts: [{ text: "Hello, how are you?" }] }],
      generationConfig,
      safetySettings,
    };

    // Generate the initial response
    generateResponse(initialMessage);
  }, []);

  const generateResponse = async (messageObject) => {
    setLoading(true);

    try {
      // Generate text
      const result = await model.generateContent(messageObject);

      // Get the generated response
      const response = result.response;

      // Update the state with the generated response
      setResponse(response.text());
    } catch (error) {
      console.error(error);
      alert("Sorry, there was an issue generating a response.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create the message object
    const messageObject = {
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig,
      safetySettings,
    };

    // Generate the response
    generateResponse(messageObject);

    // Clear the input field
    setMessage("");
  };

  return (
    <div className="max-w-lg mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Chat Bot</h1>
      <div className="flex flex-col space-y-4">
        {/* Render previous messages */}
        {response && (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-start">
              <div className="bg-gray-200 p-2 rounded-lg">
                <p className="text-sm">{response}</p>
              </div>
            </div>
            {/* Add more messages as needed */}
          </div>
        )}

        {/* Render user input */}
        <div className="flex items-center justify-end">
          <div className="bg-green-500 text-white p-2 rounded-lg">
            <p className="text-sm">{message}</p>
          </div>
        </div>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex mt-4">
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          className="flex-1 mr-2 py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
