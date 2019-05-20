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


class CreateCardMain extends React.Component {

  constructor(props) {
      super(props);
      this.state = { opinion: "Life is a bowl of cherries" }

      this.checkReturn = this.checkReturn.bind(this);
      }

  render() {return (
      <main>
      <Card>
         <textarea id="inputEng" onKeyPress={this.checkReturn} />
      </Card>
      <Card>
          <Txt phrase={this.state.opinion} /> 
      </Card>
      </main>
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


   