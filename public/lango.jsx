'use strict'

let object = undefined;
const input = document.getElementById("word");
let engText = ""; // Passed to saveInput function 
let transText = ""; // to store in database

function createCORSRequest(method, url) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    return xhr;
}

function Card(props) {
    return <div className="textCard">
         {props.children}
  </div>;
  }
  

function Txt(props) {
   if (props.phrase == undefined) {
      return <p>Text missing</p>;
      }
   else return <p>{props.phrase}</p>;
   }

function MakeHeader(){
  return(
      <header>
        <button className="cardButton"> Start Review </button>
        <span className="LangoTitle"> Lango! </span> 
      </header>
      );
}

function MakeFooter(props) {
  return(
    <footer>
      <span> username </span> 
     </footer> 
    );
}


class CreateCardMain extends React.Component {

  constructor(props) {
      super(props);
      this.state = { translation: "Life is a bowl of cherries" }

      this.getTranslation = this.getTranslation.bind(this);
      }

  render() {return (
      <React.Fragment>
      <MakeHeader />
      <main>
      <Card>
         <textarea id="inputEng" onKeyPress={this.getTranslation} />
      </Card>
      <Card>
          <Txt phrase={this.state.translation} /> 
      </Card>
      </main>
      <MakeFooter />
      </React.Fragment>
      );
    } // end of render function   

    // onKeyPress function for the textarea element
    // When the charCode is 13, the user has hit the return key
  //   checkReturn(event) {
  //  if (event.charCode == 13) {
  //     let newPhrase = document.getElementById("inputEng").value;
  //     this.setState({opinion: newPhrase} );
  //     }
  //  }

  getTranslation(event) {
    if (event.charCode == 13) {
        let url = "/translate?english=" + document.getElementById("inputEng").value;
        let xhr = createCORSRequest('GET', url);
    
        if (!xhr) {
            alert('CORS not supported');
            return;
        }
    
        xhr.onload = function() {
            let responseStr = xhr.responseText;
            object = JSON.parse(responseStr);
            console.log(object);
            // let output = document.getElementById("outputDiv");
            // output.textContent = object.Spanish;
            this.setState({translation: object.Spanish});
            engText = object.English;
            transText = object.Spanish;
        }.bind(this)
    
        xhr.onerror = function() {
            alert('There was an error in making the request');
        }
    
        xhr.send();
    }
  }

} // end of class



ReactDOM.render(
    <CreateCardMain />,
    document.getElementById('root')
);


   