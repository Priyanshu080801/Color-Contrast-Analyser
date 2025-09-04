document.addEventListener('DOMContentLoaded', () => {
    // Function to update color display and input field
    function updateColor(elementId, color) {
      const display = document.getElementById(`${elementId}Display`);
      const input = document.getElementById(`${elementId}Input`);
      display.style.backgroundColor = color;
      input.value = color;
      updateContrast();
    }
  
    // Function to copy color code to clipboard
    function copyToClipboard(text, buttonId) {
      navigator.clipboard.writeText(text).then(() => {
        // Change button color to #9dea45 for 2 seconds with a transition effect
        const button = document.getElementById(buttonId);
        button.style.backgroundColor = '#9dea45';
        button.style.transition = 'background-color 0.5s ease'; // Transition effect
        setTimeout(() => {
          button.style.backgroundColor = ''; // Reset to original color
        }, 2000); // 2 seconds
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }
  
    // Update contrast ratio based on selected colors
    function updateContrast() {
      const color1 = hexToRgb(document.getElementById('color1Input').value);
      const color2 = hexToRgb(document.getElementById('color2Input').value);
      const ratio = contrastRatio(color1, color2).toFixed(2);
      document.getElementById('ratio').textContent = ratio;
  
      const passMinimum = ratio >= 4.5 ? 'Pass' : 'Fail';
      const passNonText = ratio >= 3.0 ? 'Pass' : 'Fail';
  
      document.getElementById('contrast-minimum').textContent = passMinimum;
      document.getElementById('contrast-minimum').className = passMinimum === 'Pass' ? 'pass' : 'fail';
      
      document.getElementById('non-text-contrast').textContent = passNonText;
      document.getElementById('non-text-contrast').className = passNonText === 'Pass' ? 'pass' : 'fail';
    }
  
    // Calculate contrast ratio between two colors
    function contrastRatio(color1, color2) {
      const lum1 = luminance(color1[0], color1[1], color1[2]);
      const lum2 = luminance(color2[0], color2[1], color2[2]);
      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);
      return (brightest + 0.05) / (darkest + 0.05);
    }
  
    // Convert hex color to RGB values
    function hexToRgb(hex) {
      const bigint = parseInt(hex.slice(1), 16);
      return [bigint >> 16 & 255, bigint >> 8 & 255, bigint & 255];
    }
  
    // Calculate luminance for RGB values
    function luminance(r, g, b) {
      const a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }
  
    // Function to pick color using the EyeDropper API
    async function pickColor(buttonId, colorPickerId) {
      const eyeDropper = new EyeDropper();
      try {
        const result = await eyeDropper.open();
        updateColor(colorPickerId, result.sRGBHex);
      } catch (e) {
        console.error(e);
      }
    }
  
    // Event listener for color picker buttons
    document.getElementById('pickColor1').addEventListener('click', () => pickColor('color1', 'color1'));
    document.getElementById('pickColor2').addEventListener('click', () => pickColor('color2', 'color2'));
  
    // Event listener for copy buttons
    document.getElementById('copyColor1').addEventListener('click', () => {
      const color1 = document.getElementById('color1Input').value;
      copyToClipboard(color1, 'copyColor1');
    });
    
    document.getElementById('copyColor2').addEventListener('click', () => {
      const color2 = document.getElementById('color2Input').value;
      copyToClipboard(color2, 'copyColor2');
    });
  
    // Event listeners for color input fields
    document.getElementById('color1Input').addEventListener('input', () => updateColor('color1', document.getElementById('color1Input').value));
    document.getElementById('color2Input').addEventListener('input', () => updateColor('color2', document.getElementById('color2Input').value));
    
    // Initialize contrast calculation on load
    updateContrast();
  });
