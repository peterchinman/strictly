const compose = document.querySelector('#compose')
let lineCounter = 1;

function updateElementRhymeClass(inputElement, distance){
   $rhymeLabel = inputElement.parentElement.querySelector('.rhyme-label');

   // TODO don't hard code this distance, expose it to the user
   if (distance < 7) {
      $rhymeLabel.classList.add('rhyme-good');
      $rhymeLabel.classList.remove('rhyme-bad');
   }
   else {
      $rhymeLabel.classList.add('rhyme-bad');
      $rhymeLabel.classList.remove('rhyme-good');
   }
}
function updateElementMeterClass(inputElement, result){
   // Element class update 
   $meterLabel = inputElement.parentElement.querySelector('.meter-label');
   // Remove an error class if it has one
   $meterLabel.classList.remove('exception');
   if (result.is_valid) {
      $meterLabel.classList.add('meter-good');
      $meterLabel.classList.remove('meter-bad');
   }
   else {
      $meterLabel.classList.add('meter-bad');
      $meterLabel.classList.remove('meter-good');
   }
}

// Creates a new input group for the compose section
function createNewInputGroup() {
   let id = 'line-' + ++lineCounter;

   let $div = document.createElement('div');
   $div.classList.add('input-group');

   let $label = document.createElement('label');
   $label.for = id

   let $rhymeLabel = document.createElement('div');
   $rhymeLabel.classList.add("rhyme-label");

   let $meterLabel = document.createElement('div');
   $meterLabel.classList.add("meter-label");
   

   $label.appendChild($rhymeLabel);
   $label.appendChild($meterLabel);

   let $input = document.createElement('input')
   $input.id = id;
   $input.name = id;
   $input.type = 'text';

   $div.appendChild($label); 
   $div.appendChild($input);

   return $div; 
}

// Object to hold our CMUDict library
const CMUDict = {
   dict: null,
   moduleInstance: null,

   init: async function() {
      this.moduleInstance = await Module();
      this.dict = new this.moduleInstance.CMU_Dict();
      console.log("Dictionary initialized.");
   },

   checkMeter: function(text, meter, inputElement) {
      if (!this.dict) {
            console.error("Dictionary object is not initialized.");
            return;
      }
      try {
         const result = this.dict.check_meter_validity(text, meter);
         console.log("Meter validity result: ", result.is_valid);
         // if (result.unrecognized_words.length > 0) {
         //    console.log("Unrecognized Words: ", result.unrecognized_words);
         // }
         updateElementMeterClass(inputElement, result);

         
      }
      catch(e) {
         console.log("checkMeter exception");
         $label = inputElement.parentElement.querySelector('label');
         $label.classList.add('exception');
      }
      
   },

   getRhymeDistance: function(line1, line2) {
      if (!this.dict) {
            console.error("Dictionary object is not initialized.");
            return;
      }
      try {
         // TODO: note you misspelled rhyme in the method name, need to fix it in the Emscripten binding, recompile, and then change it here
         const distance = this.dict.get_end_rhmye_distance(line1, line2);
         return distance;
      } catch(e) {
         console.log("checkRhyme error")
      }
   },

   cleanup: function() {
      if (this.dict) {
            this.dict.delete();
            this.dict = null;
      }
   },

   checkLine: function(lineText, inputElement) {
      const formOutput = getFormData();
      console.log(formOutput);
      if (formOutput.numberOfLines) {
         // check number of lines
      }
      if (formOutput.stanzaLineLength) {
         // check stanza line length
      }
      if (formOutput.poemDifferingLines) {
         // check poem differing lines
      }
      if (formOutput.stanzaDifferingLines) {
         // check stanza differing lines
      }
      if (formOutput.rhymeScheme) {
         // remove white space
         cleanScheme = formOutput.rhymeScheme.replace(/\s+/g, '');
         schemeArray = Array.from(cleanScheme);
         /**
          * we want to transform
          * 
          * schemeArray = {"A", "B", "A", "B"}
          * 
          * to
          * 
          * schemeObject = {
          *    A: [0, 2]
          *    B: [1, 4]
          * }
          */
         schemeObject = {}
         schemeArray.forEach((element, index) => {
            schemeObject[element] = schemeObject[element] || [];
            schemeObject[element].push(index);
         })
      
         
         const lineNumber = inputElement.id.slice(5);
         const rhmyeType = schemeArray[lineNumber];
         // if this is the first line of its rhyme type, great 0 distance
         if (schemeObject[rhmyeType][0] == lineNumber) {
            console.log("first rhyme of type ", rhmyeType);
            updateElementRhymeClass(inputElement, 0);
         }
         // otherwise compare it to the first of its rhyme type
         else{
            const firstRhymeTypeLineNubmer = schemeObject[rhmyeType][0];
            const firstRhymeTypeLineText = document.querySelector('#line-' + firstRhymeTypeLineNubmer).value;
            const distance = this.getRhymeDistance(lineText, firstRhymeTypeLineText);
            updateElementRhymeClass(inputElement, distance);
            console.log("rhmye distance: ", distance); 
         }

      }
      if (formOutput.syllablesPerLine) {
         // check syllables per line
      }
      if (formOutput.meter) {
         this.checkMeter(lineText, formOutput.meter, inputElement);
      }

   }
};


// COMPOSE FIELD LOGIC
// First, asynch init our CMUDict object
CMUDict.init().then( () => {

   let string1 = "pulley";
   let string2 = "bully";
   CMUDict.getRhymeDistance(string1, string2); 

   compose.addEventListener('keydown', function(event) {
      if (event.target.matches('input')) {

         if (event.target.id != 'line-0') {
            if (event.key === "Backspace") {
               if (event.target.value === "") {
                  let id = parseInt(event.target.id.slice(5));
                  event.target.parentElement.remove();
                  document.querySelector('#line-' + (id - 1)).focus();
                  reorganizeLineId();
               }
            }

         }
         
         if (event.key === "Enter") {
            // create a new input beneath current one
            let newInput = createNewInputGroup();
            event.target.parentElement.insertAdjacentElement("afterend", newInput);
            newInput.querySelector('input').focus();

            // record current line-value to send to checkMeter();
            const lineText = event.target.value;
            CMUDict.checkLine(lineText, event.target);

            reorganizeLineId();
         }

         if (event.key === "ArrowUp") {
            let id = parseInt(event.target.id.slice(5))
            if (document.querySelector('#line-' + (id - 1))) {
               document.querySelector('#line-' + (id - 1)).focus();
            }
         }
         if (event.key === "ArrowDown") {
            let id = parseInt(event.target.id.slice(5))
            if (document.querySelector('#line-' + (id + 1))) {
               document.querySelector('#line-' + (id + 1)).focus();
            }
         }

      }
      
   }) 

})

function reorganizeLineId() {
   compose.querySelectorAll('input').forEach((input, index) => {
      input.id = 'line-' + (index);
      input.parentElement.querySelector('label').setAttribute('for', 'line-' + (index));
   })
}
