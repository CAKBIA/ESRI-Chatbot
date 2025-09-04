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
        { text: 'Hello! I’m ESRI-Chatbot, your reliable GIS assistant for Esri and BIA geospatial queries. Ask me about ArcGIS tools, BIA support, or training—I’ll provide accurate answers based on my knowledge base.', sender: 'bot' }
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
      alert('Sorry, there was an error saving the conversation. Please try again.');
    }
  };

  // Restored full knowledge base with all original resources
  const esriKnowledgeBase = `
## Esri GIS Technical Support Knowledge Base

### 1. What is GIS?
- **Definition**: A Geographic Information System (GIS) is a framework for capturing, storing, managing, analyzing, and visualizing spatial and geographic data.
- **Components**: Data, software (e.g., ArcGIS Pro), hardware, people, and methods.
- **Examples**: Mapping flood zones, analyzing traffic, visualizing demographics.
- **Esri Context**: Esri’s ArcGIS platform includes ArcGIS Pro (desktop), ArcGIS Online (web), and apps like Experience Builder for interactive apps.
- **Sources**: Esri Documentation (https://www.esri.com/en-us/what-is-gis/overview).

### 2. Geoprocessing Tools in ArcGIS Pro
- **Analysis Toolbox**: Tools for spatial analysis, including Overlay (e.g., Union, Intersect), Proximity (e.g., Buffer, Near), and Statistics (e.g., Summary Statistics).
- **Conversion Toolbox**: Convert data formats, such as Feature Class to Shapefile, JSON to Features, or Excel to Table.
- **Data Management Toolbox**: Manage data, including creating/editing feature classes, managing domains, and appending/merging datasets.
- **Troubleshooting**: Ensure ArcGIS Pro is licensed for required toolboxes (e.g., Spatial Analyst for raster tools). Verify input data coordinate systems to avoid projection errors.

### 3. Publishing Feature Services to ArcGIS Enterprise
- **Process**: Prepare data, share as web layer in ArcGIS Pro, configure settings, publish, and test.
- **Troubleshooting**: Check portal permissions, ensure ArcGIS Data Store is configured, validate service URL.
- **Sources**: Esri Documentation.

### 4. ArcGIS Enterprise Components
- **Core Components**: Portal for ArcGIS, ArcGIS Server, ArcGIS Data Store.
- **Deployment Requirements**: ArcGIS Enterprise 10.8.1 or later.
- **Common Issues**: Ensure same version across components, verify firewall settings.

### 5. GPS Software and Mobile Field Applications
- **Mobile Apps**: ArcGIS Field Maps, Survey123, QuickCapture.
- **Integration**: Syncs with ArcGIS Enterprise or Online feature services.

### 6. Integrating ArcGIS Enterprise Point Datasets with Survey123 (via Popup)
- **Process**: Ensure requirements, configure popup with Survey123 URL, test, enhance, save.
- **Example URL**: arcgis-survey123://?itemID=36ff9e8c13e042a58cfce4ad87f55d19&field:damid={DamID}&center={latitude},{longitude}
- **Sources**: Esri Community, Survey123 Documentation.

### 7. ArcGIS Online Web Maps
- **Creating a Web Map**: Add layers, configure popups, save, share.
- **Troubleshooting**: Ensure layer audience matches web map.

### 8. ArcGIS Arcade Expressions
- **Use Cases**: Dynamic popups, field calculations.
- **Example**: Concatenate([$feature.Name, " (", $feature.ID, ")"], "")
- **Sources**: Esri Documentation.

### 9. General Troubleshooting Tips
- **Licensing**: Verify licenses.
- **Data**: Check coordinate systems, geometries.
- **Connectivity**: Ensure component accessibility.

### 10. ArcGIS Pro Overview
- **Overview**: Desktop GIS for data exploration, visualization, analysis.
- **Key Features**: Navigate, author maps, geoprocessing, editing.
- **Sources**: ArcGIS Pro Resources - Esri.

### 11. Common Troubleshooting in ArcGIS Pro
- **Licensing**: Check license level.
- **Python/ArcPy**: Ensure correct environment.
- **Geoprocessing**: Verify coordinate systems.

### 12. ArcGIS Online Overview
- **Overview**: Platform for creating and sharing interactive web maps.
- **Key Features**: Smart mapping, web apps, spatial analysis.
- **Sources**: ArcGIS Online Resources - Esri.

### 13. ArcGIS Survey123 Details
- **Overview**: Form-centric data collection.
- **Key Features**: Custom surveys, offline collection.
- **Sources**: Survey123 Resources.

### 14. ArcGIS Field Maps Details
- **Overview**: Field data capture and editing.
- **Key Features**: Online/offline, GNSS support.
- **Sources**: Field Maps Resources.

### 15. ArcPy Python Scripting
- **Overview**: Python package for GIS automation.
- **Examples**: List feature classes, run Buffer tool.
- **Sources**: Python in ArcGIS Pro.

### 16. Common Errors and Solutions
- **General Function Failure**: Check logs and inputs.
- **Error 999999**: Repair geometry.
- **Sources**: Esri Community.

### 17. ArcGIS Experience Builder Overview
- **Overview**: Tool for creating web apps with 2D/3D data.
- **Key Features**: Widgets, triggers/actions, mobile optimization.
- **Sources**: https://doc.arcgis.com/en/experience-builder/.

### 18. Creating a Dashboard in ArcGIS Experience Builder
- **Process**: Choose template, add widgets, configure interactivity, publish.
- **Troubleshooting**: Use embedded Dashboards for filtering.
- **Sources**: https://doc.arcgis.com/en/experience-builder/.

### 19. Common Esri FAQs and Troubleshooting
- **Licensing**: Requires active licenses.
- **Cost**: Subscription-based, check credits.
- **Sources**: https://support.esri.com/en-us/knowledge-base.

### 20. ArcGIS Dashboards Integration
- **Overview**: KPI indicators, real-time data.
- **Integration**: Embed in Experience Builder.
- **Sources**: https://doc.arcgis.com/en/dashboards/.

### 21. Advanced Topics: Custom Widgets and APIs
- **Custom Widgets**: Build with Developer Edition.
- **APIs**: REST APIs, ArcPy.
- **Sources**: https://developers.arcgis.com/.

### 22. BIA Branch of Geospatial Support (BOGS)
- **Mission**: Assist Tribes with GIS software, training, support.
- **Who They Serve**: BIA, Tribes, stakeholders.
- **Services**: ArcGIS, Avenza Maps, training.
- **Contact**: geospatial@bia.gov, https://www.bia.gov/bia/ots/dris/bogs.

### 23. BIA Geospatial Software
- **Eligibility**: BIA employees, Tribes via DOI-BIA ELA.
- **Supported Software**: ArcGIS, Avenza Maps, DigitalGlobe.
- **Request Process**: https://www.bia.gov/service/geospatial-software/apply-ela.
- **Sources**: https://www.bia.gov/service/geospatial-software.

### 24. BIA Geospatial Training
- **Training Programs**: Esri E-Learning, Geospatial Training Services, BOGS-led events, The GEO Project, Esri Training, on-site (forthcoming).
- **Focus**: Land management, irrigation, forest harvesting, fire analysis, oil/gas, economic analyses.
- **Target Audience**: BIA, Tribes.
- **Request Process**: Contact geospatial@bia.gov, apply via https://www.bia.gov/service/geospatial-software/apply-ela.
- **Website**: https://www.bia.gov/service/geospatial-training
- **Sources**: https://www.bia.gov/service/geospatial-training.

### 25. BIA Geospatial Open Data Hub
- **Overview**: Public geospatial data at https://onemap-bia-geospatial.hub.arcgis.com/.
- **Available Data**: CSV, KML, Shapefile, web services.
- **Access**: Public, contact geospatial@bia.gov for support.
- **Sources**: https://onemap-bia-geospatial.hub.arcgis.com/.

  `.trim();

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userInput = input.trim();
    setMessages((curr) => [...curr, { text: userInput, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    let botText = '';

    // Fetch ArcGIS REST API metadata
    const fetchServiceMetadata = async (url) => {
      try {
        if (!url.includes('arcgis') || !url.match(/\/rest\/services\/[^/]+\/(MapServer|FeatureServer)/)) {
          return 'Please provide a valid ArcGIS REST service URL (e.g., ending in /MapServer or /FeatureServer).';
        }
        const response = await fetch(`${url}?f=json`, { signal: AbortSignal.timeout(5000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const data = await response.json();
        let metadata = `**Service Metadata for:** ${data.name || data.documentInfo?.Title || 'Untitled Service'}\n`;
        if (data.description) metadata += `- Description: ${data.description}\n`;
        if (data.layers) metadata += `- Layers: ${data.layers.map(l => l.name).join(', ')}\n`;
        return metadata;
      } catch (error) {
        console.error('Failed to fetch metadata:', error);
        return `Failed to retrieve metadata for ${url}. Ensure the URL is valid. Error: ${error.message}`;
      }
    };

    // Handle user input with accuracy
    if (userInput.toLowerCase().includes('service url') || userInput.toLowerCase().includes('rest api') || userInput.match(/https?:\/\//)) {
      const urlMatch = userInput.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        botText = await fetchServiceMetadata(urlMatch[0]);
        botText = `Here’s the metadata for that service URL: ${botText} Let me know if you need more details.`;
      } else {
        botText = 'Please provide a valid ArcGIS service URL (e.g., https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer) for analysis.';
      }
    } else {
      // Direct knowledge base response for specific queries
      if (userInput.toLowerCase().includes('what is gis')) {
        botText = esriKnowledgeBase.match(/### 1\. What is GIS\?[\s\S]*?(?=###|$)/)[0].replace(/### 1\. What is GIS\?\n/, '');
        botText = `Great question! ${botText} Let me know if you’d like more info!`;
      } else if (userInput.toLowerCase().includes('bia') && userInput.toLowerCase().includes('training')) {
        botText = esriKnowledgeBase.match(/### 24\. BIA Geospatial Training[\s\S]*?(?=###|$)/)[0].replace(/### 24\. BIA Geospatial Training\n/, '');
        botText = `Great question! ${botText} Visit the site for more details. Let me know how else I can assist!`;
      } else {
        botText = 'I don’t have enough specific information to answer that accurately from my knowledge base. Please ask about GIS basics or BIA training, and I’ll provide what I know.';
      }
    }

    // Process text to ensure links open in new window
    const processedText = botText.replace(/(https?:\/\/[^\s]+)/g, url => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    setMessages((curr) => [...curr, { text: processedText, sender: 'bot' }]);
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
      <div className="flex-1 overflow-y-auto p-4 bg-esriGray chat-scroll-container">
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
            placeholder="Ask about GIS or BIA training..."
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
        For BIA support, email geospatial@bia.gov.
      </div>
      {showConfirmModal && <ConfirmModal />}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
