/*
* KAZUI v01 (http://www.kazui.io)
* Copyright 2014 YonaxTics. All rights reserved.
*
* KAZUI commercial licenses may be obtained at
* http://www.kazui.io/purchase/license-agreement/kazui-complete
* If you do not own a commercial license, this file shall be governed by the trial license terms.
*/
var Form = (function () {
    function Form(element) {
        this.inputs = null;
        this.textAreas = null;
        this.result = true;
        this.changed = false;
        this.hasSuccess = 'has-success';
        this.hasError = 'has-error';
        this.element = element;
        this.init();
    }
    Form.prototype.init = function () {
        var _this = this;
        if (this.element) {
            this.inputs = this.element.querySelectorAll('input,textarea');
            var n = this.inputs.length;
            for (var i = 0; i < n; i++) {
                var input = this.inputs[i];
                if (!input.dataset.option) {
                    var small = document.createElement('small');
                    var type = input.type;
                    small.className = 'hidden';
                    if (type !== 'checkbox' && type !== 'radio') {
                        var span = document.createElement('span');
                        input.parentNode.parentNode.classList.add('has-feedback');
                        if (input.dataset.date) {
                            var ico = document.createElement('i');
                            var calendar = document.createElement('div');
                            ico.className = 'fa fa-calendar fa-fw';
                            span.className = 'form-control-feedback';
                            span.style.cursor = 'default';
                            span.appendChild(ico);
                            input.parentNode.appendChild(calendar);
                            var uiCalendar = new Calendar(calendar, { isInput: true, input: input });
                            span.onclick = function () {
                                if (uiCalendar.isOpen())
                                    uiCalendar.close();
                                else
                                    uiCalendar.open();
                            };
                        } else {
                            span.className = 'hidden';
                        }
                        input.parentNode.appendChild(span);
                    }
                    input.parentNode.appendChild(small);
                    if (input.dataset.money) {
                        input.style.textAlign = 'right';
                    }
                }
                if (input.dataset.blur) {
                    input.onblur = function () {
                        return _this.validate(_this);
                    };
                }
                if (input.dataset.keyup) {
                    input.onkeyup = function () {
                        return _this.validate(_this);
                    };
                }

                /*
                * Add event onchange
                */
                input.onchange = function () {
                    _this.changed = true;
                };
            }
        }
    };

    Form.prototype.isValid = function () {
        var n = this.inputs.length;
        var i = 0;
        var multiples = new Array();
        var totalMultiple = 1;
        while (i < n) {
            this.validate(this.inputs[i]);
            multiples.push(this.result ? 1 : 0);
            i++;
        }
        this.validateGroupCheckBox();
        i = 0;
        while (i < n) {
            totalMultiple *= multiples[i++];
        }
        return totalMultiple > 0;
    };

    Form.prototype.hasChanged = function () {
        var changedAux = this.changed;
        this.changed = false;
        return changedAux;
    };

    Form.prototype.serialize = function () {
        var elements = this.element.elements;
        var serialized = [];
        var i = 0;
        var n = elements.length;
        for (i = 0; i < n; i++) {
            var element = elements[i];
            var type = element.type;
            var value = element.value;
            var name = element.name;
            if (!name.isEmpty()) {
                switch (type) {
                    case 'text':
                    case 'checkbox':
                    case 'search':
                    case 'email':
                    case 'url':
                    case 'tel':
                    case 'number':
                    case 'range':
                    case 'date':
                    case 'month':
                    case 'week':
                    case 'time':
                    case 'datetime':
                    case 'datetime-local':
                    case 'color':
                    case 'textarea':
                    case 'password':
                    case 'select':
                    case 'hidden':
                        serialized.push(name + '=' + value);
                        break;
                    case 'radio':
                        if (element.checked)
                            serialized.push(name + '=' + value);
                        break;
                    default:
                        break;
                }
            }
        }
        return serialized.join('&');
    };

    Form.prototype.toJSON = function () {
        var elements = this.element.elements;
        var json = {};
        var i = 0;
        var n = elements.length;
        for (i = 0; i < n; i++) {
            var element = elements[i];
            var type = element.type;
            var value = element.value;
            var name = element.name;
            if (!name.isEmpty()) {
                switch (type) {
                    case 'text':
                    case 'checkbox':
                    case 'search':
                    case 'email':
                    case 'url':
                    case 'tel':
                    case 'number':
                    case 'range':
                    case 'date':
                    case 'month':
                    case 'week':
                    case 'time':
                    case 'datetime':
                    case 'datetime-local':
                    case 'color':
                    case 'textarea':
                    case 'password':
                    case 'select':
                    case 'hidden':
                        json[name] = value;
                        break;
                    case 'radio':
                        if (element.checked)
                            json[name] = value;
                        break;
                }
            }
        }
        return json;
    };

    Form.prototype.validate = function (input) {
        switch (input.type) {
            case 'text':
            case 'search':
            case 'email':
            case 'url':
            case 'tel':
            case 'number':
            case 'range':
            case 'date':
            case 'month':
            case 'week':
            case 'time':
            case 'datetime':
            case 'datetime-local':
            case 'color':
            case 'textarea':
            case 'password':
                /*
                * Check required
                */
                if (input.dataset.required) {
                    this.result = Form.isEmpty(input.value) ? this.error(input, Form.msgRequired) : this.success(input); //verificar si funciona con el this
                    if (this.result) {
                        this.generalValidations(input);
                    }
                } else {
                    this.generalValidations(input);
                }
                break;
            case 'radio':
                break;
            case 'checkbox':
                /*
                * Check input checked
                */
                if (input.dataset.required) {
                    this.result = Form.isChecked(input);
                    if (this.result) {
                        this.hiddeMessage(input);
                    } else {
                        this.error(input, Form.msgAccept);
                    }
                }
                break;

            default:
                this.result = true;
                break;
        }
    };

    Form.prototype.validateGroupCheckBox = function () {
        var groups = this.element.getElementsByClassName('group-checkbox');
        var n = groups ? groups.length : 0;
        if (n > 0) {
            for (var g = 0; g < n; g++) {
                var group = groups[g];
                if (group.dataset.checkmin) {
                    var min = group.dataset.checkmin;
                    if (this.countChecks(group) < min) {
                        var msg = Form.msgCheckMin.replace('{#}', min);
                        this.showMessageCheckbox(group, msg);
                    } else {
                        this.hideMessageCheckbox(group);
                    }
                } else if (group.dataset.checkmax) {
                    var max = group.dataset.checkmax;
                    if (this.countChecks(group) > max) {
                        var msg = Form.msgCheckMax.replace('{#}', max);
                        this.showMessageCheckbox(group, msg);
                    } else {
                        this.hideMessageCheckbox(group);
                    }
                } else if (group.dataset.checkrange) {
                    var range = group.dataset.checkrange.split('-');
                    var min = range[0];
                    var max = range[1];
                    var checks = this.countChecks(group);
                    if (checks >= min && checks <= max) {
                        this.hideMessageCheckbox(group);
                    } else {
                        var msg = Form.msgCheckRange.replace('{#min}', min).replace('{#max}', max);
                        this.showMessageCheckbox(group, msg);
                    }
                }
            }
        }
    };

    Form.prototype.countChecks = function (group) {
        var checkboxes = group.querySelectorAll('input[type="checkbox"]');
        var k = checkboxes.length;
        var checks = 0;
        for (var c = 0; c < k; c++) {
            var checkbox = checkboxes[c];
            if (checkbox.checked)
                checks++;
        }
        return checks;
    };

    Form.prototype.showMessageCheckbox = function (group, msg) {
        var small = group.getElementsByClassName('ui-form-msg')[0];
        small.classList.remove('hidden');
        small.textContent = msg;
    };

    Form.prototype.hideMessageCheckbox = function (group) {
        var small = group.getElementsByClassName('ui-form-msg')[0];
        small.classList.add('hidden');
    };

    Form.prototype.showMessage = function (input, message) {
        var small = null;
        var type = input.type;
        if (type !== 'checkbox' && type !== 'radio' && !input.dataset.option && !input.dataset.date) {
            input.parentNode.getElementsByTagName('span')[0].className = 'fa fa-times form-control-feedback';
        }
        if (input.dataset.option) {
            small = input.parentNode.parentNode.getElementsByTagName('small')[0];
        } else {
            small = input.parentNode.getElementsByTagName('small')[0];
        }
        small.textContent = message;
        small.className = 'text-danger';
    };

    Form.prototype.hiddeMessage = function (input) {
        var type = input.type;
        if (type !== 'checkbox' && type !== 'radio' && !input.dataset.option && !input.dataset.date) {
            input.parentNode.getElementsByTagName('span')[0].className = 'fa fa-check form-control-feedback'; //es mejor manejar clases para los selectores ?
        }
        if (input.dataset.option) {
            input.parentNode.parentNode.getElementsByTagName('small')[0].className = 'hidden';
        } else {
            input.parentNode.getElementsByTagName('small')[0].className = 'hidden';
        }
    };

    Form.prototype.success = function (input) {
        if (!input.parentNode.parentNode.classList.contains(this.hasSuccess)) {
            input.parentNode.parentNode.classList.add(this.hasSuccess);
        }
        if (input.parentNode.parentNode.classList.contains(this.hasError)) {
            input.parentNode.parentNode.classList.remove(this.hasError);
        }
        this.hiddeMessage(input);
        return true;
    };

    Form.prototype.error = function (input, message) {
        if (input.parentNode.parentNode.classList.contains(this.hasSuccess)) {
            input.parentNode.parentNode.classList.remove(this.hasSuccess);
        }
        if (!input.parentNode.parentNode.classList.contains(this.hasError)) {
            input.parentNode.parentNode.classList.add(this.hasError);
        }
        this.showMessage(input, message);
        return false;
    };

    Form.prototype.generalValidations = function (input) {
        /*
        * Check full name
        */
        if (input.dataset.fullname) {
            this.result = Form.isFullName(input.value) ? this.success(input) : this.error(input, Form.msgFullName);
        } else /*
        * Check email
        */
        if (input.dataset.email) {
            this.result = Form.isEmail(input.value) ? this.success(input) : this.error(input, Form.msgEmail);
        } else /*
        * Check equals to
        */
        if (input.dataset.equalsto) {
            var tmpInp = document.getElementsByName(input.dataset.equalsto)[0];
            if (Form.isEqualsTo(tmpInp.value, input.value)) {
                var tmpBool1 = this.success(input);
                var tmpBool2 = this.success(tmpInp);
                this.result = tmpBool1 && tmpBool2;
            } else {
                var tmpBool1 = this.error(input, Form.msgCheck);
                var tmpBool2 = this.error(tmpInp, Form.msgEquals);
                this.result = tmpBool1 && tmpBool2;
            }
            if (this.result) {
                this.generalValidations(tmpInp);
            }
        } else /*
        * Check money
        */
        if (input.dataset.money) {
            this.result = Form.isMoney(input.value) ? this.success(input) : this.error(input, Form.msgMoney);
        } else /*
        * Check max length
        */
        if (input.dataset.maxlength) {
            var length = input.dataset.maxlength;
            this.result = Form.maxLength(input.value, length) ? this.success(input) : this.error(input, Form.msgMaxLength.replace('{#}', length));
        } else /*
        * Check min length
        */
        if (input.dataset.minlength) {
            var length = input.dataset.minlength;
            this.result = Form.minLength(input.value, length) ? this.success(input) : this.error(input, Form.msgMinLength.replace('{#}', length));
        } else /*
        * Check range length
        */
        if (input.dataset.rangelength) {
            var data = input.dataset.rangelength.split("-");
            var min = data[0];
            var max = data[1];
            this.result = Form.rangeLength(input.value, min, max) ? this.success(input) : this.error(input, Form.msgRangeLength.replace('{#min}', min).replace('{#max}', max));
        } else /*
        * Check max number
        */
        if (input.dataset.max) {
            var max = input.dataset.max;
            this.result = Form.max(input.value, max) ? this.success(input) : this.error(input, Form.msgMax.replace('{#}', max));
        } else /*
        * Check min number
        */
        if (input.dataset.min) {
            var min = input.dataset.min;
            this.result = Form.min(input.value, min) ? this.success(input) : this.error(input, Form.msgMin.replace('{#}', min));
        } else /*
        * Check range number
        */
        if (input.dataset.range) {
            var data = input.dataset.range.split("-");
            var min = data[0];
            var max = data[1];
            this.result = Form.range(input.value, min, max) ? this.success(input) : this.error(input, Form.msgRange.replace('{#min}', min).replace('{#max}', max));
        } else /*
        * Check URL
        */
        if (input.dataset.url) {
            this.result = Form.isURL(input.value) ? this.success(input) : this.error(input, Form.msgURL);
        } else /*
        * Check date
        */
        if (input.dataset.date) {
            this.result = Form.isDate(input.value) ? this.success(input) : this.error(input, Form.msgDate);
        } else /*
        * Check number
        */
        if (input.dataset.number) {
            this.result = Form.isNumber(input.value) ? this.success(input) : this.error(input, Form.msgNumber);
        } else /*
        * Check credit card
        */
        if (input.dataset.creditcard) {
            this.result = Form.isCreditCard(input.value) ? this.success(input) : this.error(input, Form.msgCreditCard);
        } else /*
        * Check UI-Select Option
        */
        if (input.dataset.option) {
            this.result = Form.isValidOption(input, input.dataset.option) ? this.success(input) : this.error(input, Form.msgValidOption);
        } else {
            this.success(input);
        }
    };

    /*
    * @param String value
    * @returns true if value is fullname
    */
    Form.isFullName = function (value) {
        return value.match(/^[a-zA-Z][a-zA-Z ]+$/);
    };

    /*
    * @param String value
    * @returns true if value is email
    */
    Form.isEmail = function (value) {
        return value.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    };

    /*
    * @param String value
    * @returns true if value is empty
    */
    Form.isEmpty = function (value) {
        return !value.match(/^\S+$|[^\s]+$/);
    };

    /*
    * @param String value
    * @param String value1
    * @returns true if both values are equals
    */
    Form.isEqualsTo = function (value, value1) {
        return value === value1;
    };

    /*
    * @param String value
    * @returns true if value is money format
    */
    Form.isMoney = function (value) {
        return value.match(/^\d+(,\d{3})*(\.\d*)?$/);
    };

    /*
    * @param String value
    * @param length, number of characters
    * @returns true if  value  has length characters or less
    */
    Form.maxLength = function (value, length) {
        return !isNaN(length) && value.length <= length;
    };

    /*
    * @param String value
    * @param length, number of characters
    * @returns true if  value has length characters or more
    */
    Form.minLength = function (value, length) {
        return !isNaN(length) && value.length >= length;
    };

    /*
    * @param String value
    * @param min, number minimum of characters
    * @param max, number maximum of characters
    * @returns true if  value is between min and max
    */
    Form.rangeLength = function (value, min, max) {
        var length = value.length;
        return ((!isNaN(min) && length >= min) && (!isNaN(max) && length <= max));
    };

    /*
    * @param String value
    * @param max, number maximun
    * @returns true if  value is equals or less that max
    */
    Form.max = function (value, max) {
        return (!isNaN(max) && value <= max);
    };

    /*
    * @param String value
    * @param min, number minimun
    * @returns true if value is equals or greater that min
    */
    Form.min = function (value, min) {
        return (!isNaN(min) && value >= min);
    };

    /*
    * @param String value
    * @param min, number minimum
    * @param max, number maximum
    * @returns true if value is between min and max number
    */
    Form.range = function (value, min, max) {
        return ((!isNaN(min) && value >= min) && (!isNaN(max) && value <= max));
    };

    /*
    * @param String value
    * @returns true if value is URL
    */
    Form.isURL = function (value) {
        return value.match(/https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/);
    };

    /*
    * @param String value
    * @returns true if value is Date
    */
    Form.isDate = function (value) {
        var parms = value.split(/[\.\-\/]/);
        var yyyy = parseInt(parms[2], 10);
        ;
        var mm = parseInt(parms[1], 10);
        var dd = parseInt(parms[0], 10);
        if (yyyy < 1582) {
            var tmp = yyyy;
            yyyy = dd;
            dd = tmp;
        }
        var date = new Date(yyyy, mm - 1, dd);
        return (mm === (date.getMonth() + 1) && dd === date.getDate() && yyyy === date.getFullYear());
    };

    /*
    * @param String value
    * @returns true if value is Number
    */
    Form.isNumber = function (value) {
        return !isNaN(value);
    };

    /*
    * @param String value
    * @returns true if value is credit card
    */
    Form.isCreditCard = function (value) {
        return value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/);
    };

    /*
    * @param HtmlElement input
    * @returns true if input is Checked
    */
    Form.isChecked = function (input) {
        return input.checked;
    };

    /*
    * @param HtmlElement input
    * @param option
    * @returns true if option is greater than zero
    */
    Form.isValidOption = function (input, option) {
        return (!isNaN(option) && option > 0);
    };

    Form.prototype.onsubmit = function (callback) {
        this.element.onsubmit = function (e) {
            e.preventDefault();
            callback();
        };
    };
    Form.msgRequired = 'This field is required and can\'t be empty!';
    Form.msgFullName = 'Please enter a valid name!';
    Form.msgEmail = 'Please enter a valid e-mail!';
    Form.msgEquals = 'This field and the field to confirm are not the same!';
    Form.msgCheck = 'Please check!';
    Form.msgAccept = 'Please accept!';
    Form.msgMoney = 'Please enter a valid money format!';
    Form.msgMaxLength = 'Please enter no more than {#} characters!';
    Form.msgMinLength = 'Please enter at least {#} characters!';
    Form.msgRangeLength = 'Please enter a value between {#min} and {#max} characters long!';
    Form.msgMax = 'Please enter a value less than or equal to {#}!';
    Form.msgMin = 'Please enter a value greater than or equal to {#}!';
    Form.msgRange = 'Please enter a value between {#min} and {#max}!';
    Form.msgURL = 'Please enter a valid URL!';
    Form.msgDate = 'Please enter a valid date!';
    Form.msgNumber = 'Please enter a valid number!';
    Form.msgCreditCard = 'Please enter a valid credit card number!';
    Form.msgValidOption = 'Please enter a valid option!';
    Form.msgCheckMin = 'Please choose at least {#} options!';
    Form.msgCheckMax = 'Please choose no more than {#} options!';
    Form.msgCheckRange = 'Please choose between {#min} and {#max} options!';
    return Form;
})();

