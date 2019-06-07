'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var object = undefined;
var input = document.getElementById("word");
var engText = ""; // Used in saveInput function 
var transText = ""; // to store in database
var flashcards = [];

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  return xhr;
}

var CardInput = function (_React$Component) {
  _inherits(CardInput, _React$Component);

  function CardInput() {
    _classCallCheck(this, CardInput);

    return _possibleConstructorReturn(this, (CardInput.__proto__ || Object.getPrototypeOf(CardInput)).apply(this, arguments));
  }

  _createClass(CardInput, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "fieldset",
        null,
        React.createElement("input", { name: this.props.name, id: this.props.id, type: this.props.type || 'text', placeholder: this.props.placeholder, required: true })
      );
    }
  }]);

  return CardInput;
}(React.Component);

// React component for textarea


var CardTextarea = function (_React$Component2) {
  _inherits(CardTextarea, _React$Component2);

  function CardTextarea(props) {
    _classCallCheck(this, CardTextarea);

    return _possibleConstructorReturn(this, (CardTextarea.__proto__ || Object.getPrototypeOf(CardTextarea)).call(this, props));
  }

  _createClass(CardTextarea, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "fieldset",
        null,
        React.createElement("textarea", { name: this.props.name, id: this.props.id, placeholder: this.props.placeholder, required: true })
      );
    }
  }]);

  return CardTextarea;
}(React.Component);

// React component for the card (main component)


var Card = function (_React$Component3) {
  _inherits(Card, _React$Component3);

  function Card(props) {
    _classCallCheck(this, Card);

    return _possibleConstructorReturn(this, (Card.__proto__ || Object.getPrototypeOf(Card)).call(this, props));
  }

  _createClass(Card, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { id: "flipper", className: "card-container textCard" },
        React.createElement(
          "div",
          { className: "card-body" },
          React.createElement(CardBack, { text: "Correct english translation" }),
          React.createElement(CardFront, { text: "Spanish stored flashcard" })
        )
      );
    }

    // nextCard(){
    //   while (true) {
    //     let index = Math.floor(Math.random() * flashcards.length);
    //     let correct = flashcards[index].numCorrect;
    //     let seen = flashcards[index].numShown;
    //     score = Math.max(1, 5-correct) + Math.max(1, 5-seen);
    //     if (seen == 0) {
    //       score += 5;
    //     }
    //     else {
    //       score += 5 * ( Math.floor((seen-correct)/seen) );
    //     }
    //     let randNum = Math.floor(Math.random() * 16);
    //     if (randNum <= score) {
    //       this.currCard = flashcards[index].engText;
    //       break;
    //     }
    //   }
    // }

  }]);

  return Card;
}(React.Component);

// React component for the front side of the card


var CardFront = function (_React$Component4) {
  _inherits(CardFront, _React$Component4);

  function CardFront(props) {
    _classCallCheck(this, CardFront);

    return _possibleConstructorReturn(this, (CardFront.__proto__ || Object.getPrototypeOf(CardFront)).call(this, props));
  }

  _createClass(CardFront, [{
    key: "render",
    value: function render(props) {
      return React.createElement(
        "div",
        { className: "card-side side-front" },
        React.createElement(
          "div",
          { className: "card-side-container" },
          React.createElement(
            "div",
            { className: "icon" },
            React.createElement("img", { src: "../assets/noun_Refresh_2310283.svg" })
          ),
          React.createElement(
            "h2",
            { id: "trans" },
            this.props.text
          )
        )
      );
    }
  }]);

  return CardFront;
}(React.Component);

// React component for the back side of the card


var CardBack = function (_React$Component5) {
  _inherits(CardBack, _React$Component5);

  function CardBack() {
    _classCallCheck(this, CardBack);

    return _possibleConstructorReturn(this, (CardBack.__proto__ || Object.getPrototypeOf(CardBack)).apply(this, arguments));
  }

  _createClass(CardBack, [{
    key: "render",
    value: function render(props) {
      return React.createElement(
        "div",
        { className: "card-side side-back" },
        React.createElement(
          "div",
          { className: "card-side-container" },
          React.createElement(
            "div",
            { className: "correctBox" },
            React.createElement(
              "span",
              { className: "correctText" },
              " CORRECT! "
            )
          ),
          React.createElement(
            "h2",
            { id: "congrats" },
            this.props.text
          )
        )
      );
    }
  }]);

  return CardBack;
}(React.Component);

