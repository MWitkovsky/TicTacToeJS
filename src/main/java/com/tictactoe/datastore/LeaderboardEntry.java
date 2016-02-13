package com.tictactoe.datastore;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Parent;

import java.util.Date;

@Entity
public class LeaderboardEntry {
    @Parent Key<Leaderboard> parentLeaderboard;
    @Id public Long id;
    public String player_email;
    public String player_id;
    @Index public int score;
    public Date date;

    public LeaderboardEntry() {
        date = new Date();
    }

    public LeaderboardEntry(String leaderboard, int score) {
        this();
        if( leaderboard != null ) {
            parentLeaderboard = Key.create(Leaderboard.class, leaderboard);  // Creating the Ancestor key
        } else {
            parentLeaderboard = Key.create(Leaderboard.class, "default");
        }
        this.score = score;
    }

    public LeaderboardEntry(String leaderboard, int score, String id, String email) {
        this(leaderboard, score);
        player_email = email;
        player_id = id;
    }

}
