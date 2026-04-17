/* ============================================
   WEEKLY WEATHER BULLETIN GENERATOR
   JavaScript Functionality
   ============================================ */

// Global variables to store parsed data
let parsedData = {
  dates: [],
  weatherSystems: {},
  rainfall: {},
  temperatures: {
    max: [],
    min: [],
  },
  spatialDistribution: {},
};

let uploadedFiles = [];
let uploadedImageData = null;
let weekEndingDate = null;
let selectedCells = new Set();
let isDragging = false;
let dragToggleMode = null;

// Station to District mapping (Based on District_Station_Hindi.csv)
const stationDistrictMap = {
  पटना: "पटना",
  गयाजी: "गयाजी",
  भागलपुर: "भागलपुर",
  पूर्णिया: "पूर्णिया",
  "वाल्मीकि नगर": "पश्चिम चम्पारण",
  मुजफ्फरपुर: "मुजफ्फरपुर",
  छपरा: "सारण",
  दरभंगा: "दरभंगा",
  सुपौल: "सुपौल",
  फॉरबिसगंज: "अररिया",
  सबौर: "भागलपुर",
  डेहरी: "रोहतास",
  मधुबनी: "मधुबनी",
  मोतिहारी: "पूर्वी चम्पारण",
  शेखपुरा: "शेखपुरा",
  गोपालगंज: "गोपालगंज",
  मधेपुरा: "मधेपुरा",
  जमुई: "जमुई",
  बक्सर: "बक्सर",
  शिवहर: "शिवहर",
  भोजपुर: "भोजपुर",
  समस्तीपुर: "समस्तीपुर",
  वैशाली: "वैशाली",
  पुपरी: "सीतामढ़ी",
  औरंगाबाद: "औरंगाबाद",
  बेगूसराय: "बेगूसराय",
  खगड़िया: "खगड़िया",
  बांका: "बांका",
  कटिहार: "कटिहार",
  नवादा: "नवादा",
  राजगीर: "नालंदा",
  अररिया: "अररिया",
  जीरादेई: "सिवान",
  पूसा: "समस्तीपुर",
  अगवानपुर: "सहरसा",
  किशनगंज: "किशनगंज",
  कैमूर: "कैमूर",
  अरवल: "अरवल",
  बिक्रमगंज: "रोहतास",
  मुंगेर: "मुंगेर",
  जहानाबाद: "जहानाबाद",
  भभुआ: "कैमूर",
  भभूआ: "कैमूर",
  वाल्मीकि: "पश्चिम चम्पारण",
  वाल्मीकि_नगर: "पश्चिम चम्पारण",
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  initializeEventListeners();
  updateLegend();

  // Set default date to the next Monday
  const today = new Date();
  const day = today.getDay(); // 0=Sun, 1=Mon, ...
  let daysUntilMonday = 1 - day;
  if (daysUntilMonday <= 0) {
    daysUntilMonday += 7;
  }
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilMonday);
  document.getElementById("weekEndingDate").valueAsDate = nextMonday;

  calculateWeekDates();
  updateBulkEditPanel();
  loadEmployeeSignatures();
});

function initializeEventListeners() {
  // File upload handlers
  document
    .getElementById("mapUpload")
    .addEventListener("change", handleImageUpload);
  document
    .getElementById("bulletinFiles")
    .addEventListener("change", handleFileUpload);

  // Color picker change handlers
  const colorPickers = document.querySelectorAll(".color-picker");
  colorPickers.forEach((picker) => {
    picker.addEventListener("change", updateLegend);
  });

  // Multi-select handlers for spatial table
  setupMultiSelectHandlers();
}

// ============================================
// DATE SELECTION FUNCTIONS
// ============================================

function calculateWeekDates() {
  const dateInput = document.getElementById("weekEndingDate").value;
  if (!dateInput) return;

  const issueDate = new Date(dateInput);
  weekEndingDate = issueDate; // Keep global variable for compatibility

  const reportEndDate = new Date(issueDate);
  reportEndDate.setDate(issueDate.getDate() - 1);

  const reportStartDate = new Date(reportEndDate);
  reportStartDate.setDate(reportEndDate.getDate() - 6);

  // Format dates
  const formatDateHindi = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const startStr = formatDateHindi(reportStartDate);
  const endStr = formatDateHindi(reportEndDate);
  const issueStr = formatDateHindi(issueDate);

  // Update week info display
  const weekInfo = document.getElementById("weekInfo");
  weekInfo.innerHTML = `
        <p class="week-period">Week Period: ${startStr} to ${endStr}</p>
        <p class="week-hindi">सप्ताह: ${startStr} से ${endStr} तक</p>
        <p style="margin-top: 10px; color: #e53e3e; font-size: 0.9rem;">⚠️ Please upload daily bulletins for dates: ${startStr} to ${endStr}</p>
    `;

  // Update preview header
  const issueDateEl = document.getElementById("issueDate");
  if (issueDateEl)
    issueDateEl.textContent = `जारी करने की तिथि/ Date of Issue: ${issueStr}`;

  const hindiTitle1 = document.getElementById("hindiTitleLine1");
  if (hindiTitle1)
    hindiTitle1.textContent = `${endStr} को समाप्त सप्ताह के दौरान साप्ताहिक मौसम रिपोर्ट`;

  const hindiTitle2 = document.getElementById("hindiTitleLine2");
  if (hindiTitle2)
    hindiTitle2.textContent = `(${startStr} से ${endStr} तक की अवधि के लिए)`;

  const englishTitle1 = document.getElementById("englishTitleLine1");
  if (englishTitle1)
    englishTitle1.textContent = `WEEKLY WEATHER REPORT DURING THE WEEK ENDING ON ${endStr}`;

  const englishTitle2 = document.getElementById("englishTitleLine2");
  if (englishTitle2)
    englishTitle2.textContent = `(for the period ${startStr} से ${endStr})`;

  // Generate default spatial distribution table
  generateDefaultSpatialTable(startStr, endStr);
}