var DataTable = (function () {
    function DataTable(element, action, fields) {
        this.element = element;
        this.action = action;
        this.fields = fields;
        this.icoLoading = document.createElement('i');
        this.table = document.createElement('table');
        this.init();
    }
    DataTable.prototype.init = function () {
        this.icoLoading.className = 'fa fa-spinner fa-spin';
        this.table.className = 'ui-data-table table table-striped';
        this.fillTable();
    };

    DataTable.prototype.fillTable = function () {
        var _this = this;
        var m = this.fields.length;
        if (m > 0) {
            this.fillHeaderTable();
            Http.get(this.action, this.runIcoLoading(), function (xhr) {
                _this.data = JSON.parse(xhr.responseText);
                var n = _this.data.length;
                if (n > 0) {
                    var i = 0;
                    var tbody = document.createElement('tbody');

                    do {
                        var tr = document.createElement('tr');
                        var d = _this.data[i];
                        for (var j = 0; j < m; j++) {
                            var td = document.createElement('td');
                            var field = _this.fields[j];
                            td.textContent = d[field.value];
                            tr.appendChild(td);
                        }
                        tbody.appendChild(tr);
                        i++;
                    } while(i < n);
                    _this.table.appendChild(tbody);
                    _this.stopIcoLoading();
                    _this.element.appendChild(_this.table);
                }
            });
        }
    };

    DataTable.prototype.fillHeaderTable = function () {
        var m = this.fields.length;
        if (m > 0) {
            var j = 0;
            var thead = document.createElement('thead');
            var tr = document.createElement('tr');
            thead.appendChild(tr);
            do {
                var th = document.createElement('th');
                var field = this.fields[j];
                th.textContent = field.name;
                tr.appendChild(th);
                j++;
            } while(j < m);
            this.table.appendChild(thead);
        }
    };

    DataTable.prototype.runIcoLoading = function () {
        this.element.appendChild(this.icoLoading);
    };

    DataTable.prototype.stopIcoLoading = function () {
        this.element.removeChild(this.icoLoading);
    };
    return DataTable;
})();

var Popup = (function () {
    function Popup(element) {
        this.element = element;
        this.animationShow = new Animation('ui-ease', 'ui-bounce-in-down', 'ui-1s', 1000);
        this.animationClose = new Animation('ui-ease', 'ui-fade-out', 'ui-1s', 1000);
        this.mask = document.createElement('div');
        this.init();
    }
    Popup.prototype.init = function () {
        this.mask.className = 'hidden';
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(this.mask);
        this.element.classList.add('hidden');
    };

    Popup.prototype.show = function () {
        this.mask.className = 'show ui-popup-mask';
        if (this.element.classList.contains('hidden')) {
            this.element.classList.remove('hidden');
            this.element.classList.add('show');
            this.animationShow.run(this.element);
        }
    };

    Popup.prototype.close = function () {
        var _this = this;
        if (this.element.classList.contains('show')) {
            this.animationClose.run(this.element, function () {
                _this.mask.className = 'hidden';
                _this.element.classList.remove('show');
                _this.element.classList.add('hidden');
            });
        }
    };
    return Popup;
})();

var ETypeClock;
(function (ETypeClock) {
    ETypeClock[ETypeClock["STANDARD"] = 0] = "STANDARD";
    ETypeClock[ETypeClock["MILITARY"] = 1] = "MILITARY";
    ETypeClock[ETypeClock["COUNT_DOWN"] = 2] = "COUNT_DOWN";
    ETypeClock[ETypeClock["COUNT_UP"] = 3] = "COUNT_UP";
    ETypeClock[ETypeClock["CUSTOM_STANDARD"] = 4] = "CUSTOM_STANDARD";
    ETypeClock[ETypeClock["CUSTOM_MILITARY"] = 5] = "CUSTOM_MILITARY";
})(ETypeClock || (ETypeClock = {}));

