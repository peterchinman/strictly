function getFormData(){

   const formOutput = {
      numberOfLines: 0,
      stanzaLineLength: 0,
      poemDifferingLines: false,
      stanzaDifferingLines: false,
      rhymeScheme: "",
      syllablesPerLine: 0,
      meter: "",
      differingLines: {}
   };

   formOutput.numberOfLines = document.querySelector('#number-of-lines').value;
   formOutput.stanzaLineLength = document.querySelector('#stanza-line-length').value;
   if (document.querySelector('#poem-differing-lines')){
      formOutput.poemDifferingLines = document.querySelector('#poem-differing-lines').checked
   }
   if (document.querySelector('#stanza-differing-lines')){
      formOutput.stanzaDifferingLines = document.querySelector('#stanza-differing-lines').checked
   }
   formOutput.rhymeScheme = document.querySelector('#rhyme-scheme').value;

   // differingLines?
   if(formOutput.poemDifferingLines || formOutput.stanzaDifferingLines) {
      const differingSyllables = document.querySelectorAll('.differing-syllables input');
      differingSyllables.forEach((element, index) => {
         formOutput.differingLines[index] = formOutput.differingLines[index] || {};
         formOutput.differingLines[index].differingSyllables = element.value || 0;
      })

      const differingMeter = document.querySelectorAll('.differing-meter input');
      differingMeter.forEach((element, index) => {
         formOutput.differingLines[index] = formOutput.differingLines[index] || {};
         formOutput.differingLines[index].differingMeter = element.value || "";
      })
   }
   else {
      formOutput.syllablesPerLine = document.querySelector('#syllables-per-line').value;
      formOutput.meter = document.querySelector('#meter').value;
   }



   return formOutput;
}

