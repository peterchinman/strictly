// Function to retrieve poetry form data.

/**
 * Extract data from form inputs.
 * 
 * @returns {Object} poetic form output object.
 */
function getFormData(){

   // Set all the defaults;
   const formOutput = {
      rhymeDistance: -1,
      poemLineLength: 0,
      stanzaLineLength: 0,
      poemDifferingLines: false,
      stanzaDifferingLines: false,
      rhymeScheme: "",
      syllablesPerLine: 0,
      meter: "",
      differingLinesSection: {}
   };

   formOutput.rhymeDistance = document.querySelector('#rhyme-distance').value || formOutput.rhymeDistance;
   formOutput.poemLineLength = document.querySelector('#poem-line-length').value || formOutput.poemLineLength;
   formOutput.stanzaLineLength = document.querySelector('#stanza-line-length').value || formOutput.stanzaLineLength;
   if (document.querySelector('#poem-differing-lines')){
      formOutput.poemDifferingLines = document.querySelector('#poem-differing-lines').checked;
   }
   if (document.querySelector('#stanza-differing-lines')){
      formOutput.stanzaDifferingLines = document.querySelector('#stanza-differing-lines').checked;
   }
   formOutput.rhymeScheme = document.querySelector('#rhyme-scheme').value || formOutput.rhymeScheme;

   // differingLines?
   if(formOutput.poemDifferingLines || formOutput.stanzaDifferingLines) {
      const differingSyllables = document.querySelectorAll('.differing-syllables input');
      differingSyllables.forEach((element, index) => {
         formOutput.differingLinesSection[index] = formOutput.differingLinesSection[index] || {};
         formOutput.differingLinesSection[index].syllablesPerLine = element.value || 0;
      })

      const differingMeter = document.querySelectorAll('.differing-meter input');
      differingMeter.forEach((element, index) => {
         formOutput.differingLinesSection[index] = formOutput.differingLinesSection[index] || {};
         formOutput.differingLinesSection[index].meter = element.value || "";
      })
   }
   else {
      formOutput.syllablesPerLine = document.querySelector('#syllables-per-line').value;
      formOutput.meter = document.querySelector('#meter').value;
   }



   return formOutput;
}

// Pre-defined poetic forms
// TODO break this out into it's own file
const poeticForms = {
   limerick: {
      poemLineLength : 5,
      rhymeScheme : "AABBA",
      stanzaLineLength : 0,
      poemDifferingLines: true,
      stanzaDifferingLines: false,
      syllablesPerLine : 0,
      meter: "",
      differingLinesSection : {
         1 : {
            meter: "(x)x/xx/xx/(x)(x)"
         },
         2 : { 
            meter: "(x)x/xx/xx/(x)(x)"
         },
         3 : { 
            meter: "(x)x/xx/(x)"
         },
         4: {
            meter: "(x)x/xx/(x)"
         },
         5: {
            meter: "(x)x/xx/xx/(x)(x)"
         }
      },
   },
   sonnet: {
      poemLineLength : 14,
      rhymeScheme : "ABAB CDCD EFEF GG",
      stanzaLineLength : 0,
      poemDifferingLines: false,
      stanzaDifferingLines: false,
      syllablesPerLine : 0,
      meter: "x/x/x/x/x/",
      differingLinesSection : {
      },
   },
   haiku: {
      poemLineLength : 3,
      rhymeScheme : "",
      stanzaLineLength : 0,
      poemDifferingLines: true,
      stanzaDifferingLines: false,
      syllablesPerLine : 0,
      meter: "",
      differingLinesSection : {
         1 : {
            syllablesPerLine: 5
         },
         2 : { 
            syllablesPerLine: 7
         },
         3 : { 
            syllablesPerLine: 5
         }
      },
   },
   blankVerse: {
      poemLineLength : 0,
      rhymeScheme : "",
      stanzaLineLength : 0,
      poemDifferingLines: false,
      stanzaDifferingLines: false,
      syllablesPerLine : 0,
      meter: "x/x/x/x/x/",
      differingLinesSection : {
      },
   },
   commonMeter: {
      poemLineLength : 0,
      rhymeScheme : "ABAB",
      stanzaLineLength : 4,
      poemDifferingLines: false,
      stanzaDifferingLines: true,
      syllablesPerLine : 0,
      meter: "",
      differingLinesSection : {
         1 : {
            meter: "x/x/x/x/"
         },
         2 : {
            meter: "x/x/x/"
         },
         3 : {
            meter: "x/x/x/x/"
         },
         4 : {
            meter: "x/x/x/"
         },
      },
   },

}