/**
* Clock
* @class Clock
*/
var Clock = (function () {
    /**
    * constructor
    * @param {HTMLElement} element
    */
    function Clock(element) {
        this.element = element;
        this.iconUp = 'fa fa-chevron-up';
        this.iconDown = 'fa fa-chevron-down';
        this.animationUp = new Animation('ui-ease-in', 'ui-fade-in-up', 'ui-0-2s', 200);
        this.animationDown = new Animation('ui-ease-in', 'ui-fade-in-down', 'ui-0-2s', 200);
        this.isStop = true;
        this.create();
    }
    /**
    * Create HTML
    * @method create
    */
    Clock.prototype.create = function () {
        /**
        * Create HTMLElements.
        */
        this.panel = document.createElement('div');
        this.panelBody = document.createElement('div');
        this.createTable();

        /**
        * add classes.
        */
        this.element.className = 'ui-clock';
        this.panel.className = 'panel panel-primary';
        this.panelBody.className = 'ui-clock panel-body';

        /**
        * append Nodes.
        */
        this.panelBody.appendChild(this.table);
        this.panel.appendChild(this.panelBody);
        this.element.appendChild(this.panel);
    };

    /**
    * Create Table HTML
    * @method createTable
    */
    Clock.prototype.createTable = function () {
        /**
        * Create HTMLElements.
        */
        this.table = document.createElement('table');
        var tbody = document.createElement('tbody');
        var tr = document.createElement('tr');
        this.upHour = document.createElement('td');
        this.upMinutes = document.createElement('td');
        this.upSeconds = document.createElement('td');
        this.upTime = document.createElement('td');
        this.downHour = document.createElement('td');
        this.downMinutes = document.createElement('td');
        this.downSeconds = document.createElement('td');
        this.downTime = document.createElement('td');
        this.hour = document.createElement('td');
        this.minutes = document.createElement('td');
        this.seconds = document.createElement('td');
        this.time = document.createElement('td');
        var iconUp = document.createElement('i');
        var iconDown = document.createElement('i');

        /**
        * add classes.
        */
        this.table.className = 'ui-clock table table-condensed';
        tr.className = 'ui-clock-controls text-primary';
        iconUp.className = this.iconUp;
        iconDown.className = this.iconDown;

        /**
        * create row for up controls
        */
        this.upHour.appendChild(iconUp.cloneNode());
        this.upMinutes.appendChild(iconUp.cloneNode());
        this.upSeconds.appendChild(iconUp.cloneNode());
        this.upTime.appendChild(iconUp.cloneNode());
        tr.appendChild(this.upHour);
        tr.appendChild(this.upMinutes);
        tr.appendChild(this.upSeconds);
        tr.appendChild(this.upTime);
        tbody.appendChild(tr);
        this.addEventsUpControls();

        /**
        * create row for display the time
        */
        tr = document.createElement('tr');
        tr.className = 'bg-primary';
        this.clearTime();
        tr.appendChild(this.hour);
        tr.appendChild(this.minutes);
        tr.appendChild(this.seconds);
        tr.appendChild(this.time);
        tbody.appendChild(tr);

        /**
        * create row for down controls
        */
        tr = document.createElement('tr');
        tr.className = 'ui-clock-controls text-primary';
        this.downHour.appendChild(iconDown.cloneNode());
        this.downMinutes.appendChild(iconDown.cloneNode());
        this.downSeconds.appendChild(iconDown.cloneNode());
        this.downTime.appendChild(iconDown.cloneNode());
        tr.appendChild(this.downHour);
        tr.appendChild(this.downMinutes);
        tr.appendChild(this.downSeconds);
        tr.appendChild(this.downTime);
        tbody.appendChild(tr);
        this.addEventsDownControls();

        /**
        * add node tbody
        */
        this.table.appendChild(tbody);
    };

    /**
    * clear clock
    * @method clearTime
    */
    Clock.prototype.clearTime = function () {
        this.hour.textContent = '00';
        this.minutes.textContent = '00';
        this.seconds.textContent = '00';
        this.time.textContent = '--';
    };

    /**
    * add events for Up Controls
    * @method addEventsUpControls
    */
    Clock.prototype.addEventsUpControls = function () {
        var _this = this;
        this.upHour.onclick = function () {
            var max = _this.isCountDown() || _this.isCountUp() ? 99 : _this.isMilitaryTime() ? 23 : 12;
            _this.animationUp.run(_this.hour);
            _this.hour.textContent = _this.upDigit(_this.getHours(), max);
        };
        this.upMinutes.onclick = function () {
            _this.animationUp.run(_this.minutes);
            _this.minutes.textContent = _this.upDigit(_this.getMinutes(), 59);
        };
        this.upSeconds.onclick = function () {
            _this.animationUp.run(_this.seconds);
            _this.seconds.textContent = _this.upDigit(_this.getSeconds(), 59);
        };
        this.upTime.onclick = function () {
            _this.animationUp.run(_this.time);
            _this.time.textContent = _this.time.textContent === 'AM' ? 'PM' : 'AM';
        };
    };

    /**
    * add events for Down Controls
    * @method addEventsDownControls
    */
    Clock.prototype.addEventsDownControls = function () {
        var _this = this;
        this.downHour.onclick = function () {
            var start = _this.isCountDown() || _this.isCountUp() ? 99 : _this.isMilitaryTime() ? 23 : 12;
            _this.animationDown.run(_this.hour);
            _this.hour.textContent = _this.downDigit(_this.getHours(), 0, start);
        };
        this.downMinutes.onclick = function () {
            _this.animationDown.run(_this.minutes);
            _this.minutes.textContent = _this.downDigit(_this.getMinutes(), 0, 59);
        };
        this.downSeconds.onclick = function () {
            _this.animationDown.run(_this.seconds);
            _this.seconds.textContent = _this.downDigit(_this.getSeconds(), 0, 59);
        };
        this.downTime.onclick = function () {
            _this.animationDown.run(_this.time);
            _this.time.textContent = _this.time.textContent === 'AM' ? 'PM' : 'AM';
        };
    };

    /**
    * Add an zero in front, if the digit is less that ten
    * @param {any} digit
    * @return {string} digit fixed
    * @method fixDigit
    */
    Clock.prototype.fixDigit = function (digit) {
        if (digit < 10 && digit.toString().length === 1) {
            digit = '0' + digit;
        }
        return digit;
    };

    /**
    * hidden time column
    * @method hiddenTimeColumn
    */
    Clock.prototype.hiddenTimeColumn = function () {
        if (!this.upTime.classList.contains('hidden'))
            this.upTime.classList.add('hidden');
        if (!this.time.classList.contains('hidden'))
            this.time.classList.add('hidden');
        if (!this.downTime.classList.contains('hidden'))
            this.downTime.classList.add('hidden');
    };

    /**
    * show time column
    * @method showTimeColumn
    */
    Clock.prototype.showTimeColumn = function () {
        if (this.upTime.classList.contains('hidden'))
            this.upTime.classList.remove('hidden');
        if (this.time.classList.contains('hidden'))
            this.time.classList.remove('hidden');
        if (this.downTime.classList.contains('hidden'))
            this.downTime.classList.remove('hidden');
    };

    /**
    * Digit increase to the maximum number
    * @param {any} digit
    * @param {number} max
    * @method upDigit
    */
    Clock.prototype.upDigit = function (digit, max) {
        digit++;
        if (digit > max)
            digit = 0;
        return this.fixDigit(digit);
    };

    /**
    * Decrement digit to the minimum number and start over
    * @param {any} digit
    * @param {number} min
    * @param {number} start
    * @method downDigit
    */
    Clock.prototype.downDigit = function (digit, min, start) {
        digit--;
        if (digit < min)
            digit = start;
        return this.fixDigit(digit);
    };

    /**
    * Start clock in the standard time
    * @method standardTime
    */
    Clock.prototype.standardTime = function () {
        this.isStop = false;
        this.type = 0 /* STANDARD */;
        this.showTimeColumn();
        this.setDisabledControls(true);
        this.runStandardTime();
    };

    /**
    * run clock in the standard time
    * @method runStandardTime
    */
    Clock.prototype.runStandardTime = function () {
        var _this = this;
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        var t = h < 12 ? 'AM' : 'PM';
        if (h > 12)
            h = h - 12;
        else if (h === 0)
            h = 12;
        h = this.fixDigit(h);
        m = this.fixDigit(m);
        s = this.fixDigit(s);

        if (this.getSeconds() != s) {
            this.animationDown.run(this.seconds);
            this.seconds.textContent = s;
        }
        if (this.getMinutes() != m) {
            this.animationDown.run(this.minutes);
            this.minutes.textContent = m;
        }
        if (this.getHours() != h) {
            this.animationDown.run(this.hour);
            this.hour.textContent = h;
        }
        if (this.time.textContent != t) {
            this.animationDown.run(this.time);
            this.time.textContent = t;
        }
        this.timeOut = setTimeout(function () {
            _this.runStandardTime();
        }, 1000);
    };

    /**
    * Start clock in the military time
    * @method militaryTime
    */
    Clock.prototype.militaryTime = function () {
        this.isStop = false;
        this.type = 1 /* MILITARY */;
        this.hiddenTimeColumn();
        this.setDisabledControls(true);
        this.runMilitaryTime();
    };

    /**
    * Run clock in the military time
    * @method runMilitaryTime
    */
    Clock.prototype.runMilitaryTime = function () {
        var _this = this;
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();

        h = this.fixDigit(h);
        m = this.fixDigit(m);
        s = this.fixDigit(s);

        if (this.getSeconds() != s) {
            this.animationDown.run(this.seconds);
            this.seconds.textContent = s;
        }
        if (this.getMinutes() != m) {
            this.animationDown.run(this.minutes);
            this.minutes.textContent = m;
        }
        if (this.getHours() != h) {
            this.animationDown.run(this.hour);
            this.hour.textContent = h;
        }
        this.timeOut = setTimeout(function () {
            _this.runMilitaryTime();
        }, 1000);
    };

    /**
    * Start clock with the counting down
    * @param {function} callBack
    * @method countDown
    */
    Clock.prototype.countDown = function (callBack) {
        this.isStop = true;
        this.type = 2 /* COUNT_DOWN */;
        this.hiddenTimeColumn();
        this.setDisabledControls(false);
        if (callBack)
            this.callBackCountDown = callBack;
    };

    /**
    * Run clock in the counting down
    * @method runCountDown
    */
    Clock.prototype.runCountDown = function () {
        var _this = this;
        this.isStop = this.getHours() === '00' && this.getMinutes() === '00' && this.getSeconds() === '00';
        if (this.isStop) {
            this.isStop = false; //restart isStop in FALSE
            this.stop();
            if (this.callBackCountDown)
                this.callBackCountDown();
            return false;
        } else {
            var lap = this.getSeconds() === '00';
            this.animationDown.run(this.seconds);
            this.seconds.textContent = this.downDigit(this.getSeconds(), 0, 59);
            if (lap) {
                lap = false;
                this.animationDown.run(this.minutes);
                lap = this.getMinutes() === '00';
                this.minutes.textContent = this.downDigit(this.getMinutes(), 0, 59);

                if (lap && this.getHours() > 0) {
                    lap = false;
                    this.animationDown.run(this.hour);
                    this.hour.textContent = this.downDigit(this.getHours(), 0, 99);
                }
            }
        }
        this.timeOut = setTimeout(function () {
            _this.runCountDown();
        }, 1000);
    };

    /**
    * Start clock with the counting up
    * @method countUp
    */
    Clock.prototype.countUp = function () {
        this.isStop = true;
        this.type = 3 /* COUNT_UP */;
        this.hiddenTimeColumn();
        this.setDisabledControls(false);
    };

    /**
    * Run clock in the counting up
    * @method runCountUp
    */
    Clock.prototype.runCountUp = function () {
        var _this = this;
        var lap = this.getSeconds() === '59';
        this.animationUp.run(this.seconds);
        this.seconds.textContent = this.upDigit(this.getSeconds(), 59);
        if (lap) {
            lap = false;
            this.animationUp.run(this.minutes);
            lap = this.getMinutes() === '59';
            this.minutes.textContent = this.upDigit(this.getMinutes(), 59);
            if (lap) {
                lap = false;
                this.animationUp.run(this.hour);
                this.hour.textContent = this.upDigit(this.getHours(), 99);
            }
        }
        this.timeOut = setTimeout(function () {
            _this.runCountUp();
        }, 1000);
    };

    /**
    * set Standard time
    * @param {Date} date
    * @method setStandarTime
    */
    Clock.prototype.setStandardTime = function (date) {
        if (date) {
            this.seconds.textContent = this.fixDigit(date.getSeconds());
            this.minutes.textContent = this.fixDigit(date.getMinutes());
            this.hour.textContent = this.fixDigit(date.getHours());
            this.date = date;
        }
        var h = this.getHours();
        this.time.textContent = h < 12 ? 'AM' : 'PM';
        if (h > 12)
            h = h - 12;
        else if (parseInt(h) === 0)
            h = 12;
        h = this.fixDigit(h);
        this.hour.textContent = h;
        this.isStop = false;
        this.type = 4 /* CUSTOM_STANDARD */;
        this.showTimeColumn();
        this.setDisabledControls(true);
        this.runCustomStandarTime();
    };

    /**
    * Run clock in the custom standar time
    * @method runCustomStandarTime
    */
    Clock.prototype.runCustomStandarTime = function () {
        var _this = this;
        var lap = this.getSeconds() === '59';
        this.animationDown.run(this.seconds);
        this.seconds.textContent = this.upDigit(this.getSeconds(), 59);
        if (lap) {
            lap = false;
            this.animationDown.run(this.minutes);
            lap = this.getMinutes() === '59';
            this.minutes.textContent = this.upDigit(this.getMinutes(), 59);
            if (lap) {
                lap = false;
                this.animationDown.run(this.hour);
                if (this.getHours() === '12') {
                    this.time.textContent = this.getTimeForStandarClock() === 'AM' ? 'PM' : 'AM';
                }
                var h = this.upDigit(this.getHours(), 12);
                this.hour.textContent = h === '00' ? '01' : h;
            }
        }
        this.timeOut = setTimeout(function () {
            _this.runCustomStandarTime();
        }, 1000);
    };

    /**
    * set Military time
    * @param {Date} date
    * @method setMilitaryTime
    */
    Clock.prototype.setMilitaryTime = function (date) {
        if (date) {
            this.seconds.textContent = this.fixDigit(date.getSeconds());
            this.minutes.textContent = this.fixDigit(date.getMinutes());
            this.hour.textContent = this.fixDigit(date.getHours());
            this.date = date;
        }
        this.isStop = false;
        this.type = 5 /* CUSTOM_MILITARY */;
        this.hiddenTimeColumn();
        this.setDisabledControls(true);
        this.runCustomStandarTime();
    };

    /**
    * Run clock in the custom military time
    * @method runCustomMilitaryTime
    */
    Clock.prototype.runCustomMilitaryTime = function () {
        var _this = this;
        var lap = this.getSeconds() === '59';
        this.animationDown.run(this.seconds);
        this.seconds.textContent = this.upDigit(this.getSeconds(), 59);
        if (lap) {
            lap = false;
            this.animationDown.run(this.minutes);
            lap = this.getMinutes() === '59';
            this.minutes.textContent = this.upDigit(this.getMinutes(), 59);
            if (lap) {
                lap = false;
                this.animationDown.run(this.hour);
                this.hour.textContent = this.upDigit(this.getHours(), 23);
            }
        }
        this.timeOut = setTimeout(function () {
            _this.runCustomMilitaryTime();
        }, 1000);
    };

    /**
    * Start clock
    * @method start
    */
    Clock.prototype.start = function () {
        this.isStop = false;
        switch (this.type) {
            case 0 /* STANDARD */:
                this.setDisabledControls(true);
                this.runStandardTime();
                break;
            case 1 /* MILITARY */:
                this.setDisabledControls(true);
                this.runMilitaryTime();
                break;
            case 2 /* COUNT_DOWN */:
                this.runCountDown();
                break;
            case 3 /* COUNT_UP */:
                this.runCountUp();
                break;
            case 4 /* CUSTOM_STANDARD */:
                this.setDisabledControls(true);
                this.runCustomStandarTime();
                break;
            case 5 /* CUSTOM_MILITARY */:
                this.setDisabledControls(true);
                this.runCustomMilitaryTime();
                break;
        }
    };

    /**
    * Stop clock
    * @method stop
    */
    Clock.prototype.stop = function () {
        if (!this.isStop) {
            if (this.timeOut) {
                clearTimeout(this.timeOut);
                this.isStop = true;
                this.setDisabledControls(false);
            }
        }
    };

    /**
    * Reset clock
    * @method reset
    */
    Clock.prototype.reset = function () {
        this.stop();
        this.clearTime();
    };

    /**
    * Set disabled controls
    * @param {boolean} disabled
    * @method setDisabledControls
    */
    Clock.prototype.setDisabledControls = function (disabled) {
        var rowControlsUp = this.table.rows[0];
        var rowControlsDown = this.table.rows[2];
        this.disabledControl = disabled;
        if (disabled) {
            if (!rowControlsUp.classList.contains('disabled')) {
                rowControlsUp.classList.add('disabled');
            }
            if (!rowControlsDown.classList.contains('disabled')) {
                rowControlsDown.classList.add('disabled');
            }
        } else {
            if (rowControlsUp.classList.contains('disabled')) {
                rowControlsUp.classList.remove('disabled');
            }
            if (rowControlsDown.classList.contains('disabled')) {
                rowControlsDown.classList.remove('disabled');
            }
        }
    };

    /**
    * Is disabled controls
    * @returns {boolean} disabled
    * @method isDisabledControls
    */
    Clock.prototype.isDisabledControls = function () {
        return this.disabledControl;
    };

    /**
    * Set hidden controls
    * @param {boolean} hidden
    * @method setHiddenControls
    */
    Clock.prototype.setHiddenControls = function (hidden) {
        var rowControlsUp = this.table.rows[0];
        var rowControlsDown = this.table.rows[2];
        this.hiddenControl = hidden;
        if (hidden) {
            if (!rowControlsUp.classList.contains('hidden')) {
                rowControlsUp.classList.add('hidden');
            }
            if (!rowControlsDown.classList.contains('hidden')) {
                rowControlsDown.classList.add('hidden');
            }
        } else {
            if (rowControlsUp.classList.contains('hidden')) {
                rowControlsUp.classList.remove('hidden');
            }
            if (rowControlsDown.classList.contains('hidden')) {
                rowControlsDown.classList.remove('hidden');
            }
        }
    };

    /**
    * Is hidden controls
    * @returns {boolean} hidden
    * @method isHiddenControls
    */
    Clock.prototype.isHiddenControls = function () {
        return this.hiddenControl;
    };

    /**
    * Set hidden Seconds
    * @param {boolean} hidden
    * @method setHiddenSeconds
    */
    Clock.prototype.setHiddenSeconds = function (hidden) {
        var rowControlsUp = this.table.rows[0];
        var cellControlsUp = rowControlsUp.cells[2];
        var rowControlsDown = this.table.rows[2];
        var cellControlsDown = rowControlsDown.cells[2];
        this.hiddenSeconds = hidden;
        if (hidden) {
            if (!cellControlsUp.classList.contains('hidden')) {
                cellControlsUp.classList.add('hidden');
            }
            if (!this.seconds.classList.contains('hidden')) {
                this.seconds.classList.add('hidden');
            }
            if (!cellControlsDown.classList.contains('hidden')) {
                cellControlsDown.classList.add('hidden');
            }
        } else {
            if (cellControlsUp.classList.contains('hidden')) {
                cellControlsUp.classList.remove('hidden');
            }
            if (this.seconds.classList.contains('hidden')) {
                this.seconds.classList.remove('hidden');
            }
            if (cellControlsDown.classList.contains('hidden')) {
                cellControlsDown.classList.remove('hidden');
            }
        }
    };

    /**
    * Is hidden seconds
    * @returns {boolean} hidden
    * @method isHiddenSeconds
    */
    Clock.prototype.isHiddenSeconds = function () {
        return this.hiddenSeconds;
    };

    /**
    * get DateTime
    * @returns {String} dateTime
    * @method getDateTime
    */
    Clock.prototype.getDateTime = function () {
        var t = this.isStandardTime() ? this.time.textContent : '';
        return this.getHours() + ':' + this.getMinutes() + ':' + this.getSeconds() + ' ' + t;
    };

    /**
    * get Date
    * @returns {Date} date
    * @method getDate
    */
    Clock.prototype.getDate = function () {
        var date = this.isCustom() ? this.date : new Date();
        date.setHours(this.getHours(), this.getMinutes(), this.getSeconds());
        return date;
    };

    /**
    * get Hour
    * @returns {any} hour
    * @method getHours
    */
    Clock.prototype.getHours = function () {
        var h = this.hour.textContent;
        if (this.isStandardTime()) {
            h = h > 12 ? h - 12 : h;
        }
        return h;
    };

    /**
    * get Minutes
    * @returns {any} minutes
    * @method getMinutes
    */
    Clock.prototype.getMinutes = function () {
        return this.minutes.textContent;
    };

    /**
    * get Seconds
    * @returns {any} seconds
    * @method getSeconds
    */
    Clock.prototype.getSeconds = function () {
        return this.seconds.textContent;
    };

    /**
    * get Time for a standard clock :AM/PM
    * @returns {string} time
    * @method getTimeForStandarClock
    */
    Clock.prototype.getTimeForStandarClock = function () {
        var time = null;
        if (this.isStandardTime()) {
            time = this.time.textContent;
        }
        return time;
    };

    /**
    * @returns {boolean} return true if the type is standard time
    * @method isStandardTime
    */
    Clock.prototype.isStandardTime = function () {
        return this.type === 0 /* STANDARD */ || this.type === 4 /* CUSTOM_STANDARD */;
    };
    Clock.prototype.isCustomStandard = function () {
        return this.type === 4 /* CUSTOM_STANDARD */;
    };

    /**
    * @returns {boolean} return true if the type is military time
    * @method isMilitaryTime
    */
    Clock.prototype.isMilitaryTime = function () {
        return this.type === 1 /* MILITARY */ || this.type === 5 /* CUSTOM_MILITARY */;
    };
    Clock.prototype.isCustomMilitary = function () {
        return this.type === 5 /* CUSTOM_MILITARY */;
    };

    Clock.prototype.isCustom = function () {
        return this.isCustomMilitary() || this.isCustomStandard();
    };

    /**
    * @returns {boolean} return true if the type is count down
    * @method isCountDown
    */
    Clock.prototype.isCountDown = function () {
        return this.type === 2 /* COUNT_DOWN */;
    };

    /**
    * @returns {boolean} return true if the type is count up
    * @method isCountUp
    */
    Clock.prototype.isCountUp = function () {
        return this.type === 3 /* COUNT_UP */;
    };

    Clock.prototype.isStopped = function () {
        return this.isStop;
    };
    return Clock;
})();

