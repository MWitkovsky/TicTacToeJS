package com.tictactoe;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.tictactoe.datastore.Leaderboard;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.tictactoe.datastore.LeaderboardEntry;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

public class LeaderboardServlet extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        UserService userService = UserServiceFactory.getUserService();
        String thisURL = req.getRequestURI();
        User user = userService.getCurrentUser();

        PrintWriter out = resp.getWriter();
        resp.setContentType("text/html");
        if (req.getUserPrincipal() != null) {
            String leaderboardName = "default";

            //Generate HTML page
            HTMLHandler.createHeading(out);
            createBody(out, user, req, resp, userService, leaderboardName);

        } else {
            resp.sendRedirect("./");
        }
    }

    private void createBody(PrintWriter out, User user, HttpServletRequest req, HttpServletResponse resp,
                            UserService userService, String leaderboardName){
        out.println("<body>\n" +
                "    <div class=\"container\">\n" +
                "        <div class=\"jumbotron\">\n" +
                "            <div class =\"text-center\">\n" +
                "                <h1>SUPER TIC TAC TOE ULTRA DX ALPHA</h1>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "        <div class=\"text-center\">\n" +
                "            <p>Welcome, " + user.getNickname() + "!</p>\n" +
                "        </div>\n" +
                "        <div class=\"text-center\">\n" +
                "            <a href=\"tictactoe\">\n" +
                "                <input type=\"button\" onclick=\"location.href='tictactoe';\" value=\"Play Tic-Tac-Toe!\" />\n" +
                "            </a>\n" +
                "        </div>\n" +
                "" + HTMLHandler.createLoginServiceButton(req, userService) +
                "        <script>\n" +
                "            loginButton();\n" +
                "        </script>\n" +
                "" + createLeaderboardDisplay(leaderboardName) +
                "    </div>\n" +
                "</body>\n" +
                "</html>");
    }

    private String createLeaderboardDisplay(String leaderboardName){
        String html = "";

        // Create the correct Ancestor key
        Key<Leaderboard> parentLeaderboard = Key.create(Leaderboard.class, leaderboardName);

        // Run an ancestor query to ensure we see the most up-to-date
        // view of the Greetings belonging to the selected Guestbook.
        List<LeaderboardEntry> rankings = ObjectifyService.ofy()
                .load()
                .type(LeaderboardEntry.class) // We want only entries
                .ancestor(parentLeaderboard)    // Anyone in this leaderboard
                .order("-score")       // score is indexed.
                .limit(10)             // Only show 10 of them.
                .list();

        if(rankings.isEmpty()){
            html += "<div class=\"text-center\">\n";
            html += "<p>This leaderboard is empty!</p>\n";
            html += "</div>\n";
        }
        else{
            LeaderboardEntry entry;
            html += "<div class=\"text-center\">\n";
            html += "<h2>TIC TAC TOE HALL OF FAME</h2>\n";
            html += "<table class=\"table table-bordered\">\n" +
                    "    <thead>\n" +
                    "      <tr>\n" +
                    "        <th>Rank</th>\n" +
                    "        <th>User</th>\n" +
                    "        <th>Score</th>\n" +
                    "      </tr>\n" +
                    "    </thead>\n" +
                    "    <tbody>";
            for(int i=0; i<10; i++){
                if(i+1 > rankings.size()){
                    break;
                }
                entry = rankings.get(i);

                html += "<tr>\n";
                html += "<td>" + (i+1) + "</td>\n";
                html += "<td>" + entry.player_email + "</td>\n";
                html += "<td>" + entry.score + "</td>\n";
                html += "</tr>\n";
            }
            html += "</tbody>\n" +
                    "</table>\n";
            html += "</div>\n";
        }

        return html;
    }
}
