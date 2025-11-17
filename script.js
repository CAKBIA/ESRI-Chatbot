// ==== script.js: Complete Chatbot Application (Final, Functional Version) ====
// Note: This script requires React, ReactDOM, Babel, marked, and DOMPurify CDNs loaded in index.html.

let apiKey = null;

// --- Utility Functions ---

/**
 * Loads API key from gemini-key.txt, localStorage, or prompts user.
 * Sets the global apiKey variable.
 */
async function loadApiKey() {
    try {
        const resp = await fetch('gemini-key.txt?' + Date.now());
        if (resp.ok) {
            apiKey = (await resp.text()).trim();
            console.log('API key loaded from gemini-key.txt');
            return;
        }
    } catch (e) { /* ignore */ }

    const saved = localStorage.getItem('geminiKey');
    if (saved && saved.startsWith('AIza')) {
        apiKey = saved;
        return;
    }

    const input = prompt('Please paste your Google Gemini API key:');
    if (input && input.startsWith('AIza')) {
        apiKey = input.trim();
        localStorage.setItem('geminiKey', apiKey);
    } else {
        alert('No valid API key – chatbot will not work.');
    }
}

// Your FULL Original Knowledge Base – Unchanged (25+ Sections)
const esriKnowledgeBase = `
## Esri GIS Technical Support Knowledge Base
### 1. What is GIS?
- **Definition**: A Geographic Information System (GIS) is a framework for capturing, storing, managing, analyzing, and visualizing spatial and geographic data. It integrates data like maps, satellite imagery, and attributes (e.g., population, temperature) to reveal patterns and trends.
- **Components**:
  - **Data**: Spatial (points, lines, polygons) and attribute data.
  - **Software**: Tools like ArcGIS Pro, ArcGIS Online, or QGIS.
  - **Hardware**: Computers or servers for GIS processing.
  - **People**: Analysts or planners who use GIS.
  - **Methods**: Techniques like buffering, overlay, or spatial statistics.
- **Examples**:
  - Mapping flood zones for emergency planning.
  - Analyzing traffic for road optimization.
  - Visualizing demographic data for urban planning.
- **Esri Context**: Esri's ArcGIS platform includes ArcGIS Pro (desktop), ArcGIS Online (web), and apps like Experience Builder for interactive apps.
- **Sources**: Esri Documentation[](https://www.esri.com/en-us/what-is-gis/overview).
### 2. Geoprocessing Tools in ArcGIS Pro
- **Analysis Toolbox**: Tools for spatial analysis, including Overlay (e.g., Union, Intersect), Proximity (e.g., Buffer, Near), and Statistics (e.g., Summary Statistics).
- **Conversion Toolbox**: Convert data formats, such as Feature Class to Shapefile, JSON to Features, or Excel to Table.
- **Data Management Toolbox**: Manage data, including creating/editing feature classes, managing domains, and appending/merging datasets.
- **Troubleshooting**: Ensure ArcGIS Pro is licensed for required toolboxes (e.g., Spatial Analyst for raster tools). Verify input data coordinate systems to avoid projection errors.
### 3. Publishing Feature Services to ArcGIS Enterprise
- **Process**:
  1. **Prepare Data**: Ensure dataset (e.g., feature class in a geodatabase) has a defined coordinate system and no unsupported data types (e.g., complex topologies).
  2. **Share as Web Layer**: In ArcGIS Pro, use **Share as Web Layer**, select **Feature** type, and choose your ArcGIS Enterprise portal.
  3. **Configure Settings**: Enable editing, querying, or syncing; set sharing permissions (e.g., organization, public).
  4. **Publish**: Analyze for errors (e.g., missing fields) and publish.
  5. **Test**: Verify service in ArcGIS Enterprise portal and add to a web map.
- **Troubleshooting**: Check portal permissions, ensure ArcGIS Data Store is configured, and validate service URL (e.g., https://yourportal.enterprise.com/server/rest/services/<service_name>/FeatureServer).
### 4. ArcGIS Enterprise Components
- **Core Components**: Portal for ArcGIS (web interface), ArcGIS Server (hosting services), ArcGIS Data Store (data management).
- **Deployment Requirements**: ArcGIS Enterprise 10.8.1 or later for compatibility with apps like Survey123 and Field Maps.
- **Common Issues**: Ensure components are on the same version. Verify firewall settings for Portal, Server, and Data Store communication.
### 5. GPS Software and Mobile Field Applications
- **Mobile Apps**:
  - **ArcGIS Field Maps**: Data collection, map viewing, and editing in the field.
  - **ArcGIS Survey123**: Form-based data collection with customizable surveys.
  - **ArcGIS QuickCapture**: Rapid data capture with minimal input.
- **Integration**: Apps integrate with ArcGIS Enterprise or ArcGIS Online feature services for real-time syncing.
### 6. Integrating ArcGIS Enterprise Point Datasets with Survey123 (via Popup)
- **Process**:
  1. **Ensure Requirements**:
      - ArcGIS Enterprise 10.8.1 or later.
      - Point dataset published as a feature service and included in the web map.
      - Survey123 form published to your ArcGIS Enterprise portal (note itemID, e.g., https://yourportal.enterprise.com/home/item.html?id=36ff9e8c13e042a58cfce4ad87f55d19).
  2. **Identify Fields (Optional)**:
      - Use a unique identifier (e.g., GUID) to link features to survey submissions.
      - Match Survey123 form field names (from XLSForm) to point dataset attributes.
  3. **Configure Popup**:
      - Open web map in Map Viewer, select point dataset layer, and configure **Pop-ups**.
      - Add a custom link: **Add content** > **Text**, e.g., "Open Survey123 Form".
      - Use URL formats:
        - Field App: arcgis-survey123://?itemID=<your_form_itemID>
        - Web App: https://survey123.arcgis.com/share/<your_form_itemID>
        - Example: arcgis-survey123://?itemID=36ff9e8c13e042a58cfce4ad87f55d19
      - Prepopulate fields: &field:<survey_field_name>={<feature_attribute>}, e.g., &field:damid={DamID}.
  4. **Test Popup**:
      - Save web map, test in Map Viewer or apps (e.g., ArcGIS Field Maps).
      - Troubleshoot: Verify itemID, field names (case-sensitive), and attribute references.
  5. **Enhance Popup (Optional)**:
      - Use HTML: <a href="arcgis-survey123://?itemID=36ff9e8c13e042a58cfce4ad87f55d19">Open Survey</a>.
      - Use Arcade for dynamic URLs or related tables.
  6. **Save and Share**:
      - Share web map with appropriate users/groups.
      - Ensure users have access to the form and field app.
  7. **Enterprise Considerations**:
      - Add portalUrl: arcgis-survey123://?itemID=<itemID>&portalUrl=https://yourportal.enterprise.com.
      - Verify user roles and permissions.
  8. **Troubleshooting**:
      - Link issues: Ensure field app is installed or use web app URL.
      - Prepopulation issues: Check field names and attributes.
      - Android/iOS: Use https://survey123.arcgis.app.
- **Example URL**: arcgis-survey123://?itemID=36ff9e8c13e042a58cfce4ad87f55d19&field:damid={DamID}&center={latitude},{longitude}
- **Sources**: Esri Community, ArcGIS Survey123 Documentation, GIS Stack Exchange.
### 7. ArcGIS Online Web Maps
- **Creating a Web Map**:
  1. Log in to ArcGIS Online, navigate to **Map** tab.
  2. Add layers (e.g., feature services, tiled layers).
  3. Configure popups, symbology, and filters.
  4. Save and share with appropriate permissions.
- **Troubleshooting**: Ensure layers share the same audience as the web map. Check for HTTP/HTTPS mixed content issues.
### 8. ArcGIS Arcade Expressions
- **Use Cases**: Dynamic popups, field calculations, or visualizations.
- **Example**: Concatenate([$feature.Name, " (", $feature.ID, ")"], "")
- **Troubleshooting**: Test in Arcade editor, ensure referenced fields exist.
### 9. General Troubleshooting Tips
- **Licensing**: Verify ArcGIS Pro or Enterprise licenses.
- **Data**: Check coordinate systems, supported data types, and valid geometries.
- **Connectivity**: Ensure ArcGIS Enterprise components are accessible.
- **Documentation**: Use Esri documentation, Esri Community, or GIS Stack Exchange.
### 10. ArcGIS Pro Overview
- **Overview**: Professional desktop GIS for data exploration, visualization, analysis, and sharing.
- **Key Features**:
  - Navigate maps with shortcuts and tools.
  - Author maps with labels, symbols, and pop-ups.
  - Geoprocessing for spatial analysis and data management.
  - Edit features (cities, roads, etc.) in 2D/3D.
- **Sources**: ArcGIS Pro Resources - Esri.
### 11. Common Troubleshooting in ArcGIS Pro
- **Licensing**: Check license level for scripting or tools.
- **Python/ArcPy**: Ensure correct Python environment.
- **Geoprocessing**: Verify coordinate systems and geometries.
- **Sources**: FME and Esri ArcGIS Troubleshooting Guide.
### 12. ArcGIS Online Overview
- **Overview**: Platform for creating and sharing interactive web maps.
- **Key Features**:
  - Smart mapping and visualization in Map Viewer.
  - Build web apps and perform spatial analysis.
- **Sources**: ArcGIS Online Resources - Esri.
### 13. ArcGIS Survey123 Details
- **Overview**: Form-centric solution for creating, sharing, and analyzing surveys.
- **Key Features**:
  - Create forms with skip logic and multiple languages.
  - Collect data offline, analyze in ArcGIS apps.
- **Sources**: ArcGIS Survey123 Resources.
### 14. ArcGIS Field Maps Details
- **Overview**: All-in-one app for field data capture, editing, and location reporting.
- **Key Features**:
  - Works online/offline, supports GNSS receivers.
  - Add tasks to maps for workflows.
- **Sources**: ArcGIS Field Maps Resources.
### 15. ArcPy Python Scripting
- **Overview**: Python package for geographic data analysis and automation.
- **Examples**: List feature classes, run Buffer tool.
- **Troubleshooting**: Check environment and license.
- **Sources**: Python in ArcGIS Pro.
### 16. Common Errors and Solutions
- **General Function Failure**: Check logs and inputs.
- **Error 999999**: Repair geometry, shorten paths, convert nulls.
- **Topology Errors**: Ensure valid geometries and snapping.
- **Sources**: Esri Community, Utility Network error IDs.
### 17. ArcGIS Experience Builder Overview
- **Overview**: Highly configurable tool for creating web apps and experiences using flexible layouts, content, and widgets that interact with 2D/3D data. No-code/low-code for dashboards, apps, etc.
- **Key Features**: Widgets (Map, Chart, Table, Embed), triggers/actions for interactivity, mobile optimization, templates (e.g., Dashboard, Blank Fullscreen).
- **Sources**: https://doc.arcgis.com/en/experience-builder/latest/get-started/what-is-arcgis-experience-builder.htm, https://developers.arcgis.com/experience-builder/.
### 18. Creating a Dashboard in ArcGIS Experience Builder
- **Process**:
  1. Log in to ArcGIS Online/Enterprise, go to Experience Builder, click **Create new**.
  2. Choose a template (e.g., Dashboard for map + charts, or Blank Scrolling for multi-sections).
  3. Add widgets: Drag Map widget and link to a web map; add Chart/Table for data viz; use Embed for external content like ArcGIS Dashboards.
  4. Configure interactivity: Use Actions tab to link widgets (e.g., select in table pans map, filters update charts).
  5. Add dynamic content: Use Text widget for indicators, or embed from ArcGIS Dashboards for advanced filtering.
  6. Optimize for mobile: Test in Live View, adjust layouts.
  7. Publish and share: Set permissions, get URL.
- **Troubleshooting**: For dynamic filtering limitations, embed ArcGIS Dashboards. Ensure data sources are shared.
- **Example**: Build a housing dashboard with Map (census tracts), Pie Chart (ownership types), and Table (details). Link selections to update views.
- **Sources**: https://doc.arcgis.com/en/experience-builder/latest/get-started/create-your-first-web-experience.htm, https://doc.arcgis.com/en/experience-builder/latest/configure-widgets/embed-widget.htm.
### 19. Common Esri FAQs and Troubleshooting
- **Licensing**: ArcGIS Pro/Online requires active licenses; check portal for concurrent/single-use. If Manage Licensing button missing, verify admin privileges.
- **Cost**: ArcGIS Online is subscription-based; check credits for usage. No cost details here—refer to Esri pricing.
- **Deployment**: Solutions like ArcGIS Solutions are free to deploy but require ArcGIS org account.
- **Errors**: Error 999999 often from invalid geometry—use Repair Geometry tool. Portal connection fails? Check site URL and firewall.
- **Access**: E-Learning via Esri Academy; some free, others require purchase or org access.
- **3D Support**: ArcGIS Knowledge supports 3D in recent versions; check for updates.
- **Sources**: https://support.esri.com/en-us/knowledge-base, https://doc.arcgis.com/en/arcgis-online/reference/faq.htm, Esri Community.
### 20. ArcGIS Dashboards Integration
- **Overview**: Complementary to Experience Builder for KPI indicators, charts, and real-time data.
- **Integration**: Create dashboard in ArcGIS Dashboards, embed URL in Experience Builder's Embed widget for hybrid apps.
- **Sources**: https://doc.arcgis.com/en/dashboards/latest/create-and-share/get-started-with-dashboards.htm.
### 21. Advanced Topics: Custom Widgets and APIs
- **Custom Widgets**: Use Developer Edition to build React/JS widgets for Experience Builder.
- **APIs**: ArcGIS REST APIs for services; ArcPy for scripting.
- **Sources**: https://developers.arcgis.com/experience-builder/guide/getting-started-widget/, https://developers.arcgis.com/rest/.
### 22. BIA Branch of Geospatial Support (BOGS)
- **Mission**: Assist Tribal governments and Indian Affairs in managing cultural and natural resources of Indian Country by providing geographic information systems (GIS) software, training, and technical support.
- **Who They Serve**: Indian Affairs (IA) and all federally-recognized Tribes; regional geospatial coordinators working with Tribes and local BIA agencies; BIA stakeholders for mapping; represent BIA to other agencies, governments, and the public with authoritative maps.
- **Services**:
  - **Software**: ArcGIS, Avenza Maps Pro, DigitalGlobe provided through the Department of the Interior's Enterprise License Agreement (DOI-BIA ELA).
  - **Training**: Programs teaching use of GIS for land management, including irrigation flood plain analysis, forest harvesting, wildland fire analysis, oil and gas management, and other economic analyses.
  - **Technical Support**: GIS technical support for Tribal governments and Indian Affairs via DOI-BIA ELA.
- **Contact**:
  - **Branch of Geospatial Support**
  - Office of Trust Services, Division of Resource Integration Services
  - Address: 13922 Denver West Parkway Building 54, Suite 300, Lakewood, CO 80401
  - Hours: 9:00 a.m. – 5:00 p.m. MDT, Monday-Friday
  - Email: geospatial@bia.gov
  - Regional Geospatial Coordinator (Midwest): MWRGIS@bia.gov
  - Website: https://www.bia.gov/bia/ots/dris/bogs
- **Open GIS Data**: Public datasets maintained and hosted by BOGS available at https://onemap-bia-geospatial.hub.arcgis.com/.
- **Esri Licenses and Resources**: Access to ArcGIS software through the DOI-BIA ELA as part of software services for Tribes and Indian Affairs; public datasets accessible via ArcGIS Hub platform.
- **Sources**: https://www.bia.gov/bia/ots/dris/bogs, https://www.bia.gov/service/geospatial-software, https://www.bia.gov/service/geospatial-training, https://onemap-bia-geospatial.hub.arcgis.com/.
### 23. BIA Geospatial Software
- **Eligibility**: Available to authorized Bureau of Indian Affairs (BIA) employees and employees of federally recognized Tribal Governments. Limited to approved DOI-BIA ELA program organizations as per the ELA Participation Policy[](https://www.bia.gov/sites/default/files/dup/assets/public/pdf/idc015893.pdf).
- **Supported Software**:
  - **DOI-BIA Esri Enterprise License Agreement (ELA)**: ArcGIS core software and limited extensions, select Esri e-Learning courses and workshops, paid maintenance for existing products, a limited number of Esri specialty products, discounts on other Esri and third-party products, technical support.
  - **Other Tools**: Avenza Maps Pro, DigitalGlobe.
  - Products listed in ELA Product List[](https://www.bia.gov/sites/default/files/media_document/ela_product_list.pdf) at no cost for eligible organizations.
  - Current Esri ELA valid through January 31, 2029.
- **Request Process**: Apply to become approved under DOI-BIA ELA at https://www.bia.gov/service/geospatial-software/apply-ela. For current versions or support, contact geospatial@bia.gov or the Regional Geospatial Coordinator at MWRGIS@bia.gov.
- **License Agreements and Usage Policies**: Governed by ELA Participation Policy[](https://www.bia.gov/sites/default/files/dup/assets/public/pdf/idc015893.pdf).
- **Sources**: https://www.bia.gov/service/geospatial-software.
### 24. BIA Geospatial Training
- **Training Programs**:
  - **Self-Paced Online Courses**: Esri E-Learning (over 400 resources at https://www.esri.com/training/, bookmark: http://www.esri.com/training/Bookmark/P3KS92AX4), Geospatial Training Services (over 40 courses at https://geospatialtraining.com/).
  - **Instructor-Led Online Training**: Events by BOGS or USGS; The GEO Project with Mississippi State University; Esri Instructor-Led Training.
  - **On-Site Training**: Information forthcoming.
  - Focus on GIS for land management, irrigation analysis, forest harvesting, wildland fire analysis, oil and gas management, and economic analyses.
- **Target Audience**: BIA employees and employees of federally-recognized Tribes (list at https://www.govinfo.gov/content/pkg/FR-2021-01-29/pdf/2021-01606.pdf). Must be active DOI-BIA ELA participants.
- **Request Process**: Become active ELA participant at https://www.bia.gov/service/geospatial-software/apply-ela. Contact Geospatial Support Help Desk at geospatial@bia.gov or the Regional Geospatial Coordinator at MWRGIS@bia.gov for access. Registration for events opens ~30 days prior.
- **Sources**: https://www.bia.gov/service/geospatial-training, https://onemap-bia-geospatial.hub.arcgis.com/pages/training.
### 25. BIA Geospatial Open Data Hub
- **Overview**: The BIA Open Data Portal[](https://onemap-bia-geospatial.hub.arcgis.com/) provides national level geospatial data in the public domain to support tribal community resiliency, research, and more. Maintained by the Branch of Geospatial Support.
- **Available Data**: Data available for download as CSV, KML, Shapefile; accessible via web services. Includes datasets like BIA Tracts.
- **Applications**: StoryMaps, Web Applications, Web Maps.
- **Access**: Public access; no cost. For contributions or support, contact geospatial@bia.gov or the Regional Geospatial Coordinator at MWRGIS@bia.gov.
- **Integration with Esri**: Built on ArcGIS Hub; supports ArcGIS tools and services.
- **Sources**: https://onemap-bia-geospatial.hub.arcgis.com/, https://catalog.data.gov/dataset/bia-bogs-onemap.
`.trim();


