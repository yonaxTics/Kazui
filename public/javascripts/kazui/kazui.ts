/*
* KAZUI v01 (http://www.kazui.io)
* Copyright 2014 YonaxTics. All rights reserved.
*
* KAZUI commercial licenses may be obtained at
* http://www.kazui.io/purchase/license-agreement/kazui-complete
* If you do not own a commercial license, this file shall be governed by the trial license terms.
*/

enum ETypeClock {
    STANDARD,
    MILITARY,
    COUNT_DOWN,
    COUNT_UP
}
/**
 * Clock
 * @class Clock
 */
class Clock {

    private element: HTMLElement;
    private panel: HTMLDivElement;
    private panelBody: HTMLDivElement;
    private table: HTMLTableElement;
    private upHour: HTMLTableCellElement;
    private upMinutes: HTMLTableCellElement;
    private upSeconds: HTMLTableCellElement;
    private upTime: HTMLTableCellElement;
    private downHour: HTMLTableCellElement;
    private downMinutes: HTMLTableCellElement;
    private downSeconds: HTMLTableCellElement;
    private downTime: HTMLTableCellElement;
    private hour: HTMLTableCellElement;
    private minutes: HTMLTableCellElement;
    private seconds: HTMLTableCellElement;
    private time: HTMLTableCellElement;
    private timeOutFn;
    private isStop: boolean;
    private type: ETypeClock;
    private animationUp: Animation;
    private animationDown: Animation;
    private today: Date;
    private iconUp: string;
    private iconDown: string;

    /**
    * constructor 
    * @param {HTMLElement} element
    */
    constructor(element: HTMLElement) {
        this.element = element;
        this.iconUp = 'fa fa-chevron-up';
        this.iconDown = 'fa fa-chevron-down';
        this.today = new Date();
        this.animationUp = new Animation('ui-ease-in', 'ui-fade-in-up', 'ui-0-2s');
        this.animationDown = new Animation('ui-ease-in', 'ui-fade-in-down', 'ui-0-2s');        
        this.isStop = true;
        this.create();
    }

    /**
    * Create HTML
    * @method create
    */
    private create() {
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
    }
    /**
    * Create Table HTML
    * @method createTable
    */
    private createTable() {
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
        this.hour.textContent = '00';
        this.minutes.textContent = '00';
        this.seconds.textContent = '00';
        this.time.textContent = '--';
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
    }
    /**
    * add events for Up Controls
    * @method addEventsUpControls
    */
    private addEventsUpControls() {
        this.upHour.onclick = () => { };
        this.upMinutes.onclick = () => { };
        this.upSeconds.onclick = () => { };
        this.upTime.onclick = () => { };
    }
    /**
    * add events for Down Controls
    * @method addEventsDownControls
    */
    private addEventsDownControls() {
        this.downHour.onclick = () => { };
        this.downMinutes.onclick = () => { };
        this.downSeconds.onclick = () => { };
        this.downTime.onclick = () => { };
    }

    /**
   * Start clock in the standard time
   * @method standardTime
   */
    public standardTime() {
        this.type = ETypeClock.STANDARD;
    }
    /**
   * Start clock in the military time
   * @method standardTime
   */
    public militaryTime() {
        this.type = ETypeClock.MILITARY;
    }
    /**
   * Start clock with the counting down
   * @method countDown
   */
    public countDown() {
        this.type = ETypeClock.COUNT_DOWN;
    }
    /**
   * Start clock with the counting up
   * @method countUp
   */
    public countUp() {
        this.type = ETypeClock.COUNT_UP;
    }


}

class Animation {
    public type;
    public fn;
    public time;

    constructor(type, fn, time) {
        this.type = type;
        this.fn = fn;
        this.time = time;
    }

}

enum ETypeCalendar {
    DAY,
    MONTH,
    YEAR
}

class Calendar {

