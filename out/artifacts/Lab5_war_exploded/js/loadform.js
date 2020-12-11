function onSelectReportType(ele){
    var form = $(ele).parent().parent();
    var label = $(form).find(".additional_msg");
    var select = $(form).find(".additional_msg_select");

    switch (ele.value) {
        case "bike":
        case "pedestrian":
            label.text("Obstruction Type:");
            select.find('option').remove();
            select.append($("<option></option>")
                .attr("value","")
                .text("Choose the obstruction type"));
            selectValues = ['construction', 'pothole', 'damage', 'weather', 'hazard',
                'lighting', 'other'];
            $.each(selectValues, function(index,value) {
                select.append($("<option></option>")
                    .attr("value",value)
                    .text(value));
            });
            break;
        case "ADA":
            label.text("ADA Restriction Type");
            select.find('option').remove();
            select.append($("<option></option>")
                .attr("value","")
                .text("Choose the ADA restriction"));
            selectValues = ['slope', 'curb', 'width', 'surface',
                'other'];
            $.each(selectValues, function(index,value) {
                select.append($("<option></option>")
                    .attr("value",value)
                    .text(value));
            });
            break;
        default:
            $(form).find(".additional_msg_div").css("visibility", "hidden");
            return;
    }
    $(form).find(".additional_msg_div").css("visibility", "visible");
}

function queryReport(event) {
    event.preventDefault(); // stop form from submitting normally

    var a = $("#query_report_form").serializeArray();
    a.push({ name: "tab_id", value: "1" });
    a = a.filter(function(item){return item.value != '';});
    $.ajax({
        url: 'RunQuery.jsp',
        type: 'POST',
        data: a,
        success: function(reports) {
            mapInitialization(reports);
        },
        error: function(xhr, status, error) {
            alert("Status: " + status + "\nError: " + error);
        }
    });
}
//Create Report Function
function createReport(event) {
    event.preventDefault(); //stop form from refreshing normally

    var b = $("#create_report_form").serializeArray();
    b.push({ name: "tab_id", value: "0"});
    b.push({ name: "longitude", value: (document.getElementById("longitude").value)}, {name: "latitude", value: (document.getElementById("latitude").value)});
    b = b.filter(function(item){return item.value != '';});
    $.ajax({
        url: 'RunQuery.jsp',
        type: 'POST',
        data: b,
        success: function(reports) {
            alert("Thank you for submission to the community");
            $.ajax({
                url: 'RunQuery.jsp',
                type: 'POST',
                data: { "tab_id": "1"},
                success: function(reports) {
                    mapInitialization(reports);
                    $("#create_report_form")[0].reset();
                    $(".additional_msg_div").hide();
                },
                error: function(xhr, status, error) {
                    alert("An AJAX error occured: " + status + "\nError: " + error);
                }
            });
        },
        error: function(xhr, status, error) {
            alert("Status: " + status + "\nError: " + error);
        }
    });
}

$("#query_report_form").on("submit",queryReport);

$("#create_report_form").on("submit", createReport);