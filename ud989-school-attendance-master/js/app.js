/* All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */

$(function() {

    var data = {
        attendance: JSON.parse(localStorage.attendance),
        allMissed: $('tbody .missed-col'),
        allCheckboxes: $('tbody input')
    };


    var octopus = {

        countMissing: function() {
            data.allMissed.each(function() {
                var studentRow = $(this).parent('tr'),
                    dayChecks = $(studentRow).children('td').children('input'),
                    numMissed = 0;

                dayChecks.each(function() {
                    if (!$(this).prop('checked')) {
                        numMissed++;
                    }
                });

                view.render($(this), numMissed);
            });
        },

        init: function() {
            view.init(data.attendance);

            data.allCheckboxes.on('click', function() {
                var studentRows = $('tbody .student'),
                    newAttendance = {};

                studentRows.each(function() {
                    var name = $(this).children('.name-col').text(),
                        $allCheckboxes = $(this).children('td').children('input');

                    newAttendance[name] = [];

                    $allCheckboxes.each(function() {
                        newAttendance[name].push($(this).prop('checked'));
                    });
                });

                octopus.countMissing();
                localStorage.attendance = JSON.stringify(newAttendance);
            });

            octopus.countMissing();
            
        }
    };


    var view = {
        init: function(attendance) {
            for(let key in attendance) {
                var studentRow = $('tbody .name-col:contains("' + key + '")').parent('tr'),
                    dayChecks = $(studentRow).children('.attend-col').children('input');
                dayChecks.each(function(i) {
                    $(this).prop('checked', data.attendance[key][i]);
                });
            }
        },

        render: function(missedCol, numMissed) {
            missedCol.text(numMissed);
        }
    };

    octopus.init();

}());