    private days = ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'];
    private abbDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    private abbMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    private yearGregorian = 1582;
    private today = new Date();
    private displayDate: Date;
    private data;
    private table;
    private tbody: HTMLElement;
    private btnBack;
    private btnCurrent;
    private btnNext;
    private selectedCell;
    private element: HTMLElement;
    private legend: HTMLElement;
    private options;
    private title;
    private animationIn: Animation;
    private animationOut: Animation;
    private animationNext: Animation;
    private animationBack: Animation;
    private animationUp: Animation;
    private animationDown: Animation;
    private type: ETypeCalendar = ETypeCalendar.DAY;

    constructor(element: HTMLElement, options) {
        this.element = element;
        this.options = options;
        this.animationIn = new Animation('ui-ease', 'ui-fade-in-down', 'ui-0-5s');
        this.animationOut = new Animation('ui-ease', 'ui-fade-out-up', 'ui-0-5s');
        this.animationNext = new Animation('ui-ease', 'ui-flip-out-y', 'ui-0-2s');
        this.animationBack = new Animation('ui-ease', 'ui-flip-out-y', 'ui-0-2s');
        this.animationUp = new Animation('ui-ease', 'ui-flip-out-x', 'ui-0-2s');
        this.animationDown = new Animation('ui-ease', 'ui-flip-out-x', 'ui-0-2s');
        this.setOptions();
        this.displayDate = this.today.clone();
        this.displayDate.setDate(1);
        this.data = {};
        this.dataDay();
        this.createCalendar();
        this.calendarDay();
        this.mediaQuery();
    }

    private dataDay() {

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
        var day = 0;                                                  //The day to display on the calendar.
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
            if (day > 30) day--;
            isPreviousDay = true;
            isCurrentDay = false;
        }
        /*
         * Fill data.items
         */
        for (var i = 0; i < 42; i++) {
            var item: any = {};
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
        this.type = ETypeCalendar.DAY;
    }

    private dataMonth() {
        var year = this.displayDate.getFullYear();
        this.data.year = year;
        this.data.currentMonth = year === this.today.getFullYear() ? this.today.getMonth() : 0;
        this.type = ETypeCalendar.MONTH;
    }

    private dataYear() {
        var year = this.displayDate.getFullYear();
        var limitYear = year + 11;
        this.data.year = year;
        this.data.currentYear = year <= this.today.getFullYear() && limitYear >= this.today.getFullYear() ? this.today.getFullYear() : year;
        this.data.range = year + ' - ' + limitYear;
        this.type = ETypeCalendar.YEAR;
    }

    private createCalendar() {
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
    }


    /*
     * Create calendar header HTML.
     * @returns HTMLElement
     */
    private header() {
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
    }

    /*
    *Create calendar body HTML. 
    *@returns HTMLElement
    */
    private body() {
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
    }


    private clearTable(callback, animation: Animation) {
        this.table.classList.add(animation.type);
        this.table.classList.add(animation.fn);
        this.table.classList.add(animation.time);
        setTimeout(() => {
            this.table.classList.remove(animation.type);
            this.table.classList.remove(animation.fn);
            this.table.classList.remove(animation.time);
            this.table.tHead.removeChildren();
            this.tbody.removeChildren();
            callback(this);
        }, 200);
    }