function generateDefaultSpatialTable(startDate, endDate) {
  const tbody = document.getElementById("editableSpatialTableBody");
  tbody.innerHTML = "";

  // Parse dates
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = formatDateForTable(d);
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="date-cell">${dateStr}</td>
            <td class="editable-cell" data-date="${dateStr}" data-sector="NORTH CENTRAL">DRY</td>
            <td class="editable-cell" data-date="${dateStr}" data-sector="NORTH EAST">DRY</td>
            <td class="editable-cell" data-date="${dateStr}" data-sector="NORTH WEST">DRY</td>
            <td class="editable-cell" data-date="${dateStr}" data-sector="SOUTH CENTRAL">DRY</td>
            <td class="editable-cell" data-date="${dateStr}" data-sector="SOUTH EAST">DRY</td>
            <td class="editable-cell" data-date="${dateStr}" data-sector="SOUTH WEST">DRY</td>
        `;
    tbody.appendChild(row);
  }

  // Apply colors to cells
  updateSpatialTableColors();
}

function parseDate(dateStr) {
  const parts = dateStr.split(".");
  return new Date(parts[2], parts[1] - 1, parts[0]);
}

function formatDateForTable(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// ============================================
// MULTI-SELECT SPATIAL TABLE
// ============================================

function setupMultiSelectHandlers() {
  const table = document.getElementById("editableSpatialTable");
  let isTableHovered = false;

  if (table) {
    table.addEventListener("mouseenter", () => (isTableHovered = true));
    table.addEventListener("mouseleave", () => (isTableHovered = false));
  }

  // Add keyboard shortcut for Ctrl+A to select all cells
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
      const isInput =
        e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA";
      if (
        !isInput &&
        (isTableHovered ||
          selectedCells.size > 0 ||
          e.target.closest(".spatial-table"))
      ) {
        e.preventDefault();
        selectAllCells();
      }
    }
  });

  const tbody = document.getElementById("editableSpatialTableBody");
  if (!tbody) return;

  // Mouse down: start dragging and select/deselect first cell
  tbody.addEventListener("mousedown", function (e) {
    if (
      e.target.tagName.toLowerCase() === "select" ||
      e.target.tagName.toLowerCase() === "option"
    ) {
      return; // allow interacting with dropdown directly
    }

    const cell = e.target.closest(".editable-cell");
    if (!cell) return;
    if (e.button !== 0) return; // Only left click

    isDragging = true;
    e.preventDefault(); // Prevent text selection while dragging

    const multiSelectCheckbox = document.getElementById("enableMultiSelect");
    const isMultiSelectEnabled =
      multiSelectCheckbox && multiSelectCheckbox.checked;
    const cellKey = `${cell.dataset.date}-${cell.dataset.sector}`;

    if (selectedCells.has(cellKey)) {
      if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !isMultiSelectEnabled) {
        clearCellSelection();
        selectedCells.add(cellKey);
        cell.classList.add("selected-cell");
        dragToggleMode = "select";
      } else {
        selectedCells.delete(cellKey);
        cell.classList.remove("selected-cell");
        dragToggleMode = "deselect";
      }
    } else {
      if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !isMultiSelectEnabled) {
        clearCellSelection();
      }
      selectedCells.add(cellKey);
      cell.classList.add("selected-cell");
      dragToggleMode = "select";
    }
    updateBulkEditPanel();
  });

  // Mouse over: continue selecting/deselecting while dragging
  tbody.addEventListener("mouseover", function (e) {
    if (!isDragging) return;
    const cell = e.target.closest(".editable-cell");
    if (!cell) return;

    const cellKey = `${cell.dataset.date}-${cell.dataset.sector}`;
    if (dragToggleMode === "select") {
      selectedCells.add(cellKey);
      cell.classList.add("selected-cell");
    } else if (dragToggleMode === "deselect") {
      selectedCells.delete(cellKey);
      cell.classList.remove("selected-cell");
    }
    updateBulkEditPanel();
  });

  // Mouse up: stop dragging
  document.addEventListener("mouseup", function () {
    if (isDragging) {
      isDragging = false;
      dragToggleMode = null;
    }
  });

  // Double click to edit a single cell inline
  tbody.addEventListener("dblclick", function (e) {
    const cell = e.target.closest(".editable-cell");
    if (cell) {
      editCell(cell);
    }
  });
}

function clearCellSelection() {
  selectedCells.clear();
  document.querySelectorAll(".editable-cell").forEach((cell) => {
    cell.classList.remove("selected-cell");
  });
  updateBulkEditPanel();
}

function selectAllCells() {
  document.querySelectorAll(".editable-cell").forEach((cell) => {
    const cellKey = `${cell.dataset.date}-${cell.dataset.sector}`;
    selectedCells.add(cellKey);
    cell.classList.add("selected-cell");
  });
  updateBulkEditPanel();
}

function updateBulkEditPanel() {
  const panel = document.getElementById("bulkEditPanel");
  if (!panel) return;

  panel.style.display = "block";
  document.getElementById("bulkEditCount").textContent =
    `${selectedCells.size} cells selected`;

  const select = document.getElementById("bulkValueSelect");
  let optionsHTML = '<option value="">Select Value...</option>';
  const options = getDistributionOptions();

  for (const key in options) {
    const option = options[key];
    const textColor = getContrastColor(option.color);
    const label = getDistributionLabel(key);
    optionsHTML += `<option value="${key}" style="background-color: ${option.color}; color: ${textColor};">${option.text} - ${label}</option>`;
  }
  select.innerHTML = optionsHTML;
}

function applyBulkValue() {
  const select = document.getElementById("bulkValueSelect");
  const value = select.value;

  if (selectedCells.size === 0) {
    showNotification("Please select at least one cell first!", "warning");
    return;
  }

  if (!value) {
    showNotification("Please select a value first!", "warning");
    return;
  }

  const text = getDistributionText(value);
  const color = getDistributionColor(value);
  const textColor = getContrastColor(color);

  document.querySelectorAll(".editable-cell").forEach((cell) => {
    const cellKey = `${cell.dataset.date}-${cell.dataset.sector}`;
    if (selectedCells.has(cellKey)) {
      cell.textContent = text;
      cell.style.backgroundColor = color;
      cell.style.color = textColor;
    }
  });

  // Update preview
  updatePreviewSpatialTable();

  // Clear selection
  clearCellSelection();

  showNotification(
    `Applied ${text} to ${selectedCells.size} cells!`,
    "success",
  );
}

// Also allow single cell edit on double click
function editCell(cell) {
  const currentValue = cell.textContent.trim();
  const options = [
    "DRY",
    "ISOL",
    "SCATTERED",
    "FAIRLY WIDESPREAD",
    "WIDESPREAD",
  ];

  // Find current option
  let currentOption = "DRY";
  for (let opt of options) {
    if (getDistributionText(opt) === currentValue || opt === currentValue) {
      currentOption = opt;
      break;
    }
  }

  // Create select element
  const select = document.createElement("select");
  select.style.cssText =
    "width: 100%; padding: 5px; border: none; background: transparent; font-weight: bold; cursor: pointer; text-align: center;";

  options.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = getDistributionText(opt);
    if (opt === currentOption) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  // Handle change
  select.onchange = function () {
    cell.textContent = getDistributionText(this.value);
    updateCellColor(cell, this.value);
    updatePreviewSpatialTable();
  };

  // Handle blur
  select.onblur = function () {
    cell.textContent = getDistributionText(this.value);
    updateCellColor(cell, this.value);
    updatePreviewSpatialTable();
  };

  cell.innerHTML = "";
  cell.appendChild(select);
  select.focus();
}

function updateCellColor(cell, value) {
  const color = getDistributionColor(value);
  const textColor = getContrastColor(color);
  cell.style.backgroundColor = color;
  cell.style.color = textColor;
}

function updateSpatialTableColors() {
  const cells = document.querySelectorAll(".editable-cell");
  cells.forEach((cell) => {
    const value =
      Object.keys(getDistributionOptions()).find(
        (key) => getDistributionText(key) === cell.textContent.trim(),
      ) || "DRY";
    updateCellColor(cell, value);
  });
}

function updatePreviewSpatialTable() {
  const editableRows = document.querySelectorAll(
    "#editableSpatialTableBody tr",
  );
  const previewBody = document.getElementById("spatialTableBody");
  previewBody.innerHTML = "";

  editableRows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    const newRow = document.createElement("tr");

    cells.forEach((cell, index) => {
      const newCell = document.createElement("td");
      newCell.textContent = cell.textContent;

      if (index > 0) {
        const value =
          Object.keys(getDistributionOptions()).find(
            (key) => getDistributionText(key) === cell.textContent.trim(),
          ) || "DRY";
        const color = getDistributionColor(value);
        const textColor = getContrastColor(color);
        newCell.style.backgroundColor = color;
        newCell.style.color = textColor;
        newCell.style.fontWeight = "bold";
      }

      newRow.appendChild(newCell);
    });

    previewBody.appendChild(newRow);
  });
}

// ============================================
// FILE UPLOAD AND PARSING
// ============================================

function handleFileUpload(event) {
  const files = Array.from(event.target.files);

  files.forEach((file) => {
    const fileType = file.name.toLowerCase().endsWith(".pdf") ? "pdf" : "word";
    uploadedFiles.push({
      file: file,
      type: fileType,
      extractedText: "",
    });
  });

  updateFileList();
  showNotification(
    `${files.length} file(s) selected. Click "Extract & Parse Files" to process.`,
    "info",
  );
}

function updateFileList() {
  const list = document.getElementById("uploadedFilesList");
  list.innerHTML = "";

  uploadedFiles.forEach((fileObj, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <span class="file-name">${fileObj.file.name}</span>
            <span class="file-type ${fileObj.type}">${fileObj.type.toUpperCase()}</span>
            <button onclick="removeFile(${index})" style="margin-left: 10px; padding: 2px 8px; background: #e53e3e; color: white; border: none; border-radius: 4px; cursor: pointer;">×</button>
        `;
    list.appendChild(li);
  });
}

