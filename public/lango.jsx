'use strict'

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
    <footer className="footy">
      <span> username </span> 
     </footer> 
    );
}


class CreateCardMain extends React.Component {

  constructor(props) {
      super(props);
      this.state = { opinion: "Life is a bowl of cherries" }

      this.checkReturn = this.checkReturn.bind(this);
      }

  render() {return (
      <div className="insideBody">
      <MakeHeader />
      <main>
      <Card>
         <textarea id="inputEng" onKeyPress={this.checkReturn} />
      </Card>
      <Card>
          <Txt phrase={this.state.opinion} /> 
      </Card>
      </main>
      <MakeFooter />
      </div>
      );
    } // end of render function   

    // onKeyPress function for the textarea element
    // When the charCode is 13, the user has hit the return key
    checkReturn(event) {
   if (event.charCode == 13) {
      let newPhrase = document.getElementById("inputEng").value;
      this.setState({opinion: newPhrase} );
      }
   }


  } // end of class



ReactDOM.render(
    <CreateCardMain />,
    document.getElementById('root')
);


   