/**
* Animation
* @class Animation
*/
var Animation = (function () {
    /**
    * constructor
    * @param {string} type
    * @param {string} fn
    * @param {string} time
    * @param {number} ms
    */
    function Animation(type, fn, time, ms) {
        this.type = type;
        this.fn = fn;
        this.time = time;
        this.ms = ms;
    }
    /**
    * Run animation
    * @param {HTMLElement} element
    * @param {Function} callback
    * @method run
    */
    Animation.prototype.run = function (element, callBack) {
        var _this = this;
        element.classList.add(this.type);
        element.classList.add(this.fn);
        element.classList.add(this.time);
        this.timeOut = setTimeout(function () {
            element.classList.remove(_this.type);
            element.classList.remove(_this.fn);
            element.classList.remove(_this.time);
            if (callBack)
                callBack();
        }, this.ms);
    };

    /**
    * Stop animation
    * @method stop
    */
    Animation.prototype.stop = function () {
        if (this.timeOut)
            clearTimeout(this.timeOut);
    };
    return Animation;
})();

var ETypeCalendar;
(function (ETypeCalendar) {
    ETypeCalendar[ETypeCalendar["DAY"] = 0] = "DAY";
    ETypeCalendar[ETypeCalendar["MONTH"] = 1] = "MONTH";
    ETypeCalendar[ETypeCalendar["YEAR"] = 2] = "YEAR";
})(ETypeCalendar || (ETypeCalendar = {}));

