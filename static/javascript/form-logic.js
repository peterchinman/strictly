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

document.addEventListener('DOMContentLoaded', function() {
   const strictCheckboxes = document.querySelectorAll('input[type=checkbox][name=strict-checkbox]');

   var strictOptionArray = []

   strictCheckboxes.forEach(function(checkbox) {
      // record initial states
      
      checkbox.addEventListener('change', function() {
         strictOptionArray =
            Array.from(strictCheckboxes)
            .filter(i => i.checked)
            .map(i => i.value);
         console.log(strictOptionArray);
         
         if (strictOptionArray.includes("strict-lines")) {
            // include number of lines input
            console.log("strict lines checked")
         }
   
         if (strictOptionArray.includes("repeating-stanzas")) {
            // include stanza line length input

            // needs to check that number of lines is a multiple of stanza line length

            // include stanzas contain differing lines slider

            //if that is checked need to populate line options for the number of lines
         }

         if (strictOptionArray.includes("repeating-stanzas") || strictOptionArray.includes("strict-lines")) {
            // enable strict rhyme
            strictRhyme.disabled = false;
            
         }
         else {
            strictRhyme.disabled = true;
         }

   
         if (strictOptionArray.includes("strict-rhyme")) {
            // include rhyme schme input
            // also should indicate what strict rhyme is applying to
         }

         if (strictOptionArray.includes("strict-meter")) {
            // if NOT differing lines
            // include meter input
         }
   
      })
   })

})






