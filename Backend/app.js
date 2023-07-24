const express = require("express");
const cors = require('cors');

const profileRoutes = require("./routes/profile");
const groupRoutes = require("./routes/group");
const accountRoutes = require("./routes/account");
const playtimeRoutes = require("./routes/playtime");
const friendsRoutes = require("./routes/friends");
const gamesAndPlatformsRoutes = require("./routes/gamesAndPlatforms");
const requestsRoutes = require("./routes/requests");
const messagesRoutes = require("./routes/messages");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/profile", profileRoutes);
app.use("/group", groupRoutes);
app.use("/account", accountRoutes);
app.use("/playtime", playtimeRoutes);
app.use("/friends", friendsRoutes);
app.use("/gamesAndPlatforms", gamesAndPlatformsRoutes);
app.use("/requests", requestsRoutes);
app.use("/messages", messagesRoutes);

app.listen(port, () =>
{
    console.log(`Server is running on port ${port}.`);
});
