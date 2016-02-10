package com.tictactoe;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class IndexServlet extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        PrintWriter out = resp.getWriter();

        if (req.getUserPrincipal() != null) {
            resp.sendRedirect("./leaderboard");
        }
        else{
            HTMLHandler.createHeading(out);
            createBody(out);
        }
    }

    private void createBody(PrintWriter out){
        out.println("<body>\n" +
                "    <div class=\"container\">\n" +
                "        <div class=\"jumbotron\">\n" +
                "            <div class =\"text-center\">\n" +
                "                <h1>SUPER TIC TAC TOE ULTRA DX ALPHA</h1>\n" +
                "                <p>Please log in to play or see leaderboards!</p>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "        <div class=\"text-center\">\n" +
                "            <a href=\"/login\">\n" +
                "                <input type=\"button\" onclick=\"location.href='/login';\" value=\"Login with Google\" />\n" +
                "            </a>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>");
    }
}