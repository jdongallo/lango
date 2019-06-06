'use strict'

let object = undefined;
const input = document.getElementById("word");
let engText = ""; // Used in saveInput function 
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
  
function SmallCard(props) {
    return <div className="SmallCard">
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
        <button className="cardButton"> Add </button>
        <span className="LangoTitle"> Lango! </span> 
      </header>
      );
}


class MakeFooter extends React.Component {
  constructor(props){
    super(props);
  }

  render(){return(
    <footer>
      <span> username </span> 
     </footer> 
    );
    }
}


class SaveBtn extends React.Component{
  constructor(props) {
      super(props);
      this.saveInput = this.saveInput.bind(this);
      }

    render(){ return (
      <div className="SaveBtn">
       <button className="Save" onClick={this.saveInput}> Next </button>
      </div>
      );
    }

    saveInput() {
      let url = "/store?english=" + engText + "&spanish=" + transText;
      let xhr = createCORSRequest('GET', url);
  
      if (!xhr) {
          alert('CORS not supported');
          return;
      }
  
      xhr.onload = function() {
          let responseStr = xhr.responseText;
          console.log(responseStr);
      }.bind(this)
  
      xhr.onerror = function() {
          alert('There was an error in making the request');
      }.bind(this)
  
      xhr.send();
  }
}


// class 

class CreateCardMain extends React.Component {

  constructor(props) {
      super(props);
      this.state = { translation: "" }

      this.getTranslation = this.getTranslation.bind(this);
      }

  render() {return (
      <React.Fragment>
      <MakeHeader />
      <main>
      <Card>
          <div>
          <img src="../assets/noun_Refresh_2310283.svg" />
          </div>
      </Card>
      <SmallCard>
          <Txt phrase={this.state.translation} /> 
      </SmallCard>
      </main>
      <SaveBtn />
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
            this.setState({translation: object.Spanish});
            engText = object.English;
            transText = object.Spanish;
        }.bind(this)
    
        xhr.onerror = function() {
            alert('There was an error in making the request');
        }.bind(this)
    
        xhr.send();
    }
  }

} // end of class



ReactDOM.render(
    <CreateCardMain />,
    document.getElementById('root')
);
