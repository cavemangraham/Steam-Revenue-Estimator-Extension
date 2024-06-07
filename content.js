// Function to get the current URL and modify it to the desired URL for the GET request
function getTargetUrl() {
    // Function to extract text using XPath from the current web page
    function getTextFromXPath(xpath) {
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue ? result.singleNodeValue.textContent : null;
    }

    // Get the text from the specified XPath
    const xpath = "/html/body/div[1]/div[7]/div[6]/div[3]/div[3]/div[1]/div[2]/div[2]/div/div[3]";
    const extractedText = getTextFromXPath(xpath);

    if (extractedText) {
        // Process the extracted text
        const parts = extractedText.split('/');
        const lastPart = parts.filter(part => part !== "").pop();
        console.log(lastPart);

        // Modify the extracted text to derive the targetUrl as per your requirement
        const urlSearchString = encodeURIComponent(lastPart).split('_').join('+');
        const targetUrl = "https://games-stats.com/steam/?title=" + urlSearchString;
        console.log(targetUrl);
        return targetUrl;
    } else {
        console.error("Could not find the text at the specified XPath.");
    }
    
}

// Function to extract text using XPath
function getTextFromXPath(responseText, xpath) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(responseText, "text/html");
    const result = doc.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return result.singleNodeValue ? result.singleNodeValue.textContent : null;
}

function createTextbox() {
    const textbox = document.createElement("div");
    textbox.style.position = "fixed";
    textbox.style.top = "10px";
    textbox.style.right = "10px";
    textbox.style.padding = "10px";
    textbox.style.backgroundColor = "black";  // Background color
    textbox.style.color = "green";           // Font color
    textbox.style.fontSize = "25px";         // Font size
    textbox.style.border = "1px solid black";
    textbox.style.zIndex = "1000";
    textbox.id = "extractedTextBox";
    document.body.appendChild(textbox);
    return textbox;
}

// Function to update the textbox with the extracted text
function updateTextbox(text) {
    const textbox = document.getElementById("extractedTextBox");
    if (textbox) {
        textbox.textContent = "Revenue: " + text;
    }
}

// Main function to execute the steps
function main() {
    const targetUrl = getTargetUrl();
    const xpath = "/html/body/section/div/div/div[2]/table/tbody/tr/td[9]/span";
    
    // Create the textbox
    createTextbox();
    
    // Send message to background script to fetch data
    chrome.runtime.sendMessage({ action: "fetchData", url: targetUrl }, response => {
        const extractedText = getTextFromXPath(response.data, xpath);
        console.log("Game Revenue:", extractedText);
        
        // Update the textbox with the extracted text
        updateTextbox(extractedText);
    });
}

// Execute the main function
main();
