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
        <textarea name={this.props.name} id={this.props.id} onKeyPress={this.props.keyFunction} required ></textarea>
      </fieldset>
    )
  }
}


// React component for the card (main component)
class Card extends React.Component {
  constructor(props){
    super(props);
    this.state = {english: "", spanish: "", front_visible: true};
    this.getFlashcards = this.getFlashcards.bind(this);
    this.nextCard = this.nextCard.bind(this);
    this.getNextCard = this.getNextCard.bind(this);
    this.flipAnimation = this.flipAnimation.bind(this);
    this.processInput = this.processInput.bind(this);
    this.flashcards = [];
    this.cardStats = {correct: "", seen: "", cardID: ""};
    this.index = 0;
  }
  render() {
    return(
      <React.Fragment>
        <div  id="flipper" className='card-container textCard'>
          <div className='card-body' onClick={this.flipAnimation}>
            <CardBack text={this.state.english} />

            <CardFront text={this.state.spanish}/>  
          </div>
        </div>
        <SmallCard>
        <CardTextarea id="input" keyFunction={this.processInput}/>
        </SmallCard>
        <NextBtn nextCard = {this.nextCard}/>
      </React.Fragment>
    )
  }  

  componentDidMount(){
    this.getFlashcards();
  }

  // Gets the next flash card immediately or after 0.5 seconds
  // depending on which side is visible
  nextCard(){
    if (!this.state.front_visible) {
      this.flipAnimation();
      setTimeout(this.getNextCard, 500);
    }
    else {
      this.getNextCard();
    }
  }

  // Actually gets the next flashcard
  getNextCard() {
    let eng = '';
    let es = '';
    while (true) {
      this.index = Math.floor(Math.random() * this.flashcards.length);
      let correct = this.flashcards[this.index].numCorrect;
      let seen = this.flashcards[this.index].numShown;
      let score = Math.max(1, 5-correct) + Math.max(1, 5-seen);
      if (seen == 0) {
        score += 5;
      }
      else {
        score += 5 * ( Math.floor((seen-correct)/seen) );
      }
      let randNum = Math.floor(Math.random() * 16);
      if (randNum <= score) {
        eng = this.flashcards[this.index].engText;
        es = this.flashcards[this.index].transText;
        this.cardStats.correct = this.flashcards[this.index].numCorrect;
        this.cardStats.seen = this.flashcards[this.index].numShown;
        this.cardStats.cardID = this.flashcards[this.index].idNum;
        break;
      }
    }
    this.setState({english: eng, spanish: es});
  }

  // Runs when component mounts to send an AJAX request to
  // get all of the user's current flashcards in the database
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

  flipAnimation() {
    let card = document.getElementsByClassName('card-body');
    if (this.state.front_visible == true) {
      card[0].classList.add('cardFlip');
      this.setState({front_visible : false});
    }
    else {
      card[0].classList.remove('cardFlip');
      this.setState({front_visible: true});
      setTimeout(this.getNextCard, 500);
    }
  }

  processInput(event) {
    if (event.charCode == 13 && this.state.front_visible == true) {
      let userAnswer = document.getElementById('input').value;
      let answer = document.getElementById('answer');
      let correctBox = document.getElementsByClassName('correctBox');
      console.log(this.state.english, userAnswer, '*');
      let url = `/update?shown=${this.cardStats.seen}&correct=${this.cardStats.correct}&id=${this.cardStats.cardID}`;
      if (this.state.english == userAnswer.trim()) {
        console.log("Correct answer");
        correctBox[0].classList.remove('hidden');
        answer.classList.add('hidden');
        url = url + "&isCorrect=true";

        //update local array of flashcards
        this.flashcards[this.index].numCorrect++;
        this.flashcards[this.index].numShown++;
      }
      else {
        console.log("Incorrect answer");
        correctBox[0].classList.add('hidden');
        answer.classList.remove('hidden');
        url = url + "&isCorrect=false";

        //update local array of flashcards
        this.flashcards[this.index].numShown++;
      }
      this.flipAnimation();

      console.log(url);
      // Send AJAX request to update database
      let xhr = createCORSRequest('GET', url);

      if (!xhr) {
        alert('CORS not supported');
        return;
      }
  
      xhr.onload = function () {
        console.log(xhr.responseText);
      }.bind(this)
  
      xhr.onerror = function () {
        alert('There was an error in making the request');
      }.bind(this)
  
      xhr.send();
    }
  }

}

// React component for the front side of the card
class CardFront extends React.Component {
  render(props) {
    return(
      <div className='card-side'>
         <div className='card-side-container'>
          <div className="icon">
            <img  src="noun_Refresh_2310283.svg" />
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
            <span id="congrats"> CORRECT! </span>
          </div>
              <h2 id='answer'>{this.props.text}</h2>
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
