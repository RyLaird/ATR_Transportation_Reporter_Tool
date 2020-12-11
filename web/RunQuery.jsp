<%@ page import="java.io.*"%>
<%@ page import="org.json.*"%>
<%@ page import="java.sql.SQLException"%>
<%@ page import="java.sql.ResultSet"%>
<%@ page import="org.webproject.servlet.DBUtility"%>
<%@ page import="java.util.HashMap" %>

<html>
<body>

<%

    PrintWriter output = response.getWriter();
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");

    String tab_id = request.getParameter("tab_id");

// create a report
    if (tab_id.equals("0")) {
        System.out.println("Thank you for your submission!");
        try {
            DBUtility dbutil = new DBUtility();
            String sql;

            // 2. create user
            int user_id = 0;
            String fN = request.getParameter("first_name");
            String lN = request.getParameter("last_name");
            String tel = request.getParameter("telephone");
            String email = request.getParameter("email");
            if (fN != null) {fN = "'" + fN + "'";}
            if (lN != null) {lN = "'" + lN + "'";}
            if (tel != null) {tel = "'" + tel + "'";}
            if (email != null) {email = "'" + email + "'";}

            sql = "insert into person (first_name, last_name, telephone, email) values (" + fN +
                    "," + lN + "," + tel +
                    "," + email + ")";

            dbutil.modifyDB(sql);

            // record user_id
            ResultSet res_2 = dbutil.queryDB("select last_value from person_id_seq");
            res_2.next();
            user_id = res_2.getInt(1);

            System.out.println("Success! User created.");

            // 3. create report
            int report_id = 0;
            String report_type = request.getParameter("report_type");
            String lon = request.getParameter("longitude");
            String lat = request.getParameter("latitude");
            String message = request.getParameter("additionalinformation");
            String add_msg = request.getParameter("additional_message");
            if (report_type != null) {report_type = "'" + report_type + "'";}
            if (message != null) {message = "'" + message + "'";}
            if (add_msg != null) {add_msg = "'" + add_msg + "'";}

            sql = "insert into report (reporter_id, report_type, geom," +
                    " additionalinformation) values (" + user_id + "," + report_type +
                    ", ST_GeomFromText('POINT(" + lon + " " + lat + ")', 4326)" + "," +
                    message + ")";
            dbutil.modifyDB(sql);

            // record report_id
            ResultSet res_3 = dbutil.queryDB("select last_value from report_id_seq");
            res_3.next();
            report_id = res_3.getInt(1);

            System.out.println("Success! Report created.");

            // 4. create specific report
            if (report_type.equals("'bike'")) {
                sql = "insert into bike_report (report_id, obstruction_type) values ('"
                        + report_id + "'," + add_msg + ")";
                System.out.println("Success! Bike report created.");
            } else if (report_type.equals("'pedestrian'")) {
                sql = "insert into pedestrian_report (report_id, obstruction_type) values ('"
                        + report_id + "'," + add_msg + ")";
                System.out.println("Success! Pedestrian report created.");
            } else if (report_type.equalsIgnoreCase("'ada'")) {
                sql = "insert into ada_report (report_id, ada_restriction) values ('"
                        + report_id + "'," + add_msg + ")";
                System.out.println("Success! ADA report created.");
            } else {
                return;
            }
            dbutil.modifyDB(sql);

            // response that the report submission is successful
            JSONObject data = new JSONObject();
            data.put("status", "success");
            response.getWriter().write(data.toString());

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    else if (tab_id.equals("1")) {

        try {
            JSONArray list = new JSONArray();

            String report_type = request.getParameter("report_type");
            // obstruction_or_restriction will be null if report_type is null
            String obstruction_or_restriction = request.getParameter("obstruction_or_restriction");

            // Bike report
            if (report_type == null || report_type.equalsIgnoreCase("bike")) {
                String sql = "select report.id, report_type, obstruction_type, " +
                        "first_name, last_name, time_stamp, ST_X(geom) as " +
                        "longitude, ST_Y(geom) as latitude, additionalinformation from report, person, " +
                        "bike_report where reporter_id = person.id and report.id = " +
                        "report_id";
                queryReportHelper(sql,list,"bike",obstruction_or_restriction);
            }

            // Pedestrian report
            if (report_type == null || report_type.equalsIgnoreCase("pedestrian")) {
                String sql = "select report.id, report_type, obstruction_type, " +
                        "first_name, last_name, time_stamp, ST_X(geom) as " +
                        "longitude, ST_Y(geom) as latitude, additionalinformation from report, person, " +
                        "pedestrian_report where reporter_id = person.id and report.id = " +
                        "report_id";
                queryReportHelper(sql,list,"pedestrian",obstruction_or_restriction);
            }

            // ADA report
            if (report_type == null || report_type.equalsIgnoreCase("ada")) {
                String sql = "select report.id, report_type, ada_restriction, " +
                        "first_name, last_name, time_stamp, ST_X(geom) as " +
                        "longitude, ST_Y(geom) as latitude, additionalinformation from report, person, " +
                        "ada_report where reporter_id = person.id and report.id = " +
                        "report_id";
                queryReportHelper(sql,list,"ada",obstruction_or_restriction);
            }

            response.getWriter().write(list.toString());
        } catch (JSONException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (SQLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    output.close();

%>
</body>
</html>
<%!
    private void queryReportHelper(String sql, JSONArray list, String report_type,
                                   String obstruction_or_restriction) throws SQLException, JSONException {
        DBUtility dbutil = new DBUtility();
        if (obstruction_or_restriction != null) {
            if (report_type.equalsIgnoreCase("ada")) {
                sql += " and ada_restriction = '" + obstruction_or_restriction + "'";
            } else {
                sql += " and obstruction_type = '" + obstruction_or_restriction + "'";
            }
        }
        ResultSet res = dbutil.queryDB(sql);
        while (res.next()) {
            // add to response
            HashMap<String, String> m = new HashMap<String,String>();
            m.put("report_id", res.getString("id"));
            m.put("report_type", res.getString("report_type"));
            if (report_type.equalsIgnoreCase("bike") ||
                    report_type.equalsIgnoreCase("pedestrian")) {
                m.put("obstruction_type", res.getString("obstruction_type"));
            }
            else if (report_type.equalsIgnoreCase("ada")) {
                m.put("ada_restriction", res.getString("ada_restriction"));
            }
            m.put("first_name", res.getString("first_name"));
            m.put("last_name", res.getString("last_name"));
            m.put("time_stamp", res.getString("time_stamp"));
            m.put("longitude", res.getString("longitude"));
            m.put("latitude", res.getString("latitude"));
            m.put("additionalinformation", res.getString("additionalinformation"));
            list.put(m);
        }
    }
%>