    private calendarDay(self?) {
        if (!self) self = this;
        self.title.textContent = self.data.month.text + ' ' + self.data.year;
        /*
        * add event to change view type by months.
        */
        self.title.onclick = (e) => {
            e.preventDefault();
            self.displayDate.setDate(1);
            self.dataMonth();
            self.clearTable(self.calendarMonth, self.animationUp);
        }
        /*
        * add Event to navigation
        */
        self.btnBack.onclick = () => {
            self.displayDate.setDate(1);
            self.displayDate.previousMonth();
            self.dataDay();
            self.clearTable(self.calendarDay, self.animationBack);
        }
        self.btnCurrent.onclick = () => {
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
        }
        self.btnNext.onclick = () => {
            self.displayDate.setDate(1);
            self.displayDate.nextMonth();
            self.dataDay();
            self.clearTable(self.calendarDay, self.animationNext);
        }
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
                if (this.classList.contains('text-muted')) {     //no is current month
                    if (this.textContent > 20) {                   //is previous month	                      
                        self.displayDate.setDate(1);
                        self.displayDate.previousMonth();
                        self.dataDay();
                        self.displayDate.setDate(this.textContent);
                        self.data.currentDay = self.displayDate.getDate();
                        self.clearTable(self.calendarDay, self.animationBack);
                    } else {                                    //is next month	                      
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
            }
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
    }
    /*
    * Load the legend of the days of week
    */
    private loadLegend(array) {
        if (this.type === ETypeCalendar.DAY) {
            if (this.legend) this.legend.removeChildren();
            this.legend = document.createElement('tr');
            this.table.tHead.appendChild(this.legend);
            for (var i = 0; i < 7; i++) {
                var th = document.createElement('th');
                th.textContent = array[i];
                this.legend.appendChild(th);
            }
        }
    }

    private calendarMonth(self?) {
        if (!self) self = this;
        self.title.text = self.data.year;
        /*
        * add event to change view type by range years.
        */
        self.title.onclick = (e) => {
            e.preventDefault();
            self.dataYear();
            self.clearTable(self.calendarYear, self.animationUp);
        }
        /*
        * add Event to navigation
        */
        self.btnBack.onclick = () => {
            var year = self.displayDate.getFullYear() - 1;
            if (year > self.yearGregorian) {
                self.displayDate = new Date(year, 0, 1);
                self.dataMonth();
                self.clearTable(self.calendarMonth, self.animationBack);
            }
        }
        self.btnCurrent.onclick = () => {
            /*
            * If not is the current year,
            * go to current year.
            */
            if (self.displayDate.getFullYear() !== self.today.getFullYear()) {
                self.displayDate = self.today.clone();
                self.dataMonth();
                self.clearTable(self.calendarMonth, self.animationUp);
            }
        }
        self.btnNext.onclick = () => {
            self.displayDate = new Date(self.displayDate.getFullYear() + 1, 0, 1);
            self.dataMonth();
            self.clearTable(self.calendarMonth, self.animationNext);
        }

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
            }
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

    }


    private calendarYear(self?) {
        if (!self) self = this;
        self.title.text = self.data.range;
        self.title.onclick = (e) => {
            e.preventDefault();
        }
        /*
        * add Event to navigation
        */
        self.btnBack.onclick = () => {
            var year = self.displayDate.getFullYear() - 12;
            if (year <= self.yearGregorian) {
                year = self.yearGregorian;
            }
            self.displayDate = new Date(year, 0, 1);
            self.dataYear();
            self.clearTable(self.calendarYear, self.animationBack);
        }
        self.btnCurrent.onclick = () => {
            /*
           * If not is the current year,
           * go to current range year.
           */
            if (self.displayDate.getFullYear() !== self.today.getFullYear()) {
                self.displayDate = self.today.clone();
                self.dataYear();
                self.clearTable(self.calendarYear, self.animationUp);
            }
        }
        self.btnNext.onclick = () => {
            self.displayDate = new Date(self.displayDate.getFullYear() + 12, 0, 1);
            self.dataYear();
            self.clearTable(self.calendarYear, self.animationNext);
        }

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
            }
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
    }

    private setOptions() {
        if (this.options) {
            if (this.options.isInput) {
                this.element.className = 'hidden ui-calendar-input';
            }
        }
    }

    private displayDateFromValue() {
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
    }

    private selectCell(cell: HTMLElement) {
        this.selectedCell.classList.remove('bg-primary');
        cell.classList.add('bg-primary');
        this.selectedCell = cell;
    }

    /* JavaScript Media Queries */
    private mediaQuery() {
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
    }

    private loadLegendMatchMedia() {
        var mq = window.matchMedia("(max-width: 969px)");
        if (mq.matches) {
            this.loadLegend(this.abbDays);
        } else {
            this.loadLegend(this.days);
        }
    }

    public refresh() {
        this.dataDay();
        this.clearTable(this.calendarDay, this.animationUp);
    }

    public open(callback?) {
        this.element.classList.remove('hidden');
        this.element.classList.add(this.animationIn.type);
        this.element.classList.add(this.animationIn.fn);
        this.element.classList.add(this.animationIn.time);
        setTimeout(() => {
            this.element.classList.remove(this.animationIn.type);
            this.element.classList.remove(this.animationIn.fn);
            this.element.classList.remove(this.animationIn.time);
            this.displayDateFromValue();
            if (callback) callback();
        }, 500);
    }

    public close(callback?) {
        this.element.classList.add(this.animationOut.type);
        this.element.classList.add(this.animationOut.fn);
        this.element.classList.add(this.animationOut.time);
        setTimeout(() => {
            this.element.classList.remove(this.animationOut.type);
            this.element.classList.remove(this.animationOut.fn);
            this.element.classList.remove(this.animationOut.time);
            this.element.classList.add('hidden');
            if (callback) callback();
        }, 500);
    }

    public isOpen() {
        return !this.element.classList.contains('hidden');
    }

    public getDate() {
        this.displayDate.setDate(this.selectedCell.textContent);
        return this.displayDate;
    }

    public setAnimationIn(animationFn) {
        this.animationIn.fn = animationFn;
    }

    public setAnimationOut(animationFn) {
        this.animationOut.fn = animationFn;
    }

    public setLegendDaysWeek(strDays: string) {
        this.days = strDays.split(',');
        this.abbDays = new Array();
        var i = 0;
        while (i < 7) {
            this.abbDays.push(this.days[i].charAt(0));
            i++;
        }
    }

    public setLegendMonths(strMonths: string) {
        var months = strMonths.split(',');
        //@overwrite Date.getMonthName()
        Date.prototype.getMonthName = function () {
            var month_names = months;
            return month_names[this.getMonth()];
        }
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
        }
    }

}