// --- React Components and Logic ---

/**
 * Renders the content of a bot message, converting markdown to safe HTML.
 */
const BotMessage = ({ message }) => (
    <div className="flex items-start mb-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-esriBlue flex items-center justify-center text-white font-bold text-sm mr-2">
            GA
        </div>
        <div className="bg-esriLightBlue p-3 rounded-xl shadow-sm max-w-lg message-content">
            <div
                className="text-gray-900 leading-relaxed markdown-content"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(message.text)) }}
            />
        </div>
    </div>
);

/**
 * Renders the content of a user message.
 */
const UserMessage = ({ message }) => (
    <div className="flex items-start mb-4 justify-end">
        <div className="bg-esriDarkBlue text-white p-3 rounded-xl shadow-sm max-w-lg message-content">
            <div className="leading-relaxed">{message.text}</div>
        </div>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-esriDarkBlue flex items-center justify-center text-white font-bold text-sm ml-2">
            YOU
        </div>
    </div>
);

const App = () => {
    const [messages, setMessages] = React.useState([]);
    const [input, setInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [showConfirmModal, setShowConfirmModal] = React.useState(false);
    const messagesEndRef = React.useRef(null);
    const inputRef = React.useRef(null);
    // Note: 'gemini-1.5-flash' is the stable, current model.
    const model = "gemini-1.5-flash";
    const cx = "25ed03fb10e654c08"; // Your Google CSE ID

    React.useEffect(() => { loadApiKey(); }, []);

    React.useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('esriChatMessages') || '[]');
            setMessages(stored.length > 0 ? stored : [
                { text: 'Hello! I\'m BIA Geo-Assist, your friendly GIS sidekick for Esri and BIA-related geospatial queries. Ask me anything about ArcGIS tools, BIA Branch of Geospatial Support (BOGS), or troubleshooting—I\'m here to help with a smile!', sender: 'bot' }
            ]);
        } catch (e) { console.error(e); }
    }, []);

    React.useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
    React.useEffect(() => { if (!isLoading && inputRef.current) inputRef.current.focus(); }, [isLoading]);
    React.useEffect(() => {
        try { localStorage.setItem('esriChatMessages', JSON.stringify(messages)); }
        catch (e) { console.error(e); }
    }, [messages]);

    const saveConversation = () => {
        const text = messages.map(m => `${m.sender === 'user' ? 'You' : 'BIA Geo-Assist'}: ${m.text}`).join('\n\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bia_chat_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Note: The original file had these functions defined globally and then defined again
    // inside sendMessage. I am keeping the original structure but renaming the internal
    // ones to ensure the App component has working versions.

    const fetchServiceMetadata = async (url) => {
        try {
            if (!url.includes('arcgis') || !url.match(/\/rest\/services\/[^/]+\/(MapServer|FeatureServer)/)) {
                return 'Please provide a valid ArcGIS REST service URL (e.g., ending in /MapServer or /FeatureServer).';
            }
            const response = await fetch(`${url}?f=json`, { signal: AbortSignal.timeout(5000) });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            let metadata = `**Service Metadata for:** ${data.name || data.documentInfo?.Title || 'Untitled Service'}\n\n`;
            if (data.description) metadata += `- **Description**: ${data.description}\n`;
            if (data.serviceDataType) metadata += `- **Data Type**: ${data.serviceDataType}\n`;
            if (data.layers) {
                metadata += `\n**Layers**:\n`;
                data.layers.forEach(l => metadata += `- **${l.name}** (ID: ${l.id})\n`);
            } else if (data.fields) {
                metadata += `\n**Fields**:\n`;
                data.fields.forEach(f => metadata += `- **${f.name}** (Type: ${f.type})\n`);
            } else {
                metadata += `\n*No detailed info available.*\n`;
            }
            return metadata;
        } catch (error) {
            return `Failed to retrieve metadata. Error: ${error.message}`;
        }
    };

    const fetchEsriSearchResults = async (query) => {
        const cacheKey = `esri_search_${query}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) return cached;

        try {
            const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query + ' site:doc.arcgis.com OR site:developers.arcgis.com OR site:support.esri.com OR site:community.esri.com OR site:bia.gov')}&num=5`;
            const resp = await fetch(searchUrl);
            if (!resp.ok) throw new Error(`Search API error: ${resp.status}`);
            const data = await resp.json();
            if (data.items) {
                const result = data.items.map(item => `- **${item.title}**: ${item.snippet} (Source: ${item.link})`).join('\n');
                localStorage.setItem(cacheKey, result); // Cache for 24 hours
                setTimeout(() => localStorage.removeItem(cacheKey), 24 * 60 * 60 * 1000); // Expire cache
                console.log('Search results fetched:', result);
                return result;
            }
            console.log('No search results found for:', query);
            return 'No search results found.';
        } catch (error) {
            console.error('Search failed:', error);
            return `Search failed: ${error.message}. Falling back to static knowledge.`;
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === '' || isLoading) return;
        if (!apiKey) {
            alert('API Key is not loaded. Please ensure gemini-key.txt is present or try refreshing to enter the key.');
            return;
        }

        const userInput = input.trim();
        setMessages((curr) => [...curr, { text: userInput, sender: 'user' }]);
        setInput('');
        setIsLoading(true);
        let botText = '';


        // Handle user input with personality
        if (userInput.toLowerCase().includes('service url') || userInput.toLowerCase().includes('rest api') || userInput.match(/https?:\/\//)) {
            const urlMatch = userInput.match(/https?:\/\/[^\s]+/);
            if (urlMatch) {
                // Use the metadata function defined above
                botText = await fetchServiceMetadata(urlMatch[0]); 
                botText = `Great question! Here's the scoop on that service URL: ${botText} Let me know if you need more details—I'm learning from you to get even better!`;
            } else {
                botText = 'Oops, looks like I need a valid ArcGIS service URL to work my magic! Try something like "What are the layers in this service: https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer" — I\'ll figure it out with you!';
            }
            setMessages((curr) => [...curr, { text: botText, sender: 'bot' }]);
        } else {
            try {
                // Fetch search results for advanced queries
                const searchResults = userInput.toLowerCase().includes('what is gis') ? '' : await fetchEsriSearchResults(userInput);
                const prompt = `
                    You are BIA Geo-Assist, a friendly and professional technical support assistant for Esri GIS products and BIA-related geospatial queries. Respond in a structured format with headings, bullets, examples, and sources. Add a cheerful tone, use phrases like 'great question!' or 'let's tackle this together!', and encourage follow-ups. For basic questions like 'What is GIS?', prioritize the knowledge base. For advanced or specific queries, use search results if relevant, then supplement with the knowledge base. Include BIA-specific information from the knowledge base for relevant queries (e.g., BOGS contact, software, training). Cite sources inline (e.g., Esri Documentation, BIA Website). Learn from the user's input by adapting responses based on their previous questions if applicable. Do not mention AI.
                    Online Search Results: ${searchResults}
                    Knowledge Base: ${esriKnowledgeBase}
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

                botText = await apiCall();
                setMessages((curr) => [...curr, { text: botText, sender: 'bot' }]);

            } catch (error) {
                console.error('API call failed:', error);
                const searchUrl = `https://doc.arcgis.com/en/search/?q=${encodeURIComponent(userInput)}`;
                let fallbackText = `Oh no, I hit a snag! I couldn't fetch that info (Error: ${error.message}). `;

                if (userInput.toLowerCase().includes('what is gis')) {
                    // Fallback to Knowledge Base extract (Section 1)
                    fallbackText += `But no worries, here's what I know: ${esriKnowledgeBase.match(/### 1\. What is GIS\?[\s\S]*?(?=###|$)/)[0]} Let's explore more if you'd like!`;
                } else if (userInput.toLowerCase().includes('experience builder') && userInput.toLowerCase().includes('dashboard')) {
                    // Fallback to Knowledge Base extract (Section 18)
                    fallbackText += `No problem, let's pivot! Here's the rundown: ${esriKnowledgeBase.match(/### 18\. Creating a Dashboard in ArcGIS Experience Builder[\s\S]*?(?=###|$)/)[0]} Got more questions? I'm all ears!`;
                } else if (userInput.toLowerCase().includes('bia') || userInput.toLowerCase().includes('geospatial') || userInput.toLowerCase().includes('bogs')) {
                    // Fallback to Knowledge Base extract (Section 22)
                    fallbackText += `Let's tackle this together! Here's some info from my BIA knowledge base: ${esriKnowledgeBase.match(/### 22\. BIA Branch of Geospatial Support \(BOGS\)[\s\S]*?(?=###|$)/)[0]} For more, contact geospatial@bia.gov or MWRGIS@bia.gov. Want to dive deeper?`;
                } else {
                    fallbackText += `Try checking the [Esri Documentation for "${userInput}"](${searchUrl}) or toss me a rephrased question—I'll do my best to assist!`;
                }
                botText = fallbackText;
                setMessages((curr) => [...curr, { text: botText, sender: 'bot' }]);
            }
        }
        setIsLoading(false);
    };


    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-2xl overflow-hidden">
            {/* Header */}
            <header className="p-4 bg-esriBlue text-white font-bold text-center text-xl shadow-lg flex justify-between items-center">
                <div className="w-8"></div> {/* Spacer for symmetry */}
                BIA Geo-Assist
                <button 
                    onClick={() => setShowConfirmModal(true)} 
                    className="p-1 rounded-full hover:bg-esriLightBlue transition-colors"
                    title="Clear Chat"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.937a2.25 2.25 0 01-2.244-2.077L5.052 6.555M11.22 3.31a.75.75 0 00-1.06 0L9.2 4.31a.75.75 0 000 1.06l1.04 1.04a.75.75 0 001.06 0l1.04-1.04a.75.75 0 000-1.06L11.22 3.31z" />
                    </svg>
                </button>
            </header>

            {/* Message Display Area */}
            <div
                ref={messagesEndRef}
                className="flex-grow p-4 overflow-y-auto chat-scroll-container space-y-4 bg-gray-50"
            >
                {messages.map((message, index) => (
                    message.sender === 'bot' ? (
                        <BotMessage key={index} message={message} />
                    ) : (
                        <UserMessage key={index} message={message} />
                    )
                ))}
                {isLoading && (
                    <BotMessage message={{ text: 'Thinking... I\'m cooking up a great answer for you!' }} />
                )}
            </div>

            {/* Input Field */}
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 flex bg-white">
                <input
                    type="text"
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-esriBlue"
                    placeholder={isLoading ? "Please wait for the response..." : "Ask me about GIS, BOGS, or ArcGIS troubleshooting..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    ref={inputRef}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className={`ml-3 px-4 py-2 text-white font-semibold rounded-lg transition-colors ${
                        input.trim() && !isLoading
                            ? 'bg-esriBlue hover:bg-esriLightBlue'
                            : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!input.trim() || isLoading}
                >
                    {isLoading ? 'Sending...' : 'Send'}
                </button>
            </form>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-80">
                        <h3 className="text-lg font-bold mb-4">Clear Conversation?</h3>
                        <p className="mb-6">Are you sure you want to clear the entire chat history?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setMessages([]);
                                    localStorage.removeItem('esriChatMessages');
                                    setShowConfirmModal(false);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Footer with Save Option */}
            <div className="p-2 border-t border-gray-100 flex justify-center bg-gray-50">
                <button 
                    onClick={saveConversation}
                    className="text-sm text-gray-600 hover:text-esriBlue transition-colors flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Save Chat
                </button>
            </div>
        </div>
    );
};

// --- CRITICAL: React Rendering Call ---
// This is the part that renders the component to the HTML DOM.
const container = document.getElementById('root');
if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
} else {
    console.error("The div with id='root' was not found in index.html. The application cannot render.");
}