/**
 * Creates a  <field-group>, and initializes it to .disabled. <field-group> id = field.inputId + "-group".
 * 
 * Example of what the javascript generates
   		<field-group>
				<label for="number-of-lines">Number of Lines</label>
				<input id="number-of-lines" name="number-of-lines" type="number">
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
      label.textContent = field.labelText;

      // Create the input
      const input = document.createElement('input');
      input.id = field.inputId;
      input.name = field.inputId;
      input.type = field.type;
      input.classList.add('empty');
      // input.setAttribute('disabled', true);

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


// MAIN EVENT, LET"S GOO, WEE-OOO WEEE_OOOOO
document.addEventListener('DOMContentLoaded', function() {

   // declare the fieldgroup inputs
   const $numberOfLinesInput = document.querySelector('#number-of-lines');
   const $stanzaLineLengthInput = document.querySelector('#stanza-line-length');
   const $rhymeSchemeInput = document.querySelector('#rhyme-scheme');
   const $syllablesPerLineInput = document.querySelector('#syllables-per-line');
   const $meterInput = document.querySelector('#meter');

   // generic differing lines checkbox selector
   const $differingLinesInput = document.querySelector('.differing-lines');

   document.addEventListener('input', function(event) {

      // VARIABLE DECLARATION FOR DYNAMIC ELEMENTS
      // any of these may be null! so check for them before using them!

      // specific differing lines checkbox selectors
      const $poemDifferingLinesInput = document.getElementById('poem-differing-lines')
      const $stanzaDifferingLinesInput = document.getElementById('stanza-differing-lines');

      // differingLinesSections
      const $poemDifferingLinesSection = document.getElementById('poem-differing-lines-section');
      const $stanzaDifferingLinesSection = document.getElementById('stanza-differing-lines-section');


      /*******************
       * EVENT DELEGATION
       *******************/

      // STRICT LINES
      if (event.target == $numberOfLinesInput) {
         // event: empty to non-empty
         if ($numberOfLinesInput.classList.contains('empty') && $numberOfLinesInput.value > 0) {
            // no longer empty
            $numberOfLinesInput.classList.remove('empty');

            // activate poem-differing-lines
            if ($poemDifferingLinesInput) {
               $poemDifferingLinesInput.disabled = false;
            }
            
         }
         // event: non-empty to empty
         else if($numberOfLinesInput.value <= 0){
            $numberOfLinesInput.classList.add('empty');

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
            console.log("updating poemDifferingLinesSection")
            $poemDifferingLinesSection.remove();
            let lineLength = event.target.value;
            createAndPlaceDifferingLinesSection(lineLength, 'poem');
         }
      }

      // REPEATING STANZAS
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
               
               if ($numberOfLinesInput.value > 0) {
                  let lineLength = $numberOfLinesInput.value;
                  createAndPlaceDifferingLinesSection(lineLength, "poem")
               }
            }

            if (! $numberOfLinesInput.value > 0) {
               $differingLinesInput.disabled = true;
            }
         }

         // If stanza differing lines is checked we need to reconstruct the differing section with the correct number of lines
         // TODO it would be nice if this preserved what input there was there currently;
         if ($stanzaDifferingLinesInput && $stanzaDifferingLinesInput.checked == true) {
            // deconstuct and update
            let lineLength = event.target.value;
            $stanzaDifferingLinesSection.remove();
            createAndPlaceDifferingLinesSection(lineLength, 'stanza');
         }
      }
      
      // STRICT RHYME SCHEME
      if (event.target == $rhymeSchemeInput) {
         // event: empty to non-empty
         if ($rhymeSchemeInput.classList.contains('empty') && $rhymeSchemeInput.value != "") {
            // activate 
            $rhymeSchemeInput.classList.remove('empty')
         }
         // event: non-empty to empty
         else {
            $rhymeSchemeInput.classList.add('empty')
         }
      }
      
      // STRICT SYLLABLE COUNT
      if (event.target == $syllablesPerLineInput) {
         // event: empty to non-empty
         if ($syllablesPerLineInput.classList.contains('empty') && $syllablesPerLineInput.value > 0) {
            $syllablesPerLineInput.classList.remove('empty');
         }
         // event: unchecked
         else if ($syllablesPerLineInput.value <= 0) {
            // deactivate syllables per line
            $syllablesPerLineInput.classList.add('empty');
         }
      }

      // STRICT METER
      if (event.target == $meterInput) {
         // event: empty to non-empty
         if ($meterInput.classList.contains('empty') && $meterInput.value != "") {
            $meterInput.classList.remove('empty');
         }
         // event: non-empty to empty
         else {
            $meterInput.classList.add('empty');
         }
      }

      // POEM DIFFERING LINES CHECKBOX INPUT
      if (event.target == $poemDifferingLinesInput) {
         // event: checked
         if ($poemDifferingLinesInput && $poemDifferingLinesInput.checked == true) {
            // get line length
            let lineLength = $numberOfLinesInput.value;
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

      if (event.target == $numberOfLinesInput || event.target == $stanzaLineLengthInput) {
         let poemLines = $numberOfLinesInput.value;
         let stanzaLines = $stanzaLineLengthInput.value;

         if ((poemLines > 0 && stanzaLines > 0) && (poemLines % stanzaLines != 0)){
            $stanzaLineLengthInput.setCustomValidity("Number of Lines must be divisible by Stanza Line Length");
         }
         else {
            $stanzaLineLengthInput.setCustomValidity("");
         }
      }

      if (event.target == $rhymeSchemeInput) {
         let userInput = event.target.value;
         // TODO check if userInput uses only alphabet
         // TODO check if userInput has the correct number of characters    
      }

      // TODO check to make sure query selector is working here
      if (event.target == $meterInput || event.target == document.querySelectorAll('.differing-meter') ) {
         let userInput = event.target.value;
         // TODO check if userInput uses only 'x' and '/'
         // TODO check that number of syllables matches syllables per line, if it exists. 
         
      }
   })
})