function removeFile(index) {
  uploadedFiles.splice(index, 1);
  updateFileList();
}

function clearFiles() {
  uploadedFiles = [];
  document.getElementById("bulletinFiles").value = "";
  updateFileList();
  showNotification("All files cleared!", "info");
}

async function extractAndParseFiles() {
  if (uploadedFiles.length === 0) {
    showNotification("Please upload files first!", "warning");
    return;
  }

  document.getElementById("loadingOverlay").style.display = "flex";
  document.getElementById("loadingText").textContent =
    "Extracting text from files...";

  try {
    let combinedText = "";

    for (let fileObj of uploadedFiles) {
      const text = await extractTextFromFile(fileObj.file);
      fileObj.extractedText = text;
      combinedText += "\n\n" + text;
    }

    // Put extracted text in textarea
    document.getElementById("bulletinInput").value = combinedText.trim();

    // Parse the data
    parseData();

    showNotification("Files extracted and parsed successfully!", "success");
  } catch (error) {
    console.error("Extraction error:", error);
    showNotification(
      "Error extracting files. Please try manual paste.",
      "error",
    );
  } finally {
    document.getElementById("loadingOverlay").style.display = "none";
  }
}

async function extractTextFromFile(file) {
  const fileType = file.name.toLowerCase();

  if (fileType.endsWith(".pdf")) {
    return await extractTextFromPDF(file);
  } else if (fileType.endsWith(".doc") || fileType.endsWith(".docx")) {
    return await extractTextFromWord(file);
  }

  throw new Error("Unsupported file type");
}

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    text += textContent.items.map((item) => item.str).join(" ") + "\n";
  }

  return text;
}

async function extractTextFromWord(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
  return result.value;
}

// ============================================
// SAMPLE DATA LOADER
// ============================================

function loadSampleData() {
  const sampleData = `DATE: 23.03.2026
TIME OF ISSUE: 12:45 HRS IST

पिछले 24 घंटों का राज्य में दर्ज किया गया मौसम सारांश:-

अधिकतम तापमान :  
 सर्वाधिक अधिकतम तापमान 35.5°C (22.03.2026) बिक्रमगंज (रोहतास) में दर्ज किया गया ।

न्यूनतम तापमान :
 सबसे कम न्यूनतम तापमान 16.5°C (23.03.2026) जीरादेई (सिवान) में दर्ज किया गया।

हवा का बहाव : पश्चिमी 10-15 kmph

वर्षा की मुख्य मात्रा (मिमी में):– NIL

बिहार राज्य से संबंधित आज की संक्षिप्त मौसम प्रणाली:-
 उत्तर-पश्चिमी भारत पर एक पश्चिमी विक्षोभ (Western Disturbance) ऊपरी वायुमंडलीय चक्रवातीय परिसंचरण (upper air cyclonic circulation) के रूप में अब जम्मू और उसके आसपास समुद्र तल से 3.1 किमी ऊपर स्थित है।

DATE: 24.03.2026
TIME OF ISSUE: 12:30 HRS IST

पिछले 24 घंटों का राज्य में दर्ज किया गया मौसम सारांश:-

अधिकतम तापमान :  
 सर्वाधिक अधिकतम तापमान 36.2°C (23.03.2026) बिक्रमगंज (रोहतास) में दर्ज किया गया ।

न्यूनतम तापमान :
 सबसे कम न्यूनतम तापमान 15.8°C (24.03.2026) जीरादेई (सिवान) में दर्ज किया गया।

हवा का बहाव : दक्षिण-पश्चिमी 08-12 kmph

वर्षा की मुख्य मात्रा (मिमी में):– इसोपुर-0.9, भभुआ-0.8, डुमरांव-0.4

बिहार राज्य से संबंधित आज की संक्षिप्त मौसम प्रणाली:-
 मध्य प्रदेश के मध्य भागों के ऊपर, समुद्र तल से 0.9km की ऊँचाई पर बना ऊपरी वायुमंडलीय चक्रवातीय परिसंचरण अभी भी बना हुआ है।

DATE: 25.03.2026
TIME OF ISSUE: 12:45 HRS IST

पिछले 24 घंटों का राज्य में दर्ज किया गया मौसम सारांश:-

अधिकतम तापमान :  
 सर्वाधिक अधिकतम तापमान 35.7°C (24.03.2026) कैमूर में दर्ज किया गया ।

न्यूनतम तापमान :
 सबसे कम न्यूनतम तापमान 16.1°C (25.03.2026) जीरादेई (सिवान) में दर्ज किया गया।

हवा का बहाव : 48 किलोमीटर/घंटा तक की तेज हवाएं किशनगंज जिले मे दर्ज की गई।

वर्षा की मुख्य मात्रा (मिमी में):– THAKURGANJ 18.0, POTHIA 0.8

बिहार राज्य से संबंधित आज की संक्षिप्त मौसम प्रणाली:-
 एक नया पश्चिमी विक्षोभ चक्रवाती परिसंचरण के रूप में उत्तरी पाकिस्तान एवं उससे सटे अफगानिस्तान पर स्थित है, जो औसत समुद्र तल से 3.1 किमी से 5.8 किमी के बीच विस्तृत है।`;

  document.getElementById("bulletinInput").value = sampleData;
  showNotification("Sample data loaded successfully!", "success");
}

