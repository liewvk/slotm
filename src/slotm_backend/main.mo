import Array "mo:base/Array";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";

actor {
    let symbols = ["🍒", "🍋", "🍊", "🍉", "🍇", "⭐", "🔔", "7️⃣"];
    private stable var balance = 1000; // Starting balance of 1000

    private func getRandom(max: Nat) : Nat {
        let time = Int.abs(Time.now());
        Int.abs(time) % max
    };

    private func calculateReward(result: [Text]) : Nat {
        // All same
        if (result[0] == result[1] and result[1] == result[2]) {
            switch(result[0]) {
                case "🍒" { 1500 };
                case "🍉" { 2000 };
                case "🍊" { 2500 };
                case "🍇" { 3000 };
                case "🔔" { 3500 };
                case "⭐" { 4000 };
                case "7️⃣" { 10000 };
                case _ { 0 };
            };
        }
        // Two same
        else if (result[0] == result[1] or result[1] == result[2] or result[0] == result[2]) {
            let pair = if (result[0] == result[1]) { result[0] }
                      else if (result[1] == result[2]) { result[1] }
                      else { result[0] };
            switch(pair) {
                case "🍒" { 400 };
                case "🍉" { 500 };
                case "🍊" { 600 };
                case "7️⃣" { 700 };
                case "🍇" { 800 };
                case "🔔" { 900 };
                case "⭐" { 1000 };
                case _ { 0 };
            };
        }
        // All different
        else { 100 };
    };

    public query func getBalance() : async Nat {
        balance
    };

    public shared func spin() : async Text {
        assert(balance >= 10);
        balance -= 10; // Deduct spin cost

        let sym_size = symbols.size();
        let pattern = getRandom(5);
        
        let first = getRandom(sym_size);
        var second = first;
        var third = first;

        if (pattern < 3) {
            third := (first + 1 + getRandom(sym_size - 1)) % sym_size;
        } else if (pattern == 3) {
            second := (first + 1 + getRandom(sym_size - 1)) % sym_size;
            third := (second + 1 + getRandom(sym_size - 2)) % sym_size;
        };

        let result = [symbols[first], symbols[second], symbols[third]];
        let reward = calculateReward(result);
        balance += reward;

        let resultText = Text.join(" | ", Iter.fromArray(result));
        let isJackpot = reward == 10000;
        
        if (isJackpot) {
            return "JACKPOT!\n" # resultText # "\nWon: " # Nat.toText(reward);
        } else if (reward > 0) {
            return resultText # "\nWon: " # Nat.toText(reward);
        } else {
            return resultText;
        };
    };
}