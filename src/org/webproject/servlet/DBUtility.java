package org.webproject.servlet;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DBUtility {
    private static final String Driver = "org.postgresql.Driver";
    private static final String ConnUrl = "jdbc:postgresql://localhost:5432/Active_Transportation_Reporter";
    private static final String Username = "postgres";
    private static final String Password = "admin";

    // This is a constructor
    public DBUtility() {
    }

    // create a Connection to the database
    private Connection connectDB() {
        Connection conn = null;
        try {
            Class.forName(Driver);
            conn = DriverManager.getConnection(ConnUrl, Username, Password);
            return conn;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return conn;
    }

    // execute a sql query (e.g. SELECT) and return a ResultSet
    public ResultSet queryDB(String sql) {
        Connection conn = connectDB();
        ResultSet res = null;
        try {
            if (conn != null) {
                Statement stmt = conn.createStatement();
                res = stmt.executeQuery(sql);
                conn.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return res;
    }

    // execute a sql query (e.g. INSERT) to modify the database;
    // no return value needed
    public void modifyDB(String sql) {
        Connection conn = connectDB();
        try {
            if (conn != null) {
                Statement stmt = conn.createStatement();
                stmt.execute(sql);
                stmt.close();
                conn.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * @param args
     * @throws SQLException
     */
    public static void main(String[] args) throws SQLException {
        // You can test the methods you created here
        DBUtility util = new DBUtility();

        // 1. create a user
        util.modifyDB("insert into damage_report (report_id, damage_type) values (5, 'pollution')");

        // 2. query the database
        ResultSet res = util.queryDB("select * from report");
        while (res.next()) {
            System.out.println(res.getString("report_type"));
        }

    }

}
