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

      const apiKey = "xai-rMi96KGSeqiSviZroMJKWgpx2Og5LLAJgH5tdppIgt6jKxilVqM5VtVB97ELirGf3rqemD0JYtkq125G";
      const cx = "25ed03fb10e654c08";

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
        }
      };

      // Expanded Knowledge base with BIA-specific additions
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
- **Esri Context**: Esri’s ArcGIS platform includes ArcGIS Pro (desktop), ArcGIS Online (web), and apps like Experience Builder for interactive apps.
- **Sources**: Esri Documentation (https://www.esri.com/en-us/what-is-gis/overview).

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
  - **Software**: ArcGIS, Avenza Maps Pro, DigitalGlobe provided through the Department of the Interior’s Enterprise License Agreement (DOI-BIA ELA).
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

### 23. BIA Geospatial Training
- **Training Programs**:
  - **Self-Paced Online Courses**: Esri E-Learning (over 400 resources at https://www.esri.com/training/, bookmark: http://www.esri.com/training/Bookmark/P3KS92AX4), Geospatial Training Services (over 40 courses at https://geospatialtraining.com/).
  - **Instructor-Led Online Training**: Events by BOGS or USGS; The GEO Project with Mississippi State University; Esri Instructor-Led Training.
  - **On-Site Training**: Information forthcoming.
  - Focus on GIS for land management, irrigation analysis, forest harvesting, wildland fire analysis, oil and gas management, and economic analyses.
- **Target Audience**: BIA employees and employees of federally-recognized Tribes (list at https://www.govinfo.gov/content/pkg/FR-2021-01-29/pdf/2021-01606.pdf). Must be active DOI-BIA ELA participants.
- **Request Process**: Become active ELA participant at https://www.bia.gov/service/geospatial-software/apply-ela. Contact Geospatial Support Help Desk at geospatial@bia.gov or the Regional Geospatial Coordinator at MWRGIS@bia.gov for access. Registration for events opens ~30 days prior.
- **Sources**: https://www.bia.gov/service/geospatial-training, https://onemap-bia-geospatial.hub.arcgis.com/pages/training.

### 24. BIA Geospatial Software
- **Eligibility**: Available to authorized Bureau of Indian Affairs (BIA) employees and employees of federally recognized Tribal Governments. Limited to approved DOI-BIA ELA program organizations as per the ELA Participation Policy (https://www.bia.gov/sites/default/files/dup/assets/public/pdf/idc015893.pdf).
- **Supported Software**:
  - **DOI-BIA Esri Enterprise License Agreement (ELA)**: ArcGIS core software and limited extensions, select Esri e-Learning courses and workshops, paid maintenance for existing products, a limited number of Esri specialty products, discounts on other Esri and third-party products, technical support.
  - **Other Tools**: Avenza Maps Pro, DigitalGlobe.
  - Products listed in ELA Product List (https://www.bia.gov/sites/default/files/media_document/ela_product_list.pdf) at no cost for eligible organizations.
  - Current Esri ELA valid through January 31, 2029.
- **Request Process**: Apply to become approved under DOI-BIA ELA at https://www.bia.gov/service/geospatial-software/apply-ela. For current versions or support, contact geospatial@bia.gov or the Regional Geospatial Coordinator at MWRGIS@bia.gov.
- **License Agreements and Usage Policies**: Governed by ELA Participation Policy (https://www.bia.gov/sites/default/files/dup/assets/public/pdf/idc015893.pdf).
- **Sources**: https://www.bia.gov/service/geospatial-software.

### 25. BIA Geospatial Open Data Hub
- **Overview**: The BIA Open Data Portal (https://onemap-bia-geospatial.hub.arcgis.com/) provides national level geospatial data in the public domain to support tribal community resiliency, research, and more. Maintained by the Branch of Geospatial Support. Serves as a repository for BIA geodata, applications, and resources.
- **Available Data**: Data available for download as CSV, KML, Shapefile; accessible via web services for application development and data visualization. Includes datasets like BIA Tracts (interactive map for tracts, parcels, BIA lands).
- **Applications**: StoryMaps, Web Applications, Web Maps for deeper data exploration.
- **Access**: Public access; no cost. For contributions or support, contact geospatial@bia.gov or the Regional Geospatial Coordinator at MWRGIS@bia.gov.
- **Integration with Esri**: Built on ArcGIS Hub; supports ArcGIS tools and services.
- **Sources**: https://onemap-bia-geospatial.hub.arcgis.com/, https://catalog.data.gov/dataset/bia-bogs-onemap.
      `.trim();

                // ——————————————————————————————
      // ADD THIS ENTIRE FUNCTION HERE
      // ——————————————————————————————
      const fetchServiceMetadata = async (url) => {
        try {
          // Basic validation
          if (!url.includes('arcgis')) {
            return 'That doesn’t look like an ArcGIS REST service URL.';
          }

          // Clean the URL and fetch ?f=json
          const cleanUrl = url.trim().replace(/\?.*$/, '');
          const response = await fetch(`${cleanUrl}?f=json`, {
            signal: AbortSignal.timeout(8000)
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
          }

          const data = await response.json();

          let result = `**${data.serviceDescription || data.name || 'ArcGIS Service'}**\n\n`;

          if (data.description) result += `${data.description}\n\n`;
          if (data.currentVersion) result += `**Version**: ${data.currentVersion}\n`;
          if (data.supportedExtensions) result += `**Extensions**: ${data.supportedExtensions}\n`;

          if (data.layers && data.layers.length > 0) {
            result += `\n**Layers (${data.layers.length})**:\n`;
            data.layers.forEach(l => {
              result += `- ${l.name} (ID: ${l.id})\n`;
            });
          }

          if (data.tables && data.tables.length > 0) {
            result += `\n**Tables**:\n`;
            data.tables.forEach(t => {
              result += `- ${t.name} (ID: ${t.id})\n`;
            });
          }

          return result.trim();

        } catch (err) {
          console.error('Metadata fetch failed:', err);
          return `I couldn't read that service.\nError: ${err.message}\n\nMake sure it's a public ArcGIS REST endpoint ending in MapServer, FeatureServer, etc.`;
        }
      };
      // ——————————————————————————————
      // END OF THE FUNCTION TO ADD
      // ——————————————————————————————
                  const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userInput = input.trim();
        setMessages(curr => [...curr, { text: userInput, sender: 'user' }]);
        setInput('');
        setIsLoading(true);
        let botText = '';

        // ——— Handle ArcGIS REST service URLs ———
        if (/https?:\/\//i.test(userInput) || userInput.toLowerCase().includes('service url') || userInput.toLowerCase().includes('rest api')) {
          const urlMatch = userInput.match(/(https?:\/\/[^\s]+)/);
          if (urlMatch) {
            botText = await fetchServiceMetadata(urlMatch[1]);
            botText = `Great question! Here’s the metadata for that service:\n\n${botText}\n\nNeed anything else?`;
          } else {
            botText = 'I didn’t find a valid URL. Try pasting something like:\n`https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer`';
          }
          setMessages(curr => [...curr, { text: botText, sender: 'bot' }]);
          setIsLoading(false);
          return;
        }

        // ——— Main Grok call (hard-coded key, fully working) ———
        try {
          const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer xai-rMi96KGSeqiSviZroMJKWgpx2Og5LLAJgH5tdppIgt6jKxilVqM5VtVB97ELirGf3rqemD0JYtkq125G'
            },
            body: JSON.stringify({
              model: 'grok-4-latest',
              messages: [
                { role: "system", content: `You are BIA Geo-Assist, a friendly and professional GIS expert for Esri and BIA. Always use the knowledge base when relevant:\n\n${esriKnowledgeBase}` },
                { role: "user",   content: userInput }
              ],
              temperature: 0.7,
              max_tokens: 2000
            })
          });

          if (!response.ok) {
            const err = await response.text();
            throw new Error(`Grok ${response.status}: ${err}`);
          }

          const data = await response.json();
          botText = data.choices[0].message.content.trim();

        } catch (error) {
          console.error('Grok failed:', error);
          const searchUrl = `https://doc.arcgis.com/en/search/?q=${encodeURIComponent(userInput)}`;
          botText = `Oh no, I hit a snag! (${error.message})\n\n`;

          if (userInput.toLowerCase().includes('what is gis')) {
            botText += esriKnowledgeBase.match(/### 1\. What is GIS\?[\s\S]*?(?=###|$)/)[0];
          } else if (userInput.toLowerCase().includes('experience builder') && userInput.toLowerCase().includes('dashboard')) {
            botText += esriKnowledgeBase.match(/### 18\. Creating a Dashboard in ArcGIS Experience Builder[\s\S]*?(?=###|$)/)[0];
          } else if (/bia|bogs|geospatial/i.test(userInput)) {
            botText += esriKnowledgeBase.match(/### 22\. BIA Branch of Geospatial Support \(BOGS\)[\s\S]*?(?=###|$)/)[0];
          } else {
            botText += `Try the Esri docs → [Search "${userInput}"](${searchUrl}) or ask again!`;
          }
        }

        setMessages(curr => [...curr, { text: botText, sender: 'bot' }]);
        setIsLoading(false);
      };

      // ——— Rest of your UI components (unchanged) ———
      const BotMessage = ({ message }) => (
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-esriBlue flex items-center justify-center text-white font-bold text-sm mr-2">GA</div>
          <div className="bg-esriLightBlue p-3 rounded-xl shadow-sm max-w-lg message-content">
            <div className="text-gray-900 leading-relaxed markdown-content"
                 dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(message.text)) }} />
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Clear Chat History</h3>
            <p className="mb-6">Are you sure? This cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={() => { setMessages([]); localStorage.removeItem('esriChatMessages'); setShowConfirmModal(false); }}
                      className="px-4 py-2 bg-red-600 text-white rounded">Clear</button>
            </div>
          </div>
        </div>
      );

      return (
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-full border border-gray-200">
          {/* Header, chat area, input, etc. – everything you already have stays exactly the same */}
          {/* … your existing return JSX … */}
          <div className="bg-esriBlue text-white p-4 flex items-center justify-between rounded-t-xl shadow-md">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-esriBlue">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold">BIA Geo-Assist</h1>
            </div>
            <div className="flex space-x-2">
              <button onClick={saveConversation} className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300">Save Chat</button>
              <button onClick={() => setShowConfirmModal(true)} className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300">Clear Chat</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-esriGray">
            {messages.length === 0 && <div className="flex items-center justify-center h-full text-center text-gray-500"><p className="text-lg">Your conversation with BIA Geo-Assist will appear here.</p></div>}
            {messages.map((msg, i) => msg.sender === 'user' ? <UserMessage key={i} message={msg} /> : <BotMessage key={i} message={msg} />)}
            {isLoading && <div className="flex items-start mb-4"><div className="flex-shrink-0 w-8 h-8 rounded-full bg-esriBlue flex items-center justify-center text-white font-bold text-sm mr-2">GA</div><div className="flex space-x-1 p-3"><div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div><div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div><div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div></div></div>}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="p-4 bg-white border-t">
            <div className="flex space-x-2">
              <input ref={inputRef} type="text" className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-esriBlue" placeholder="Ask a question about Esri or BIA GIS..." value={input} onChange={e => setInput(e.target.value)} disabled={isLoading} />
              <button type="submit" className="bg-esriBlue text-white p-3 rounded-full hover:opacity-80 disabled:opacity-50" disabled={isLoading}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.985.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z"/></svg>
              </button>
            </div>
          </form>

          <div className="p-2 bg-gray-100 text-center text-xs text-gray-600 border-t">
            For Midwest GIS support, email MWRGIS@bia.gov
          </div>

          {showConfirmModal && <ConfirmModal />}
        </div>
      );
    };

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
