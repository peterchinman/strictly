var createYourOwnButton = document.getElementById('create-your-own');
var customFormBoolean = false;

var strictLines = document.getElementById('strict-lines');
var repeatingStanzas = document.getElementById('repeating-stanzas');
var strictRhyme = document.getElementById('strict-rhyme');
var strictSyllable = document.getElementById('strict-syllable');
var strictMeter = document.getElementById('strict-meter')


createYourOwnButton.addEventListener('click', function() {
   createYourOwnButton.classList.toggle('active');
})

function createFieldGroup(labelText, inputId, type) {

   if (!document.getElementById(inputId)) {
      // Create field-group
      const fieldGroup = document.createElement('field-group');
      fieldGroup.setAttribute('id', inputId + '-group'); // Unique id for the group for easy removal
      // Create label
      const label = document.createElement('label');
      label.setAttribute('for', inputId);
      label.textContent = labelText;

      // Create the input
      const input = document.createElement('input');
      input.setAttribute('id', inputId);
      input.setAttribute('name', inputId);
      input.setAttribute('type', type);

      // Append the label and input to the field-group
      fieldGroup.appendChild(label);
      fieldGroup.appendChild(input);

      // Append the field-group to the desired parent container
      // document.querySelector('#container').appendChild(fieldGroup);

      const moreOptions = document.getElementById('more-options')

      // this is a complicated system for getting them to appear in the right order
      const inputOrder = ['number-of-lines', 'stanza-line-length', 'rhyme-scheme', 'syllables-per-line', 'meter']
      let elementAdded = false;
      inputOrder.forEach((element, index) => {
         if (inputId === element) {
            for (let i = index; i < inputOrder.length; ++i) {
               if (document.getElementById(inputOrder[i])) {
                  moreOptions.insertBefore(fieldGroup, document.getElementById(inputOrder[i] + '-group'))
                  elementAdded = true;
               }
            }
         }
      })

      if (!elementAdded) {
         moreOptions.appendChild(fieldGroup)
      }

      return fieldGroup;
   }
   
}

function removeFieldGroup(inputId){
   const fieldGroup = document.getElementById(inputId + '-group');
    if (fieldGroup) {
        fieldGroup.remove();
    }
}

document.addEventListener('DOMContentLoaded', function() {
   const strictCheckboxes = document.querySelectorAll('input[type=checkbox][name=strict-checkbox]');

   var strictOptionArray = []

   strictCheckboxes.forEach(function(checkbox) {
      
      checkbox.addEventListener('change', function(event) {

         strictOptionArray =
            Array.from(strictCheckboxes)
            .filter(i => i.checked)
            .map(i => i.value);
         console.log(strictOptionArray)

         if (strictLines.checked) {
            // include number of lines input
            const fieldGroup = createFieldGroup('Number of Lines', 'number-of-lines', 'number');
            
         }
         else {
            removeFieldGroup('number-of-lines')
         }
   
         if (repeatingStanzas.checked) {
            // include stanza line length input
            const fieldGroup = createFieldGroup('Stanza Line Length', 'stanza-line-length', 'number')
           
            // TODO needs to check that number of lines is a multiple of stanza line length

            // TODO include stanzas contain differing lines slider

            //if that is checked need to populate line options for the number of lines
         }
         else {
            removeFieldGroup('stanza-line-length')
         }

         if (repeatingStanzas.checked || strictLines.checked) {
            // enable strict rhyme
            strictRhyme.disabled = false;
            
         }
         else {
            strictRhyme.checked = false;
            strictRhyme.disabled = true;
         }

   
         if (strictRhyme.checked) {
            // include rhyme schme input
            const fieldGroup = createFieldGroup('Rhyme Scheme', 'rhyme-scheme', 'text')
            // also should indicate what strict rhyme is applying to
         }
         else {
            removeFieldGroup('rhyme-scheme')
         }

         if (strictSyllable.checked) {
            createFieldGroup('Syllables per Line', 'syllables-per-line', 'number')
         }
         else {
            removeFieldGroup('syllables-per-line')
         }

         if (strictMeter.checked) {
            // if NOT differing lines

            // include meter input
            createFieldGroup('Meter', 'meter', 'text')
         }
         else {
            removeFieldGroup('meter')
         }
   
      })
   })

})






