// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// Define the SportsBetting contract
contract SportsBetting {
    address public owner; // Owner of the contract
    uint256 public gameIdCounter = 0; // Counter for unique game IDs, explicitly initialized to 0

    // Enum to represent the status of a game 0 = Not Started, Ongoing is 1 and 2 is Finished. 
    enum GameStatus { NotStarted, Ongoing, Finished }

    // Enum to represent betting options. TEAM A = 0  TEAM B = 1 ; 
    enum BetOption { TeamA, TeamB }

    // Struct to store information about each game
    struct Game {
        uint256 id;                      // Unique identifier for the game
        bytes32 teamA;                   // Name of Team A 
        bytes32 teamB;                   // Name of Team B
        GameStatus status;               // Current status of the game
        BetOption winningOption;         // Winning option after game finishes
        uint256 totalBetTeamA;           // Total amount bet on Team A
        uint256 totalBetTeamB;           // Total amount bet on Team B
        mapping(address => uint256) betsTeamA; // User bets on Team A
        mapping(address => uint256) betsTeamB; // User bets on Team B
    }

    // Mapping from game ID to Game struct
    mapping(uint256 => Game) public games;

    // Events for logging significant contract interactions
    event GameCreated(uint256 gameId, bytes32 teamA, bytes32 teamB);
    event BetPlaced(address indexed bettor, uint256 indexed gameId, BetOption option, uint256 amount);
    event GameFinished(uint256 gameId, BetOption winningOption);
    event WinningsWithdrawn(address indexed bettor, uint256 amount);

    // Modifier to restrict access to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    // Modifier to ensure a game exists
    modifier gameExists(uint256 _gameId) {
        require(_gameId > 0 && _gameId <= gameIdCounter, "Game does not exist.");
        _;
    }

    // Constructor function executed upon contract deployment
    constructor() {
        owner = msg.sender; // Set the contract deployer as the owner
    }

    // Function to create a new game
    function createGame(bytes32 _teamA, bytes32 _teamB) external onlyOwner {
        gameIdCounter++; // Increment the game ID counter

        Game storage newGame = games[gameIdCounter];

        newGame.id = gameIdCounter;
        newGame.teamA = _teamA;
        newGame.teamB = _teamB;
        newGame.status = GameStatus.NotStarted; // Set initial status

        emit GameCreated(gameIdCounter, _teamA, _teamB);
    }

    // Function to start a game, allowing users to place bets
    function startGame(uint256 _gameId) external onlyOwner gameExists(_gameId) {
        Game storage game = games[_gameId];
        require(game.status == GameStatus.NotStarted, "Game has already started or finished.");
        game.status = GameStatus.Ongoing;

        emit GameFinished(_gameId, game.winningOption);
    }

    // Function for users to place bets on a game
    function placeBet(uint256 _gameId, BetOption _option) external payable gameExists(_gameId) {
        Game storage game = games[_gameId];
        require(game.status == GameStatus.Ongoing, "Betting is not allowed for this game.");
        require(msg.value > 0, "Bet amount must be greater than zero.");

        if (_option == BetOption.TeamA) {
            game.betsTeamA[msg.sender] += msg.value;
            game.totalBetTeamA += msg.value;
        } else if (_option == BetOption.TeamB) {
            game.betsTeamB[msg.sender] += msg.value;
            game.totalBetTeamB += msg.value;
        } else {
            revert("Invalid betting option.");
        }

        emit BetPlaced(msg.sender, _gameId, _option, msg.value);
    }

    // Function to finish a game and declare the winner
    function finishGame(uint256 _gameId, BetOption _winningOption) external onlyOwner gameExists(_gameId) {
        Game storage game = games[_gameId];
        require(game.status == GameStatus.Ongoing, "Game is not ongoing or already finished.");
        game.status = GameStatus.Finished;
        game.winningOption = _winningOption;

        emit GameFinished(_gameId, _winningOption);
    }

    // Function for users to withdraw their winnings after a game concludes
    function withdrawWinnings(uint256 _gameId) external gameExists(_gameId) {
        Game storage game = games[_gameId];
        require(game.status == GameStatus.Finished, "Game is not finished.");

        uint256 payout;
        uint256 userBet;
        uint256 totalBetWinningTeam;

        if (game.winningOption == BetOption.TeamA) {
            userBet = game.betsTeamA[msg.sender];
            require(userBet > 0, "No winnings to withdraw.");
            totalBetWinningTeam = game.totalBetTeamA;
            game.betsTeamA[msg.sender] = 0;
        } else if (game.winningOption == BetOption.TeamB) {
            userBet = game.betsTeamB[msg.sender];
            require(userBet > 0, "No winnings to withdraw.");
            totalBetWinningTeam = game.totalBetTeamB;
            game.betsTeamB[msg.sender] = 0;
        } else {
            revert("Invalid winning option.");
        }

        uint256 totalPot = game.totalBetTeamA + game.totalBetTeamB;
        payout = (userBet * totalPot) / totalBetWinningTeam;

        (bool success, ) = msg.sender.call{value: payout}("");
        require(success, "Transfer failed.");

        emit WinningsWithdrawn(msg.sender, payout);
    }

    // Function to get the amount a user has bet on each team in a game
    function getUserBet(uint256 _gameId, address _user) external view gameExists(_gameId) returns (uint256 teamABet, uint256 teamBBet) {
        Game storage game = games[_gameId];
        teamABet = game.betsTeamA[_user];
        teamBBet = game.betsTeamB[_user];
    }

    // Function to get the total bets on each team for a game
    function getGameTotalBets(uint256 _gameId) external view gameExists(_gameId) returns (uint256 totalBetTeamA, uint256 totalBetTeamB) {
        Game storage game = games[_gameId];
        totalBetTeamA = game.totalBetTeamA;
        totalBetTeamB = game.totalBetTeamB;
    }
}
