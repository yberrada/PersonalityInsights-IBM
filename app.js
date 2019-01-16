'use strict';
var fs = require('fs');
var express=  require('express');
var bodyParser = require('body-parser');
var app= express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
const tone_analyzer = new ToneAnalyzerV3({
  iam_apikey: "3_G1PdBG8k-Bj6Kc-BAaDI2-gcYTBHa6kQtUYkw4cJD2",
  version: "2018-03-19",
  url: "https://gateway.watsonplatform.net/tone-analyzer/api"
});


app.get('/', function (req, res) {
  res.render('index', {val: null,val2:null, error: null});
})
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', function (req, res) {

  var contents = fs.readFileSync(req.body.chat, 'utf8');
    let params = {
      tone_input: contents,
      content_type: 'text/plain',
      sentences: true
    };
    tone_analyzer.tone(params, function (err, response) {
      var maxScore =0;
      var maxName='';
        if (err) {
          console.log(err);
        } else {
          console.log("The main tones detected in this review are: ");
          for(var i=0;i<response.document_tone.tones.length;i++){
            if(response.document_tone.tones[i].score>0.5)
            console.log(response.document_tone.tones[i].tone_name);
          }
          console.log("The sentences that are the most relevant:");
          for(var i=0;i<response.sentences_tone.length;i++){
            for(var j=0;j<response.sentences_tone[i].tones.length;j++){
              if(response.sentences_tone[i].tones[j].score>0.7 && response.sentences_tone[i].tones[j].score>maxScore && response.sentences_tone[i].tones[j].tone_name != 'Confident' &&response.sentences_tone[i].tones[j].tone_name != 'Analytical'){
                console.log("###########################################");
                console.log(response.sentences_tone[i].tones[j].tone_name);
                console.log(response.sentences_tone[i].tones[j].score);
                console.log(response.sentences_tone[i].text);
                maxScore = response.sentences_tone[i].tones[j].score;
                maxName=response.sentences_tone[i].tones[j].tone_name;
              }
          }
      }
      res.render('index', {val:maxName,val2:maxScore,error: null});

      }
      });

})
app.listen(3000,()=>{
  console.log("output to port 3000");
})
