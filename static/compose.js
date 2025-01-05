const compose = document.querySelector('#compose')
let lineCounter = 0;

function updateIndicator(inputElement, type, result){
   $label = inputElement.parentElement.querySelector('.' + type + '-indicator');
   // Remove an error class if it has one
   if($label){
      $label.classList.remove('exception');
      if (result) {
         $label.classList.add('good');
         $label.classList.remove('bad');
      }
      else {
         $label.classList.add('bad');
         $label.classList.remove('good');
      }
   }
   else{
      console.log(type, " indicator not found")
   }
   
}

function addIndicator(label, type){
   let indicator = document.createElement('div');
   indicator.classList.add('indicator');
   indicator.classList.add(type + '-indicator');

   label.appendChild(indicator);
}

// receives a poetic form, which it uses to generate the correct Indicators for Rhmye, Meter, and Syllable checking
// this should be run whenever there is input on the form that *might* change rhyme, meter, and/or syllable, but we don't know which in particular to run.
//    i.e. Rhmye Meter or Syllable inputs
// ALSO should be run whenever we create a new input
function createAndPlaceInputGroupIndicators(form, lineNumber) {
   console.log(form);

      // first let's clear current indicators
      const label = document.querySelector('label[for="line-' + lineNumber + '"]');
      const indicators = label.querySelectorAll('.indicator')
      if (indicators) {
         indicators.forEach(e => e.remove());
      }
      
      if(form.rhymeScheme) {
         addIndicator(label, "rhyme");
      }
      
      if(form.meter || form.differingLinesSection[lineNumber]?.meter) {
         addIndicator(label, "meter");
      }

      if(form.syllablesPerLine || form.differingLinesSection[lineNumber]?.syllablesPerLine) {
         addIndicator(label, "syllable");
      }
   // })
}

function updateAllInputGroupIndicators() {
   console.log("updateAllInputGroupIndicators")
   // select all input groups
   document.querySelectorAll('.input-group').forEach(element => {
      const lineNumber = element.id.slice(5, -6)
      createAndPlaceInputGroupIndicators(getFormData(), lineNumber)
   });
}

function addIndicatorToAllInputs(type) {
   // select all input groups
   document.querySelectorAll('.input-group').forEach(element => {
      const lineNumber = element.id.slice(5, -6)
      const label = document.querySelector('label[for="line-' + lineNumber + '"]');
      addIndicator(label, type);
   });
}

function removeIndicatorFromAllInputs(type) {
   // select all input groups
   document.querySelectorAll('.input-group').forEach(element => {
      element.querySelector('.' + type + '-indicator').remove();
   });
}



// Creates a new input group for the compose section
function createNewInputGroup() {
   let id = 'line-' + ++lineCounter;

   let $div = document.createElement('div');
   $div.classList.add('input-group');
   $div.id = id + '-group';

   let $label = document.createElement('label');
   $label.setAttribute("for", id);
   $label.classList.add('indicators');

   let $input = document.createElement('input')
   $input.id = id;
   $input.name = id;
   $input.type = 'text';
   $input.classList.add('compose-input')

   $div.appendChild($input);
   $div.appendChild($label); 

   return $div; 
}

// Runs thru all compose-inputs and checks them
function checkAllLines(){
   const inputs = document.querySelectorAll('.compose-input')
   inputs.forEach((element, index) => {
      CMUDict.checkLine(element.value, element);
   })
}

function checkAll(type) {
   const formOutput = getFormData();
   const inputs = document.querySelectorAll('.compose-input')
   inputs.forEach((element, index) => {
      
      if(type === "rhyme"){
         CMUDict.checkRhyme(element.value, formOutput.rhymeScheme, element, index, formOutput.rhymeDistance);
      }
      if(type === "meter"){
         if (formOutput.differingLinesSection[index]?.meter){
            CMUDict.checkMeter(element.value, formOutput.differingLinesSection[index].meter, element);
            return;
         }
         else if (formOutput.meter) {
               CMUDict.checkMeter(element.value, formOutput.meter, element);
         }
      }
      if(type === "syllable"){
         // check if we have differing section meter first
         if (formOutput.differingLinesSection[index]?.syllablesPerLine){
            CMUDict.checkSyllable(element.value, formOutput.differingLinesSection[index].syllablesPerLine, element);
            return;
         }
         else if (formOutput.syllablesPerLine) {
               CMUDict.checkSyllable(element.value, formOutput.syllablesPerLine, element);
         }
      }
   
      
   })
}

