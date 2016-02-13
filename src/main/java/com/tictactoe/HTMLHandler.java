package com.tictactoe;

import com.google.appengine.api.users.UserService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

public class HTMLHandler {
    public static void createHeading(PrintWriter out){
        out.println("<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <!-- Latest compiled and minified CSS -->\n" +
                "    <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css\"\n" +
                "          integrity=\"sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7\"\n" +
                "          crossorigin=\"anonymous\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n" +
                "    <link rel=\"stylesheet\" href=\"http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css\">\n" +
                "    <link rel=\"stylesheet\" href=\"stylesheets/main.css\">\n" +
                "    <script src=\"https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js\"></script>\n" +
                "    <script src=\"http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js\"></script>\n" +
                "\n" +
                "    <title>Tic Tac Toe</title>\n" +
                "</head>");
    }

    public static String createLoginServiceButton(HttpServletRequest req, UserService userService){
        String button = "";
        button += "<div class=\"text-center\">\n";
        if (req.getUserPrincipal() != null) {
            button += "<a href=\"" + userService.createLogoutURL(req.getRequestURI())+ "\">\n";
            button += "<input type=\"button\" onclick=\"location.href='/logout';\" value=\"Logout of Google\" />\n";
        } else {
            button += "<a href=\"/login\">\n";
            button += "<input type=\"button\" onclick=\"location.href='/login';\" value=\"Login with Google\" />\n";
        }
        button += "</a>\n" +
                "</div>\n";
        return button;
    }

    public static String createLeaderboardButton(){
        return "<div class=\"text-center\">\n" +
                "            <a href=\"/leaderboard\">\n" +
                "                <input type=\"button\" onclick=\"location.href='/leaderboard';\" value=\"Back to Leaderboard\" />\n" +
                "            </a>\n" +
                "        </div>\n";
    }
}
