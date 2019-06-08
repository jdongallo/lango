'use strict'

function createCORSRequest(method, url) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    return xhr;
}


class CardInput extends React.Component {
  render() {
    return(
      <fieldset>
        <input name={this.props.name} id={this.props.id} type={this.props.type || 'text'} placeholder={this.props.placeholder} required />
      </fieldset>
    )
  }
}

// React component for textarea
class CardTextarea extends React.Component {
  constructor(props){
    super(props);

  }
  render() {
    return(
      <fieldset>
        <textarea name={this.props.name} id={this.props.id} placeholder={this.props.placeholder} required ></textarea>
      </fieldset>
    )
  }
}


// React component for the card (main component)
class Card extends React.Component {
  constructor(props){
    super(props);
    this.state = {english: "", spanish: ""};
    this.getFlashcards = this.getFlashcards.bind(this);
    this.nextCard = this.nextCard.bind(this);
    this.flashcards = [];
  }
  render() {
    return(
      <React.Fragment>
        <div  id="flipper" className='card-container textCard'>
          <div className='card-body'>
            <CardBack text={this.state.english} />

            <CardFront text={this.state.spanish} />  
          </div>
        </div>
        <SmallCard>
        <CardTextarea  />
        </SmallCard>
        <NextBtn nextCard = {this.nextCard}/>
      </React.Fragment>
    )
  }  

  componentDidMount(){
    this.getFlashcards();
  }

  nextCard(){
    let eng = '';
    let es = '';
    while (true) {
      let index = Math.floor(Math.random() * this.flashcards.length);
      let correct = this.flashcards[index].numCorrect;
      let seen = this.flashcards[index].numShown;
      let score = Math.max(1, 5-correct) + Math.max(1, 5-seen);
      if (seen == 0) {
        score += 5;
      }
      else {
        score += 5 * ( Math.floor((seen-correct)/seen) );
      }
      let randNum = Math.floor(Math.random() * 16);
      if (randNum <= score) {
        eng = this.flashcards[index].engText;
        es = this.flashcards[index].transText;
        break;
      }
    }
    this.setState({english: eng, spanish: es});
  }

  getFlashcards() {
    let url = "/flashcards";
    let xhr = createCORSRequest('GET', url);

    if (!xhr) {
      alert('CORS not supported');
      return;
    }

    xhr.onload = function () {
      let responseStr = xhr.responseText;
      this.flashcards = JSON.parse(responseStr);
      console.log(this.flashcards);
      this.nextCard();
    }.bind(this)

    xhr.onerror = function () {
      alert('There was an error in making the request');
    }.bind(this)

    xhr.send();

  }

}

// React component for the front side of the card
class CardFront extends React.Component {
  constructor(props){
    super(props);

  }

  render(props) {
    return(
      <div className='card-side side-front'>
         <div className='card-side-container'>
             <div className="icon">
          <img  src="../assets/noun_Refresh_2310283.svg" />
          </div> 
            <h2 id='trans'>{this.props.text}</h2>

        </div>
      </div>
    )
  }
}

// React component for the back side of the card
class CardBack extends React.Component {
  render(props) {
    return(
      <div className='card-side side-back'>
         <div className='card-side-container'>
          <div className="correctBox">
            <span className="correctText"> CORRECT! </span>
          </div>
              <h2 id='congrats'>{this.props.text}</h2>
        </div>
      </div>
    )
  }
}


function SmallCard(props){
  return( <div className="SmallCard"> 
          {props.children}
          </div> ) 
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
        <a className="cardButton" href="lango.html"> Add </a>
        <span className="LangoTitle"> Lango! </span> 
      </header>
      );
}


class MakeFooter extends React.Component {
  constructor(props){
    super(props);
    this.state = {name: ""};
    this.getName = this.getName.bind(this);
  }

  render(){return(
    <footer>
      <Txt phrase = {this.state.name}/>
     </footer> 
    );
    }

  componentDidMount(){
    this.getName();
  }

  getName(){
    let url = "/name";
    let xhr = createCORSRequest('GET', url);

    if (!xhr) {
      alert('CORS not supported');
      return;
    }

    xhr.onload = function () {
      let responseStr = xhr.responseText;
      this.setState({name: responseStr});
    }.bind(this)

    xhr.onerror = function () {
      alert('There was an error in making the request');
    }.bind(this)

    xhr.send();
  }
}


class NextBtn extends React.Component{
  constructor(props) {
      super(props);
      }

    render(){ return (
      <div className="SaveBtn">
       <button className="Save" onClick={this.props.nextCard}> Next </button>
      </div>
      );
    }
 }

class CreateCardMain extends React.Component {

  constructor(props) {
      super(props);
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
      </main>
      <MakeFooter />
      </React.Fragment>
      );
    }

} // end of class

ReactDOM.render(
    <CreateCardMain />,
    document.getElementById('root')
);