class Select {

    private formGroup = document.createElement('div');
    private hidden = document.createElement('input');
    private input: any = document.createElement('input');
    private mask = document.createElement('div');
    private ico = document.createElement('i');
    private items = document.createElement('ul');
    private element: HTMLElement = null;
    private oldItem: HTMLElement = null;
    private currentItem: HTMLElement = null;
    private open = false;
    private disabled = false;
    private readOnly = false;
    private data: Array<any> = null;
    private length = 0;
    private icono = 'fa-angle-down';

    constructor(htmlElement: HTMLElement, data) {
        this.element = htmlElement;
        this.data = data;
        this.formGroup.className = 'form-group  has-feedback';
        this.hidden.type = 'hidden';
        if (this.element.getAttribute('data-name')) this.hidden.name = this.element.getAttribute('data-name');
        this.formGroup.appendChild(this.hidden);
        this.input.type = 'text';
        this.input.className = 'form-control';
        this.input.onchange = () => { return true; }
        this.input.onkeyup = (e) => {
            if (e) {
                if (e.keyCode == 13) this.toggle();
                if (e.keyCode == 38) this.previous();
                if (e.keyCode == 40) this.next();
            }
        };
        this.input.onkeydown = (e) => {
            if (e) {
                if (e.keyCode != 9 && e.keyCode != 13 && e.keyCode != 16 &&
                    e.keyCode != 17 && !(e.keyCode >= 38 && e.keyCode <= 40)) {
                    e.preventDefault();
                }
            }
        };
        this.formGroup.appendChild(this.input);
        this.mask.className = 'ui-mask';
        this.mask.onclick = (e) => {
            this.toggle();
            e.stopPropagation();
            return false;
        }
        this.formGroup.appendChild(this.mask);
        this.ico.className = 'form-control-feedback fa';
        this.ico.classList.add(this.icono);
        this.ico.onclick = (e) => {
            this.toggle();
            e.stopPropagation();
            return false;
        }
        this.formGroup.appendChild(this.ico);
        this.element.appendChild(this.formGroup);
        this.items.className = 'ui-select-items';
        this.element.appendChild(this.items);
        this.fill();
    }