var Calendar = (function () {
    function Calendar(element, options) {
        this.days = ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'];
        this.abbDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        this.abbMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.yearGregorian = 1582;
        this.today = new Date();
        this.type = 0 /* DAY */;
        this.element = element;
        this.options = options;
        this.animationIn = new Animation('ui-ease', 'ui-fade-in-down', 'ui-0-5s', 500);
        this.animationOut = new Animation('ui-ease', 'ui-fade-out-up', 'ui-0-5s', 500);
        this.animationNext = new Animation('ui-ease', 'ui-flip-out-y', 'ui-0-2s', 200);
        this.animationBack = new Animation('ui-ease', 'ui-flip-out-y', 'ui-0-2s', 200);
        this.animationUp = new Animation('ui-ease', 'ui-flip-out-x', 'ui-0-2s', 200);
        this.animationDown = new Animation('ui-ease', 'ui-flip-out-x', 'ui-0-2s', 200);
        this.setOptions();
        this.displayDate = this.today.clone();
        this.displayDate.setDate(1);
        this.data = {};
        this.dataDay();
        this.createCalendar();
        this.calendarDay();
        this.mediaQuery();
    }
    Calendar.prototype.dataDay = function () {
        var dayweek = this.displayDate.getDay();
        var month = this.displayDate.getMonth();
        var year = this.displayDate.getFullYear();
        var totalDays = this.displayDate.getMonthDayCount();
        this.data.month = {
            value: month,
            text: this.displayDate.getMonthName()
        };
        this.data.year = year;
        this.data.currentDay = month === this.today.getMonth() && year === this.today.getFullYear() ? this.today.getDate() : 1;
        this.data.items = new Array();
        var previousTotalDays = 0;
        var day = 0;
        var isPreviousDay = false;
        var isCurrentDay = true;
        var isNextDay = false;

        /*
        * If the day week is greater than zero,
        * necessary known how many days has the previous month.
        */
        if (dayweek > 0) {
            var previousDate = this.displayDate.clone();
            previousDate.previousMonth();
            previousTotalDays = previousDate.getMonthDayCount();

            /*
            * calculate the first day for display on the calendar
            */
            day = previousTotalDays - dayweek;
            if (day > 30)
                day--;
            isPreviousDay = true;
            isCurrentDay = false;
        }

        for (var i = 0; i < 42; i++) {
            var item = {};
            day++;
            item.day = day;
            if (isPreviousDay) {
                item.previousDay = true;

                /*
                *If the day is equals at  total days the
                *previous month, is becasuse wiLL start
                *the current month
                */
                if (day === previousTotalDays) {
                    isPreviousDay = false;
                    isCurrentDay = true;
                    day = 0;
                }
            } else if (isCurrentDay) {
                item.currentDay = true;

                /*
                *If the day is equals at  total days the
                *current month, is becasuse wiLL start
                *the next month.
                */
                if (day === totalDays) {
                    isNextDay = true;
                    isCurrentDay = false;
                    day = 0;
                }
            } else {
                item.nextDay = true;
            }
            this.data.items.push(item);
        }
        this.type = 0 /* DAY */;
    };

    Calendar.prototype.dataMonth = function () {
        var year = this.displayDate.getFullYear();
        this.data.year = year;
        this.data.currentMonth = year === this.today.getFullYear() ? this.today.getMonth() : 0;
        this.type = 1 /* MONTH */;
    };

    Calendar.prototype.dataYear = function () {
        var year = this.displayDate.getFullYear();
        var limitYear = year + 11;
        this.data.year = year;
        this.data.currentYear = year <= this.today.getFullYear() && limitYear >= this.today.getFullYear() ? this.today.getFullYear() : year;
        this.data.range = year + ' - ' + limitYear;
        this.type = 2 /* YEAR */;
    };

    Calendar.prototype.createCalendar = function () {
        var row = document.createElement('div');
        var col = document.createElement('div');
        var panelDefault = document.createElement('div');
        var panelBody = document.createElement('div');

        row.className = 'row';
        col.className = 'col-sm-12 col-md-12';
        panelDefault.className = 'ui-calendar panel panel-default panel-main';
        panelBody.className = 'panel-body';

        panelBody.appendChild(this.header());
        panelBody.appendChild(this.body());
        panelDefault.appendChild(panelBody);
        col.appendChild(panelDefault);
        row.appendChild(col);

        /*
        * add calendar to parent
        */
        this.element.appendChild(row);
    };

    /*
    * Create calendar header HTML.
    * @returns HTMLElement
    */
    Calendar.prototype.header = function () {
        var row = document.createElement('div');
        row.className = 'row';

        var colTitle = document.createElement('div');
        colTitle.className = 'col-sm-6';

        /*
        * add the title
        */
        this.title = document.createElement('a');
        this.title.className = 'ui-title';
        this.title.href = '#';

        colTitle.appendChild(this.title);

        var colButtons = document.createElement('div');
        colButtons.className = 'ui-calendar col-sm-6';
        var btnGroupJustified = document.createElement('div');
        btnGroupJustified.className = 'btn-group btn-group-justified';

        /*
        * back Button
        */
        var btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';
        this.btnBack = document.createElement('button');
        this.btnBack.type = 'button';
        this.btnBack.className = 'btn btn-default';
        var i = document.createElement('i');
        i.className = 'fa fa-chevron-circle-left';
        this.btnBack.appendChild(i);
        btnGroup.appendChild(this.btnBack);
        btnGroupJustified.appendChild(btnGroup);

        /*
        * current Button
        */
        btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';
        this.btnCurrent = document.createElement('button');
        this.btnCurrent.type = 'button';
        this.btnCurrent.className = 'btn btn-default';
        i = document.createElement('i');
        i.className = 'fa fa-circle';
        this.btnCurrent.appendChild(i);
        btnGroup.appendChild(this.btnCurrent);
        btnGroupJustified.appendChild(btnGroup);

        /*
        * next Button
        */
        btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';
        this.btnNext = document.createElement('button');
        this.btnNext.type = 'button';
        this.btnNext.className = 'btn btn-default';
        i = document.createElement('i');
        i.className = 'fa fa-chevron-circle-right';
        this.btnNext.appendChild(i);
        btnGroup.appendChild(this.btnNext);
        btnGroupJustified.appendChild(btnGroup);

        colButtons.appendChild(btnGroupJustified);
        row.appendChild(colTitle);
        row.appendChild(colButtons);
        return row;
    };

    /*
    *Create calendar body HTML.
    *@returns HTMLElement
    */
    Calendar.prototype.body = function () {
        var row = document.createElement('div');
        row.className = 'row';
        var col = document.createElement('div');
        col.className = 'col-sm-12';

        var panelDefault = document.createElement('div');
        panelDefault.className = 'ui-calendar panel panel-default';

        var panelBody = document.createElement('div');
        panelBody.className = 'panel-body';

        /*
        * Create the table
        */
        this.table = document.createElement('table');
        this.table.className = 'table table-condensed';
        var thead = document.createElement('thead');
        this.tbody = document.createElement('tbody');
        this.table.appendChild(thead);
        this.table.appendChild(this.tbody);
        panelBody.appendChild(this.table);
        panelDefault.appendChild(panelBody);
        col.appendChild(panelDefault);
        row.appendChild(col);
        return row;
    };

    Calendar.prototype.clearTable = function (callback, animation) {
        var _this = this;
        this.table.classList.add(animation.type);
        this.table.classList.add(animation.fn);
        this.table.classList.add(animation.time);
        setTimeout(function () {
            _this.table.classList.remove(animation.type);
            _this.table.classList.remove(animation.fn);
            _this.table.classList.remove(animation.time);
            _this.table.tHead.removeChildren();
            _this.tbody.removeChildren();
            callback(_this);
        }, 200);
    };

    Calendar.prototype.calendarDay = function (self) {
        if (!self)
            self = this;
        self.title.textContent = self.data.month.text + ' ' + self.data.year;

        /*
        * add event to change view type by months.
        */
        self.title.onclick = function (e) {
            e.preventDefault();
            self.displayDate.setDate(1);
            self.dataMonth();
            self.clearTable(self.calendarMonth, self.animationUp);
        };

        /*
        * add Event to navigation
        */
        self.btnBack.onclick = function () {
            self.displayDate.setDate(1);
            self.displayDate.previousMonth();
            self.dataDay();
            self.clearTable(self.calendarDay, self.animationBack);
        };
        self.btnCurrent.onclick = function () {
            /*
            * If not is the current month,
            * go to current month.
            */
            var dMonth = self.displayDate.getMonth();
            var month = self.today.getMonth();
            if (!(dMonth === month && self.today.getFullYear() === self.displayDate.getFullYear())) {
                self.displayDate = self.today.clone();
                self.displayDate.setDate(1);
                self.dataDay();
                self.clearTable(self.calendarDay, self.animationUp);
            }
        };
        self.btnNext.onclick = function () {
            self.displayDate.setDate(1);
            self.displayDate.nextMonth();
            self.dataDay();
            self.clearTable(self.calendarDay, self.animationNext);
        };
        self.loadLegendMatchMedia();

        /*
        * Create the days of previous month, current month and next month,
        * with a total of 42 days
        */
        var mod = 1;
        var axuTr = document.createElement('tr');
        var currentDay = self.data.currentDay;
        for (var j = 0; j < 42; j++) {
            var item = self.data.items[j];
            var day = item.day;
            var td = document.createElement('td');

            /*
            * If the day not for the current month,
            * make the text clearer
            */
            if (item.previousDay || item.nextDay) {
                td.className = 'text-muted';
            }

            /*
            * If the day is the current day,
            * make the background darker
            */
            if (item.currentDay && day === currentDay) {
                td.className = 'bg-primary';
                self.selectedCell = td;
            }

            /*
            * Add event, if  is input option
            * then change self value for the selected date.
            */
            td.onclick = function () {
                self.selectCell(this);
                if (this.classList.contains('text-muted')) {
                    if (this.textContent > 20) {
                        self.displayDate.setDate(1);
                        self.displayDate.previousMonth();
                        self.dataDay();
                        self.displayDate.setDate(this.textContent);
                        self.data.currentDay = self.displayDate.getDate();
                        self.clearTable(self.calendarDay, self.animationBack);
                    } else {
                        self.displayDate.setDate(1);
                        self.displayDate.nextMonth();
                        self.dataDay();
                        self.displayDate.setDate(this.textContent);
                        self.data.currentDay = self.displayDate.getDate();
                        self.clearTable(self.calendarDay, self.animationNext);
                    }
                }
                if (self.options && self.options.isInput) {
                    self.displayDate.setDate(this.textContent);
                    var tmpInput = self.options.input;
                    tmpInput.value = self.displayDate.format(tmpInput.dataset.date);
                    tmpInput.onchange();
                    tmpInput.onblur();
                    self.close();
                }
            };
            td.textContent = day;
            axuTr.appendChild(td);

            /*
            * If mod is greater than zero and is module of 7,
            * is because will start other week on the calendar
            */
            if (mod > 1 && mod % 7 === 0) {
                self.tbody.appendChild(axuTr);
                axuTr = document.createElement('tr');
            }
            mod++;
        }
    };

    /*
    * Load the legend of the days of week
    */
    Calendar.prototype.loadLegend = function (array) {
        if (this.type === 0 /* DAY */) {
            if (this.legend)
                this.legend.removeChildren();
            this.legend = document.createElement('tr');
            this.table.tHead.appendChild(this.legend);
            for (var i = 0; i < 7; i++) {
                var th = document.createElement('th');
                th.textContent = array[i];
                this.legend.appendChild(th);
            }
        }
    };

    Calendar.prototype.calendarMonth = function (self) {
        if (!self)
            self = this;
        self.title.text = self.data.year;

        /*
        * add event to change view type by range years.
        */
        self.title.onclick = function (e) {
            e.preventDefault();
            self.dataYear();
            self.clearTable(self.calendarYear, self.animationUp);
        };

        /*
        * add Event to navigation
        */
        self.btnBack.onclick = function () {
            var year = self.displayDate.getFullYear() - 1;
            if (year > self.yearGregorian) {
                self.displayDate = new Date(year, 0, 1);
                self.dataMonth();
                self.clearTable(self.calendarMonth, self.animationBack);
            }
        };
        self.btnCurrent.onclick = function () {
            /*
            * If not is the current year,
            * go to current year.
            */
            if (self.displayDate.getFullYear() !== self.today.getFullYear()) {
                self.displayDate = self.today.clone();
                self.dataMonth();
                self.clearTable(self.calendarMonth, self.animationUp);
            }
        };
        self.btnNext.onclick = function () {
            self.displayDate = new Date(self.displayDate.getFullYear() + 1, 0, 1);
            self.dataMonth();
            self.clearTable(self.calendarMonth, self.animationNext);
        };

        /*
        * Create all months of a year.
        */
        var tr = document.createElement('tr');
        var mod = 1;
        var currentMonth = self.data.currentMonth;
        for (var j = 0; j < 12; j++) {
            var td = document.createElement('td');

            /*
            * If the j is the current day,
            * make the background darker.
            */
            if (j === currentMonth) {
                td.className = 'bg-primary';
            }
            td.textContent = self.abbMonths[j];
            tr.appendChild(td);

            /*
            * add event to go to month selected.
            */
            td.onclick = function () {
                self.displayDate.setMonth(self.abbMonths.indexOf(this.textContent));
                self.displayDate.setDate(1);
                self.dataDay();
                self.clearTable(self.calendarDay, self.animationDown);
            };

            /*
            * If mod is greater than zero and is module of 3,
            * add new row.
            */
            if (mod > 1 && mod % 3 === 0) {
                self.tbody.appendChild(tr);
                tr = document.createElement('tr');
            }
            mod++;
        }
    };

    Calendar.prototype.calendarYear = function (self) {
        if (!self)
            self = this;
        self.title.text = self.data.range;
        self.title.onclick = function (e) {
            e.preventDefault();
        };

        /*
        * add Event to navigation
        */
        self.btnBack.onclick = function () {
            var year = self.displayDate.getFullYear() - 12;
            if (year <= self.yearGregorian) {
                year = self.yearGregorian;
            }
            self.displayDate = new Date(year, 0, 1);
            self.dataYear();
            self.clearTable(self.calendarYear, self.animationBack);
        };
        self.btnCurrent.onclick = function () {
            /*
            * If not is the current year,
            * go to current range year.
            */
            if (self.displayDate.getFullYear() !== self.today.getFullYear()) {
                self.displayDate = self.today.clone();
                self.dataYear();
                self.clearTable(self.calendarYear, self.animationUp);
            }
        };
        self.btnNext.onclick = function () {
            self.displayDate = new Date(self.displayDate.getFullYear() + 12, 0, 1);
            self.dataYear();
            self.clearTable(self.calendarYear, self.animationNext);
        };

        /*
        * Create range year.
        */
        var tr = document.createElement('tr');
        var mod = 1;
        var year = self.data.year;
        var currentYear = self.data.currentYear;
        for (var j = 0; j < 12; j++) {
            var td = document.createElement('td');

            /*
            * If the j is the current day,
            * make the background darker.
            */
            if (year === currentYear) {
                td.className = 'bg-primary';
            }
            td.textContent = (year++).toString();
            tr.appendChild(td);

            /*
            * add event to go to year selected.
            */
            td.onclick = function () {
                self.displayDate.setFullYear(this.textContent);
                self.dataMonth();
                self.clearTable(self.calendarMonth, self.animationDown);
            };

            /*
            * If mod is greater than zero and is module of 3,
            * add new row.
            */
            if (mod > 1 && mod % 3 === 0) {
                self.tbody.appendChild(tr);
                tr = document.createElement('tr');
            }
            mod++;
        }
    };

    Calendar.prototype.setOptions = function () {
        if (this.options) {
            if (this.options.isInput) {
                this.element.className = 'hidden ui-calendar-input';
            }
        }
    };

    Calendar.prototype.displayDateFromValue = function () {
        if (this.options && this.options.isInput) {
            var input = this.options.input;
            var value = input.value;
            if (!value.isEmpty()) {
                this.displayDate = new Date().parse(value, input.dataset.date);
                this.displayDate = this.displayDate.isValid() ? this.displayDate : new Date();
                var col = this.displayDate.getDay();
                var row = this.displayDate.getWeekOfMonth();
                this.displayDate.setDate(1);
                this.dataDay();
                this.clearTable(this.calendarDay, this.animationUp);
                var cell = this.table.rows[row].cells[col];
                this.selectCell(cell);
            }
        }
    };

    Calendar.prototype.selectCell = function (cell) {
        this.selectedCell.classList.remove('bg-primary');
        cell.classList.add('bg-primary');
        this.selectedCell = cell;
    };

    /* JavaScript Media Queries */
    Calendar.prototype.mediaQuery = function () {
        if (matchMedia) {
            var mq = window.matchMedia("(max-width: 969px)");
            var self = this;
            mq.addListener(function () {
                if (mq.matches) {
                    self.loadLegend(self.abbDays);
                } else {
                    self.loadLegend(self.days);
                }
            });
        }
    };

    Calendar.prototype.loadLegendMatchMedia = function () {
        var mq = window.matchMedia("(max-width: 969px)");
        if (mq.matches) {
            this.loadLegend(this.abbDays);
        } else {
            this.loadLegend(this.days);
        }
    };

    Calendar.prototype.refresh = function () {
        this.dataDay();
        this.clearTable(this.calendarDay, this.animationUp);
    };

    Calendar.prototype.open = function (callback) {
        var _this = this;
        this.element.classList.remove('hidden');
        this.element.classList.add(this.animationIn.type);
        this.element.classList.add(this.animationIn.fn);
        this.element.classList.add(this.animationIn.time);
        setTimeout(function () {
            _this.element.classList.remove(_this.animationIn.type);
            _this.element.classList.remove(_this.animationIn.fn);
            _this.element.classList.remove(_this.animationIn.time);
            _this.displayDateFromValue();
            if (callback)
                callback();
        }, 500);
    };

    Calendar.prototype.close = function (callback) {
        var _this = this;
        this.element.classList.add(this.animationOut.type);
        this.element.classList.add(this.animationOut.fn);
        this.element.classList.add(this.animationOut.time);
        setTimeout(function () {
            _this.element.classList.remove(_this.animationOut.type);
            _this.element.classList.remove(_this.animationOut.fn);
            _this.element.classList.remove(_this.animationOut.time);
            _this.element.classList.add('hidden');
            if (callback)
                callback();
        }, 500);
    };

    Calendar.prototype.isOpen = function () {
        return !this.element.classList.contains('hidden');
    };

    Calendar.prototype.getDate = function () {
        this.displayDate.setDate(this.selectedCell.textContent);
        return this.displayDate;
    };

    Calendar.prototype.setAnimationIn = function (animationFn) {
        this.animationIn.fn = animationFn;
    };

    Calendar.prototype.setAnimationOut = function (animationFn) {
        this.animationOut.fn = animationFn;
    };

    Calendar.prototype.setLegendDaysWeek = function (strDays) {
        this.days = strDays.split(',');
        this.abbDays = new Array();
        var i = 0;
        while (i < 7) {
            this.abbDays.push(this.days[i].charAt(0));
            i++;
        }
    };

    Calendar.prototype.setLegendMonths = function (strMonths) {
        var months = strMonths.split(',');

        //@overwrite Date.getMonthName()
        Date.prototype.getMonthName = function () {
            var month_names = months;
            return month_names[this.getMonth()];
        };
        var i = 0;
        this.abbMonths = new Array();
        while (i < 12) {
            this.abbMonths.push(months[i].substring(0, 3));
            i++;
        }
        var mAbbrs = this.abbMonths;

        //@overwrite Date.getMonthAbbr()
        Date.prototype.getMonthAbbr = function () {
            var month_abbrs = mAbbrs;
            return month_abbrs[this.getMonth()];
        };
    };
    return Calendar;
})();

