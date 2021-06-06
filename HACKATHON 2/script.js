var email = document.querySelector('#email');
var message = document.querySelector('#message');
var synth = window.speechSynthesis;
        function speak(msg){
            var utterThis = new SpeechSynthesisUtterance(msg);
            synth.speak(utterThis);
        }
        var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
        var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
        var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

        var grammar = '#JSGF V1.0;'

        var recognition = new SpeechRecognition();
        var speechRecognitionList = new SpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;
        
        recognition.onresult = function(event) {
            var last = event.results.length - 1;
            var command = event.results[0][0].transcript;
            message.textContent = 'Voice Input: ' + command ;
            let words = command.toLowerCase();
            if(words.includes('email')){
                let element = document.querySelector("input[name='Email']");
                element.focus();
                
                let value = command.substr(command.indexOf(" ") + 1);
                let recordedString = value.toLowerCase().replace(/\s/g, "");
                element.value = recordedString;
                speak("Your email is " + recordedString + " Let's proceed");
                setTimeout(() => {
                    recognition.start();
                }, 3000);
            }
            else if(words.includes('name')){
                let element = document.querySelector("input[name='Name']");
                element.focus();
                
                let recordedString = command.substr(command.indexOf(" ") + 1);
    
                element.value = recordedString;
                speak("Your name is " + recordedString + " Let's proceed");
                setTimeout(() => {
                    recognition.start();
                }, 3000);
            }
            else if(words.includes('batch')){
                let element = document.querySelector("select[name='Batch']");
                element.focus();
                let options = element.options;
                for(let i=0; i<options.length; i++){
                    if(command.includes(options[i].value)){
                        options[i].selected = true;
                    }
                }
                
                let recordedString = command.substr(command.indexOf(" ") + 1);
                speak("Your are from batch of " + recordedString + " Let's proceed");
                setTimeout(() => {
                    recognition.start();
                }, 3000);
            }
            else if(words.includes('experience')){
                let element = document.querySelector("select[name='Experience']");
                element.focus();
                
                let options = element.options;
                if(command.includes('0') || command.includes('zero')){
                    options[0].selected = true;
                }
                else if(command.includes('1') || command.includes('one')){
                    options[1].selected = true;
                }
                else{
                    options[2].selected = true;
                }
                // for(let i=0; i<options.length; i++){
                //     console.log(options[i].value);
                //     if(command.includes(options[i].value)){
                        
                //         options[i].selected = true;
                //     }
                // }
                // for (var option of document.querySelector("select[name='Experience']").options) {
                //     if(command.includes(option.value)){
                //         option.selected = "true";
                //     }
                // }

                let recordedString = command.substr(command.indexOf(" ") + 1);
    
                speak("Your have experience of " + recordedString + " Let's proceed");
                setTimeout(() => {
                    recognition.start();
                }, 3000);
            } 
            else if(words.includes('done')){
                speak("Okay, let's validate your id");
                setTimeout(() => {
                    document.getElementById('verify-button').click();
                }, 3000);
            }
            else{
                speak("Come again")
                setTimeout(() => {
                    recognition.start();
                }, 2000);
            }  
        };

        recognition.onspeechend = function() {
            recognition.stop();
        };

        recognition.onerror = function(event) {
            message.textContent = 'Error occurred in recognition: ' + event.error;
        }        

        document.getElementById('activate').addEventListener('click', function(){
            // alert('Clicked');
            speak("Hi, this is your assistant");
            setTimeout(() => {
                recognition.start();
            }, 1000);
            

        });

        