    private fill() {
        this.length = this.data.length;
        for (var i = 0; i < this.length; i++) {
            var item = this.data[i];
            var li = document.createElement('li');
            li.textContent = item.value;
            li.tabIndex = i;
            li.setAttribute('data-option', item.option);
            var self = this;
            li.onclick = function (e) {
                self.changeValue(this);
                self.toggle();
                e.stopPropagation();
                return false;
            }
            li.onkeyup = function (e) {
                if (e) {
                    if (e.keyCode == 13) {
                        self.changeValue(self.currentItem);
                        self.toggle();
                    }
                    if (e.keyCode == 38) {
                        self.previous();
                    }
                    if (e.keyCode == 40) {
                        self.next();
                    }
                }
            }
           this.items.appendChild(li);
            if (item.selected) {
                this.selectItem(item.option);
            }
        }
    }

    private animationIn() {
        this.items.classList.add('open');
        this.items.classList.add('ui-ease-in');
        this.items.classList.add('ui-0-2s');
        this.items.classList.add('ui-fade-in-down');
        setTimeout(() => {
            this.items.classList.remove('ui-ease-in');
            this.items.classList.remove('ui-0-2s');
            this.items.classList.remove('ui-fade-in-down');
        }, 200);
    }

    private animationOut() {
        this.items.classList.add('ui-ease-out');
        this.items.classList.add('ui-0-2s');
        this.items.classList.add('ui-fade-out-up');
        setTimeout(() => {
            this.items.classList.remove('ui-ease-out');
            this.items.classList.remove('ui-0-2s');
            this.items.classList.remove('ui-fade-out-up');
            this.items.classList.remove('open');
        }, 200);
    }

    private changeValue(htmlElement: HTMLElement) {
        this.oldItem = this.currentItem;
        this.currentItem = htmlElement;
        this.input.value = this.currentItem.textContent;
        this.input.setAttribute('data-option', this.currentItem.getAttribute('data-option'));
        this.hidden.value = this.input.value;
        this.input.onchange();
        this.oldItem.classList.remove('bg-primary');
        this.currentItem.classList.add('bg-primary');
        this.input.focus();

    }

    private next() {
        if (!this.disabled && !this.readOnly && this.currentItem) {
            var item = this.currentItem.nextElementSibling;
            if (item) {
                this.changeValue(<HTMLElement>item);
            }
        }
    }

    private previous() {
        if (!this.disabled && !this.readOnly && this.currentItem) {
            var item = this.currentItem.previousSibling;
            if (item) {
                this.changeValue(<HTMLElement>item);
            }
        }
    }

    public toggle() {
        if (!this.readOnly && !this.disabled) {
            this.open = this.items.classList.contains('open');
            if (this.open) {
                this.animationOut();
                this.open = false;
            } else {
                Select.clear();
                this.animationIn();
                this.open = true;
                if (!this.currentItem) {
                    this.currentItem = this.items.getElementsByTagName('li')[0];
                    this.currentItem.classList.add('bg-primary');
                }
                this.currentItem.focus();
                this.input.focus();
            }
        }
    }

    public selectItem(option) {
        if (!this.disabled && !this.readOnly) {
            var lis = this.items.getElementsByTagName('li');
            if (this.length > 0) {
                var found = false;
                var i = 0;
                do {
                    var item = lis[i];
                    i++;
                    if (item.getAttribute('data-option') == option) {
                        this.oldItem = this.currentItem;
                        this.currentItem = item;
                        found = true;
                    }
                } while (!found && i < this.length);
                if (found) {
                    this.input.value = this.currentItem.textContent;
                    this.input.setAttribute('data-option', this.currentItem.getAttribute('data-option'));
                    this.hidden.value = this.input.value;
                    this.currentItem.focus();
                    if (this.oldItem) this.oldItem.classList.remove('bg-primary');
                    this.currentItem.classList.add('bg-primary');
                }
            }
        }
    }

    public addItem(option, value) {
        if (!this.disabled && !this.readOnly) {
            var li = document.createElement('li');
            li.textContent = value;
            li.tabIndex = this.length + 1;
            li.setAttribute('data-option', option);
            this.input.setAttribute('data-option', option);
            var self = this;
            li.onclick = function (e) {
                self.changeValue(this);
                e.stopPropagation();
                return false;
            }
            this.items.appendChild(li);
            this.length++;
        }
    }

