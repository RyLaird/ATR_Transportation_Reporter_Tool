<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
         pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
  <title>ATR</title>

  <!-- Custom styles -->
  <link rel="stylesheet" href="css/style.css">

  <!--JQuery-->
  <script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
  <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>

  <!--Bootstrap-->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>

  <!--Google Map js libraries-->
  <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyAhHsbbWyfEDxG9JnoWNnAVlgXdKhP6Ipw&libraries=geometry,places"></script>
</head>

<body>


<nav class="navbar navbar-inverse navbar-fixed-top" id="navbar">
  <a class="navbar-brand" style="color:white;text-align:center;">Active Transportation Reporter</a>
</nav>

<div class="container-fluid">
  <div class="row">
    <div class="sidebar col-xs-3" id="sidebar">

      <!-- Tab Navis-->
      <ul class="nav nav-tabs">
        <li class="active"><a href="#create_report" data-toggle="tab">Create Report</a></li>
        <li><a href="#query_report" data-toggle="tab">Query</a></li>
      </ul>

      <!-- Tab panes -->
      <div class="tab-content ">
        <!-- Create Report Tab Panel -->
        <div class="tab-pane active" id="create_report">
          <form id = "create_report_form">
            <div><label>First Name:&nbsp</label><input placeholder="Your first name" name="first_name"></div>
            <div><label>Last Name:&nbsp</label><input placeholder="Your last name" name="last_name"></div>
            <div><label>Telephone:&nbsp</label><input placeholder="optional" name="telephone"></div>
            <div><label>Email:&nbsp</label><input placeholder="optional" name="email"></div>

            <div><label>Report Type:</label>
              <select onchange="onSelectReportType(this)" name="report_type">
                <option value="">Choose the report type</option>
                <option value="bike">Bike</option>
                <option value="pedestrian">Pedestrian</option>
                <option value="ADA">ADA</option>
              </select>
            </div>
            <div class="additional_msg_div" style="visibility: hidden"><label class="additional_msg"></label>
              <select class="additional_msg_select" name="additional_message"></select>
            </div>
            <div><label>Report Location:</label>
              <p>Click anywhere on the map to begin dragging your marker!</p>
              <img src="images/drag.png">
              <br>
              <label>Marker Latitude &nbsp&nbsp</label><input id="latitude" placeholder="Click Map to Populate" >
              <label>Marker Longitude &nbsp</label><input id="longitude" placeholder="Click Map to Populate" >

            </div>
            <br>
            <p>Please describe the report to the community</p>
            <div><label>Details of Report:&nbsp</label><input placeholder="Describe your findings!" name="additionalinformation"></div>
            <!--<button type="submit" class="btn btn-default" id="report_submit_btn">
              <span class="glyphicon glyphicon-star"></span> Submit
            </button> -->
            <br>
            <button type="submit" class="btn btn-primary" id="report_submit_btn">
              </span> Add Report
            </button>
          </form>
        </div>

        <!-- Query Report Tab Panel -->
        <div class="tab-pane" id="query_report">
          <form id = "query_report_form">
            <div><label>Report Type:</label>
              <select onchange="onSelectReportType(this)" name="report_type">
                <option value="">Choose the report type</option>
                <option value="bike">Bike</option>
                <option value="pedestrian">Pedestrian</option>
                <option value="ADA">ADA</option>
              </select>
            </div>
            <div class="additional_msg_div" style="visibility: hidden"><label class="additional_msg"></label>
              <select class="additional_msg_select" name="obstruction_or_restriction"></select>
            </div>
            <button type="submit" class="btn btn-primary" id="submit_query_btn">
              </span> Submit Query
            </button>
          </form>
        </div>
      </div>
      <br>
      <img src="logo.png" width="217" height="127"alt="logo">
    </div>

      <!--Not currently using button-->
      <!--<button type="button" id="sidebarCollapse" class="btn btn-basic navbar-btn">
        <i class="glyphicon glyphicon-align-left"></i>
        <span>Toggle Sidebar</span>
      </button> -->

      <div id="map-canvas" class="col-xs-9"></div>

    </div>
  </div>
<script src="js/loadmap.js"></script>
<script src="js/loadform.js"></script>

</body>
</html>
