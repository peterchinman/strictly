/**
 * Creates a  <field-group>, and initializes it to .disabled. <field-group> id = field.inputId + "-group".
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
      label.textContent = field.labelText;

      // Create the input
      const input = document.createElement('input');
      input.setAttribute('id', field.inputId);
      input.setAttribute('name', field.inputId);
      input.setAttribute('type', field.type);
      input.setAttribute('disabled', true);

      // Append the label and input to the field-group
      fieldGroup.appendChild(label);
      fieldGroup.appendChild(input);
      
      return fieldGroup;
}

/**
 * Appends an HTML element to a parent element with specified ID
 * @param {HTMLElement} element - HTML element to place
 * @param {string} parentID - ID of the element into which to append.
 * @returns {HTMLElement} Placed <field-group> element.
 */
function appendChildToId(element, parentID) {
   const placeHere = document.getElementById(parentID)

   if (placeHere) {
      placeHere.appendChild(element)
   }
   else {
      console.error("parentID does not correspond to element")
   }
   const placedElement = document.getElementById(element.id)
   return placedElement;
}

/**
 * Creates a checkbox slider element.
 * @param {Object} field - An Object containing the following properties:
 * @param {string} field.id - ID of the <input>
 * @param {string} field.text - Text for the label
 * @param {string} field.name — <input> name, optional
 * @param {string} field.class — <input> class
 * @returns {string} String containing the HTML for the element.
 */
function createCheckboxSlider(field) {
      return `
      <label class="checkbox-slider" id="${field.id + "-label"}" for="${field.id}">${field.text}
         <input   type="checkbox"
                  id="${field.id}"
                  value="strict-lines"
                  name="${field.name || 'strict-checkbox'}"
                  class="${field.class}">
         <div class="toggle">
            <div class="slider"></div>
            <span id="no">NO</span>
            <span id="yes">YES</span>
         </div>
      </label>
         `;
}

function removeElementParentById(elementId){
   const element = document.getElementById(elementId);
   if (element) {
      const parent = element.parentElement;
      parent.remove();
   }
}

/**
 * Set child <input> in a <field-group> created with createFieldGroup() to disabled = false.
 * @param {HTMLElement} fieldGroup - Element to activate
 */
function activate(fieldGroup){
   idGroup = fieldGroup.getAttribute('id');
   // remove the "-group" ending on the id
   id = idGroup.slice(0, -6)
   document.getElementById(id).disabled = false;
}


/**
 * Set child <input> in a <field-group> created with createFieldGroup() to disabled = true.
 * @param {HTMLElement} fieldGroup - Element to activate
 */
function deactivate(fieldGroup){
   idGroup = fieldGroup.getAttribute('id');
   // remove the "-group" ending on the id
   id = idGroup.slice(0, -6)
   document.getElementById(id).disabled = true;
}

/**
 * Creates the Differing Line section, with inputs enabled or disabled based on flags. I think this will default to enabled if no flags are specified, right?
 * @param {number} lineLength - Element to activate
 * @param {string} stanzaOrPoem - "stanza" if this is for the stanza-differing-lines, "poem" if this is for poem-differing-lines
 * @param {boolean} syllableFlag - is $strictSyllableInput checked?
 * @param {boolean} meterFlag - is $strictMeterInput checked?
 * @returns {HTMLElement} Container contain all the differing line sections
 */
function createAndPlaceDifferingLinesSection(lineLength, stanzaOrPoem, syllableFlag, meterFlag) {
   const container = document.createElement('div');
   container.setAttribute('id', stanzaOrPoem + '-differing-lines-section');
   container.classList.add('differing-lines-section');
   for (let i = 1; i <= lineLength; ++i){
      const fieldset = document.createElement('fieldset');
      const title = document.createElement('h2');
      title.textContent = "Line " + i;
      fieldset.appendChild(title);
      
      const syllable = createFieldGroup({labelText: "Syllables per Line", inputId: "syllables-per-line-" + i, type: "number", groupClassName: "differing-syllables"});

      
      syllable.querySelector('input').disabled = !syllableFlag
      fieldset.appendChild(syllable);
  
      const meter = createFieldGroup({labelText: "Meter", inputId: "meter-" + i, type: "text", groupClassName: "differing-meter"});
      meter.querySelector('input').disabled = !meterFlag
      fieldset.appendChild(meter);

      container.appendChild(fieldset);
   }

   // place the element
   document.getElementById('form-submit').parentNode.insertBefore(container, document.getElementById('form-submit'));
}