/**
 * Loads a poetic form into the form form input fields.
 * 
 * @param {Object} field – An poetic form object:
 */
function loadFormData(form) {
   
   
   $poemLineLengthInput.value = form.poemLineLength || null;
   $rhymeSchemeInput.value = form.rhymeScheme || null;
   $stanzaLineLengthInput.value = form.stanzaLineLength || null;
   $differingLinesInput.checked = form.poemDifferingLines || form.stanzaDifferingLines;
   $syllablesPerLineInput.value = form.syllablesPerLine;
   $meterInput.value = form.meter || null;

   updateDifferingLinesCheckboxState(form);
   runDifferingLinesLogic(form);

   if ($differingLinesInput.checked) {
      Object.entries(form.differingLinesSection).forEach(([key, value]) => {
         document.querySelector('#syllables-per-line-' + key).value = value.syllablesPerLine;
         document.querySelector('#meter-' + key).value = value.meter || "";
      });
   }
}

/**
 * Update error message on input.
 * 
 * 
 * @param {HTMLElement} inputElement— the element to update the error on
 * @param {string} errorMessage—the error to be updated
 * @param {bool} bool—true equal set error, false equals remove error
 */
function updateError(inputElement, errorMessage, bool){
   
   label = inputElement.parentElement.querySelector('label');

   // check if error already exists
   const errorElements = label.querySelectorAll('.error');
   for (const element of errorElements) {
      if (element.textContent == errorMessage){
         if (bool) {
            return;
         }
         else {
            element.remove();
         }
      }
   }
   // otherwise attach error if bool is true
   if (bool) {
      errorSpan = document.createElement('span');
      errorSpan.classList.add('error');
      errorSpan.textContent = errorMessage;
      label.appendChild(errorSpan);
   }
   
}

function updateDifferingLinesCheckboxState(form) {
   if (form.poemLineLength) {
      document.querySelector('.poem-or-stanza').textContent = "Poem";
      $differingLinesInput.id = "poem-differing-lines";
      $differingLinesInput.name = "poem-differing-lines";
      $differingLinesInput.disabled = false;
   }
   // this supercedes Poem Line Length, if it exists
   if (form.stanzaLineLength) {
      document.querySelector('.poem-or-stanza').textContent = "Stanza";
      $differingLinesInput.id = "stanza-differing-lines";
      $differingLinesInput.name = "stanza-differing-lines";
      $differingLinesInput.disabled = false;
   }
   // if neither are set, disable field
   if(!form.stanzaLineLength && !form.poemLineLength){
      $differingLinesInput.disabled = true;
   }
}

/**
 * Run this function to run thru all the differing lines checkbox logic:
 * 1. Deconstucting differing line section.
 * 2. Creating Differing Line Section again if needed, with correct values.
 * 3. Activating and deactivating $syllablesPerLineInput and $meterInput. As needed
 * 
 * This function should be run anytime:
 * 1. The Differing Lines Checkbox state may have changed
 * 2. $syllablesPerLineInput or $meterInput may have gone from empty to non-empty or vice versa.
 * 
 * 
 * @param {Object} form 
 */
function runDifferingLinesLogic(form) {
   // deconstruct differing lines section
   const $differingLinesSection = document.querySelector('.differing-lines-section');
   if ($differingLinesSection) {
      $differingLinesSection.remove();
   }

   // If Differing Lines Checkbox Checked
   if (form.poemDifferingLines || form.stanzaDifferingLines){

      // deactivate meter and syllables per line
      $syllablesPerLineInput.disabled = true;
      $meterInput.disabled = true;

      let stanzaOrPoem = "";
      let lineLength = 0;
      if (form.poemDifferingLines) {
         stanzaOrPoem = "poem";
         lineLength = form.poemLineLength;
      }
      // stanza takes precedence, so if both exist, we overwrite
      if (form.stanzaDifferingLines) {
         stanzaOrPoem = "stanza";
         lineLength = form.stanzaLineLength;
      }
      createAndPlaceDifferingLinesSection(lineLength, stanzaOrPoem);
   }
   // otherwise, reactivate the fields and be merry
   else{
      // activate meter and syllables per line
      $syllablesPerLineInput.disabled = false;
      $meterInput.disabled = false;
   }
}



