package com.tictactoe;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

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
            //Generate HTML page
            HTMLHandler.createHeading(out);
            createBody(out, user, req, resp, userService);
        } else {
            resp.sendRedirect("./");
        }
    }

    private void createBody(PrintWriter out, User user, HttpServletRequest req, HttpServletResponse resp,
                            UserService userService){
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
                "            <a href=\"tictactoe.html\">\n" +
                "                <input type=\"button\" onclick=\"location.href='tictactoe.html';\" value=\"Play Tic-Tac-Toe!\" />\n" +
                "            </a>\n" +
                "        </div>\n" +
                "" + HTMLHandler.createLoginServiceButton(req, userService) +
                "        <script>\n" +
                "            loginButton();\n" +
                "        </script>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>");
    }
}