function checkAllRhymes(){
   const formOutput = getFormData();
   const maxDistance = formOutput.rhymeDistance;
   const inputs = document.querySelectorAll('.compose-input')
   inputs.forEach((element, index) => {
      CMUDict.checkRhyme(element.value, formOutput.rhymeScheme, element, index, maxDistance);
   })
}
function checkAllMeters(){
   const formOutput = getFormData();
   const inputs = document.querySelectorAll('.compose-input');
   inputs.forEach((element, index) => {
      // check if we have differing section meter first
      if (formOutput.differingLinesSection[index]?.meter){
         CMUDict.checkMeter(element.value, formOutput.differingLinesSection[index].meter, element);
         return;
      }
      else if (formOutput.meter) {
            CMUDict.checkMeter(element.value, formOutput.meter, element);
      }
   })
}
function checkAllSyllables(){
   const formOutput = getFormData();
   const inputs = document.querySelectorAll('.compose-input');
   inputs.forEach((element, index) => {
      // check if we have differing section meter first
      if (formOutput.differingLinesSection[index]?.syllablesPerLine){
         CMUDict.checkSyllable(element.value, formOutput.differingLinesSection[index].syllablesPerLine, element);
         return;
      }
      else if (formOutput.syllablesPerLine) {
            CMUDict.checkMeter(element.value, formOutput.syllablesPerLine, element);
      }
   })
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

   checkSyllable: function(text, numberOfSyllables, inputElement){
      if(!text){
         return;
      }
      let syllableIsGood = false;

      if (!this.dict) {
            console.error("Dictionary object is not initialized.");
            return;
      }
      try {
         const result = this.dict.check_syllable_validity(text, numberOfSyllables);
         console.log("Syllable Count validity result: ", result.is_valid);
         if (result.unrecognized_words.length > 0) {
            console.log("Unrecognized Words: ", result.unrecognized_words);
         }
         syllableIsGood = result.is_valid ? true : false;
         updateIndicator(inputElement, "syllable", syllableIsGood);

         
      }
      catch(e) {
         console.log("checkMeter exception");
         $label = inputElement.parentElement.querySelector('label');
         $label.classList.add('exception');
      }
   },

   checkMeter: function(text, meter, inputElement) {
      if(!text){
         return;
      }
      let meterIsGood = false;

      if (!this.dict) {
            console.error("Dictionary object is not initialized.");
            return;
      }
      try {
         const result = this.dict.check_meter_validity(text, meter);
         console.log("Meter validity result: ", result.is_valid);
         if (result.unrecognized_words.length > 0) {
            console.log("Unrecognized Words: ", result.unrecognized_words);
         }
         meterIsGood = result.is_valid ? true : false;
         updateIndicator(inputElement, "meter", meterIsGood);

         
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

   // TODO implement repeating rhyme schemes
   checkRhyme: function(text, meter, inputElement, lineNumber, maxDistance){
      if (!text) {
         return; 
      }
      let rhymeIsGood = -1;
      // remove white space
      const cleanScheme = meter.replace(/\s+/g, '');
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

      
      const rhymeType = schemeArray[lineNumber];
      // if this is the first line of its rhyme type, great 0 distance
      if (schemeObject[rhymeType][0] == lineNumber) {
         console.log("first rhyme of type ", rhymeType);
         updateIndicator(inputElement, "rhyme", true);
      }
      // otherwise compare it to the first of its rhyme type
      else{
         const firstRhymeTypeLineNubmer = schemeObject[rhymeType][0];
         const firstRhymeTypeLineText = document.querySelector('#line-' + firstRhymeTypeLineNubmer).value;
         // TODO will getRhymeDistance ever cuase an error??
         const distance = this.getRhymeDistance(text, firstRhymeTypeLineText);
         rhymeIsGood = distance <= maxDistance ? true : false;
         updateIndicator(inputElement, "rhyme", rhymeIsGood);
         console.log("rhyme distance between line ", firstRhymeTypeLineNubmer, " and ", lineNumber, ": ", distance); 
      }
   },

   cleanup: function() {
      if (this.dict) {
            this.dict.delete();
            this.dict = null;
      }
   },

   checkLine: function(lineText, inputElement) {
      // lineNumber is 0 indexed!
      const lineNumber = inputElement.id.slice(5);

      const formOutput = getFormData();

      if (formOutput.poemLineLength) {
         // check Poem Line Length
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
         const maxDistance = formOutput.rhymeDistance;
         this.checkRhyme(lineText, formOutput.rhymeScheme, inputElement, lineNumber, maxDistance)

      }
      if (formOutput.syllablesPerLine) {
         this.checkSyllable(lineText, formOutput.syllablesPerLine, inputElement);
      }
      if (formOutput.differingLinesSection[lineNumber]?.syllablesPerLine){
         this.checkSyllable(lineText, formOutput.differingLinesSection[lineNumber].syllablesPerLine, inputElement);
      }
      if (formOutput.meter) {
         this.checkMeter(lineText, formOutput.meter, inputElement);
      }
      if (formOutput.differingLinesSection[lineNumber]?.meter){
         this.checkMeter(lineText, formOutput.differingLinesSection[lineNumber].meter, inputElement);
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
            const newLineNumber = newInput.id.slice(5, -6)
            createAndPlaceInputGroupIndicators(getFormData(), newLineNumber);

            // send current line-value to send to checkLine();
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
      input.parentElement.id = 'line-' + (index) + '-group'
   })
}
