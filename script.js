// ==== script.js ====
// Your Original Code + ONLY the Endpoint Fix (November 17, 2025)

let apiKey = null;

// Load key from gemini-key.txt or prompt
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

// Full Knowledge Base – Your Original 25+ Sections (Unchanged)
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
      - Use HTML: <a href="arcgis-survey123://?itemID