var ETypeSelect;
(function (ETypeSelect) {
    ETypeSelect[ETypeSelect["SIMPLE"] = 0] = "SIMPLE";
    ETypeSelect[ETypeSelect["ICON"] = 1] = "ICON";
    ETypeSelect[ETypeSelect["IMAGE"] = 2] = "IMAGE";
})(ETypeSelect || (ETypeSelect = {}));

var State = (function () {
    function State(old, current) {
        this.old = null;
        this.current = null;
        if (old)
            this.old = old;
        if (current)
            this.current = current;
    }
    State.prototype.exchange = function (value) {
        this.old = this.current;
        this.current = value;
    };
    return State;
})();

var Select = (function () {
    function Select(htmlElement, data, options) {
        var _this = this;
        this.formGroup = document.createElement('div');
        this.hidden = document.createElement('input');
        this.input = document.createElement('input');
        this.mask = document.createElement('div');
        this.ico = document.createElement('i');
        this.items = document.createElement('ul');
        this.element = null;
        this.open = false;
        this.disabled = false;
        this.readOnly = false;
        this.data = null;
        this.length = 0;
        this.icono = 'fa-angle-down';
        this.type = 0 /* SIMPLE */;
        this.options = null;
        this.element = htmlElement;
        this.data = data;
        if (options)
            this.setOptions(options);
        this.animaIn = new Animation('ui-ease-in', 'ui-0-2s', 'ui-fade-in-down', 200);
        this.animaOut = new Animation('ui-ease-out', 'ui-0-2s', 'ui-fade-out-up', 200);
        this.itemSate = new State();
        this.formGroup.className = 'form-group  has-feedback';
        this.hidden.type = 'hidden';
        if (this.element.getAttribute('data-name'))
            this.hidden.name = this.element.getAttribute('data-name');
        this.formGroup.appendChild(this.hidden);
        this.input.type = 'text';
        this.input.className = 'form-control';
        this.input.onchange = function () {
            return true;
        };
        this.input.onkeyup = function (e) {
            if (e) {
                if (e.keyCode == 13)
                    _this.toggle();
                if (e.keyCode == 38)
                    _this.previous();
                if (e.keyCode == 40)
                    _this.next();
            }
        };
        this.input.onkeydown = function (e) {
            if (e) {
                if (e.keyCode != 9 && e.keyCode != 13 && e.keyCode != 16 && e.keyCode != 17 && !(e.keyCode >= 38 && e.keyCode <= 40)) {
                    e.preventDefault();
                }
            }
        };
        this.formGroup.appendChild(this.input);
        this.mask.className = 'ui-mask';
        this.mask.onclick = function (e) {
            _this.toggle();
            e.stopPropagation();
            return false;
        };
        this.formGroup.appendChild(this.mask);
        this.ico.className = 'form-control-feedback fa';
        this.ico.classList.add(this.icono);
        this.ico.onclick = function (e) {
            _this.toggle();
            e.stopPropagation();
            return false;
        };
        this.formGroup.appendChild(this.ico);
        this.element.appendChild(this.formGroup);
        this.items.className = 'ui-select-items';
        this.element.appendChild(this.items);
        this.config();
        this.fill();
    }
    Select.prototype.setOptions = function (options) {
        this.options = options;
        if (options.icon) {
            this.type = 1 /* ICON */;
            this.itemIconState = new State();
        } else if (options.image) {
            this.type = 2 /* IMAGE */;
            this.itemImageState = new State();
        }
    };

    Select.prototype.config = function (clear) {
        switch (this.type) {
            case 1 /* ICON */:
                if (clear) {
                    this.formGroup.classList.remove('has-ui-icon');
                    this.items.classList.remove('fa-lu');
                    this.formGroup.removeChild(this.icoItem);
                    this.icoItem = null;
                } else {
                    this.formGroup.classList.add('has-ui-icon');
                    this.items.classList.add('fa-lu');
                    this.icoItem = document.createElement('i');
                    this.icoItem.className = 'form-control-ui-icon fa';
                    this.formGroup.appendChild(this.icoItem);
                }

                break;
            case 2 /* IMAGE */:
                if (clear) {
                    this.formGroup.classList.remove('has-ui-image');
                    this.items.classList.remove('ui-image-lu');
                    this.formGroup.removeChild(this.imgItem);
                    this.imgItem = null;
                } else {
                    this.formGroup.classList.add('has-ui-image');
                    this.items.classList.add('ui-image-lu');
                    this.imgItem = document.createElement('img');
                    this.imgItem.className = 'form-control-ui-image';
                    this.formGroup.appendChild(this.imgItem);
                }
                break;
        }
    };

    Select.prototype.fill = function () {
        this.length = this.data.length;
        for (var i = 0; i < this.length; i++) {
            var item = this.data[i];
            var li = document.createElement('li');
            if (item.icon)
                this.addIcon(li, item.icon);
            else if (item.image)
                this.addImage(li, item.image);
            li.appendChild(document.createTextNode(item.value));
            li.tabIndex = i;
            li.setAttribute('data-option', item.option);
            var self = this;
            li.onclick = function (e) {
                self.changeValue(this);
                self.toggle();
                e.stopPropagation();
                return false;
            };
            li.onkeyup = function (e) {
                if (e) {
                    if (e.keyCode == 13) {
                        self.changeValue(self.itemSate.current);
                        self.toggle();
                    }
                    if (e.keyCode == 38) {
                        self.previous();
                    }
                    if (e.keyCode == 40) {
                        self.next();
                    }
                }
            };
            this.items.appendChild(li);
            if (item.selected) {
                this.selectItem(item.option);
            }
        }
    };

    Select.prototype.addIcon = function (element, classIcon) {
        var tmpIcon = document.createElement('i');
        tmpIcon.className = 'fa fa-li';
        tmpIcon.classList.add(classIcon);
        element.appendChild(tmpIcon);
    };

    Select.prototype.addImage = function (element, src) {
        var tmpImg = document.createElement('img');
        tmpImg.className = 'ui-image-item';
        tmpImg.src = src;
        element.appendChild(tmpImg);
    };

    Select.prototype.animationIn = function () {
        this.items.classList.add('open');
        this.animaIn.run(this.items);
    };

    Select.prototype.animationOut = function () {
        var _this = this;
        this.animaOut.run(this.items, function () {
            _this.items.classList.remove('open');
        });
    };

    Select.prototype.changeValue = function (htmlElement) {
        this.itemSate.exchange(htmlElement);
        this.input.value = this.itemSate.current.textContent;
        this.input.setAttribute('data-option', this.itemSate.current.getAttribute('data-option'));
        this.hidden.value = this.input.value;
        this.input.onchange();
        this.itemSate.old.classList.remove('bg-primary');
        this.itemSate.current.classList.add('bg-primary');
        if (this.isTypeIcon()) {
            this.changeIconItem();
        } else if (this.isTypeImage()) {
            this.changeImageItem();
        }
        this.input.focus();
    };

    Select.prototype.changeIconItem = function () {
        this.itemIconState.exchange(this.getIconItem());
        this.icoItem.classList.remove(this.itemIconState.old);
        this.icoItem.classList.add(this.itemIconState.current);
    };

    Select.prototype.changeImageItem = function () {
        this.itemImageState.exchange(this.getImageItem());
        this.imgItem.src = this.itemImageState.current;
    };

    Select.prototype.next = function () {
        if (!this.disabled && !this.readOnly && this.itemSate.current) {
            var item = this.itemSate.current.nextElementSibling;
            if (item) {
                this.changeValue(item);
            }
        }
    };

    Select.prototype.previous = function () {
        if (!this.disabled && !this.readOnly && this.itemSate.current) {
            var item = this.itemSate.current.previousSibling;
            if (item) {
                this.changeValue(item);
            }
        }
    };

    Select.prototype.isTypeIcon = function () {
        return this.type === 1 /* ICON */;
    };

    Select.prototype.isTypeImage = function () {
        return this.type === 2 /* IMAGE */;
    };

    Select.prototype.isTypeSimple = function () {
        return this.type === 0 /* SIMPLE */;
    };

    Select.prototype.toggle = function () {
        if (!this.readOnly && !this.disabled) {
            this.open = this.items.classList.contains('open');
            if (this.open) {
                this.animationOut();
                this.open = false;
            } else {
                Select.clear();
                this.animationIn();
                this.open = true;
                if (!this.itemSate.current) {
                    this.itemSate.current = this.items.getElementsByTagName('li')[0];
                    this.itemSate.current.classList.add('bg-primary');
                }
                this.itemSate.current.focus();
                this.input.focus();
            }
        }
    };

    Select.prototype.selectItem = function (option) {
        if (!this.disabled && !this.readOnly) {
            var lis = this.items.getElementsByTagName('li');
            if (this.length > 0) {
                var found = false;
                var i = 0;
                do {
                    var item = lis[i];
                    i++;
                    if (item.getAttribute('data-option') == option) {
                        this.itemSate.exchange(item);
                        found = true;
                    }
                } while(!found && i < this.length);
                if (found) {
                    this.input.value = this.itemSate.current.textContent;
                    this.input.setAttribute('data-option', this.itemSate.current.getAttribute('data-option'));
                    this.hidden.value = this.input.value;
                    if (this.isTypeIcon()) {
                        this.changeIconItem();
                    } else if (this.isTypeImage()) {
                        this.changeImageItem();
                    }
                    this.itemSate.current.focus();
                    if (this.itemSate.old)
                        this.itemSate.old.classList.remove('bg-primary');
                    this.itemSate.current.classList.add('bg-primary');
                }
            }
        }
    };

    Select.prototype.addItem = function (option, value, args) {
        if (!this.disabled && !this.readOnly) {
            var li = document.createElement('li');
            if (args) {
                if (args.icon && this.isTypeIcon()) {
                    this.addIcon(li, args.icon);
                } else if (args.image && this.isTypeImage()) {
                    this.addImage(li, args.image);
                }
            }
            li.appendChild(document.createTextNode(value));
            li.tabIndex = this.length + 1;
            li.setAttribute('data-option', option);
            this.input.setAttribute('data-option', option);
            var self = this;
            li.onclick = function (e) {
                self.changeValue(this);
                self.toggle();
                e.stopPropagation();
                return false;
            };

            this.items.appendChild(li);
            this.length++;
        }
    };

    Select.prototype.getItem = function () {
        if (!this.disabled && !this.readOnly) {
            if (this.isTypeIcon()) {
                var tmpIcon = this.itemSate.current.getElementsByClassName('fa')[0];
                return {
                    value: this.input.value,
                    option: this.input.getAttribute('data-option'),
                    icon: tmpIcon.classList.item(2)
                };
            } else if (this.isTypeImage()) {
                var tmpImg = this.itemSate.current.getElementsByClassName('ui-image-item')[0];
                return {
                    value: this.input.value,
                    option: this.input.getAttribute('data-option'),
                    image: tmpImg.src
                };
            } else {
                return {
                    value: this.input.value,
                    option: this.input.getAttribute('data-option')
                };
            }
        }
    };

    Select.prototype.getValue = function () {
        if (!this.disabled && !this.readOnly) {
            return this.input.value;
        }
    };

    Select.prototype.getOption = function () {
        if (!this.disabled && !this.readOnly) {
            return this.input.getAttribute('data-option');
        }
    };

    Select.prototype.isOpen = function () {
        if (!this.disabled && !this.readOnly) {
            return this.open;
        }
    };

    /**
    * get Icon Item Class
    * @returns {string} class Icon
    * @method getIconItem
    */
    Select.prototype.getIconItem = function () {
        if (!this.disabled && !this.readOnly) {
            var tmpIcon = this.itemSate.current.getElementsByClassName('fa')[0];
            return tmpIcon.classList.item(2);
        }
    };

    /**
    * get Image Item src
    * @returns {string} src
    * @method getImageItem
    */
    Select.prototype.getImageItem = function () {
        if (!this.disabled && !this.readOnly) {
            var tmpImg = this.itemSate.current.getElementsByClassName('ui-image-item')[0];
            return tmpImg.src;
        }
    };

    /**
    * set Data
    * @param {[JSON]} data
    * @param {JSON} options
    * @method setDate
    */
    Select.prototype.setData = function (data, options) {
        if (!this.disabled && !this.readOnly) {
            /**
            * Clear
            */
            this.clearData();

            /**
            * Load
            */
            this.data = data;
            if (options)
                this.setOptions(options);
            this.config();
            this.fill();
        }
    };

    Select.prototype.isDisabled = function () {
        return this.disabled;
    };

    Select.prototype.setDisabled = function (disabled) {
        this.disabled = disabled;
        this.input.disabled = this.disabled;
        if (this.disabled) {
            this.element.classList.add('disabled');
        } else {
            this.element.classList.remove('disabled');
        }
    };

    Select.prototype.isReadOnly = function () {
        return this.readOnly;
    };

    Select.prototype.setReadOnly = function (readOnly) {
        this.readOnly = readOnly;
        this.input.readOnly = this.readOnly;
        if (this.readOnly) {
            this.element.classList.add('read-only');
        } else {
            this.element.classList.remove('read-only');
        }
    };

    Select.prototype.setHeight = function (height) {
        if (!this.disabled && !this.readOnly) {
            this.items.style.height = height;
        }
    };

    Select.prototype.getSize = function () {
        if (!this.disabled || !this.readOnly) {
            return this.length;
        }
    };

    Select.prototype.setIcono = function (icono) {
        if (!this.disabled && !this.readOnly) {
            this.ico.classList.remove(this.icono);
            this.icono = icono;
            this.ico.classList.add(this.icono);
        }
    };

    Select.prototype.focus = function () {
        if (!this.disabled && !this.readOnly) {
            this.input.focus();
        }
    };

    Select.prototype.loading = function () {
        if (this.ico.classList.contains(this.icono))
            this.ico.classList.remove(this.icono);
        if (!this.ico.classList.contains('fa-spinner'))
            this.ico.classList.add('fa-spinner');
        if (!this.ico.classList.contains('fa-spin'))
            this.ico.classList.add('fa-spin');
        this.setDisabled(true);
    };

    Select.prototype.complete = function () {
        if (this.ico.classList.contains('fa-spinner'))
            this.ico.classList.remove('fa-spinner');
        if (this.ico.classList.contains('fa-spin'))
            this.ico.classList.remove('fa-spin');
        if (!this.ico.classList.contains(this.icono))
            this.ico.classList.add(this.icono);
        this.setDisabled(false);
    };

    Select.prototype.clearData = function () {
        this.config(true);
        this.hidden.value = '';
        this.input.value = '';
        this.input.removeAttribute('data-option');
        this.items.innerHTML = '';
    };

    Select.prototype.onchange = function (callback) {
        this.input.onchange = callback;
    };

    Select.clear = function () {
        var selects = document.getElementsByClassName('ui-select');
        var n = selects.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var select = selects[i];
                var items = select.getElementsByTagName('ul')[0];
                if (items) {
                    if (items.classList.contains('open')) {
                        items.classList.add('ui-ease-out');
                        items.classList.add('ui-0-2s');
                        items.classList.add('ui-fade-out-up');
                        (function (items) {
                            setTimeout(function () {
                                items.classList.remove('ui-ease-out');
                                items.classList.remove('ui-0-2s');
                                items.classList.remove('ui-fade-out-up');
                                items.classList.remove('open');
                            }, 200);
                        })(items);
                    }
                }
            }
        }
    };
    return Select;
})();