    public getItem() {
        if (!this.disabled && !this.readOnly) {
            return {
                value: this.input.value,
                option: this.input.getAttribute('data-option')
            };
        }
    }

    public getValue() {
        if (!this.disabled && !this.readOnly) {
            return this.input.value;
        }
    }

    public getOption() {
        if (!this.disabled && !this.readOnly) {
            return this.input.getAttribute('data-option');
        }
    }

    public isOpen() {
        if (!this.disabled && !this.readOnly) {
            return this.open;
        }
    }

    public isDisabled() {
        return this.disabled;
    }

    public setDisabled(disabled: boolean) {
        this.disabled = disabled;
        this.input.disabled = this.disabled;
        if (this.disabled) {
            this.element.classList.add('disabled');
        } else {
            this.element.classList.remove('disabled');
        }
    }

    public isReadOnly() {
        return this.readOnly;
    }

    public setReadOnly(readOnly: boolean) {
        this.readOnly = readOnly;
        this.input.readOnly = this.readOnly;
        if (this.readOnly) {
            this.element.classList.add('read-only');
        } else {
            this.element.classList.remove('read-only');
        }
    }

    public setHeight(height: string) {
        if (!this.disabled && !this.readOnly) {
            this.items.style.height = height;
        }
    }

    public getSize() {
        if (!this.disabled || !this.readOnly) {
            return this.length;
        }
    }

    public setIcono(icono: string) {
        if (!this.disabled && !this.readOnly) {
            this.ico.classList.remove(this.icono);
            this.icono = icono;
            this.ico.classList.add(this.icono);
        }
    }

    public focus() {
        if (!this.disabled && !this.readOnly) {
            this.input.focus();
        }
    }

    public onchange(callback) {
        this.input.onchange = callback;
    }

    public static clear() {
        var selects = document.getElementsByClassName('ui-select');
        var n = selects.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var select = <HTMLElement> selects[i];
                var items = select.getElementsByTagName('ul')[0];
                if (items.classList.contains('open')) {
                    items.classList.add('ui-ease-out');
                    items.classList.add('ui-0-2s');
                    items.classList.add('ui-fade-out-up');
                    (function (items) {
                        setTimeout(() => {
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
}


class Alert {

    private element: HTMLElement = null;
    private button = document.createElement('button');
    private span = document.createElement('span');
    private p = document.createElement('p');
    private i = document.createElement('i');
    private strong = document.createElement('strong');
    public icoSuccess = 'fa-check';
    public icoInfo = 'fa-info';
    public icoWarning = 'fa-exclamation-triangle';
    public icoDanger = 'fa-times';
    public icoWait = 'fa-circle-o-notch';
    public animationIn = 'ui-fade-in';
    public animationOut = 'ui-fade-out';
    public typeAnimation = 'ui-ease-in-out';
    private type = 'close';
    private durationAnimation = 'ui-1s';

    constructor(htmlElement: HTMLElement) {
        this.element = htmlElement;
        this.element.className = 'hidden';
        this.button.className = 'close';
        this.button.type = 'button';
        var self = this;
        this.button.onclick = function () {
            self.close()
        }
        this.span.innerHTML = '&times;';
        this.button.appendChild(this.span);
        this.element.appendChild(this.button);
        this.p.className = 'text-center';
        this.p.appendChild(this.i);
        this.p.appendChild(this.strong);
        this.element.appendChild(this.p);
    }

    public close() {
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
            setTimeout(function () { self.element.classList.add('hidden') }, 1000);
        }
    }

    public success(message) {
        this.removeAnimation();
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoSuccess);
        this.element.className = 'alert alert-success alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'success';

    }

    public info(message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoInfo);
        this.element.className = 'alert alert-info alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'info';
        this.removeAnimation();

    }

    public warning(message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoWarning);
        this.element.className = 'alert alert-warning alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'warning';
        this.removeAnimation();
    }

    public danger(message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoDanger);
        this.element.className = 'alert alert-danger alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'danger';
        this.removeAnimation();
    }

    public wait(message) {
        this.i.className = 'fa fa-spin fa-lg pull-left';
        this.i.classList.add(this.icoWait);
        this.element.className = 'alert alert-info alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'wait';
        this.removeAnimation();
    }

    private addAnimation() {
        this.element.classList.add(this.typeAnimation);
        this.element.classList.add(this.durationAnimation);
        this.element.classList.add(this.animationIn);
    }

    private removeAnimation() {
        var self = this;
        setTimeout(function () {
            self.element.classList.remove(self.typeAnimation);
            self.element.classList.remove(self.durationAnimation);
            self.element.classList.remove(self.animationIn);
        }, 1000);
    }
}

class Toggle {

