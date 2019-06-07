'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var object = undefined;
var input = document.getElementById("word");
var engText = ""; // Used in saveInput function 
var transText = ""; // to store in database

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    return xhr;
}

<<<<<<< Updated upstream
function Card(props) {
    return React.createElement(
=======
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

    var _this3 = _possibleConstructorReturn(this, (Card.__proto__ || Object.getPrototypeOf(Card)).call(this, props));

    _this3.state = { english: "", spanish: "" };
    _this3.nextCard = _this3.nextCard.bind(_this3);
    _this3.getFlashcards = _this3.getFlashcards.bind(_this3);
    _this3.flashcards = [];
    return _this3;
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
          React.createElement(CardBack, { text: this.state.english }),
          React.createElement(CardFront, { text: this.state.spanish })
        )
      );
    }
  }, {
    key: "nextCard",
    value: function nextCard() {
      // while (true) {
      //   let index = Math.floor(Math.random() * this.flashcards.length);
      //   let correct = this.flashcards[index].numCorrect;
      //   let seen = this.flashcards[index].numShown;
      //   let eng = this.flashcards[index].engText;
      //   let es = this.flashcards[index].transText
      //   score = Math.max(1, 5-correct) + Math.max(1, 5-seen);
      //   if (seen == 0) {
      //     score += 5;
      //   }
      //   else {
      //     score += 5 * ( Math.floor((seen-correct)/seen) );
      //   }
      //   let randNum = Math.floor(Math.random() * 16);
      //   if (randNum <= score) {
      //     this.setState({english: eng, spanish: es});
      //     break;
      //   }
      // }
      console.log(this.flashcards[0]);
    }
  }, {
    key: "getFlashcards",
    value: function getFlashcards() {
      var url = "/flashcards";
      var xhr = createCORSRequest('GET', url);

      if (!xhr) {
        alert('CORS not supported');
        return;
      }

      xhr.onload = function () {
        this.flashcards = JSON.parse(xhr.responseText);
        console.log(this.flashcards);
        var eng = this.flashcards[0].engText;
        var es = this.flashcards[0].transText;
        console.log(eng, es);
        console.log(this.flashcards[0]);
        this.setState({ english: eng, spanish: es });
      }.bind(this);

      xhr.onerror = function () {
        alert('There was an error in making the request');
      }.bind(this);

      xhr.send();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getFlashcards();
      this.nextCard();
    }
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
>>>>>>> Stashed changes
        "div",
        { className: "textCard" },
        props.children
    );
}

function SmallCard(props) {
    return React.createElement(
        "div",
        { className: "SmallCard" },
        props.children
    );
}

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
            "button",
            { className: "cardButton" },
            " Add "
        ),
        React.createElement(
            "span",
            { className: "LangoTitle" },
            " Lango! "
        )
    );
}

var MakeFooter = function (_React$Component) {
    _inherits(MakeFooter, _React$Component);

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

var SaveBtn = function (_React$Component2) {
    _inherits(SaveBtn, _React$Component2);

    function SaveBtn(props) {
        _classCallCheck(this, SaveBtn);

        var _this2 = _possibleConstructorReturn(this, (SaveBtn.__proto__ || Object.getPrototypeOf(SaveBtn)).call(this, props));

        _this2.saveInput = _this2.saveInput.bind(_this2);
        return _this2;
    }

    _createClass(SaveBtn, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "SaveBtn" },
                React.createElement(
                    "button",
                    { className: "Save", onClick: this.saveInput },
                    " Next "
                )
            );
        }
    }, {
        key: "saveInput",
        value: function saveInput() {
            var url = "/store?english=" + engText + "&spanish=" + transText;
            var xhr = createCORSRequest('GET', url);

            if (!xhr) {
                alert('CORS not supported');
                return;
            }

            xhr.onload = function () {
                var responseStr = xhr.responseText;
                console.log(responseStr);
            }.bind(this);

            xhr.onerror = function () {
                alert('There was an error in making the request');
            }.bind(this);

            xhr.send();
        }
    }]);

    return SaveBtn;
}(React.Component);

// class 

var CreateCardMain = function (_React$Component3) {
    _inherits(CreateCardMain, _React$Component3);

    function CreateCardMain(props) {
        _classCallCheck(this, CreateCardMain);

        var _this3 = _possibleConstructorReturn(this, (CreateCardMain.__proto__ || Object.getPrototypeOf(CreateCardMain)).call(this, props));

        _this3.state = { translation: "" };

<<<<<<< Updated upstream
        _this3.getTranslation = _this3.getTranslation.bind(_this3);
        return _this3;
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
                        React.createElement(Txt, { phrase: this.state.translation })
                    )
                ),
                React.createElement(SaveBtn, null),
                React.createElement(MakeFooter, null)
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

    }, {
        key: "getTranslation",
        value: function getTranslation(event) {
            if (event.charCode == 13) {
                var url = "/translate?english=" + document.getElementById("inputEng").value;
                var xhr = createCORSRequest('GET', url);

                if (!xhr) {
                    alert('CORS not supported');
                    return;
                }

                xhr.onload = function () {
                    var responseStr = xhr.responseText;
                    object = JSON.parse(responseStr);
                    console.log(object);
                    this.setState({ translation: object.Spanish });
                    engText = object.English;
                    transText = object.Spanish;
                }.bind(this);

                xhr.onerror = function () {
                    alert('There was an error in making the request');
                }.bind(this);

                xhr.send();
            }
        }
    }]);

    return CreateCardMain;
}(React.Component); // end of class


=======
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
    }
  }]);

  return CreateCardMain;
}(React.Component); // end of class

>>>>>>> Stashed changes
ReactDOM.render(React.createElement(CreateCardMain, null), document.getElementById('root'));