document.addEventListener('DOMContentLoaded', function() {

   // const $form = document.getElementById('create-form');

   // declare the #strict-checkboxes inputs
   const $strictLinesInput = document.getElementById('strict-lines');
   const $repeatingStanzasInput = document.getElementById('repeating-stanzas');
   const $strictRhymeInput = document.getElementById('strict-rhyme');
   const $strictSyllableInput = document.getElementById('strict-syllable');
   const $strictMeterInput = document.getElementById('strict-meter');

   // declare and create the #moreOptions <field-groups>
   const $numberOfLines = appendChildToId(createFieldGroup({labelText: 'Number of Lines', inputId: 'number-of-lines', type: 'number'}), 'form-inputs');
   const $stanzaLineLength = appendChildToId(createFieldGroup({labelText:'Stanza Line Length', inputId: 'stanza-line-length', type: 'number'}), "form-inputs");
   const $rhymeScheme = appendChildToId(createFieldGroup({labelText:'Rhyme Scheme', inputId: 'rhyme-scheme', type: 'text'}), "form-inputs");
   const $syllablesPerLine = appendChildToId(createFieldGroup({labelText:'Syllables per Line', inputId: 'syllables-per-line', type: 'number'}), "form-inputs");
   const $meter = appendChildToId(createFieldGroup({labelText:'Meter', inputId: 'meter', type: 'text'}), "form-inputs");

   // declare the fieldgroup inputs
   const $numberOfLinesInput = $numberOfLines.querySelector('input');
   const $stanzaLineLengthInput = $stanzaLineLength.querySelector('input');
   const $rhymeSchemeInput = $rhymeScheme.querySelector('input');
   const $syllablesPerLineInput = $syllablesPerLine.querySelector('input');
   const $meterInput = $meter.querySelector('input');



   document.addEventListener('input', function(event) {

      // DECLARE VARIABLES FOR DYNAMIC ELEMENTS
      // any of these may be null! so check for them before using them!

      // generic differing lines checkbox, either for poem or stanza
      const $differingLinesInput = document.querySelector('.differing-lines');
      const $differingLinesLabel = $differingLinesInput ? $differingLinesInput.parentElement : null;

      const $poemDifferingLinesInput = document.getElementById('poem-differing-lines')
      const $poemDifferingLinesLabel = document.getElementById('poem-differing-lines-label');
      
      const $stanzaDifferingLinesInput = document.getElementById('stanza-differing-lines');
      const $stanzaDifferingLinesLabel = document.getElementById('stanza-differing-lines-label');

      // generic differing lines section, followed by specific
      const $differingLinesSection = document.querySelector('.differing-lines-section');
      const $poemDifferingLinesSection = document.getElementById('poem-differing-lines-section');
      const $stanzaDifferingLinesSection = document.getElementById('stanza-differing-lines-section');


      /*******************
       * EVENT DELEGATION
       *******************/

      // STRICT LINES
      if (event.target == $strictLinesInput) {
         // event: checked
         if ($strictLinesInput.checked) {
            activate($numberOfLines)

            // enable strict rhyme input
            $strictRhymeInput.disabled = false;

            // poem-differing-lines checkbox appears if not already present
            if ($strictSyllableInput.checked || $strictMeterInput.checked) {
               // stanza differing lines supercedes, so check if it exists
               if (!$stanzaDifferingLinesLabel) {
                  // create poem differing lines checkbox
                  let slider = createCheckboxSlider({
                     id: 'poem-differing-lines',
                     text: 'Poem Contains Differing Lines?',
                     name : 'poem-differing-lines',
                     class : 'differing-lines'
                     });
                  $stanzaLineLength.insertAdjacentHTML("afterend", slider);
               }
            }
            
         }
         // event: unchecked
         else {
            // deactivate
            deactivate($numberOfLines);

            // if repeating stanzas not checked need to disable strict rhyme input
            if (!$repeatingStanzasInput.checked) {
               $strictRhymeInput.disabled = true
            }

            // remove differing lines
            if ($poemDifferingLinesLabel){
               // deconstruct
               $poemDifferingLinesLabel.remove();
            }
            if ($poemDifferingLinesSection) {
               // deconstruct
               $poemDifferingLinesSection.remove();

            }
         }
      }

      // REPEATING STANZAS
      if (event.target == $repeatingStanzasInput) {
         // event: cheked
         if ($repeatingStanzasInput.checked) {
            // activate stanza line length
            activate($stanzaLineLength);
            // activate strict rhyme input
            $strictRhymeInput.disabled = false;
            // differing-lines
            if ($strictSyllableInput.checked || $strictMeterInput.checked) {
               // supercedes $poemDifferingLines
               if ($poemDifferingLinesLabel) {
                  // desconstruct
                  $poemDifferingLinesLabel.remove()
               }
               // supercedes $poemDifferingLinesSection
               if ($poemDifferingLinesSection) {
                  $poemDifferingLinesSection.remove()
               }
               // create stanza differing lines checkbox
               let slider = createCheckboxSlider({
                  id: 'stanza-differing-lines',
                  text: 'Stanza Contains Differing Lines?',
                  name : 'stanza-differing-lines',
                  class : 'differing-lines'
                  });
               $stanzaLineLength.insertAdjacentHTML("afterend", slider);
               
            }
         }
         // if unchecked
         else {
            // deactivate
            deactivate($stanzaLineLength);

            // if strict lines not checked, need to disable strict rhyme input
            if (!$strictLinesInput.checked) {
               $strictRhymeInput.disabled = true
            }

            if ($stanzaDifferingLinesLabel) {
               // deconstruct
               $stanzaDifferingLinesLabel.remove();

               if ($strictLinesInput.checked){
                  let slider = createCheckboxSlider({
                     id: 'poem-differing-lines',
                     text: 'Poem Contains Differing Lines?',
                     name : 'poem-differing-lines',
                     class : 'differing-lines'
                     });
                  $stanzaLineLength.insertAdjacentHTML("afterend", slider);
               }
            }
            if ($stanzaDifferingLinesSection) {
               // deconstruct
               $stanzaDifferingLinesSection.remove();
            }
         }
      }
      
      // STRICT RHYME SCHEME
      if (event.target == $strictRhymeInput) {
         // event: checked
         if ($strictRhymeInput.checked == true) {
            // activate 
            activate($rhymeScheme);
         }
         // event: unchecked
         else {
            deactivate($rhymeScheme);
         }
      }
      
      // STRICT SYLLABLE COUNT
      if (event.target == $strictSyllableInput) {
         // event: checked
         if ($strictSyllableInput.checked == true) {
            // if no differing lines section, activate
            if(!$poemDifferingLinesSection && !$stanzaDifferingLinesSection) {
               activate($syllablesPerLine);
            }
            // if differing lines, we need to activate each
            if ($poemDifferingLinesSection || $stanzaDifferingLinesSection) {
               // activate each entry in differing lines section
               document.querySelector('.differing-syllables').forEach(function (element) {
                  activate(element);
               })

            }

            // if strictLines or repeatingStanzas is checked we need to create differingLines checkbox if it doesn't exist already.
            if (($strictLinesInput.checked || $repeatingStanzasInput.checked) && !$differingLinesLabel) {
               // if repeating stanza checked create that one
               if ($repeatingStanzasInput.checked) {
                  let slider = createCheckboxSlider({
                     id: 'stanza-differing-lines',
                     text: 'Stanza Contains Differing Lines?',
                     name : 'stanza-differing-lines',
                     class : 'differing-lines'
                     });
                  $stanzaLineLength.insertAdjacentHTML("afterend", slider);
               }
               // if not checked, then ONLY strictlines is checked and we should create that one 
               else {
                  // create poem differing lines checkbox
                  let slider = createCheckboxSlider({
                     id: 'poem-differing-lines',
                     text: 'Poem Contains Differing Lines?',
                     name : 'poem-differing-lines',
                     class : 'differing-lines'
                     });
                  $stanzaLineLength.insertAdjacentHTML("afterend", slider);
               }
            }
         }
         // event: unchecked
         else {
            // deactivate syllables per line
            deactivate($syllablesPerLine);

            if ($poemDifferingLinesSection || $stanzaDifferingLinesSection) {
               // deactivate each entry in differing lines section
               document.querySelectorAll('.differing-syllables').forEach(function(element) {
                  deactivate(element);
               })
            }
            // if strict meter unchecked, we need to break down differing lines
            if ($strictMeterInput.checked == false) {
               // if differingLinesLabel, deconstruct
               if ($differingLinesLabel) {
                $differingLinesLabel.remove();
               }
               // if differingLinesSection, deconstruct
               if ($differingLinesSection) {
                  $differingLinesSection.remove();
               }
            }  
         }
      }

      // STRICT METER
      if (event.target == $strictMeterInput) {
         // event: checked
         if ($strictMeterInput.checked == true) {
            // if no differing lines section, activate meter inpput
            if(!$differingLinesSection){
               activate($meter);
            }
            // if differing lines section, we need to activate each 
            if ($differingLinesSection) {
               document.querySelectorAll('.differing-meter').forEach(function(element) {
                  activate(element);
               })
            }

            // if strictLines or repeatingStanzas is checked we need to create differingLines checkbox if it doesn't exist already.
            if (($strictLinesInput.checked || $repeatingStanzasInput.checked) && !$differingLinesLabel) {
               // if repeating stanza checked create that one
               if ($repeatingStanzasInput.checked) {
                  let slider = createCheckboxSlider({
                     id: 'stanza-differing-lines',
                     text: 'Stanza Contains Differing Lines?',
                     name : 'stanza-differing-lines',
                     class : 'differing-lines'
                     });
                  $stanzaLineLength.insertAdjacentHTML("afterend", slider);
               }
               // if not checked, then ONLY strictlines is checked and we should create that one 
               else {
                  // create poem differing lines checkbox
                  let slider = createCheckboxSlider({
                     id: 'poem-differing-lines',
                     text: 'Poem Contains Differing Lines?',
                     name : 'poem-differing-lines',
                     class : 'differing-lines'
                     });
                  $stanzaLineLength.insertAdjacentHTML("afterend", slider);
               }
            }
         }
         // event: unchecked
         else {
            deactivate($meter);

            if ($differingLinesSection) {
               // deactivate each
               document.querySelectorAll('.differing-meter').forEach(function(element) {
                  deactivate(element);
               })
            }
            // if strict syllable unchecked, need to break down differing lines
            if (!$strictSyllableInput.checked) {
               // if differingLinesLabel, deconstruct
               if ($differingLinesLabel) {
                  $differingLinesLabel.remove();
               }
               // if differingLinesSection, deconstruct
               if ($differingLinesSection) {
                  $differingLinesSection.remove();
               }
            }  
         }
      }

      // NUMBER of LINES
      if (event.target == $numberOfLinesInput) {
         let lineLength = event.target.value;
         // If poem differing lines is checked we need to reconstruct the differing section with the correct number of line
         // TODO it would be nice if this preserved what input there was there currently;
         if ($poemDifferingLinesInput && $poemDifferingLinesInput.checked == true) {
            // deconstruct and update
            $poemDifferingLinesSection.remove();

            let syllableFlag = $strictSyllableInput.checked;
            let meterFlag = $strictMeterInput.checked;
            createAndPlaceDifferingLinesSection(lineLength, 'poem', syllableFlag, meterFlag);
         }
      }

      // STANZA LINE LENGTH
      if (event.target == $stanzaLineLengthInput) {
         let lineLength = event.target.value;
         // If stanza differing lines is checked we need to reconstruct the differing section with the correct number of lines
         // TODO it would be nice if this preserved what input there was there currently;
         if ($stanzaDifferingLinesInput && $stanzaDifferingLinesInput.checked == true) {
            // deconstuct and update
            $stanzaDifferingLinesSection.remove();

            let syllableFlag = $strictSyllableInput.checked;
            let meterFlag = $strictMeterInput.checked;
            createAndPlaceDifferingLinesSection(lineLength, 'stanza', syllableFlag, meterFlag);
         }
      }

      // POEM DIFFERING LINES CHECKBOX INPUT
      if (event.target == $poemDifferingLinesInput) {
         // event: checked
         if ($poemDifferingLinesInput && $poemDifferingLinesInput.checked == true) {

            // get line length
            let lineLength = $numberOfLinesInput.value;
            // check flags
            let syllableFlag = $strictSyllableInput.checked;
            let meterFlag = $strictMeterInput.checked;
            // create differing line section
            createAndPlaceDifferingLinesSection(lineLength, 'poem', syllableFlag, meterFlag);

            // deactivate regular syllable and meter inputs
            deactivate($syllablesPerLine);
            deactivate($meter);

         }
         // event: unchecked;
         else {
            // remove section
            $poemDifferingLinesSection.remove();

            // reactivate syllable and meter inputs if applicable
            if($strictSyllableInput.checked){
               activate($syllablesPerLine);
            }
            if($strictMeterInput.checked){
               activate($meter);
            }

         }
         
      }

      // STANZA DIFFERING LINES CHECKBOX INPUT
      if (event.target == $stanzaDifferingLinesInput) {
         // event: checked
         if ($stanzaDifferingLinesInput.checked == true) {
            // get line length
            let lineLength = $stanzaLineLengthInput.value;
            // check flags
            let syllableFlag = $strictSyllableInput.checked;
            let meterFlag = $strictMeterInput.checked;
            // create differing line section
            createAndPlaceDifferingLinesSection(lineLength, 'stanza', syllableFlag, meterFlag);

            // deactivate regular syllable and meter inputs
            deactivate($syllablesPerLine);
            deactivate($meter);
         }
         // event: unchecked
         else {
            // remove section
            $stanzaDifferingLinesSection.remove();

            // reactivate syllable and meter inputs if applicable

            if($strictSyllableInput.checked){
               activate($syllablesPerLine);
            }
            if($strictMeterInput.checked){
               activate($meter);
            }
         }
         
      }

      // FORM VALIDATION LOGIC

      if (event.target == $numberOfLinesInput || event.target == $stanzaLineLengthInput) {
         let poemLines = $numberOfLinesInput.value;
         let stanzaLines = $stanzaLineLengthInput.value;

         if (poemLines % stanzaLines != 0){
            $stanzaLineLengthInput.setCustomValidity("Number of Lines must be divisible by Stanza Line Length");
         }
         else {
            $stanzaLineLengthInput.setCustomValidity("");
         }
      }

      if (event.target == $rhymeScheme) {
         let userInput = event.target.value;
         // TODO check if userInput uses only alphabet
         // TODO check if userInput has the correct number of characters
         
      }

      // TODO check to make sure query selector is working here
      if (event.target == $meter || event.target == document.querySelectorAll('.differing-meter') ) {
         let userInput = event.target.value;
         // TODO check if userInput uses only 'x' and '/'
         // TODO check that number of syllables matches syllables per line, if it exists. 
         
      }

   })
})
