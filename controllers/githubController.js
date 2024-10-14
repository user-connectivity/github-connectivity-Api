const githubHelper = require("../helpers/githubHelper");
const githubUserModel = require("../models/githubIntegration");

// Handle the OAuth2 callback
exports.githubCallback = async (req, res) => {
  const { code, state } = req.body;

  try {
    const accessToken = await githubHelper.exchangeCodeForToken(code, state);
    const githubUser = await githubHelper.getGitHubUser(accessToken);
    // Check if the user already exists in the database
    let user = await githubUserModel.findOne({ githubId: githubUser.id });
    if (!user) {
      // Create a new user if not found
      user = new githubUserModel({
        id: githubUser.id,
        avatar_url: githubUser.avatar_url,
        login: githubUser.login,
        name: githubUser.name,
        type: githubUser.type,
        created_at: githubUser.created_at,
        accessToken,
      });
      await user.save();
    } else {
      // Update existing user's access token
      user.accessToken = accessToken;
      await user.save();
    }

    res.json({
      message: "Authentication successful",
      user: user,
      accessToken,
    });
  } catch (error) {
    console.error("Error during GitHub OAuth:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};