function SmallCard(props) {
  return React.createElement(
    "div",
    { className: "SmallCard" },
    props.children
  );
}
// class SmallCard extends React.Component{
//   constructor(props){
//     super(props);
//     this.nextCard = this.nextCard.bind(this);

//   }
//    render(){
//       return <div className="SmallCard">
//                 {this.currCard}
//           </div>  
//         }


//   }


function Txt(props) {
  if (props.phrase == undefined) {
    return React.createElement(
      "p",
      null,
      "Text missing"
    );
  } else return React.createElement(
    "p",
    null,
    props.phrase
  );
}

function MakeHeader() {
  return React.createElement(
    "header",
    null,
    React.createElement(
      "a",
      { className: "cardButton", href: "lango.html" },
      " Add "
    ),
    React.createElement(
      "span",
      { className: "LangoTitle" },
      " Lango! "
    )
  );
}

var MakeFooter = function (_React$Component6) {
  _inherits(MakeFooter, _React$Component6);

  function MakeFooter(props) {
    _classCallCheck(this, MakeFooter);

    return _possibleConstructorReturn(this, (MakeFooter.__proto__ || Object.getPrototypeOf(MakeFooter)).call(this, props));
  }

  _createClass(MakeFooter, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "footer",
        null,
        React.createElement(
          "span",
          null,
          " username "
        )
      );
    }
  }]);

  return MakeFooter;
}(React.Component);

var SaveBtn = function (_React$Component7) {
  _inherits(SaveBtn, _React$Component7);

  function SaveBtn(props) {
    _classCallCheck(this, SaveBtn);

    return _possibleConstructorReturn(this, (SaveBtn.__proto__ || Object.getPrototypeOf(SaveBtn)).call(this, props));
    // this.saveInput = this.saveInput.bind(this);
  }

  _createClass(SaveBtn, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "SaveBtn" },
        React.createElement(
          "button",
          { className: "Save" },
          " Next "
        )
      );
    }
  }]);

  return SaveBtn;
}(React.Component);

// go to next flashcard instead

// class 

var CreateCardMain = function (_React$Component8) {
  _inherits(CreateCardMain, _React$Component8);

  function CreateCardMain(props) {
    _classCallCheck(this, CreateCardMain);

    var _this8 = _possibleConstructorReturn(this, (CreateCardMain.__proto__ || Object.getPrototypeOf(CreateCardMain)).call(this, props));

    _this8.state = { translation: "" };
    // this.nextCard = this.nextCard.bind(this);
    // this.currCard = this.currCard.bind(this);
    return _this8;
  }

  _createClass(CreateCardMain, [{
    key: "render",
    value: function render() {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(MakeHeader, null),
        React.createElement(
          "main",
          null,
          React.createElement(
            Card,
            null,
            React.createElement(
              "div",
              null,
              React.createElement("img", { src: "../assets/noun_Refresh_2310283.svg" })
            )
          ),
          React.createElement(
            SmallCard,
            null,
            React.createElement(CardTextarea, null)
          )
        ),
        React.createElement(SaveBtn, null),
        React.createElement(MakeFooter, null)
      );
    } // end of render function   
    // <textarea id="inputEng" onKeyPress={this.getTranslation} />
    // onKeyPress function for the textarea element
    // When the charCode is 13, the user has hit the return key
    //   checkReturn(event) {
    //  if (event.charCode == 13) {
    //     let newPhrase = document.getElementById("inputEng").value;
    //     this.setState({opinion: newPhrase} );
    //     }
    //  }


    // nextCard(){
    //   while (true) {
    //     let index = Math.floor(Math.random() * flashcards.length);
    //     let correct = flashcards[index].numCorrect;
    //     let seen = flashcards[index].numShown;
    //     score = Math.max(1, 5-correct) + Math.max(1, 5-seen);
    //     if (seen == 0) {
    //       score += 5;
    //     }
    //     else {
    //       score += 5 * ( Math.floor((seen-correct)/seen) );
    //     }
    //     let randNum = Math.floor(Math.random() * 16);
    //     if (randNum <= score) {
    //       this.currCard = flashcards[index].engText;
    //       break;
    //     }
    //   }
    // }

  }]);

  return CreateCardMain;
}(React.Component); // end of class


function getFlashcards() {
  var url = "/flashcards";
  var xhr = createCORSRequest('GET', url);

  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  xhr.onload = function () {
    flashcards = xhr.responseText;
    console.log(flashcards);
  };

  xhr.onerror = function () {
    alert('There was an error in making the request');
  };

  xhr.send();
}

getFlashcards();

ReactDOM.render(React.createElement(CreateCardMain, null), document.getElementById('root'));