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

function Card(props) {
    return React.createElement(
        "div",
        { className: "textCard" },
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

var MakeHeader = function (_React$Component) {
    _inherits(MakeHeader, _React$Component);

    function MakeHeader() {
        _classCallCheck(this, MakeHeader);

        return _possibleConstructorReturn(this, (MakeHeader.__proto__ || Object.getPrototypeOf(MakeHeader)).apply(this, arguments));
    }

    _createClass(MakeHeader, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "header",
                null,
                React.createElement(
                    "a",
                    { className: "cardButton", href: "review.html" },
                    " Start Review "
                ),
                React.createElement(
                    "span",
                    { className: "LangoTitle" },
                    " Lango! "
                )
            );
        }
    }]);

    return MakeHeader;
}(React.Component);

var MakeFooter = function (_React$Component2) {
    _inherits(MakeFooter, _React$Component2);

    function MakeFooter(props) {
        _classCallCheck(this, MakeFooter);

        var _this2 = _possibleConstructorReturn(this, (MakeFooter.__proto__ || Object.getPrototypeOf(MakeFooter)).call(this, props));

        _this2.state = { name: "" };
        _this2.getName = _this2.getName.bind(_this2);
        return _this2;
    }

    _createClass(MakeFooter, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "footer",
                null,
                React.createElement(Txt, { phrase: this.state.name })
            );
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.getName();
        }
    }, {
        key: "getName",
        value: function getName() {
            var url = "/name";
            var xhr = createCORSRequest('GET', url);

            if (!xhr) {
                alert('CORS not supported');
                return;
            }

            xhr.onload = function () {
                var responseStr = xhr.responseText;
                this.setState({ name: responseStr });
            }.bind(this);

            xhr.onerror = function () {
                alert('There was an error in making the request');
            }.bind(this);

            xhr.send();
        }
    }]);

    return MakeFooter;
}(React.Component);

var SaveBtn = function (_React$Component3) {
    _inherits(SaveBtn, _React$Component3);

    function SaveBtn(props) {
        _classCallCheck(this, SaveBtn);

        var _this3 = _possibleConstructorReturn(this, (SaveBtn.__proto__ || Object.getPrototypeOf(SaveBtn)).call(this, props));

        _this3.saveInput = _this3.saveInput.bind(_this3);
        return _this3;
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
                    " Save "
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

var CreateCardMain = function (_React$Component4) {
    _inherits(CreateCardMain, _React$Component4);

    function CreateCardMain(props) {
        _classCallCheck(this, CreateCardMain);

        var _this4 = _possibleConstructorReturn(this, (CreateCardMain.__proto__ || Object.getPrototypeOf(CreateCardMain)).call(this, props));

        _this4.state = { translation: "" };

        _this4.getTranslation = _this4.getTranslation.bind(_this4);
        return _this4;
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
                        React.createElement("textarea", { id: "inputEng", onKeyPress: this.getTranslation })
                    ),
                    React.createElement(
                        Card,
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