// ============================================
// DATA PARSING FUNCTIONS
// ============================================

function clearInput() {
  document.getElementById("bulletinInput").value = "";
  resetPreview();
  showNotification("Input cleared!", "info");
}

function parseData() {
  const input = document.getElementById("bulletinInput").value.trim();

  if (!input) {
    showNotification("Please paste bulletin data first!", "warning");
    return;
  }

  // Reset parsed data
  parsedData = {
    dates: [],
    weatherSystems: {},
    rainfall: {},
    temperatures: {
      max: [],
      min: [],
    },
    spatialDistribution: {},
  };

  // Split by DATE: marker - handle various formats
  const dayBlocks = input.split(/DATE:\s*/i).filter((block) => block.trim());

  dayBlocks.forEach((block) => {
    parseDayBlock(block);
  });

  // Update UI
  updatePreview();
  showNotification(
    `Parsed ${parsedData.dates.length} days of data successfully!`,
    "success",
  );
}

function parseDayBlock(block) {
  // Normalize line breaks and clean up
  const normalizedBlock = block
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/\x00/g, "") // Remove null bytes
    .replace(/\x0B/g, "") // Remove vertical tabs
    .replace(/\x0C/g, ""); // Remove form feeds

  const lines = normalizedBlock
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);

  if (lines.length === 0) return;

  // Extract date - handle various formats
  const dateMatch = lines[0].match(/(\d{2})[./](\d{2})[./](\d{4})/);
  if (!dateMatch) return;

  const date = dateMatch[0];
  const formattedDate = formatDate(date);
  parsedData.dates.push(formattedDate);

  const content = normalizedBlock;

  // Parse weather system
  parseWeatherSystem(formattedDate, content);

  // Parse rainfall
  parseRainfall(formattedDate, content);

  // Parse temperatures
  parseTemperatures(formattedDate, content);

  // Parse wind
  parseWind(formattedDate, content);
}

function formatDate(dateStr) {
  const parts = dateStr.split(/[./]/);
  if (parts.length === 3) {
    return `${parts[0]}.${parts[1]}.${parts[2]}`;
  }
  return dateStr;
}

function parseWeatherSystem(date, content) {
  // Match Hindi weather system section - improved pattern
  const weatherPatterns = [
    /बिहार राज्य से संबंधित आज की संक्षिप्त मौसम प्रणाली[:\s\-]*([\s\S]*?)(?=DATE:|पूर्वानुमान|तापमान प्रवृत्ति|$)/i,
    /SIGNIFICANT SYNOPTIC FEATURES[:\s\-]*([\s\S]*?)(?=DATE:|FORECAST|$)/i,
  ];

  let weatherText = "";
  for (let pattern of weatherPatterns) {
    const match = content.match(pattern);
    if (match) {
      weatherText = match[1].trim();
      break;
    }
  }

  if (weatherText) {
    // Split into bullet points (handle various bullet types)
    const bullets = weatherText
      .split(/[\n\r]+/)
      .map((line) => line.trim())
      .filter(
        (line) =>
          line &&
          line.length > 10 && // Filter out very short lines
          !line.match(/^(अधिकतम|न्यूनतम|हवा|वर्षा|तापमान|Warning|Alert)/i),
      )
      .map((line) => {
        // Remove bullet symbols
        return line.replace(/^[➢•\-\s◊]+/, "").trim();
      })
      .filter((line) => line);

    parsedData.weatherSystems[date] = bullets;
  }
}

function parseRainfall(date, content) {
  // Match rainfall section - improved patterns
  const rainfallPatterns = [
    /वर्षा की मुख्य मात्रा \(मिमी में\)[:\s\-–—]*([\s\S]*?)(?=बिहार राज्य|DATE:|पूर्वानुमान|तापमान|Warning|$)/i,
    /CHIEF AMOUNTS OF RAINFALL[:\s\-–—]*([\s\S]*?)(?=DATE:|WEATHER|FORECAST|$)/i,
  ];

  let rainfallText = "";
  for (let pattern of rainfallPatterns) {
    const match = content.match(pattern);
    if (match) {
      rainfallText = match[1].trim();
      break;
    }
  }

  if (rainfallText) {
    // Check for NIL/No rain
    if (
      rainfallText.toUpperCase().includes("NIL") ||
      rainfallText.includes("नहीं") ||
      rainfallText.includes("शुष्क") ||
      rainfallText.match(/^\s*[-–—]?\s*$/)
    ) {
      parsedData.rainfall[date] = [];
    } else {
      // Parse station rainfall data
      const stations = [];

      // Clean up the text
      const cleanText = rainfallText
        .replace(/\*NA.*?AWS.*?\*/gi, "") // Remove footnotes
        .replace(/\(.*?\)/g, "") // Remove parentheses
        .replace(/Automatic weather station/gi, "");

      // Split by comma, newline, or other delimiters
      const entries = cleanText
        .split(/[,\n;|]/)
        .map((e) => e.trim())
        .filter((e) => e);

      entries.forEach((entry) => {
        // Match patterns like "STATION 18.0", "STATION-18.0", "STATION: 18.0", "STATION – 18.0"
        const patterns = [
          /([^\d:()–—\-]+)[\s\-–—:]+([\d.]+)/,
          /([A-Z]+)[\s]+([\d.]+)/,
          /([\u0900-\u097F]+)[\s]+([\d.]+)/, // Hindi station names
        ];

        for (let pattern of patterns) {
          const match = entry.match(pattern);
          if (match) {
            const station = match[1].trim();
            const rainfall = parseFloat(match[2]);
            if (station && !isNaN(rainfall) && station.length > 1) {
              stations.push({ station, rainfall });
              break;
            }
          }
        }
      });

      parsedData.rainfall[date] = stations;
    }
  }
}