/**
 * Creates a  <field-group>
 * <field-group> id = field.inputId + "-group".
 * 
 * Example of what the javascript generates
   		<field-group>
				<label for="poem-line-length">Poem Line Length</label>
				<input id="poem-line-length" name="poem-line-length" type="number">
			</field-group>
 * 
 * @param {Object} field – An Object containing the following properties:
 * @param {string} field.inputId - ID for <input>
 * @param {string} field.groupClassName - <field-group> class name
 * @param {string} field.labelText — Text for label.
 * @param {string} field.type — Type of <input>
 * @returns {HTMLElement} Constucted <field-group> element.
 */
function createFieldGroup(field) {

      // Create field-group
      const fieldGroup = document.createElement('field-group');
      fieldGroup.setAttribute('id', field.inputId + '-group');
      // fieldGroup.classList.add('disabled');
      fieldGroup.classList.add(field.groupClassName);
      

      // Create label
      const label = document.createElement('label');
      label.setAttribute('for', field.inputID);
      
      const labelName = document.createElement('span');
      labelName.classList.add('label-name');
      labelName.textContent = field.labelText;
      label.appendChild(labelName);

      // Create the input
      const input = document.createElement('input');
      input.id = field.inputId;
      input.name = field.inputId;
      input.type = field.type;
      input.classList.add('empty');
      // input.setAttribute('disabled', true);

      if(field.labelText === "Meter") {
         // ridiculous triple escaping the backslash
         input.pattern = "[x\\\/\\\(\\\) \\t\\r\\n\\f]*";
         input.title = "Only 'x', '/', '(', ')' and whitespace are allowed."
         input.classList.add('meter');
      }

      if(field.labelText === "Syllables per Line") {
         input.min = 0;
         input.classList.add('syllable');
      }

      // Append the label and input to the field-group
      fieldGroup.appendChild(label);
      fieldGroup.appendChild(input);
      
      return fieldGroup;
}

/**
 * Creates the Differing Line section, with inputs enabled or disabled based on flags. I think this will default to enabled if no flags are specified, right?
 * @param {number} lineLength - Element to activate
 * @param {string} stanzaOrPoem - "stanza" if this is for the stanza-differing-lines, "poem" if this is for poem-differing-lines
 * @param {boolean} syllableFlag - is $strictSyllableInput checked?
 * @param {boolean} meterFlag - is $strictMeterInput checked?
 * @returns {HTMLElement} Container contain all the differing line sections
 */
function createAndPlaceDifferingLinesSection(lineLength, stanzaOrPoem) {
   const container = document.createElement('div');
   container.setAttribute('id', stanzaOrPoem + '-differing-lines-section');
   container.classList.add('differing-lines-section');
   for (let i = 1; i <= lineLength; ++i){
      const fieldset = document.createElement('fieldset');
      const title = document.createElement('h2');
      title.textContent = "Line " + i;
      fieldset.appendChild(title);
      
      const syllable = createFieldGroup({labelText: "Syllables per Line", inputId: "syllables-per-line-" + i, type: "number", groupClassName: "differing-syllables"});

      fieldset.appendChild(syllable);
  
      const meter = createFieldGroup({labelText: "Meter", inputId: "meter-" + i, type: "text", groupClassName: "differing-meter"});
      fieldset.appendChild(meter);

      container.appendChild(fieldset);
   }

   // place the element

   // if there's a submit button insert before that
   if (document.querySelector('#form-submit')) {
      document.querySelector('#form-submit').parentNode.insertBefore(container, document.querySelector('#form-submit'));
   }
   // otherwise append to end of form
   else{
      document.querySelector('#create-form').appendChild(container);
   }
}

// GLOBAL VARIABLES

const $predefinedFormSelect = document.querySelector('#predefined-form');
const $poemLineLengthInput = document.querySelector('#poem-line-length');
const $stanzaLineLengthInput = document.querySelector('#stanza-line-length');
const $rhymeSchemeInput = document.querySelector('#rhyme-scheme');
const $rhymeDistanceInput = document.querySelector('#rhyme-distance')
const $syllablesPerLineInput = document.querySelector('#syllables-per-line');
const $meterInput = document.querySelector('#meter');