var Alert = (function () {
    function Alert(htmlElement) {
        this.element = null;
        this.button = document.createElement('button');
        this.span = document.createElement('span');
        this.p = document.createElement('p');
        this.i = document.createElement('i');
        this.strong = document.createElement('strong');
        this.icoSuccess = 'fa-check';
        this.icoInfo = 'fa-info';
        this.icoWarning = 'fa-exclamation-triangle';
        this.icoDanger = 'fa-times';
        this.icoWait = 'fa-circle-o-notch';
        this.animationIn = 'ui-fade-in';
        this.animationOut = 'ui-fade-out';
        this.typeAnimation = 'ui-ease-in-out';
        this.type = 'close';
        this.durationAnimation = 'ui-1s';
        this.element = htmlElement;
        this.element.className = 'hidden';
        this.button.className = 'close';
        this.button.type = 'button';
        var self = this;
        this.button.onclick = function () {
            self.close();
        };
        this.span.innerHTML = '&times;';
        this.button.appendChild(this.span);
        this.element.appendChild(this.button);
        this.p.className = 'text-center';
        this.p.appendChild(this.i);
        this.p.appendChild(this.strong);
        this.element.appendChild(this.p);
    }
    Alert.prototype.close = function () {
        if (this.type !== 'close') {
            switch (this.type) {
                case 'success':
                    this.element.className = 'alert alert-success alert-dismissible';
                    break;
                case 'info':
                case 'wait':
                    this.element.className = 'alert alert-info alert-dismissible';
                    break;
                case 'warning':
                    this.element.className = 'alert alert-warning alert-dismissible';
                    break;
                case 'danger':
                    this.element.className = 'alert alert-danger alert-dismissible';
                    break;
            }
            this.type = 'close';
            this.element.classList.add(this.typeAnimation);
            this.element.classList.add(this.durationAnimation);
            this.element.classList.add(this.animationOut);
            var self = this;
            setTimeout(function () {
                self.element.classList.add('hidden');
            }, 1000);
        }
    };

    Alert.prototype.success = function (message) {
        this.removeAnimation();
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoSuccess);
        this.element.className = 'alert alert-success alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'success';
    };

    Alert.prototype.info = function (message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoInfo);
        this.element.className = 'alert alert-info alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'info';
        this.removeAnimation();
    };

    Alert.prototype.warning = function (message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoWarning);
        this.element.className = 'alert alert-warning alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'warning';
        this.removeAnimation();
    };

    Alert.prototype.danger = function (message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoDanger);
        this.element.className = 'alert alert-danger alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'danger';
        this.removeAnimation();
    };

    Alert.prototype.wait = function (message) {
        this.i.className = 'fa fa-spin fa-lg pull-left';
        this.i.classList.add(this.icoWait);
        this.element.className = 'alert alert-info alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'wait';
        this.removeAnimation();
    };

    Alert.prototype.addAnimation = function () {
        this.element.classList.add(this.typeAnimation);
        this.element.classList.add(this.durationAnimation);
        this.element.classList.add(this.animationIn);
    };

    Alert.prototype.removeAnimation = function () {
        var self = this;
        setTimeout(function () {
            self.element.classList.remove(self.typeAnimation);
            self.element.classList.remove(self.durationAnimation);
            self.element.classList.remove(self.animationIn);
        }, 1000);
    };
    return Alert;
})();