function parseTemperatures(date, content) {
  // Parse max temperature - improved patterns
  const maxTempPatterns = [
    /सर्वाधिक अधिकतम तापमान\s+([\d.]+)°?C?\s*\(?\s*(\d{2}[./]\d{2}[./]\d{4})?\s*\)?\s*([^\(\n]+)/i,
    /अधिकतम तापमान[:\s]+([\d.]+)/i,
    /Maximum Temperature[:\s]+([\d.]+)/i,
  ];

  let maxTempFound = false;
  for (let pattern of maxTempPatterns) {
    const match = content.match(pattern);
    if (match) {
      const temp = parseFloat(match[1]);
      const stationDistrict = match[3] ? match[3].trim() : "";
      const parts = stationDistrict.split(/[\s(),]+/).filter((p) => p);

      let station = parts[0] || "";
      let district = parts[1] || "";
      if (station && stationDistrictMap[station]) {
        district = stationDistrictMap[station];
      }

      parsedData.temperatures.max.push({
        date: date,
        temp: temp,
        station: station,
        district: district,
      });
      maxTempFound = true;
      break;
    }
  }

  // Parse min temperature
  const minTempPatterns = [
    /सबसे कम न्यूनतम तापमान\s+([\d.]+)°?C?\s*\(?\s*(\d{2}[./]\d{2}[./]\d{4})?\s*\)?\s*([^\(\n]+)/i,
    /न्यूनतम तापमान[:\s]+([\d.]+)/i,
    /Minimum Temperature[:\s]+([\d.]+)/i,
  ];

  let minTempFound = false;
  for (let pattern of minTempPatterns) {
    const match = content.match(pattern);
    if (match) {
      const temp = parseFloat(match[1]);
      const stationDistrict = match[3] ? match[3].trim() : "";
      const parts = stationDistrict.split(/[\s(),]+/).filter((p) => p);

      let station = parts[0] || "";
      let district = parts[1] || "";
      if (station && stationDistrictMap[station]) {
        district = stationDistrictMap[station];
      }

      parsedData.temperatures.min.push({
        date: date,
        temp: temp,
        station: station,
        district: district,
      });
      minTempFound = true;
      break;
    }
  }
}

function parseWind(date, content) {
  // Parse wind information if needed
  const windMatch = content.match(/हवा का बहाव[:\s]+([^\n]+)/i);
  if (windMatch) {
    // Store wind data if needed
    // parsedData.wind[date] = windMatch[1].trim();
  }
}

// ============================================
// PREVIEW UPDATE FUNCTIONS
// ============================================

function updatePreview() {
  updateWeatherSystemSummary();
  updateRainfallTable();
  generateDailyTemperatureTable();
  updateTemperatureTable();
  updateTemperatureAnalysis();
  updatePreviewSpatialTable();
}

function updateWeatherSystemSummary() {
  const container = document.getElementById("weatherSystemSummary");
  let html = "";

  Object.keys(parsedData.weatherSystems).forEach((date) => {
    const systems = parsedData.weatherSystems[date];
    if (systems && systems.length > 0) {
      html += `<div class="weather-day">
                <h5 contenteditable="true">DATE: ${date}</h5>
                <ul>`;

      systems.forEach((system) => {
        if (system.trim()) {
          html += `<li contenteditable="true">${system}</li>`;
        }
      });

      html += `</ul></div>`;
    }
  });

  container.innerHTML =
    html || '<p class="placeholder-text">No weather system data available</p>';
}

function updateRainfallTable() {
  const tbody = document.getElementById("rainfallTableBody");
  let html = "";

  Object.keys(parsedData.rainfall).forEach((date) => {
    const stations = parsedData.rainfall[date];
    if (stations.length === 0) {
      html += `<tr><td contenteditable="true">${date}</td><td contenteditable="true">NIL</td></tr>`;
    } else {
      const stationText = stations
        .map((s) => `${s.station}-${s.rainfall}`)
        .join(", ");
      html += `<tr><td contenteditable="true">${date}</td><td contenteditable="true">${stationText}</td></tr>`;
    }
  });

  tbody.innerHTML =
    html ||
    '<tr><td colspan="2" class="placeholder-text">No rainfall data</td></tr>';
}

function updateTemperatureTable() {
  const tbody = document.getElementById("temperatureTableBody");
  let html = "";

  // Find highest max and lowest min
  let highestMax = null;
  let lowestMin = null;

  if (parsedData.temperatures.max.length > 0) {
    highestMax = parsedData.temperatures.max.reduce((max, curr) =>
      curr.temp > max.temp ? curr : max,
    );
  }

  if (parsedData.temperatures.min.length > 0) {
    lowestMin = parsedData.temperatures.min.reduce((min, curr) =>
      curr.temp < min.temp ? curr : min,
    );
  }

  if (highestMax) {
    html += `<tr>
            <td contenteditable="true">Highest Maximum</td>
            <td contenteditable="true">${highestMax.temp}°C</td>
            <td contenteditable="true">${highestMax.station || "BIKRAMGANJ"}</td>
            <td contenteditable="true">${highestMax.district || "ROHTAS"}</td>
            <td contenteditable="true">${highestMax.date}</td>
        </tr>`;
  }

  if (lowestMin) {
    html += `<tr>
            <td contenteditable="true">Lowest Minimum</td>
            <td contenteditable="true">${lowestMin.temp}°C</td>
            <td contenteditable="true">${lowestMin.station || "ZIRADEI"}</td>
            <td contenteditable="true">${lowestMin.district || "SIWAN"}</td>
            <td contenteditable="true">${lowestMin.date}</td>
        </tr>`;
  }

  tbody.innerHTML =
    html ||
    '<tr><td colspan="5" class="placeholder-text">No temperature data</td></tr>';
}

function updateTemperatureAnalysis() {
  let highestMax = null;
  let lowestMin = null;

  if (parsedData.temperatures.max.length > 0) {
    highestMax = parsedData.temperatures.max.reduce((max, curr) =>
      curr.temp > max.temp ? curr : max,
    );
  }

  if (parsedData.temperatures.min.length > 0) {
    lowestMin = parsedData.temperatures.min.reduce((min, curr) =>
      curr.temp < min.temp ? curr : min,
    );
  }

  if (highestMax) {
    document.getElementById("maxTempHindi").textContent =
      `सप्ताह के दौरान राज्य के मैदानी इलाकों में सबसे अधिक अधिकतम तापमान ${highestMax.temp}°C (${highestMax.station || "BIKRAMGANJ"}, ${highestMax.district || "ROHTAS"}) में ${highestMax.date} को दर्ज किया गया।`;

    document.getElementById("maxTempEnglish").textContent =
      `The highest maximum temperature of ${highestMax.temp}°C had been recorded at ${highestMax.station || "BIKRAMGANJ"} (${highestMax.district || "ROHTAS"}) on ${highestMax.date} respectively over the plains of the state during the week.`;
  }

  if (lowestMin) {
    document.getElementById("minTempHindi").textContent =
      `सप्ताह के दौरान राज्य के मैदानी इलाकों में सबसे कम न्यूनतम तापमान ${lowestMin.temp}°C (${lowestMin.station || "ZIRADEI"}, ${lowestMin.district || "SIWAN"}) में ${lowestMin.date} को दर्ज किया गया।`;

    document.getElementById("minTempEnglish").textContent =
      `The lowest minimum temperature of ${lowestMin.temp}°C had been recorded at ${lowestMin.station || "ZIRADEI"} (${lowestMin.district || "SIWAN"}) on ${lowestMin.date} over the plains of the state during the week.`;
  }
}

// ============================================
// DISTRIBUTION CONFIGURATION
// ============================================

function getDistributionOptions() {
  return {
    DRY: {
      color: document.getElementById("colorDRY").value,
      text: document.getElementById("textDRY").value,
    },
    ISOL: {
      color: document.getElementById("colorISOL").value,
      text: document.getElementById("textISOL").value,
    },
    SCATTERED: {
      color: document.getElementById("colorSCATTERED").value,
      text: document.getElementById("textSCATTERED").value,
    },
    "FAIRLY WIDESPREAD": {
      color: document.getElementById("colorFAIRLY").value,
      text: document.getElementById("textFAIRLY").value,
    },
    WIDESPREAD: {
      color: document.getElementById("colorWIDESPREAD").value,
      text: document.getElementById("textWIDESPREAD").value,
    },
  };
}

function getDistributionColor(type) {
  const options = getDistributionOptions();
  return options[type]?.color || "#ffffff";
}

function getDistributionText(type) {
  const options = getDistributionOptions();
  return options[type]?.text || type;
}

function getContrastColor(hexColor) {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#ffffff";
}

function updateLegend() {
  const legend = document.getElementById("distributionLegend");
  const previewLegend = document.getElementById("previewLegend");
  const types = ["DRY", "ISOL", "SCATTERED", "FAIRLY WIDESPREAD", "WIDESPREAD"];

  let html = `<table class="legend-table" style="width: 100%; border-collapse: collapse; border: 1px solid #000; text-align: center; font-size: 11px; margin-top: 15px; margin-bottom: 15px; line-height: 1.4;">
    <tr>`;

  types.forEach((type) => {
    const color = getDistributionColor(type);
    const textColor = getContrastColor(color);
    const text = getDistributionText(type);
    const label = getDistributionLabel(type);
    const formattedLabel = label.replace(" – ", "<br>"); // Line break after English text

    html += `<td style="background-color: ${color}; color: ${textColor}; border: 1px solid #000; padding: 6px; width: 20%; vertical-align: middle;">
            <span style="font-weight: bold; font-size: 12px;">${text}</span><br>${formattedLabel}
        </td>`;
  });

  html += `</tr></table>`;

  if (legend) legend.innerHTML = html;
  if (previewLegend) previewLegend.innerHTML = html;

  // Update table colors
  updateSpatialTableColors();
  updatePreviewSpatialTable();
  updateBulkEditPanel();
}

function getDistributionLabel(type) {
  const labels = {
    DRY: "शुष्क",
    ISOL: "(ONE OR TWO PLACES) – एक दो स्थानों पर",
    SCATTERED: "(FEW PLACES) – कुछ स्थानों पर",
    "FAIRLY WIDESPREAD": "(MANY PLACES) – अनेक स्थानों पर",
    WIDESPREAD: "(MOST PLACES) – अधिकांश स्थानों पर",
  };
  return labels[type] || type;
}

// ============================================
// IMAGE UPLOAD HANDLING
// ============================================

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    uploadedImageData = e.target.result;

    // Display in upload area
    const uploadedImg = document.getElementById("uploadedMap");
    uploadedImg.src = uploadedImageData;
    uploadedImg.style.display = "block";

    // Display in preview
    const previewImg = document.getElementById("previewMap");
    previewImg.src = uploadedImageData;
    previewImg.style.display = "block";

    // Hide placeholders
    document.querySelector(".upload-placeholder").style.display = "none";
    document.getElementById("mapPlaceholder").style.display = "none";
    document.getElementById("mapPage").style.display = "block";
    document.getElementById("removeImageBtn").style.display = "inline-flex";

    const sig3 = document.getElementById("signaturePage3");
    if (sig3) sig3.style.display = "none";

    showNotification("Map uploaded successfully!", "success");
  };
  reader.readAsDataURL(file);
}

