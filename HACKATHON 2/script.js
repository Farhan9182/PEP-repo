var email = document.querySelector('#email');
var message = document.querySelector('#message');
        var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
        var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
        var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

        var grammar = '#JSGF V1.0;'

        var recognition = new SpeechRecognition();
        var speechRecognitionList = new SpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        recognition.onresult = function(event) {
            var last = event.results.length - 1;
            var command = event.results[0][0].transcript;
            message.textContent = 'Voice Input: ' + command ;
            console.log('Confidence: ' + event.results[0][0].confidence);
            if(command.toLowerCase() === 'email'){
                document.getElementById('email').focus();
                speak("What is your email");
                
                

            }
            else if (command.toLowerCase() === 'select tony'){
                document.querySelector('#chkTony').checked = true;
            }
            else if (command.toLowerCase() === 'select bruce'){
                document.querySelector('#chkBruce').checked = true;
            }
            else if (command.toLowerCase() === 'select nick'){
                document.querySelector('#chkNick').checked = true;
            }   
        };

        recognition.onspeechend = function() {
            recognition.stop();
        };

        recognition.onerror = function(event) {
            message.textContent = 'Error occurred in recognition: ' + event.error;
        }        

        // document.querySelector('.button').addEventListener('click', function(){
        //     // alert('Clicked');
        //     recognition.start();

        // });

        var synth = window.speechSynthesis;
        function speak(msg){
            var utterThis = new SpeechSynthesisUtterance(msg);
            synth.speak(utterThis);
        }