angular.module("datepicker").controller("widgetController", function($scope,$q,$routeParams,$moment){
    
    var beginning_year = 0;
    var year_offset = 15;
    $scope.final_date = "";
    $scope.showMonthsGrid = false;
    $scope.showYearsGrid = false;
    $scope.showDaysGrid = true;
    
    $scope.weekdays = ['Su','M','Tu','W','Th','F','Sa'];
    
    $scope.showDatepicker = false;
    var today = $moment();
    $scope.defaultMonth = today.format("MMMM");
    $scope.defaultYear = today.format('YYYY');
    $scope.defaultDate = today.date();
    $scope.selectedDate = null;
    
    updateDaysGrid($scope.defaultDate, $scope.defaultMonth, $scope.defaultYear);
    
    $scope.last = function(){
        if($scope.showDaysGrid == true){
            var last_month_obj = $scope.activeMonthObj.subtract(1,'months');
            updateDaysGrid(1, last_month_obj.format('MMMM'), last_month_obj.format('YYYY'));   
        }
        else if($scope.showYearsGrid == true){
            beginning_year = beginning_year - year_offset;
            $scope.years = getYears(beginning_year);
        }
    };
    
    $scope.next = function(){
        if($scope.showDaysGrid == true){
            var next_month_obj = $scope.activeMonthObj.add(1,'months');
            updateDaysGrid(1, next_month_obj.format('MMMM'), next_month_obj.format('YYYY'));   
        }
        else if($scope.showYearsGrid == true){
            beginning_year = beginning_year + year_offset;
            $scope.years = getYears(beginning_year);
        }
    };
    
    $scope.selectDate = function(date_obj){
        if(date_obj.activeMonth == true){
            $scope.final_date = (date_obj.date.toString().length == 1 ? "0" + date_obj.date : date_obj.date) + "/" + $scope.activeMonthObj.format('MM/YYYY');
            date_obj.selected = true;
            if($scope.selectedDate != null){
                $scope.selectedDate.selected = false;
            }
            $scope.selectedDate = date_obj;
        }
        
        
    };
    
    $scope.selectMonth = function(month){
        
        updateDaysGrid(1, month, $scope.activeMonthObj.format('YYYY'));
        $scope.showGrid('day');
    };
    
    $scope.selectYear = function(year){
        
        updateDaysGrid(1, $scope.activeMonthObj.format('MMMM'), year);
        $scope.showGrid('month');
    };
    
    
    
    $scope.showGrid = function(type){
        if(type == 'month'){
            
            $scope.months = [];
            var count = 0;
            var row = [];
            while (count < 12){
                if(count != 0 && count % 3 == 0){
                   $scope.months.push(row);
                    row = [];
                }
                row.push(moment().month(count).format("MMMM"));
                count++;
            }
            if(row.length > 0){
                $scope.months.push(row);
            }
            
            $scope.showMonthsGrid = true;
            $scope.showDaysGrid = false;
            $scope.showYearsGrid = false;
        }
        else if(type == 'year'){
            beginning_year = parseInt($scope.activeMonthObj.format("YYYY")) - parseInt(year_offset/2);
            $scope.years = getYears(beginning_year); // grid of 9 elements where current year is in the center
            $scope.showMonthsGrid = false;
            $scope.showDaysGrid = false;
            $scope.showYearsGrid = true;
        }
        else{
            $scope.showMonthsGrid = false;
            $scope.showDaysGrid = true;
            $scope.showYearsGrid = false;
        }
    }
    
    function updateDaysGrid(date, month, year){
        
        console.log(month);
        console.log(year);
        
        $scope.activeMonth = month;
        $scope.activeYear = year;
        
        $scope.activeMonthObj = getMomentObj(date, month, year, 'MMMM-YYYY', '-')
    
        var active_month_num_days = $scope.activeMonthObj.daysInMonth();
        var last_month = $scope.activeMonthObj.clone().subtract(1,'months');
        console.log(last_month);
        var last_month_num_days = last_month.daysInMonth();
        
        console.log($scope.activeMonthObj.format('MMMM'));
        
        $scope.days_grid = [];
        var i = 0;
        var row = [];
        var first_row_adjusted = 0;
        var date = getMomentObj(i+1, month, year, 'D-MMMM-YYYY', '-'); 
        var day_of_week = date.day();
        
        //add days before the first day of the month

        if(day_of_week > 0){
            var j = day_of_week - 1;

            var date_last_month = last_month_num_days;
            while(j >= 0){
                row[j] = {date:date_last_month, activeMonth:false};
                date_last_month--;
                j--;
            }
        } 

        while(i < active_month_num_days){

            if(row.length == 7){
                $scope.days_grid.push(row);
                row = [];
                day_of_week = 0;
            }

            row[day_of_week] = {date:i + 1, activeMonth:true};    
            i++;
            day_of_week++;
        }

        if(row.length >=0){
            $scope.days_grid.push(row);
        }
        console.log($scope.days_grid);
    }
    
    function getYears(beginning_year){
        
        var years = [];
        var i = 0;
        var row = [];
        
        while(i < year_offset){
            if(row.length == 3){
                years.push(row);
                row = [];
            }
            if(beginning_year >= 0) {
                row.push(beginning_year);
            } 
            i++;
            beginning_year++;
        }
        if(row.length >= 0){
            years.push(row);
        }
        
        return years;
    }
    
    function getMomentObj(date,month,year,format,delimiter){
        var str = "";
        if(date != null){
            str += date + delimiter;
        }
        if(month != null){
            str += month + delimiter;
        }
        if(year != null){
            str += year;
        }
        return $moment(str,format);
    }
    
});



angular.module("datepicker").directive('showWidget', function() {
    var directive = {};

    directive.restrict = 'A';

    directive.link = function(scope, element, attributes) {
            
        function updateVisibility() {
            if(open){
                element.css('display','flex');
                element.css('flex-direction','column');
                
            }
            else{
                element.css('display','none');
            }

        }

        scope.$watch(attributes.showWidget, function(value) {
          open = value;
          updateVisibility();
        });

    };

    return directive;
});