function removeImage() {
  uploadedImageData = null;
  document.getElementById("mapUpload").value = "";
  document.getElementById("uploadedMap").style.display = "none";
  document.getElementById("previewMap").style.display = "none";
  document.querySelector(".upload-placeholder").style.display = "block";
  document.getElementById("mapPlaceholder").style.display = "block";
  document.getElementById("mapPage").style.display = "none";
  document.getElementById("removeImageBtn").style.display = "none";

  const sig3 = document.getElementById("signaturePage3");
  if (sig3) sig3.style.display = "block";

  showNotification("Image removed!", "info");
}

// ============================================
// PDF & WORD GENERATION
// ============================================

// Helper to convert image src to data URI
async function imageToDataUri(img) {
  // If it's already a data URI (like the uploaded map), return it directly
  if (img.src.startsWith("data:image")) {
    return img.src;
  }
  try {
    // Fetch the image from its source
    const response = await fetch(img.src);
    const blob = await response.blob();
    // Convert the blob to a data URI
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error(`Failed to fetch and convert image: ${img.src}`, error);
    return img.src; // Return original src on error to avoid breaking
  }
}

async function generateWord() {
  document.getElementById("loadingOverlay").style.display = "flex";
  document.getElementById("loadingText").textContent =
    "Generating Word Document...";

  try {
    const previewElement = document.getElementById("bulletinPreview");
    const clonedElement = previewElement.cloneNode(true);

    // Remove the tip/hint
    const hint = clonedElement.querySelector(".edit-hint");
    if (hint) hint.remove();

    // Remove hidden pages
    clonedElement.querySelectorAll(".bulletin-page").forEach((page) => {
      if (page.style.display === "none") {
        page.remove();
      }
    });

    // Convert images to Base64 to embed directly in Word
    const images = Array.from(clonedElement.querySelectorAll("img"));
    await Promise.all(
      images.map(async (img) => {
        if (img.style.display !== "none") {
          const dataUri = await imageToDataUri(img);
          img.src = dataUri;
          // Safe dimensions for Word
          if (
            img.classList.contains("logo-left") ||
            img.classList.contains("logo-right")
          ) {
            img.removeAttribute("width");
            img.setAttribute("height", "115");
            img.style.width = "auto";
            img.style.height = "115px";
          } else if (
            img.id === "previewMap" ||
            img.classList.contains("preview-map-image")
          ) {
            img.setAttribute("width", "720"); // Fit exactly within A4 with minimum margins
            img.style.width = "720px";
            img.style.maxWidth = "100%";
            img.style.height = "auto";
          } else {
            img.style.maxWidth = "100%";
          }
        }
      }),
    );

    // Fix Header Flexbox for Word (Convert to Layout Table)
    const header = clonedElement.querySelector(".header");
    if (header) {
      const logoLeft = header.querySelector(".logo-left");
      const logoRight = header.querySelector(".logo-right");
      const title = header.querySelector(".title");

      const tableHeader = document.createElement("table");
      tableHeader.className = "layout-table";
      tableHeader.setAttribute("width", "100%");
      tableHeader.setAttribute("border", "0");
      tableHeader.setAttribute("cellpadding", "0");
      tableHeader.setAttribute("cellspacing", "0");
      tableHeader.style.width = "100%";
      tableHeader.style.border = "none";
      tableHeader.style.marginBottom = "20px";
      tableHeader.style.borderBottom = "3px double #1e3a5f";
      tableHeader.innerHTML = `
            <tr>
                <td width="20%" style="width: 20%; text-align: left; border: none; vertical-align: middle; padding: 0;">
                    ${logoLeft ? logoLeft.outerHTML : ""}
                </td>
                <td width="60%" style="width: 60%; text-align: center; border: none; vertical-align: middle; padding: 0;">
                    ${title ? title.innerHTML : ""}
                </td>
                <td width="20%" style="width: 20%; text-align: right; border: none; vertical-align: middle; padding: 0;">
                    ${logoRight ? logoRight.outerHTML : ""}
                </td>
            </tr>
        `;
      header.parentNode.replaceChild(tableHeader, header);
    }

    // Fix all tables styling for Word
    clonedElement
      .querySelectorAll("table:not(.layout-table)")
      .forEach((table) => {
        table.setAttribute("border", "1");
        table.style.borderCollapse = "collapse";
        table.style.width = "100%";
        table.style.border = "1px solid #000000";
        table.style.marginBottom = "20px";

        table.querySelectorAll("th, td").forEach((cell) => {
          cell.style.border = "1px solid #000000";
          cell.style.padding = "8px";

          if (cell.tagName.toLowerCase() === "th") {
            cell.style.backgroundColor = "#1e3a5f";
            cell.style.color = "#ffffff";
            cell.style.fontWeight = "bold";
            cell.style.textAlign = "center";
          }
        });
      });

    // Ensure page breaks
    const pages = clonedElement.querySelectorAll(".bulletin-page");
    pages.forEach((page, index) => {
      if (index < pages.length - 1) {
        const br = document.createElement("br");
        br.style.pageBreakAfter = "always";
        page.appendChild(br);
      }
    });

    // Remove existing signatures to prevent duplicates in Word
    clonedElement
      .querySelectorAll(".app-signature")
      .forEach((el) => el.remove());

    // Add the fixed footer exclusively to the last page
    if (pages.length > 0) {
      const lastPage = pages[pages.length - 1];
      const signatureDiv = document.createElement("div");
      signatureDiv.style.cssText =
        "text-align: center; margin-top: 50px; font-size: 10pt; color: #718096; border-top: 1px solid #e2e8f0; padding-top: 15px; font-weight: bold;";
      signatureDiv.innerHTML =
        "Generated by SWFC_Weekly_Report Web Application | Developed by Lal Kamal";
      lastPage.appendChild(signatureDiv);
    }

    // Wrap in Word-compatible HTML Document Structure
    const htmlContent = `
    <html xmlns:v="urn:schemas-microsoft-com:vml"
          xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
        <meta charset='utf-8'>
        <title>Weekly Weather Bulletin</title>
        <style>
            @page WordSection1 {
                size: 8.5in 11.0in;
                margin: 0.5in 0.5in 0.5in 0.5in;
            }
            div.WordSection1 { page: WordSection1; }
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #000; }
            h4 { background-color: #f7fafc; padding: 8px; border-left: 4px solid #3182ce; font-size: 14pt; margin-top: 15px; margin-bottom: 10px; }
            .bulletin-page { margin-bottom: 20px; }
            ul { margin-top: 5px; margin-bottom: 15px; }
            li { margin-bottom: 5px; }
        </style>
    </head>
    <body>
        <div class="WordSection1">
            ${clonedElement.innerHTML}
        </div>
    </body>
    </html>
    `;

    // Important: \\ufeff forces UTF-8 encoding so Hindi text doesn't break in MS Word
    const blob = new Blob(["\ufeff", htmlContent], {
      type: "application/msword",
    });

    const dateInput = document.getElementById("weekEndingDate").value;
    const filename = `Weekly_Weather_Bulletin_Bihar_${dateInput || "latest"}.doc`;

    if (window.saveAs) {
      window.saveAs(blob, filename);
    } else {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    showNotification(
      "Word document generated successfully with exact styling!",
      "success",
    );
  } catch (error) {
    console.error("Word generation error:", error);
    showNotification("Error generating Word document.", "error");
  } finally {
    document.getElementById("loadingOverlay").style.display = "none";
  }
}

async function generatePDF() {
  const { jsPDF } = window.jspdf;

  // Show loading
  document.getElementById("loadingOverlay").style.display = "flex";
  document.getElementById("loadingText").textContent = "Generating PDF...";

  try {
    const element = document.getElementById("bulletinPreview");
    const pages = element.querySelectorAll(".bulletin-page");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    let isFirstPageOfPdf = true;

    for (const page of pages) {
      // Skip hidden pages
      if (page.style.display === "none") continue;

      // Capture page as canvas
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      if (!isFirstPageOfPdf) {
        pdf.addPage();
      }
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      isFirstPageOfPdf = false;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
    }

    // Generate filename with date range
    const dateInput = document.getElementById("weekEndingDate").value;
    let filename = "Weekly_Weather_Bulletin_Bihar";
    if (dateInput) {
      filename += `_${dateInput}`;
    }
    filename += ".pdf";

    // Save PDF
    pdf.save(filename);

    showNotification("PDF generated successfully!", "success");
  } catch (error) {
    console.error("PDF generation error:", error);
    showNotification("Error generating PDF. Please try again.", "error");
  } finally {
    document.getElementById("loadingOverlay").style.display = "none";
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function resetPreview() {
  document.getElementById("weatherSystemSummary").innerHTML =
    '<p class="placeholder-text">Weather system data will appear here after parsing...</p>';
  document.getElementById("rainfallTableBody").innerHTML =
    '<tr><td colspan="2" class="placeholder-text">Rainfall data will appear here...</td></tr>';
  document.getElementById("temperatureTableBody").innerHTML =
    '<tr><td colspan="5" class="placeholder-text">Temperature data will appear here...</td></tr>';
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        background: ${type === "success" ? "#38a169" : type === "warning" ? "#d69e2e" : type === "error" ? "#e53e3e" : "#3182ce"};
    `;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add CSS animations and styles
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    /* Prevent text selection when dragging */
    .spatial-table {
        user-select: none;
        -webkit-user-select: none;
    }

    /* Multi-select styles */
    .editable-cell {
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 600;
        text-transform: uppercase;
        border: 2px solid transparent;
    }

    .editable-cell:hover {
        filter: brightness(0.9);
        transform: scale(1.02);
    }

    .editable-cell.selected-cell {
        border: 3px solid #e53e3e !important;
        box-shadow: 0 0 10px rgba(229, 62, 62, 0.5);
        transform: scale(1.05);
        z-index: 10;
        position: relative;
    }

    .date-cell {
        font-weight: bold;
        background: #f7fafc;
    }
`;
document.head.appendChild(style);

// ============================================
// NEW ADDITIONS FOR FEATURES
// ============================================

function generateDailyTemperatureTable() {
  const tbody = document.getElementById("dailyTemperatureTableBody");
  if (!tbody) return;

  let html = "";
  if (parsedData.dates && parsedData.dates.length > 0) {
    parsedData.dates.forEach((date) => {
      // Filter used to support multiple stations if present
      const maxEntries = parsedData.temperatures.max.filter(
        (t) => t.date === date,
      );
      const minEntries = parsedData.temperatures.min.filter(
        (t) => t.date === date,
      );

      const extractField = (entries, field) => {
        if (!entries || entries.length === 0) return "--";
        return entries
          .map((entry) => {
            if (field === "temp") {
              let tempFloat = parseFloat(entry.temp);
              return !isNaN(tempFloat) ? tempFloat.toFixed(1) : entry.temp;
            }
            return entry[field] || "--";
          })
          .join("<br>");
      };

      html += `<tr>
        <td contenteditable="true">${date}</td>
        <td contenteditable="true">${extractField(maxEntries, "temp")}</td>
        <td contenteditable="true">${extractField(maxEntries, "station")}</td>
        <td contenteditable="true">${extractField(maxEntries, "district")}</td>
        <td contenteditable="true">${extractField(minEntries, "temp")}</td>
        <td contenteditable="true">${extractField(minEntries, "station")}</td>
        <td contenteditable="true">${extractField(minEntries, "district")}</td>
      </tr>`;
    });
  }

  tbody.innerHTML =
    html ||
    '<tr><td colspan="7" class="placeholder-text">No daily temperature data</td></tr>';
}

// ============================================
// MENU INTERLINKING FUNCTIONS
// ============================================

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function toggleLanguage() {
  const isHindi = document.documentElement.lang === "hi";
  document.documentElement.lang = isHindi ? "en" : "hi";
  showNotification(
    `Language switched to ${isHindi ? "English" : "Hindi"}.`,
    "info",
  );
}

function changeBackground(color) {
  document.body.style.background = color;
}

// ============================================
// SIGNATURE & CSV LOADING
// ============================================

async function loadEmployeeSignatures() {
  const preparedBySelect =
    document.getElementById("preparedBySelect") ||
    document.getElementById("preparedBy");
  const issuedBySelect =
    document.getElementById("issuedBySelect") ||
    document.getElementById("issuedBy");

  if (!preparedBySelect || !issuedBySelect) return;

  try {
    const paths = [
      "../IMD_Employee _Name/Employee_Name.csv",
      "../IMD_Employee_Name/Employee_Name.csv",
    ];

    let response = null;
    for (let p of paths) {
      try {
        let res = await fetch(p);
        if (res.ok) {
          response = res;
          break;
        }
      } catch (e) {}
    }

    if (!response || !response.ok)
      throw new Error("CSV File not found or CORS blocked");

    const csvText = await response.text();
    const lines = csvText.split(/\r?\n/);

    preparedBySelect.innerHTML = "";
    issuedBySelect.innerHTML = "";

    let firstPrepared = true;
    let firstIssued = true;

    function parseCSVRow(str) {
      let arr = [],
        quote = false,
        col = "";
      for (let i = 0; i < str.length; i++) {
        let cc = str[i],
          nc = str[i + 1];
        if (cc === '"' && quote && nc === '"') {
          col += cc;
          ++i;
          continue;
        }
        if (cc === '"') {
          quote = !quote;
          continue;
        }
        if (cc === "," && !quote) {
          arr.push(col.trim());
          col = "";
          continue;
        }
        col += cc;
      }
      arr.push(col.trim());
      return arr;
    }

    if (lines.length > 0) {
      let headers = parseCSVRow(lines[0]);
      let dutyOfficerIdx = 1;
      let forecastIssuedIdx = 2;

      for (let i = 0; i < headers.length; i++) {
        let h = headers[i].toLowerCase();
        if (h.includes("duty officer") || h.includes("prepared"))
          dutyOfficerIdx = i;
        if (h.includes("forecast issued by") || h.includes("issued"))
          forecastIssuedIdx = i;
      }

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        let row = parseCSVRow(lines[i]);
        let dutyOfficer = row[dutyOfficerIdx] ? row[dutyOfficerIdx].trim() : "";
        let forecastIssued = row[forecastIssuedIdx]
          ? row[forecastIssuedIdx].trim()
          : "";

        if (dutyOfficer) {
          preparedBySelect.add(
            new Option(dutyOfficer, dutyOfficer, false, firstPrepared),
          );
          firstPrepared = false;
        }
        if (forecastIssued) {
          issuedBySelect.add(
            new Option(forecastIssued, forecastIssued, false, firstIssued),
          );
          firstIssued = false;
        }
      }
    }
  } catch (error) {
    console.warn("CSV load failed (CORS/Path issue). Loading default names.");
    preparedBySelect.innerHTML = "";
    issuedBySelect.innerHTML = "";
    preparedBySelect.add(
      new Option("Amit Kumar - Met-A", "Amit Kumar - Met-A"),
    );
    issuedBySelect.add(
      new Option("Ashish Kumar - Scientist-D", "Ashish Kumar - Scientist-D"),
    );
  }

  if (typeof updateSignatures === "function") updateSignatures();
  if (typeof updatePreview === "function") updatePreview();
}

function updateSignatures() {
  const prep = document.getElementById("preparedBySelect")?.value || "Met-A";
  const iss = document.getElementById("issuedBySelect")?.value || "Sc-D";
  const prepSpan = document.getElementById("preparedBy");
  const issSpan = document.getElementById("issuedBy");
  if (prepSpan) prepSpan.textContent = prep;
  if (issSpan) issSpan.textContent = iss;
}
