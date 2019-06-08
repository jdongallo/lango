'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
    key: 'render',
    value: function render() {
      return React.createElement(
        'fieldset',
        null,
        React.createElement('input', { name: this.props.name, id: this.props.id, type: this.props.type || 'text', placeholder: this.props.placeholder, required: true })
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
    key: 'render',
    value: function render() {
      return React.createElement(
        'fieldset',
        null,
        React.createElement('textarea', { name: this.props.name, id: this.props.id, placeholder: this.props.placeholder, required: true })
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
    _this3.getFlashcards = _this3.getFlashcards.bind(_this3);
    _this3.nextCard = _this3.nextCard.bind(_this3);
    _this3.flashcards = [];
    return _this3;
  }

  _createClass(Card, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(
          'div',
          { id: 'flipper', className: 'card-container textCard' },
          React.createElement(
            'div',
            { className: 'card-body' },
            React.createElement(CardBack, { text: this.state.english }),
            React.createElement(CardFront, { text: this.state.spanish })
          )
        ),
        React.createElement(
          SmallCard,
          null,
          React.createElement(CardTextarea, null)
        ),
        React.createElement(NextBtn, { nextCard: this.nextCard })
      );
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getFlashcards();
    }
  }, {
    key: 'nextCard',
    value: function nextCard() {
      var eng = '';
      var es = '';
      while (true) {
        var index = Math.floor(Math.random() * this.flashcards.length);
        var correct = this.flashcards[index].numCorrect;
        var seen = this.flashcards[index].numShown;
        var score = Math.max(1, 5 - correct) + Math.max(1, 5 - seen);
        if (seen == 0) {
          score += 5;
        } else {
          score += 5 * Math.floor((seen - correct) / seen);
        }
        var randNum = Math.floor(Math.random() * 16);
        if (randNum <= score) {
          eng = this.flashcards[index].engText;
          es = this.flashcards[index].transText;
          break;
        }
      }
      this.setState({ english: eng, spanish: es });
    }
  }, {
    key: 'getFlashcards',
    value: function getFlashcards() {
      var url = "/flashcards";
      var xhr = createCORSRequest('GET', url);

      if (!xhr) {
        alert('CORS not supported');
        return;
      }

      xhr.onload = function () {
        var responseStr = xhr.responseText;
        this.flashcards = JSON.parse(responseStr);
        console.log(this.flashcards);
        this.nextCard();
      }.bind(this);

      xhr.onerror = function () {
        alert('There was an error in making the request');
      }.bind(this);

      xhr.send();
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
    key: 'render',
    value: function render(props) {
      return React.createElement(
        'div',
        { className: 'card-side side-front' },
        React.createElement(
          'div',
          { className: 'card-side-container' },
          React.createElement(
            'div',
            { className: 'icon' },
            React.createElement('img', { src: '../assets/noun_Refresh_2310283.svg' })
          ),
          React.createElement(
            'h2',
            { id: 'trans' },
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
    key: 'render',
    value: function render(props) {
      return React.createElement(
        'div',
        { className: 'card-side side-back' },
        React.createElement(
          'div',
          { className: 'card-side-container' },
          React.createElement(
            'div',
            { className: 'correctBox' },
            React.createElement(
              'span',
              { className: 'correctText' },
              ' CORRECT! '
            )
          ),
          React.createElement(
            'h2',
            { id: 'congrats' },
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
    'div',
    { className: 'SmallCard' },
    props.children
  );
}

function Txt(props) {
  if (props.phrase == undefined) {
    return React.createElement(
      'p',
      null,
      'Text missing'
    );
  } else return React.createElement(
    'p',
    null,
    props.phrase
  );
}

function MakeHeader() {
  return React.createElement(
    'header',
    null,
    React.createElement(
      'a',
      { className: 'cardButton', href: 'lango.html' },
      ' Add '
    ),
    React.createElement(
      'span',
      { className: 'LangoTitle' },
      ' Lango! '
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
    key: 'render',
    value: function render() {
      return React.createElement(
        'footer',
        null,
        React.createElement(
          'span',
          null,
          ' username '
        )
      );
    }
  }]);

  return MakeFooter;
}(React.Component);

var NextBtn = function (_React$Component7) {
  _inherits(NextBtn, _React$Component7);

  function NextBtn(props) {
    _classCallCheck(this, NextBtn);

    return _possibleConstructorReturn(this, (NextBtn.__proto__ || Object.getPrototypeOf(NextBtn)).call(this, props));
  }

  _createClass(NextBtn, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'SaveBtn' },
        React.createElement(
          'button',
          { className: 'Save', onClick: this.props.nextCard },
          ' Next '
        )
      );
    }
  }]);

  return NextBtn;
}(React.Component);

var CreateCardMain = function (_React$Component8) {
  _inherits(CreateCardMain, _React$Component8);

  function CreateCardMain(props) {
    _classCallCheck(this, CreateCardMain);

    return _possibleConstructorReturn(this, (CreateCardMain.__proto__ || Object.getPrototypeOf(CreateCardMain)).call(this, props));
  }

  _createClass(CreateCardMain, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(MakeHeader, null),
        React.createElement(
          'main',
          null,
          React.createElement(
            Card,
            null,
            React.createElement(
              'div',
              null,
              React.createElement('img', { src: '../assets/noun_Refresh_2310283.svg' })
            )
          )
        ),
        React.createElement(MakeFooter, null)
      );
    }
  }]);

  return CreateCardMain;
}(React.Component); // end of class

ReactDOM.render(React.createElement(CreateCardMain, null), document.getElementById('root'));