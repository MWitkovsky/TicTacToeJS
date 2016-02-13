package com.tictactoe.datastore;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Entity
public class Leaderboard {
    @Id public String leaderboard;
}