// generic differing lines checkbox selector
const $differingLinesInput = document.querySelector('.differing-lines');


// MAIN EVENT, LET"S GOO, WEE-OOO WEEE_OOOOO
document.addEventListener('DOMContentLoaded', function() {

   document.addEventListener('input', function(event) {

      // VARIABLE DECLARATION FOR DYNAMIC ELEMENTS
      // any of these may be null! so check for them before using them!

      // specific differing lines checkbox selectors
      const $poemDifferingLinesInput = document.getElementById('poem-differing-lines')
      const $stanzaDifferingLinesInput = document.getElementById('stanza-differing-lines');

      // specific differingLinesSections
      const $poemDifferingLinesSection = document.getElementById('poem-differing-lines-section');
      const $stanzaDifferingLinesSection = document.getElementById('stanza-differing-lines-section');

      // generic differingLinesSection
      const $differingLinesSection = document.querySelector('.differing-lines-section');


      

      /*******************
       * EVENT DELEGATION
       *******************/

      // if input is either rhyme, meter, or syllable related, we need to regenerate the inputGroupIndicators for all compose inputs
      if (event.target == $rhymeSchemeInput
         || event.target == $meterInput
         || event.target.matches('.differing-meter input')
         || event.target == $syllablesPerLineInput
         || event.target.matches('.differing-syllables input')
      ) {
         // updateAllInputGroupIndicators();
      }

      // PREDEFINED FORM PICKED
      if (event.target == $predefinedFormSelect) {
         loadFormData(poeticForms[$predefinedFormSelect.value]);
         // select all input groups

         updateAllInputGroupIndicators();

         // rerun all lines
         checkAllLines();
      }

      // TODO: set up a "clear" button next to it to cancel pre-define form

      // POEM LINE LENGTH
      if (event.target == $poemLineLengthInput) {
         // event: empty to non-empty
         if ($poemLineLengthInput.classList.contains('empty') && $poemLineLengthInput.value > 0) {
            // no longer empty
            $poemLineLengthInput.classList.remove('empty');

            // activate poem-differing-lines
            if ($poemDifferingLinesInput) {
               $poemDifferingLinesInput.disabled = false;
            }
            
         }
         // event: non-empty to empty
         else if($poemLineLengthInput.value <= 0){
            $poemLineLengthInput.classList.add('empty');

            // disable differing lines
            if ($poemDifferingLinesInput){
               // disable
               $poemDifferingLinesInput.disabled = true;
            }
            if ($poemDifferingLinesSection) {
               // deconstruct
               $poemDifferingLinesSection.remove();

            }
         }

         // If poem differing lines is checked we need to reconstruct the differing section with the correct number of line
         // TODO it would be nice if this preserved what input there was there currently;
         if ($poemDifferingLinesInput && $poemDifferingLinesInput.checked == true) {
            // deconstruct and update
            $poemDifferingLinesSection.remove();
            let lineLength = event.target.value;
            createAndPlaceDifferingLinesSection(lineLength, 'poem');
         }
      }

      // STANZA LINE LENGTH
      if (event.target == $stanzaLineLengthInput) {
         // event: empty to non-empty
         if ($stanzaLineLengthInput.classList.contains('empty') && $stanzaLineLengthInput.value > 0) {
            // no longer empty
            $stanzaLineLengthInput.classList.remove('empty');
            
            // supercedes $poemDifferingLinesSection
            if ($poemDifferingLinesSection) {
               $poemDifferingLinesSection.remove()

               let lineLength = $stanzaLineLengthInput.value;
               createAndPlaceDifferingLinesSection(lineLength, "stanza")

            }
            // create stanza differing lines checkbox

            document.querySelector('.poem-or-stanza').textContent = "Stanza";
            $differingLinesInput.id = "stanza-differing-lines";
            $differingLinesInput.name = "stanza-differing-lines";
            $differingLinesInput.disabled = false;
         }
         // event: non-empty to empty
         else if((!$stanzaLineLengthInput.classList.contains('empty')) && $stanzaLineLengthInput.value <= 0) {
            // deactivate
            $stanzaLineLengthInput.classList.add('empty')

            document.querySelector('.poem-or-stanza').textContent = "Poem";
            $differingLinesInput.id = "poem-differing-lines";
            $differingLinesInput.name = "poem-differing-lines";

            if ($stanzaDifferingLinesSection) {
               // deconstruct
               $stanzaDifferingLinesSection.remove();
               
               if ($poemLineLengthInput.value > 0) {
                  let lineLength = $poemLineLengthInput.value;
                  createAndPlaceDifferingLinesSection(lineLength, "poem")
               }
            }

            if (! $poemLineLengthInput.value > 0) {
               $differingLinesInput.disabled = true;
            }
         }

         // If stanza differing lines is checked we need to reconstruct the differing section with the correct Poem Line Length
         // TODO it would be nice if this preserved what input there was there currently;
         if ($stanzaDifferingLinesInput && $stanzaDifferingLinesInput.checked == true) {
            // deconstuct and update
            let lineLength = event.target.value;
            $stanzaDifferingLinesSection.remove();
            createAndPlaceDifferingLinesSection(lineLength, 'stanza');
         }
      }
      
      // RHYME SCHEME
      if (event.target == $rhymeSchemeInput) {
         // event: there is input
         if ($rhymeSchemeInput.value != "") {
            // event: empty to non-empty
            if ($rhymeSchemeInput.classList.contains('empty')){
               // activate 
               $rhymeSchemeInput.classList.remove('empty')

               // we need to add Rhyme Indicator to all inputs
               addIndicatorToAllInputs("rhyme");
            }
            

            // rhyme scheme has changed, we should re-check all rhmyes
            console.log("rhyme scheme change, we should check all rhymes")
            checkAll('rhyme');

         }
         // event: non-empty to empty
         else{
            $rhymeSchemeInput.classList.add('empty')

            // remove Rhyme Indicator from all inputs
            removeIndicatorFromAllInputs('rhyme');
         }
         
      }

      // RHYME DISTANCE
      if (event.target == $rhymeDistanceInput) {
         // recheck all rhymes
         checkAll('rhyme');
      }
      
      // SYLLABLES PER LINE
      if (event.target == $syllablesPerLineInput) {
         // event: there is input
         if ($syllablesPerLineInput.value > 0) {
            // event: empty to non-empty
            if($syllablesPerLineInput.classList.contains('empty')){
               $syllablesPerLineInput.classList.remove('empty');

               // we need to add syllable indicator to all inputs
               addIndicatorToAllInputs("syllable");
            }

            // syllables have changed, we should re-check all syllables
            checkAll('syllable');
            
         }
         // event: non-empty to empty
         else {
            // deactivate syllables per line
            $syllablesPerLineInput.classList.add('empty');

            // remove meter indicator from all inputs
            removeIndicatorFromAllInputs('syllable');
         }
      }

      // METER
      if (event.target == $meterInput) {
         // event: there is input
         if ($meterInput.value != "") {
            // event: empty to non-empty
            if($meterInput.classList.contains('empty')){
               $meterInput.classList.remove('empty');

               // we need to add meter indicator to all inputs
               addIndicatorToAllInputs("meter");
            }

            // meter has changed, we should re-check all meters
            checkAll('meter');
            
         }
         // event: non-empty to empty
         else {
            $meterInput.classList.add('empty');
            // remove meter indicator from all inputs
            removeIndicatorFromAllInputs('meter');

         }
      }

      // POEM DIFFERING LINES CHECKBOX INPUT
      if (event.target == $poemDifferingLinesInput) {
         // event: checked
         if ($poemDifferingLinesInput && $poemDifferingLinesInput.checked == true) {
            // get line length
            let lineLength = $poemLineLengthInput.value;
            // create differing line section
            createAndPlaceDifferingLinesSection(lineLength, 'poem');
            // deactivate regular syllable and meter inputs
            $syllablesPerLineInput.disabled = true;
            $meterInput.disabled = true;
         }
         // event: unchecked;
         else {
            // remove section
            if ($poemDifferingLinesSection) {
               $poemDifferingLinesSection.remove();
            }
            // reactivate syllable and meter inputs if applicable
            $syllablesPerLineInput.disabled = false;
            $meterInput.disabled = false;
         } 
      }

      // STANZA DIFFERING LINES CHECKBOX INPUT
      if (event.target == $stanzaDifferingLinesInput) {
         // event: checked
         if ($stanzaDifferingLinesInput.checked == true) {
            // get line length
            let lineLength = $stanzaLineLengthInput.value;
            // create differing line section
            createAndPlaceDifferingLinesSection(lineLength, 'stanza');
            // deactivate regular syllable and meter inputs
            $syllablesPerLineInput.disabled = true;
            $meterInput.disabled = true;
         }
         // event: unchecked
         else {
            // remove section
            $stanzaDifferingLinesSection.remove();

            // reactivate syllable and meter inputs if applicable
            $syllablesPerLineInput.disabled = false;
            $meterInput.disabled = false;
         }
      }

      // SYLLABLE CONNT AND METER FOR DIFERING LINES

      // if (event.target == )



      // FORM VALIDATION LOGIC

      
      // POEM LINE LENGTH MUST BE DIVISIBLE BY STANZA LINE LENGTH
      if (event.target == $poemLineLengthInput || event.target == $stanzaLineLengthInput) {
         const errorMessage = "Poem Line Length must be divisible by Stanza Line Length"
         let poemLines = $poemLineLengthInput.value;
         let stanzaLines = $stanzaLineLengthInput.value;

         if ((poemLines > 0 && stanzaLines > 0) && (poemLines % stanzaLines != 0)){
            updateError($stanzaLineLengthInput, errorMessage, true);
            updateError($poemLineLengthInput, errorMessage, true);
         }
         else {
            updateError($stanzaLineLengthInput, errorMessage, false);
            updateError($poemLineLengthInput, errorMessage, false);
         }
         
      }

      // Rhyme Scheme must match either Poem Length or Stanza Length
      if (event.target === $rhymeSchemeInput || ($rhymeSchemeInput.value && event.target === $poemLineLengthInput) || ($rhymeSchemeInput.value && event.target === $stanzaLineLengthInput)) {
         const errorMessage = "Rhyme Scheme Length must match either Stanza Line Length or Poem Line Length";

         let userRhymeInput = $rhymeSchemeInput.value;
         
         // strip whitespace from Input
         userRhymeInput = userRhymeInput.trim();
         userRhymeInput = userRhymeInput.replace(/\s/g, "");
         rhymeSchemeLength = userRhymeInput.length;

         
         poemLineLength = parseInt($poemLineLengthInput.value) || 0;
         stanzaLineLength = parseInt($stanzaLineLengthInput.value) || 0;

         if (rhymeSchemeLength && (poemLineLength || stanzaLineLength) && (rhymeSchemeLength !== poemLineLength && rhymeSchemeLength !== stanzaLineLength)){
            
            // $rhymeSchemeInput.setCustomValidity(errorMessage);
            updateError($rhymeSchemeInput, errorMessage, true);
         } 
         else {
            // $rhymeSchemeInput.setCustomValidity("");
            updateError($rhymeSchemeInput, errorMessage, false);
         }     
      }


      // METER INPUT LENGTH NEEDS TO MATCH SYLLABLE COUNT

      // METER INPUT ONLY CONTAINS 'x' '/' and whitespace
      if(event.target === $meterInput || event.target.matches('.meter')) {
         const errorMessage = "Only 'x', '/', '(', ')' and whitespace are allowed."
         if(!event.target.checkValidity()) {
            updateError(event.target, errorMessage, true);
         }
         else {
            updateError(event.target, errorMessage, false);
         }
      }

      // METER INPUT parentheses validation
      if(event.target === $meterInput || event.target.matches('.meter')) {
         const errorMessage = "Parentheses error"

         const inputString = event.target.value;

         let openParen = false;
         let errorFlag = false;
         for (const char of inputString) {
            if (char === '('){
               // if paren already open
               if(openParen){
                  errorFlag = true;
               }
               openParen = true;
            }
            if (char === ')'){
               if(!openParen) {
                  errorFlag = true;
               }
               openParen = false;
            }
         }

         if(errorFlag) {
            updateError(event.target, errorMessage, true);
         }
         else {
            updateError(event.target, errorMessage, false);
         }
      }



   })
})


