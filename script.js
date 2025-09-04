// Check for marked.js and DOMPurify availability
if (typeof marked === 'undefined') {
  console.error('Marked.js failed to load. Falling back to plain text.');
}
if (typeof DOMPurify === 'undefined') {
  console.error('DOMPurify failed to load. Markdown sanitization disabled.');
}

// Custom Marked.js renderer to make all links open in a new window
const renderer = {
  link(href, title, text) {
    // This is the core logic: it adds target="_blank" and the recommended
    // security attributes rel="noopener noreferrer" to every link.
    return `<a href="${href}"${title ? ` title="${title}"` : ''} target="_blank" rel="noopener noreferrer">${text}</a>`;
  }
};
// Use the custom renderer with the marked library
marked.use({ renderer });


const App = () => {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const messagesEndRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const chatContainerRef = React.useRef(null);
  const apiKey = "AIzaSyADvIoS1NcspmkXp3sHYrD38zhh1DlBXAM"; // Replace if invalid
  const model = "gemini-1.5-flash"; // Stable model
  const cx = "25ed03fb10e654c08"; // Replace with your Google CSE ID

  // Add event listener to handle link clicks
  React.useEffect(() => {
    const handleLinkClick = (event) => {
      // Check if the clicked element is an anchor tag
      if (event.target.tagName === 'A') {
        event.preventDefault(); // Prevent default navigation
        window.open(event.target.href, '_blank'); // Open link in new tab
      }
    };

    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('click', handleLinkClick);
    }

    return () => {
      if (container) {
        container.removeEventListener('click', handleLinkClick);
      }
    };
  }, []);

  // Load stored messages or initial welcome
  React.useEffect(() => {
    try {
      const storedMessages = JSON.parse(localStorage.getItem('esriChatMessages') || '[]');
      setMessages(storedMessages.length > 0 ? storedMessages : [
        { text: 'Hello! I’m ESRI-Chatbot, your friendly GIS sidekick for Esri and BIA-related geospatial queries. Ask me anything about ArcGIS tools, BIA Branch of Geospatial Support (BOGS), or troubleshooting—I’m here to help with a smile!', sender: 'bot' }
      ]);
    } catch (e) {
      console.error('Failed to load messages from localStorage:', e);
    }
  }, []);

  // Scroll to latest message
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input after loading
  React.useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  // Persist messages to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('esriChatMessages', JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save messages to localStorage:', e);
    }
  }, [messages]);

  // Function to save conversation as a text file
  const saveConversation = () => {
    try {
      const conversationText = messages.map(msg =>
        `${msg.sender === 'user' ? 'You' : 'ESRI-Chatbot'}: ${msg.text}`
      ).join('\n\n');
      const blob = new Blob([conversationText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      a.download = `esri_chatbot_conversation_${timestamp}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to save conversation:', e);
      // Replaced alert with a message box for better user experience
      setMessages((curr) => [...curr, { text: 'Sorry, there was an error saving the conversation. Please try again.', sender: 'bot' }]);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userInput = input.trim();
    setMessages((curr) => [...curr, { text: userInput, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    let botText = '';

    // Function to fetch and summarize search results
    const fetchEsriSearchResults = async (query) => {
      const cacheKey = `esri_search_${query}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) return cached;

      try {
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query + ' site:doc.arcgis.com OR site:developers.arcgis.com OR site:support.esri.com OR site:community.esri.com OR site:bia.gov')}&num=5`;
        const response = await fetch(searchUrl);
        if (!response.ok) throw new Error(`Search API error: ${response.status} ${response.statusText}`);
        const data = await response.json();
        if (data.items) {
          const result = data.items.map(item => `- **${item.title}**: ${item.snippet} (Source: ${item.link})`).join('\n');
          localStorage.setItem(cacheKey, result);
          setTimeout(() => localStorage.removeItem(cacheKey), 24 * 60 * 60 * 1000);
          return result;
        }
        return 'No search results found.';
      } catch (error) {
        console.error('Search failed:', error);
        return `Search failed: ${error.message}. Falling back to static knowledge.`;
      }
    };
    
    // Function to fetch service metadata
    const fetchServiceMetadata = async (url) => {
      try {
        if (!url.includes('arcgis') || !url.match(/\/rest\/services\/[^/]+\/(MapServer|FeatureServer)/)) {
          return 'Please provide a valid ArcGIS REST service URL (e.g., ending in /MapServer or /FeatureServer).';
        }
        const response = await fetch(`${url}?f=json`, { signal: AbortSignal.timeout(5000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const data = await response.json();

        let metadata = `**Service Metadata for:** ${data.name || data.documentInfo?.Title || 'Untitled Service'}\n\n`;
        if (data.description) metadata += `- **Description**: ${data.description}\n`;
        if (data.serviceDataType) metadata += `- **Data Type**: ${data.serviceDataType}\n`;
        if (data.layers) {
          metadata += `\n**Layers**:\n`;
          data.layers.forEach((layer) => {
            metadata += `- **${layer.name}** (ID: ${layer.id})\n`;
          });
        } else if (data.fields) {
          metadata += `\n**Fields**:\n`;
          data.fields.forEach((field) => {
            metadata += `- **${field.name}** (Type: ${field.type})\n`;
          });
        } else {
          metadata += `\n*No detailed layer or field information available.*\n`;
        }
        return metadata;
      } catch (error) {
          console.error('Failed to fetch metadata:', error);
          return `Failed to retrieve metadata for ${url}. Ensure the URL is a valid, accessible ArcGIS REST service. Error: ${error.message}`;
      }
    };

    // Exponential backoff for API calls
    const callApiWithBackoff = async (apiCall, retries = 5, delay = 1000) => {
      try {
        return await apiCall();
      } catch (error) {
        console.error('API call attempt failed:', error);
        if (retries > 0) {
          console.log(`Retrying API call, ${retries} retries left, waiting ${delay}ms`);
          await new Promise(res => setTimeout(res, delay));
          return callApiWithBackoff(apiCall, retries - 1, delay * 2);
        } else {
          throw error;
        }
      }
    };

    if (userInput.toLowerCase().includes('service url') || userInput.toLowerCase().includes('rest api') || userInput.match(/https?:\/\//)) {
      const urlMatch = userInput.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        botText = await fetchServiceMetadata(urlMatch[0]);
        botText = `Great question! Here’s the scoop on that service URL: ${botText} Let me know if you need more details—I’m learning from you to get even better!`;
      } else {
        botText = 'Oops, looks like I need a valid ArcGIS service URL to work my magic! Try something like "What are the layers in this service: https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer" — I’ll figure it out with you!';
      }
    } else {
      try {
        // Fetch search results for advanced queries
        const searchResults = await fetchEsriSearchResults(userInput);
        const prompt = `
          You are ESRI-Chatbot, a friendly and professional technical support assistant for Esri GIS products and BIA-related geospatial queries. Respond in a structured format with headings, bullets, examples, and sources. Add a cheerful tone, use phrases like 'great question!' or 'let’s tackle this together!', and encourage follow-ups. Do not mention AI.
          Online Search Results: ${searchResults}
          User Query: ${userInput}
          Previous Context: ${messages.map(m => m.text).join('\n')}
        `;
        const payload = {
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        };
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const apiCall = async () => {
          console.log('Sending API request to:', apiUrl);
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!response.ok) throw new Error(`API error: ${response.status} ${response.statusText}`);
          const result = await response.json();
          console.log('API response:', result);
          if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
            return result.candidates[0].content.parts[0].text;
          } else {
            throw new Error('No valid response received from API.');
          }
        };

        botText = await callApiWithBackoff(apiCall);
      } catch (error) {
        console.error('API call failed:', error);
        const searchUrl = `https://doc.arcgis.com/en/search/?q=${encodeURIComponent(userInput)}`;
        let fallbackText = `Oh no, I hit a snag! I couldn’t fetch that info (Error: ${error.message}). Try checking the [Esri Documentation for "${userInput}"](${searchUrl}) or toss me a rephrased question—I’ll do my best to assist!`;
        botText = fallbackText;
      }
    }

    setMessages((curr) => [...curr, { text: botText, sender: 'bot' }]);
    setIsLoading(false);
  };

  const BotMessage = ({ message }) => (
    <div className="flex items-start mb-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-esriBlue flex items-center justify-center text-white font-bold text-sm mr-2">
        EC
      </div>
      <div className="bg-esriLightBlue p-3 rounded-xl shadow-sm max-w-lg message-content">
        <div
          className="text-gray-900 leading-relaxed markdown-content"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(message.text)) }}
        />
      </div>
    </div>
  );

  const UserMessage = ({ message }) => (
    <div className="flex items-end justify-end mb-4">
      <div className="bg-esriBlue text-white p-3 rounded-xl shadow-sm max-w-lg">
        <p className="leading-relaxed">{message.text}</p>
      </div>
    </div>
  );

  const ConfirmModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto">
        <h3 className="text-lg font-semibold mb-4">Clear Chat History</h3>
        <p className="mb-6">Are you sure you want to clear the chat history? This action cannot be undone.</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowConfirmModal(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setMessages([]);
              localStorage.removeItem('esriChatMessages');
              setShowConfirmModal(false);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-all duration-200"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-full border border-gray-200">
      <div className="bg-esriBlue text-white p-4 flex items-center justify-between rounded-t-xl shadow-md">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-esriBlue">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold">ESRI-Chatbot</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={saveConversation}
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-200 rounded-md hover:bg-gray-300 transition-all duration-200"
          >
            Save Chat
          </button>
          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-200 rounded-md hover:bg-gray-300 transition-all duration-200"
          >
            Clear Chat
          </button>
        </div>
      </div>
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 bg-esriGray chat-scroll-container">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-center text-gray-500">
            <p className="text-lg">Your conversation with ESRI-Chatbot will appear here.</p>
          </div>
        )}
        {messages.map((msg, index) => (
          msg.sender === 'user' ? (
            <UserMessage key={index} message={msg} />
          ) : (
            <BotMessage key={index} message={msg} />
          )
        ))}
        {isLoading && (
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-esriBlue flex items-center justify-center text-white font-bold text-sm mr-2">
              EC
            </div>
            <div className="flex items-center space-x-1 p-3">
              <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse-dot"></div>
              <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse-dot"></div>
              <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse-dot"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-esriBlue focus:border-transparent transition-all duration-200 disabled:opacity-50"
            placeholder="Ask a question about Esri or BIA GIS..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-esriBlue text-white p-3 rounded-full shadow-md hover:bg-opacity-80 transition-all duration-200 disabled:opacity-50"
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.985.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
            </svg>
          </button>
        </div>
      </form>
      <div className="p-2 bg-gray-100 border-t border-gray-200 text-center text-xs text-gray-600">
        For Midwest GIS support, email the Regional Geospatial Coordinator, MWRGIS@bia.gov.
      </div>
      {showConfirmModal && <ConfirmModal />}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
