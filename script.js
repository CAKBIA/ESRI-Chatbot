    // Check for marked.js and DOMPurify availability
    if (typeof marked === 'undefined') {
      console.error('Marked.js failed to load. Falling back to plain text.');
    }
    if (typeof DOMPurify === 'undefined') {
      console.error('DOMPurify failed to load. Markdown sanitization disabled.');
    }

    const App = () => {
      const [messages, setMessages] = React.useState([]);
      const [input, setInput] = React.useState('');
      const [isLoading, setIsLoading] = React.useState(false);
      const [showConfirmModal, setShowConfirmModal] = React.useState(false);
      const messagesEndRef = React.useRef(null);
      const inputRef = React.useRef(null);
      const apiKey = "AIzaSyADvIoS1NcspmkXp3sHYrD38zhh1DlBXAM"; // Replace if invalid
      const model = "gemini-1.5-flash"; // Stable model
      const cx = "25ed03fb10e654c08"; // Replace with your Google CSE ID

      // Load stored messages or initial welcome
      React.useEffect(() => {
        try {
          const storedMessages = JSON.parse(localStorage.getItem('esriChatMessages') || '[]');
          setMessages(storedMessages.length > 0 ? storedMessages : [
            { text: 'Hello! I’m BIA Geo-Assist, your friendly GIS sidekick for Esri and BIA-related geospatial queries. Ask me anything about ArcGIS tools, BIA Branch of Geospatial Support (BOGS), or troubleshooting—I’m here to help with a smile!', sender: 'bot' }
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
            `${msg.sender === 'user' ? 'You' : 'BIA Geo-Assist'}: ${msg.text}`
          ).join('\n\n');
          const blob = new Blob([conversationText], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          a.download = `bia_geo_assist_conversation_${timestamp}.txt`;
          a.click();
          URL.revokeObjectURL(url);
        } catch (e) {
          console.error('Failed to save conversation:', e);
          alert('Sorry, there was an error saving the conversation. Please try again.');