var Toggle = (function () {
    function Toggle() {
    }
    Toggle.init = function () {
        this.initNavBar();
        this.initDropDown();
    };

    Toggle.initNavBar = function () {
        var navbars = document.querySelectorAll('.navbar-toggle[data-toggle="collapse"]');
        var n = navbars.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var element = navbars[i];
                element.onclick = function () {
                    var target = document.getElementById(this.dataset.target);
                    this.classList.toggle('collapsed');
                    target.classList.toggle('in');
                };
            }
        }
    };

    Toggle.initDropDown = function () {
        var dropdownsToggle = document.querySelectorAll('.dropdown-toggle[data-toggle="dropdown"]');
        var n = dropdownsToggle.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var element = dropdownsToggle[i];
                element.onclick = function (e) {
                    var dropdown = this.parentNode;
                    var dropdownMenu = dropdown.getElementsByClassName('dropdown-menu')[0];
                    if (dropdown.classList.contains('open')) {
                        dropdownMenu.classList.add('ui-ease');
                        dropdownMenu.classList.add('ui-0-5s');
                        dropdownMenu.classList.add('ui-fade-out-up');
                        setTimeout(function () {
                            dropdownMenu.classList.remove('ui-ease');
                            dropdownMenu.classList.remove('ui-0-5s');
                            dropdownMenu.classList.remove('ui-fade-out-up');
                            dropdown.classList.remove('open');
                        }, 500);
                    } else {
                        dropdown.classList.add('open');
                        dropdownMenu.classList.add('ui-ease');
                        dropdownMenu.classList.add('ui-0-5s');
                        dropdownMenu.classList.add('ui-fade-in-down');
                        setTimeout(function () {
                            dropdownMenu.classList.remove('ui-ease');
                            dropdownMenu.classList.remove('ui-0-5s');
                            dropdownMenu.classList.remove('ui-fade-in-down');
                        }, 500);
                    }
                    e.stopPropagation();
                    return false;
                };
            }
        }
    };

    Toggle.clearDropDown = function () {
        var dropdownsToggle = document.querySelectorAll('.dropdown-toggle[data-toggle="dropdown"]');
        var n = dropdownsToggle.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var dropdown = dropdownsToggle[i].parentNode;
                if (dropdown.classList.contains('open')) {
                    var dropdownMenu = dropdown.getElementsByClassName('dropdown-menu')[0];
                    dropdownMenu.classList.add('ui-ease');
                    dropdownMenu.classList.add('ui-0-5s');
                    dropdownMenu.classList.add('ui-fade-out-up');
                    setTimeout(function () {
                        dropdownMenu.classList.remove('ui-ease');
                        dropdownMenu.classList.remove('ui-0-5s');
                        dropdownMenu.classList.remove('ui-fade-out-up');
                        dropdown.classList.remove('open');
                    }, 500);
                }
            }
        }
    };
    return Toggle;
})();

var EHttpStatus;
(function (EHttpStatus) {
    EHttpStatus[EHttpStatus["OK"] = 200] = "OK";
    EHttpStatus[EHttpStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    EHttpStatus[EHttpStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    EHttpStatus[EHttpStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    EHttpStatus[EHttpStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    EHttpStatus[EHttpStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(EHttpStatus || (EHttpStatus = {}));
var EReadyStateStatus;
(function (EReadyStateStatus) {
    EReadyStateStatus[EReadyStateStatus["UNINITIALIZED"] = 0] = "UNINITIALIZED";
    EReadyStateStatus[EReadyStateStatus["LOADING"] = 1] = "LOADING";
    EReadyStateStatus[EReadyStateStatus["LOADED"] = 2] = "LOADED";
    EReadyStateStatus[EReadyStateStatus["INTERACTIVE"] = 3] = "INTERACTIVE";
    EReadyStateStatus[EReadyStateStatus["COMPLETED"] = 4] = "COMPLETED";
})(EReadyStateStatus || (EReadyStateStatus = {}));
var Http = (function () {
    function Http() {
    }
    Http.get = function (action, onBeforeSend, onReady, onError) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (onBeforeSend)
                onBeforeSend();
            if (this.readyState === 4 /* COMPLETED */) {
                if (this.status === 200 /* OK */) {
                    if (onReady)
                        onReady(this);
                } else {
                    if (onerror)
                        onError();
                }
            }
        };
        xhr.open('GET', action);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
        xhr.send();
    };

    Http.post = function (data, action, onBeforeSend, onReady, onError) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (onBeforeSend)
                onBeforeSend();
            if (this.readyState === 4 /* COMPLETED */) {
                if (this.status === 200 /* OK */) {
                    if (onReady)
                        onReady(this);
                } else {
                    if (onerror)
                        onError();
                }
            }
        };
        xhr.open('POST', action);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
        xhr.send(data);
    };

    Http.sendJSON = function (data, action, onBeforeSend, onReady, onError) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (onBeforeSend)
                onBeforeSend();
            if (this.readyState === 4 /* COMPLETED */) {
                if (this.status === 200 /* OK */) {
                    if (onReady)
                        onReady(this);
                } else {
                    if (onerror)
                        onError();
                }
            }
        };
        xhr.open('POST', action);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(data);
    };

    Http.put = function () {
    };

    Http.delete = function () {
    };
    return Http;
})();

var Utils = (function () {
    function Utils() {
    }
    Utils.showActiveLink = function (element) {
        var anchors = element.querySelectorAll('.ui-link');
        var n = anchors.length;
        var url = window.location.pathname;
        url = url.replace(/\//g, '');
        for (var i = 0; i < n; i++) {
            var a = anchors[i];
            var href = a.href.split('/');
            href = href[href.length - 1];
            if (a.classList.contains('active')) {
                a.parentNode.classList.add('remove');
            }
            if (href === url) {
                a.parentNode.classList.add('active');
            }
        }
    };

    Utils.reloadCSS = function (element, href) {
        var queryString = '?reload=' + new Date().getTime();
        element.href = href.replace(/\?.*|$/, queryString);
    };

    Utils.serialize = function (form) {
        var elems = form.elements;
        var serialized = [];
        var n = elems.length;
        for (var i = 0; i < n; i++) {
            var element = elems[i];
            var type = element.type;
            var value = element.value;
            var name = element.name;
            if (name !== null || name !== undefined || name !== "") {
                switch (type) {
                    case 'text':
                    case 'radio':
                    case 'checkbox':
                    case 'search':
                    case 'email':
                    case 'url':
                    case 'tel':
                    case 'number':
                    case 'range':
                    case 'date':
                    case 'month':
                    case 'week':
                    case 'time':
                    case 'datetime':
                    case 'datetime-local':
                    case 'color':
                    case 'textarea':
                    case 'password':
                    case 'select':
                    case 'hidden':
                        serialized.push(name + '=' + value);
                        break;
                    default:
                        break;
                }
            }
        }
        return serialized.join('&');
    };
    return Utils;
})();

window.onload = function () {
    Toggle.init();
};

document.onclick = function () {
    Toggle.clearDropDown();
    Select.clear();
};

/*
* Return name of month
*/
Date.prototype.getMonthName = function () {
    var month_names = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    return month_names[this.getMonth()];
};

/*
* Return month abbreviation
*/
Date.prototype.getMonthAbbr = function () {
    var month_abbrs = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];

    return month_abbrs[this.getMonth()];
};

/*
* Return full day of week name
*/
Date.prototype.getDayFull = function () {
    var days_full = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];
    return days_full[this.getDay()];
};

/*
*  Return full day of week name
*/
Date.prototype.getDayAbbr = function () {
    var days_abbr = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ];
    return days_abbr[this.getDay()];
};

/*
* Return the day of year 1-365
*/
Date.prototype.getDayOfYear = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((this.getTime() - onejan.getTime()) / 86400000);
};

/*
* Return the day suffix (st,nd,rd,th)
*/
Date.prototype.getDaySuffix = function () {
    var d = this.getDate();
    var sfx = ["th", "st", "nd", "rd"];
    var val = d % 100;
    return (sfx[(val - 20) % 10] || sfx[val] || sfx[0]);
};

/*
* Return Week of Year
*/
Date.prototype.getWeekOfYear = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
};

/*
* return week of month
*/
Date.prototype.getWeekOfMonth = function () {
    var firstDayOfMonth = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
    return Math.ceil((this.getDate() + firstDayOfMonth) / 7);
};

/*
* Return if it is a leap year or not
*/
Date.prototype.isLeapYear = function () {
    return (this.getFullYear() % 4 === 0 || (this.getFullYear() % 100 !== 0 && this.getFullYear() % 400 === 0));
};

/*
* Return Number of Days in a given month
*/
Date.prototype.getMonthDayCount = function () {
    var month_day_counts = [
        31,
        this.isLeapYear() ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ];

    return month_day_counts[this.getMonth()];
};

/*
* back a month
*/
Date.prototype.previousMonth = function () {
    var month = this.getMonth() - 1;
    var year = this.getFullYear();
    if (month < 0 && year > 1582) {
        month = 11;
        year--;
    }
    var tDays = this.getMonthDayCount();
    if (this.getDate() > tDays) {
        this.setDate(tDays);
    }
    this.setMonth(month);
    this.setFullYear(year);
};

/*
* next an month
*/
Date.prototype.nextMonth = function () {
    var month = this.getMonth() + 1;
    var year = this.getFullYear();
    if (month > 11) {
        month = 0;
        year++;
    }
    var tDays = this.getMonthDayCount();
    if (this.getDate() > tDays) {
        this.setDate(tDays);
    }
    this.setMonth(month);
    this.setFullYear(year);
};

/*
* returns clone date
*/
Date.prototype.clone = function () {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate());
};

/*
* returns true if the date is valid
*/
Date.prototype.isValid = function () {
    return !isNaN(this.getTime());
};

/*
* return Format date
*/
Date.prototype.format = function (dateFormat) {
    /*
    * break apart format string into array of characters
    */
    dateFormat = dateFormat.split("");
    var date = this.getDate(), month = this.getMonth(), hours = this.getHours(), minutes = this.getMinutes(), seconds = this.getSeconds();

    /*
    * get all date properties
    * ( based on PHP date object functionality )
    */
    var date_props = {
        d: date < 10 ? '0' + date : date,
        D: this.getDayAbbr(),
        j: this.getDate(),
        l: this.getDayFull(),
        S: this.getDaySuffix(),
        w: this.getDay(),
        z: this.getDayOfYear(),
        W: this.getWeekOfYear(),
        F: this.getMonthName(),
        m: month < 9 ? '0' + (month + 1) : month + 1,
        M: this.getMonthAbbr(),
        n: month + 1,
        t: this.getMonthDayCount(),
        L: this.isLeapYear() ? '1' : '0',
        Y: this.getFullYear(),
        y: this.getFullYear() + ''.substring(2, 4),
        a: hours > 12 ? 'pm' : 'am',
        A: hours > 12 ? 'PM' : 'AM',
        g: hours % 12 > 0 ? hours % 12 : 12,
        G: hours > 0 ? hours : "12",
        h: hours % 12 > 0 ? hours % 12 : 12,
        H: hours,
        i: minutes < 10 ? '0' + minutes : minutes,
        s: seconds < 10 ? '0' + seconds : seconds
    };

    /*
    * loop through format array of characters and add matching data
    * else add the format character (:,/, etc.)
    */
    var date_string = "";
    var n = dateFormat.length;
    for (var i = 0; i < n; i++) {
        var f = dateFormat[i];
        if (f.match(/[a-zA-Z]/g)) {
            date_string += date_props[f] ? date_props[f] : '';
        } else {
            date_string += f;
        }
    }

    return date_string;
};

/*
* parse string date to object Date
* @param string date
* @param string pattern formmat
* @returns object Date
*/
Date.prototype.parse = function (dateString, pattern) {
    /*
    * break apart format string into array paralel of characters
    */
    dateString = dateString.split(/\W/);
    var pattern = pattern.split(/\W/);
    var n = pattern.length;
    var date = new Date();
    for (var i = 0; i < n; i++) {
        var str = pattern[i];
        switch (str) {
            case 'd':
            case 'j':
                date.setDate(dateString[i]);
                break;
            case 'm':
            case 'n':
                date.setMonth(dateString[i] - 1);
                break;
            case 'F':
                var monthNames = [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ];
                date.setMonth(monthNames.indexOf(dateString[i]));
                break;
            case 'M':
                var monthAbbrs = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ];
                date.setMonth(monthAbbrs.indexOf(dateString[i]));
                break;
            case 'Y':
                date.setFullYear(dateString[i]);
                break;
        }
    }
    return date;
};

Element.prototype.removeChildren = function () {
    while (this.childNodes.length > 0) {
        this.removeChild(this.childNodes[0]);
    }
};

var author = 'Yonatan Alexis Quintero Rodriguez';
var version = '0.1';
