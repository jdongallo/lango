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

// React component for the card (main component)

var Card = function (_React$Component) {
  _inherits(Card, _React$Component);

  function Card() {
    _classCallCheck(this, Card);

    return _possibleConstructorReturn(this, (Card.__proto__ || Object.getPrototypeOf(Card)).apply(this, arguments));
  }

  _createClass(Card, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "card-container textCard" },
        React.createElement(
          "div",
          { className: "card-body" },
          React.createElement(CardBack, { text: "Correct english translation" }),
          React.createElement(CardFront, { text: "Spanish stored flashcard" })
        )
      );
    }
  }]);

  return Card;
}(React.Component);

// React component for the front side of the card


var CardFront = function (_React$Component2) {
  _inherits(CardFront, _React$Component2);

  function CardFront() {
    _classCallCheck(this, CardFront);

    return _possibleConstructorReturn(this, (CardFront.__proto__ || Object.getPrototypeOf(CardFront)).apply(this, arguments));
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


var CardBack = function (_React$Component3) {
  _inherits(CardBack, _React$Component3);

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
            { className: "correctMessage" },
            React.createElement(
              "span",
              null,
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

var MakeFooter = function (_React$Component4) {
  _inherits(MakeFooter, _React$Component4);

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

var SaveBtn = function (_React$Component5) {
  _inherits(SaveBtn, _React$Component5);

  function SaveBtn(props) {
    _classCallCheck(this, SaveBtn);

    var _this5 = _possibleConstructorReturn(this, (SaveBtn.__proto__ || Object.getPrototypeOf(SaveBtn)).call(this, props));

    _this5.saveInput = _this5.saveInput.bind(_this5);
    return _this5;
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

var CreateCardMain = function (_React$Component6) {
  _inherits(CreateCardMain, _React$Component6);

  function CreateCardMain(props) {
    _classCallCheck(this, CreateCardMain);

    var _this6 = _possibleConstructorReturn(this, (CreateCardMain.__proto__ || Object.getPrototypeOf(CreateCardMain)).call(this, props));

    _this6.state = { translation: "" };

    _this6.getTranslation = _this6.getTranslation.bind(_this6);
    return _this6;
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


ReactDOM.render(React.createElement(CreateCardMain, null), document.getElementById('root'));