    static init() {
        this.initNavBar();
        this.initDropDown();
    }

    private static initNavBar() {
        var navbars = document.querySelectorAll('.navbar-toggle[data-toggle="collapse"]');
        var n = navbars.length;
        if (n > 0) {

            for (var i = 0; i < n; i++) {
                var element: any = navbars[i];
                element.onclick = function () {
                    var target = document.getElementById(this.dataset.target);
                    this.classList.toggle('collapsed');
                    target.classList.toggle('in');
                }
	         }
        }
    }

    private static initDropDown() {
        var dropdownsToggle = document.querySelectorAll('.dropdown-toggle[data-toggle="dropdown"]');
        var n = dropdownsToggle.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var element: any = dropdownsToggle[i];
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
                }
	         }
        }
    }

    static clearDropDown() {
        var dropdownsToggle = document.querySelectorAll('.dropdown-toggle[data-toggle="dropdown"]');
        var n = dropdownsToggle.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var dropdown: any = dropdownsToggle[i].parentNode;
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
    }
}

class Utils {

    static showActiveLink(element) {
        var anchors = element.querySelectorAll('.ui-link');
        var n = anchors.length;
        var url: any = window.location.pathname;
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
    }

    static reloadCSS(element, href) {
        var queryString = '?reload=' + new Date().getTime();
        element.href = href.replace(/\?.*|$/, queryString);
    }

}


window.onload = function () {
    Toggle.init();
}

document.onclick = function () {
    Toggle.clearDropDown();
    Select.clear();
}

interface Date {
    getMonthName(): string;
    getMonthAbbr(): string;
    getDayFull(): string;
    getDayAbbr(): string;
    getDayOfYear(): number;
    getDaySuffix(): string;
    getWeekOfYear(): number;
    getWeekOfMonth(): number;
    isLeapYear(): boolean;
    getMonthDayCount(): number;
    previousMonth();
    nextMonth();
    clone(): Date;
    isValid(): boolean;
    format(format): string;
    parse(strDate, pattern): Date;
}
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
}
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
}
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
}
/*
* return week of month
*/
Date.prototype.getWeekOfMonth = function () {
    var firstDayOfMonth = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
    return Math.ceil((this.getDate() + firstDayOfMonth) / 7);
}

/*
* Return if it is a leap year or not
*/
Date.prototype.isLeapYear = function () {
    return (this.getFullYear() % 4 === 0 || (this.getFullYear() % 100 !== 0 && this.getFullYear() % 400 === 0));
}
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
}
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
}
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
}
/*
* returns clone date
*/
Date.prototype.clone = function () {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate());
}
/*
 * returns true if the date is valid
 */
Date.prototype.isValid = function () {
    return !isNaN(this.getTime());
}
/*
* return Format date
*/
Date.prototype.format = function (dateFormat) {
    /*
    * break apart format string into array of characters
    */
    dateFormat = dateFormat.split("");
    var date = this.getDate(),
        month = this.getMonth(),
        hours = this.getHours(),
        minutes = this.getMinutes(),
        seconds = this.getSeconds();
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

interface Element {
    removeChildren();
}
Element.prototype.removeChildren = function () {
    while (this.childNodes.length > 0) {
        this.removeChild(this.childNodes[0]);
    }
}


var author = 'Yonatan Alexis Quintero Rodriguez';
var version = '0.1';
