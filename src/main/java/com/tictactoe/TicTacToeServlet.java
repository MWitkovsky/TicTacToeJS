package com.tictactoe;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javax.servlet.ServletException;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.tictactoe.datastore.Leaderboard;
import com.tictactoe.datastore.LeaderboardEntry;

@SuppressWarnings("serial")
public class TicTacToeServlet extends HttpServlet {
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException, ServletException {
        UserService userService = UserServiceFactory.getUserService();
        String thisURL = req.getRequestURI();
        User user = userService.getCurrentUser();

        PrintWriter out = resp.getWriter();
        resp.setContentType("text/html");
        if (req.getUserPrincipal() != null) {
            //Generate HTML page
            createHeading(out);
            createBody(out, user);
          } else {
            resp.sendRedirect("./");
        }
    }

    public void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException{
        UserService userService = UserServiceFactory.getUserService();
        User user = userService.getCurrentUser();

        LeaderboardEntry userEntry = null;

        // Create the correct Ancestor key
        Key<Leaderboard> parentLeaderboard = Key.create(Leaderboard.class, "default");

        // Run an ancestor query to ensure we see the most up-to-date
        // view of the Greetings belonging to the selected Guestbook.
        List<LeaderboardEntry> entries = ObjectifyService.ofy()
                .load()
                .type(LeaderboardEntry.class) // We want only entries
                .ancestor(parentLeaderboard)    // Anyone in this leaderboard
                .list();

        for (LeaderboardEntry entry : entries){
            if(entry.player_id.equals(user.getUserId())){
                userEntry = entry;
                break;
            }
        }
        if (userEntry == null){
            userEntry = new LeaderboardEntry("default", 1, user.getUserId(), user.getEmail());
        }
        else{
            ObjectifyService.ofy().delete().entity(userEntry).now();
            userEntry.score++;
        }

        ObjectifyService.ofy().save().entity(userEntry).now();
        resp.sendRedirect("./");
    }

    private void createHeading(PrintWriter out){
        out.println("<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <script src=\"https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js\"></script>\n" +
                "    <!-- Latest compiled and minified CSS -->\n" +
                "    <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css\"\n" +
                "          integrity=\"sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7\"\n" +
                "          crossorigin=\"anonymous\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n" +
                "    <link rel=\"stylesheet\" href=\"http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css\">\n" +
                "    <link rel=\"stylesheet\" href=\"stylesheets/main.css\">\n" +
                "    <script src=\"http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js\"></script>\n" +
                "    <script src=\"./js/TicTacToe.js\"></script>\n" +
                "\n" +
                "    <title>Tic Tac Toe</title>\n" +
                "</head>");
    }

    private void createBody(PrintWriter out, User user){
        out.println("<body>\n" +
                "    <div class=\"container\">\n" +
                "        <div class=\"jumbotron\">\n" +
                "            <div class =\"text-center\">\n" +
                "                <h1>SUPER TIC TAC TOE ULTRA DX ALPHA</h1>\n" +
                "                <p>Player: " + user.getNickname() + "</p>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "        <div class =\"text-center\">\n" +
                "            <canvas id=\"myCanvas\" width=\"800\" height=\"800\" style=\"border:1px solid #000000;\"></canvas>\n" +
                "        </div>\n" +
                "        <div class =\"text-center\">\n" +
                "            <input type=\"button\" onclick=\"nextGame();\" value=\"Start New Game!\" />\n" +
                "        </div>\n" +
                "" + HTMLHandler.createLeaderboardButton() +
                "        <script>\n" +
                "            init();\n" +
                "        </script>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>");
    }
}

