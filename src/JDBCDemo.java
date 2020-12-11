import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class JDBCDemo {
    public static void main(String[] args) {
        Connection conn;
        Statement stmt;
        try {
            //load the JDBC Driver
            Class.forName("org.postgresql.Driver");

            //establish connection
            String url = "jdbc:postgresql://localhost:5432/Active_Transportation_Reporter";
            conn = DriverManager.getConnection(url, "postgres", "admin");

            //query the database
            String sql = "select id, report_type, time_stamp, " + "ST_asText(geom) as geom from report";
            stmt = conn.createStatement();

            ResultSet res = stmt.executeQuery(sql);

            //print the result
            if (res !=null) {
                while (res.next()) {
                    System.out.println("id: " + res.getString("id"));
                    System.out.println("report_type: " + res.getString("report_type"));
                    System.out.println("time_stamp: " + res.getString("time_stamp"));
                    System.out.println("geom: " + res.getString("geom"));
                }
            }

            //clean up
            stmt.close();
            conn.close();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}

